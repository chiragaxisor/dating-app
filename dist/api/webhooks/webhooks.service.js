"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const store_purchase_entity_1 = require("../users/entities/store-purchase.entity");
const purchase_verification_service_1 = require("../users/purchase-verification.service");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    constructor(purchaseVerificationService, userRepository, storePurchaseRepository) {
        this.purchaseVerificationService = purchaseVerificationService;
        this.userRepository = userRepository;
        this.storePurchaseRepository = storePurchaseRepository;
        this.logger = new common_1.Logger(WebhooksService_1.name);
    }
    async handleAppleWebhook(payload) {
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
            const storedPurchase = await this.storePurchaseRepository.findOne({
                where: [
                    { transactionId: transactionInfo.originalTransactionId, purchaseType: store_purchase_entity_1.PurchaseType.SUBSCRIPTION },
                    { transactionId: transactionInfo.transactionId, purchaseType: store_purchase_entity_1.PurchaseType.SUBSCRIPTION },
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
                    }
                    break;
                case 'EXPIRED':
                    await this.handleExpired(storedPurchase, transactionInfo);
                    break;
                case 'DID_FAIL_TO_RENEW':
                    this.logger.warn(`Renewal failed for transaction: ${transactionInfo.originalTransactionId}`);
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
        }
        catch (error) {
            this.logger.error('Apple webhook processing error', error.stack);
            return { status: 'error', message: error.message };
        }
    }
    async handleRenewal(storedPurchase, transactionInfo) {
        const newExpiry = transactionInfo.expiresDate ? new Date(transactionInfo.expiresDate) : null;
        this.logger.log(`Handling renewal. New expiry: ${newExpiry}`);
        if (storedPurchase && storedPurchase.user) {
            await this.userRepository.update(storedPurchase.user.id, {
                isSubscribed: true,
                subscriptionExpiry: newExpiry,
            });
            await this.storePurchaseRepository.update(storedPurchase.id, {
                status: store_purchase_entity_1.PurchaseStatus.ACTIVE,
                expiryDate: newExpiry,
                transactionId: transactionInfo.transactionId,
            });
            this.logger.log(`Subscription renewed for user ${storedPurchase.user.id}`);
        }
        else {
            this.logger.warn(`No stored purchase found for renewal: ${transactionInfo.originalTransactionId}`);
        }
    }
    async handleExpired(storedPurchase, transactionInfo) {
        this.logger.log(`Handling expiry for transaction: ${transactionInfo.originalTransactionId}`);
        if (storedPurchase && storedPurchase.user) {
            await this.userRepository.update(storedPurchase.user.id, {
                isSubscribed: false,
            });
            await this.storePurchaseRepository.update(storedPurchase.id, {
                status: store_purchase_entity_1.PurchaseStatus.EXPIRED,
            });
            this.logger.log(`Subscription expired for user ${storedPurchase.user.id}`);
        }
    }
    async handleRefund(storedPurchase, transactionInfo) {
        this.logger.log(`Handling refund for transaction: ${transactionInfo.originalTransactionId}`);
        if (storedPurchase && storedPurchase.user) {
            await this.userRepository.update(storedPurchase.user.id, {
                isSubscribed: false,
            });
            await this.storePurchaseRepository.update(storedPurchase.id, {
                status: store_purchase_entity_1.PurchaseStatus.REFUNDED,
            });
            this.logger.log(`Subscription refunded for user ${storedPurchase.user.id}`);
        }
    }
    async handleGoogleWebhook(payload) {
        this.logger.log('Google Webhook Received', JSON.stringify(payload));
        if (payload.message && payload.message.data) {
            const data = JSON.parse(Buffer.from(payload.message.data, 'base64').toString());
            this.logger.log('Decoded Google Data:', JSON.stringify(data));
            if (data.subscriptionNotification) {
                const { subscriptionId, purchaseToken, notificationType } = data.subscriptionNotification;
                const packageName = data.packageName;
                this.logger.log(`Google Subscription Notification: type=${notificationType}, sub=${subscriptionId}`);
                const storedPurchase = await this.storePurchaseRepository.findOne({
                    where: { purchaseToken, purchaseType: store_purchase_entity_1.PurchaseType.SUBSCRIPTION },
                    relations: ['user'],
                });
                switch (notificationType) {
                    case 1:
                    case 2:
                    case 4:
                        if (storedPurchase && storedPurchase.user) {
                            try {
                                const result = await this.purchaseVerificationService.verifyGoogleSubscription(packageName, subscriptionId, purchaseToken);
                                await this.userRepository.update(storedPurchase.user.id, {
                                    isSubscribed: true,
                                    subscriptionExpiry: result.expiryDate,
                                });
                                await this.storePurchaseRepository.update(storedPurchase.id, {
                                    status: store_purchase_entity_1.PurchaseStatus.ACTIVE,
                                    expiryDate: result.expiryDate,
                                });
                            }
                            catch (e) {
                                this.logger.error('Google renewal verification failed', e.message);
                            }
                        }
                        break;
                    case 3:
                        if (storedPurchase && storedPurchase.user) {
                            await this.storePurchaseRepository.update(storedPurchase.id, {
                                status: store_purchase_entity_1.PurchaseStatus.CANCELLED,
                            });
                        }
                        break;
                    case 12:
                        if (storedPurchase && storedPurchase.user) {
                            await this.userRepository.update(storedPurchase.user.id, { isSubscribed: false });
                            await this.storePurchaseRepository.update(storedPurchase.id, {
                                status: store_purchase_entity_1.PurchaseStatus.REFUNDED,
                            });
                        }
                        break;
                    case 13:
                        if (storedPurchase && storedPurchase.user) {
                            await this.userRepository.update(storedPurchase.user.id, { isSubscribed: false });
                            await this.storePurchaseRepository.update(storedPurchase.id, {
                                status: store_purchase_entity_1.PurchaseStatus.EXPIRED,
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
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __param(2, (0, typeorm_1.InjectRepository)(store_purchase_entity_1.StorePurchase)),
    __metadata("design:paramtypes", [purchase_verification_service_1.PurchaseVerificationService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map