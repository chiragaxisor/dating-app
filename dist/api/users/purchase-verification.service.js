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
var PurchaseVerificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseVerificationService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
let PurchaseVerificationService = PurchaseVerificationService_1 = class PurchaseVerificationService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PurchaseVerificationService_1.name);
    }
    async verifyGoogleProduct(packageName, productId, purchaseToken) {
        try {
            const auth = this.getGoogleAuth();
            if (!auth) {
                throw new common_1.BadRequestException('Google Play credentials are not configured in the server .env file.');
            }
            const androidPublisher = googleapis_1.google.androidpublisher({ version: 'v3', auth });
            const response = await androidPublisher.purchases.products.get({
                packageName,
                productId,
                token: purchaseToken,
            });
            if (response.data.purchaseState === 0) {
                return { success: true, data: response.data };
            }
            throw new common_1.BadRequestException('Google purchase is not in valid state');
        }
        catch (error) {
            this.logger.error('Google product verification error', error.message);
            throw new common_1.BadRequestException(`Google verification failed: ${error.message}`);
        }
    }
    async verifyGoogleSubscription(packageName, subscriptionId, purchaseToken) {
        try {
            const auth = this.getGoogleAuth();
            if (!auth) {
                throw new common_1.BadRequestException('Google Play credentials are not configured in the server .env file.');
            }
            const androidPublisher = googleapis_1.google.androidpublisher({ version: 'v3', auth });
            const response = await androidPublisher.purchases.subscriptions.get({
                packageName,
                subscriptionId,
                token: purchaseToken,
            });
            const expiryTime = response.data.expiryTimeMillis;
            if (expiryTime && Number(expiryTime) > Date.now()) {
                return { success: true, expiryDate: new Date(Number(expiryTime)), data: response.data };
            }
            throw new common_1.BadRequestException('Google subscription has expired or is invalid');
        }
        catch (error) {
            this.logger.error('Google subscription verification error', error.message);
            throw new common_1.BadRequestException(`Google subscription verification failed: ${error.message}`);
        }
    }
    async verifyAppleReceipt(receiptData) {
        try {
            const sharedSecret = this.configService.get('APPLE_SHARED_SECRET');
            if (!sharedSecret) {
                throw new common_1.BadRequestException('Apple Shared Secret is not configured in the server .env file.');
            }
            const isProduction = this.configService.get('ENVIRONMENT') === 'production';
            let response = await this.callAppleVerify(receiptData, sharedSecret, true);
            if (response.status === 21007) {
                response = await this.callAppleVerify(receiptData, sharedSecret, false);
            }
            if (response.status === 0) {
                const latestInfo = response.latest_receipt_info ? response.latest_receipt_info[0] : response.receipt.in_app[0];
                const expiryDate = latestInfo.expires_date_ms ? new Date(Number(latestInfo.expires_date_ms)) : null;
                return { success: true, expiryDate, data: response };
            }
            throw new common_1.BadRequestException(`Apple verification failed (Status ${response.status})`);
        }
        catch (error) {
            this.logger.error('Apple verification error', error.message);
            throw new common_1.BadRequestException(`Apple verification failed: ${error.message}`);
        }
    }
    async callAppleVerify(receiptData, password, production) {
        const url = production
            ? 'https://buy.itunes.apple.com/verifyReceipt'
            : 'https://sandbox.itunes.apple.com/verifyReceipt';
        const { data } = await axios_1.default.post(url, { 'receipt-data': receiptData, password });
        return data;
    }
    getGoogleAuth() {
        const clientEmail = this.configService.get('GOOGLE_SERVICES_CLIENT_EMAIL');
        const privateKey = this.configService.get('GOOGLE_SERVICES_PRIVATE_KEY')?.replace(/\\n/g, '\n');
        if (!clientEmail || !privateKey)
            return null;
        return new googleapis_1.google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/androidpublisher'],
        });
    }
};
exports.PurchaseVerificationService = PurchaseVerificationService;
exports.PurchaseVerificationService = PurchaseVerificationService = PurchaseVerificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PurchaseVerificationService);
//# sourceMappingURL=purchase-verification.service.js.map