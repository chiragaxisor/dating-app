import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PurchaseVerificationService {
  private readonly logger = new Logger(PurchaseVerificationService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Verify Google Play Product (Consumable/Coin)
   */
  async verifyGoogleProduct(packageName: string, productId: string, purchaseToken: string) {
    try {
      const auth = this.getGoogleAuth();
      if (!auth) {
        throw new BadRequestException('Google Play credentials are not configured in the server .env file.');
      }

      const androidPublisher = google.androidpublisher({ version: 'v3', auth });
      const response = await androidPublisher.purchases.products.get({
        packageName,
        productId,
        token: purchaseToken,
      });

      if (response.data.purchaseState === 0) {
        return { success: true, data: response.data };
      }
      throw new BadRequestException('Google purchase is not in valid state');
    } catch (error) {
      this.logger.error('Google product verification error', error.message);
      throw new BadRequestException(`Google verification failed: ${error.message}`);
    }
  }

  /**
   * Verify Google Play Subscription
   */
  async verifyGoogleSubscription(packageName: string, subscriptionId: string, purchaseToken: string) {
    try {
      const auth = this.getGoogleAuth();
      if (!auth) {
        throw new BadRequestException('Google Play credentials are not configured in the server .env file.');
      }

      const androidPublisher = google.androidpublisher({ version: 'v3', auth });
      const response = await androidPublisher.purchases.subscriptions.get({
        packageName,
        subscriptionId,
        token: purchaseToken,
      });

      // expiryTimeMillis exists for subscriptions
      const expiryTime = response.data.expiryTimeMillis;
      if (expiryTime && Number(expiryTime) > Date.now()) {
        return { success: true, expiryDate: new Date(Number(expiryTime)), data: response.data };
      }
      throw new BadRequestException('Google subscription has expired or is invalid');
    } catch (error) {
      this.logger.error('Google subscription verification error', error.message);
      throw new BadRequestException(`Google subscription verification failed: ${error.message}`);
    }
  }

  /**
   * Verify Apple Receipt (Consumable & Subscription)
   */
  async verifyAppleReceipt(receiptData: string) {
    try {
      const sharedSecret = this.configService.get<string>('APPLE_SHARED_SECRET');
      if (!sharedSecret) {
        throw new BadRequestException('Apple Shared Secret is not configured in the server .env file.');
      }
      const isProduction = this.configService.get<string>('ENVIRONMENT') === 'production';
      
      let response = await this.callAppleVerify(receiptData, sharedSecret, true); // Try Production
      
      if (response.status === 21007) { // Sandbox receipt sent to production
        response = await this.callAppleVerify(receiptData, sharedSecret, false); // Try Sandbox
      }

      if (response.status === 0) {
        // Find the latest receipt info if it's a subscription
        const latestInfo = response.latest_receipt_info ? response.latest_receipt_info[0] : response.receipt.in_app[0];
        const expiryDate = latestInfo.expires_date_ms ? new Date(Number(latestInfo.expires_date_ms)) : null;
        
        return { success: true, expiryDate, data: response };
      }
      throw new BadRequestException(`Apple verification failed (Status ${response.status})`);
    } catch (error) {
      this.logger.error('Apple verification error', error.message);
      throw new BadRequestException(`Apple verification failed: ${error.message}`);
    }
  }

  private async callAppleVerify(receiptData: string, password: string, production: boolean) {
    const url = production 
      ? 'https://buy.itunes.apple.com/verifyReceipt' 
      : 'https://sandbox.itunes.apple.com/verifyReceipt';
    
    const { data } = await axios.post(url, { 'receipt-data': receiptData, password });
    return data;
  }

  private getGoogleAuth() {
    const clientEmail = this.configService.get<string>('GOOGLE_SERVICES_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('GOOGLE_SERVICES_PRIVATE_KEY')?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) return null;

    return new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });
  }
}
