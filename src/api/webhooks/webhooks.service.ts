import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';
import { StorePurchase, PurchaseStatus, PurchaseType } from '../users/entities/store-purchase.entity';
import { PurchaseVerificationService } from '../users/purchase-verification.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly purchaseVerificationService: PurchaseVerificationService,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(StorePurchase)
    private readonly storePurchaseRepository: Repository<StorePurchase>,
  ) {}

  /**
   * Handle Apple App Store Server Notifications V2
   */
  async handleAppleWebhook(payload: any) {
    this.logger.log('Apple Webhook Received');

    const signedPayload = payload.signedPayload;
    if (!signedPayload) {
      this.logger.warn('No signedPayload in Apple webhook');
      return { status: 'error', message: 'Missing signedPayload' };
    }

    try {
      const notification = await this.purchaseVerificationService.verifyAppleNotificationV2(signedPayload);

      const { notificationType, subtype, transactionInfo } = notification;
      this.logger.log(`Apple Notification: type=${notificationType}, subtype=${subtype}`);

      if (!transactionInfo) {
        this.logger.warn('No transaction info in notification');
        return { status: 'success' };
      }

      // Find the stored purchase by originalTransactionId or transactionId
      const storedPurchase = await this.storePurchaseRepository.findOne({
        where: [
          { transactionId: transactionInfo.originalTransactionId, purchaseType: PurchaseType.SUBSCRIPTION },
          { transactionId: transactionInfo.transactionId, purchaseType: PurchaseType.SUBSCRIPTION },
        ],
        relations: ['user'],
      });

      switch (notificationType) {
        case 'DID_RENEW':
          await this.handleRenewal(storedPurchase, transactionInfo);
          break;

        case 'DID_CHANGE_RENEWAL_STATUS':
          if (subtype === 'AUTO_RENEW_DISABLED') {
            this.logger.log(`Auto-renew disabled for transaction: ${transactionInfo.originalTransactionId}`);
            // Subscription is still active until expiry, just log it
          }
          break;

        case 'EXPIRED':
          await this.handleExpired(storedPurchase, transactionInfo);
          break;

        case 'DID_FAIL_TO_RENEW':
          this.logger.warn(`Renewal failed for transaction: ${transactionInfo.originalTransactionId}`);
          // Subscription might still be in grace period, don't deactivate yet
          if (subtype === 'GRACE_PERIOD') {
            this.logger.log('User in billing grace period');
          }
          break;

        case 'REFUND':
          await this.handleRefund(storedPurchase, transactionInfo);
          break;

        case 'REVOKE':
          await this.handleRefund(storedPurchase, transactionInfo);
          break;

        default:
          this.logger.log(`Unhandled Apple notification type: ${notificationType}`);
      }

      return { status: 'success' };
    } catch (error) {
      this.logger.error('Apple webhook processing error', error.stack);
      return { status: 'error', message: error.message };
    }
  }

  private async handleRenewal(storedPurchase: StorePurchase | null, transactionInfo: any) {
    const newExpiry = transactionInfo.expiresDate ? new Date(transactionInfo.expiresDate) : null;
    this.logger.log(`Handling renewal. New expiry: ${newExpiry}`);

    if (storedPurchase && storedPurchase.user) {
      // Update user subscription
      await this.userRepository.update(storedPurchase.user.id, {
        isSubscribed: true,
        subscriptionExpiry: newExpiry,
      });

      // Update stored purchase
      await this.storePurchaseRepository.update(storedPurchase.id, {
        status: PurchaseStatus.ACTIVE,
        expiryDate: newExpiry,
        transactionId: transactionInfo.transactionId,
      });

      this.logger.log(`Subscription renewed for user ${storedPurchase.user.id}`);
    } else {
      this.logger.warn(`No stored purchase found for renewal: ${transactionInfo.originalTransactionId}`);
    }
  }

  private async handleExpired(storedPurchase: StorePurchase | null, transactionInfo: any) {
    this.logger.log(`Handling expiry for transaction: ${transactionInfo.originalTransactionId}`);

    if (storedPurchase && storedPurchase.user) {
      await this.userRepository.update(storedPurchase.user.id, {
        isSubscribed: false,
      });

      await this.storePurchaseRepository.update(storedPurchase.id, {
        status: PurchaseStatus.EXPIRED,
      });

      this.logger.log(`Subscription expired for user ${storedPurchase.user.id}`);
    }
  }

  private async handleRefund(storedPurchase: StorePurchase | null, transactionInfo: any) {
    this.logger.log(`Handling refund for transaction: ${transactionInfo.originalTransactionId}`);

    if (storedPurchase && storedPurchase.user) {
      await this.userRepository.update(storedPurchase.user.id, {
        isSubscribed: false,
      });

      await this.storePurchaseRepository.update(storedPurchase.id, {
        status: PurchaseStatus.REFUNDED,
      });

      this.logger.log(`Subscription refunded for user ${storedPurchase.user.id}`);
    }
  }

  /**
   * Handle Google Play Real-time Developer Notifications
   */
  async handleGoogleWebhook(payload: any) {
    this.logger.log('Google Webhook Received', JSON.stringify(payload));

    if (payload.message && payload.message.data) {
      const data = JSON.parse(Buffer.from(payload.message.data, 'base64').toString());
      this.logger.log('Decoded Google Data:', JSON.stringify(data));

      if (data.subscriptionNotification) {
        const { subscriptionId, purchaseToken, notificationType } = data.subscriptionNotification;
        const packageName = data.packageName;
        this.logger.log(`Google Subscription Notification: type=${notificationType}, sub=${subscriptionId}`);

        // Find stored purchase
        const storedPurchase = await this.storePurchaseRepository.findOne({
          where: { purchaseToken, purchaseType: PurchaseType.SUBSCRIPTION },
          relations: ['user'],
        });

        // notificationType: 1=RECOVERED, 2=RENEWED, 3=CANCELED, 4=PURCHASED, 5=ON_HOLD, 12=REVOKED, 13=EXPIRED
        switch (notificationType) {
          case 1: // RECOVERED
          case 2: // RENEWED
          case 4: // PURCHASED
            if (storedPurchase && storedPurchase.user) {
              try {
                const result = await this.purchaseVerificationService.verifyGoogleSubscription(
                  packageName, subscriptionId, purchaseToken,
                );
                await this.userRepository.update(storedPurchase.user.id, {
                  isSubscribed: true,
                  subscriptionExpiry: result.expiryDate,
                });
                await this.storePurchaseRepository.update(storedPurchase.id, {
                  status: PurchaseStatus.ACTIVE,
                  expiryDate: result.expiryDate,
                });
              } catch (e) {
                this.logger.error('Google renewal verification failed', e.message);
              }
            }
            break;

          case 3: // CANCELED
            if (storedPurchase && storedPurchase.user) {
              await this.storePurchaseRepository.update(storedPurchase.id, {
                status: PurchaseStatus.CANCELLED,
              });
            }
            break;

          case 12: // REVOKED
            if (storedPurchase && storedPurchase.user) {
              await this.userRepository.update(storedPurchase.user.id, { isSubscribed: false });
              await this.storePurchaseRepository.update(storedPurchase.id, {
                status: PurchaseStatus.REFUNDED,
              });
            }
            break;

          case 13: // EXPIRED
            if (storedPurchase && storedPurchase.user) {
              await this.userRepository.update(storedPurchase.user.id, { isSubscribed: false });
              await this.storePurchaseRepository.update(storedPurchase.id, {
                status: PurchaseStatus.EXPIRED,
              });
            }
            break;
        }
      }

      if (data.oneTimeProductNotification) {
        const { sku, purchaseToken } = data.oneTimeProductNotification;
        const packageName = data.packageName;
        this.logger.log(`Google One-time Product: SKU=${sku}, Package=${packageName}, Token=${purchaseToken}`);
      }
    }

    return { status: 'success' };
  }
}
