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
const jose_1 = require("jose");
const crypto = require("crypto");
const APPLE_ROOT_CA_G3_PEM = `-----BEGIN CERTIFICATE-----
MIICQzCCAcmgAwIBAgIILcX8iNLFS5UwCgYIKoZIzj0EAwMwZzEbMBkGA1UEAwwS
QXBwbGUgUm9vdCBDQSAtIEczMSYwJAYDVQQLDB1BcHBsZSBDZXJ0aWZpY2F0aW9u
IEF1dGhvcml0eTETMBEGA1UECgwKQXBwbGUgSW5jLjELMAkGA1UEBhMCVVMwHhcN
MTQwNDMwMTgxOTA2WhcNMzkwNDMwMTgxOTA2WjBnMRswGQYDVQQDDBJBcHBsZSBS
b290IENBIC0gRzMxJjAkBgNVBAsMHUFwcGxlIENlcnRpZmljYXRpb24gQXV0aG9y
aXR5MRMwEQYDVQQKDApBcHBsZSBJbmMuMQswCQYDVQQGEwJVUzB2MBAGByqGSM49
AgEGBSuBBAAiA2IABJjpLz1AcqTtkyJygRMc3RCV8cWjTnHcFBbZDuWmBSp3ZHtf
TjjTuxxEtX/1H7YyYl3J6YRbTzBPEVoA/VhYDKX1DyxNB0cTddqXl5dvMVztK517
IDvYuVTZXpmkOlEKMaNCMEAwHQYDVR0OBBYEFLuw3qFYM4iapIqZ3r6966/ayySr
MA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEGMAoGCCqGSM49BAMDA2gA
MGUCMQCD6cHEFl4aXTQY2e3v9GwOAEZLuN+yRhHFD/3meoyhpmvOwgPUnPWTxnS4
at+qIxUCMG1mihDK1A3UT82NQz60imOlM27jbdoXt2QfyFMm+YhidDkLF1vLUagM
6BgD56KyKA==
-----END CERTIFICATE-----`;
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
        if (receiptData.includes('.') && receiptData.split('.').length === 3) {
            this.logger.log('JWS Token detected, using StoreKit 2 verification');
            return await this.verifyAppleJWS(receiptData);
        }
        try {
            let sharedSecret = this.configService.get('APPLE_SHARED_SECRET');
            if (sharedSecret) {
                sharedSecret = sharedSecret.replace(/^['"]|['"]$/g, '');
            }
            if (!sharedSecret || sharedSecret === '') {
                throw new common_1.BadRequestException('Apple Shared Secret is not configured or is empty in the server .env file.');
            }
            const sanitizedReceipt = receiptData?.trim()
                .replace(/\n|\r/g, '')
                .replace(/ /g, '+') || '';
            if (!sanitizedReceipt) {
                throw new common_1.BadRequestException('Apple receipt data is empty');
            }
            this.logger.log(`Verifying Legacy Apple receipt. Length: ${sanitizedReceipt.length}`);
            const isProduction = this.configService.get('ENVIRONMENT') === 'production';
            let response = await this.callAppleVerify(sanitizedReceipt, sharedSecret, true);
            if (response.status === 21007) {
                this.logger.log('Sandbox receipt detected, retrying with sandbox URL...');
                response = await this.callAppleVerify(sanitizedReceipt, sharedSecret, false);
            }
            if (response.status === 0) {
                this.logger.log('Apple legacy verification successful');
                const latestInfo = response.latest_receipt_info ? response.latest_receipt_info[0] : response.receipt.in_app[0];
                const expiryDate = latestInfo.expires_date_ms ? new Date(Number(latestInfo.expires_date_ms)) : null;
                const bundleId = response.receipt?.bundle_id || null;
                const productId = latestInfo.product_id || null;
                return {
                    success: true,
                    expiryDate,
                    transactionId: latestInfo.transaction_id,
                    originalTransactionId: latestInfo.original_transaction_id,
                    bundleId,
                    productId,
                    data: response
                };
            }
            this.logger.error(`Apple legacy verification failed with status: ${response.status}`);
            throw new common_1.BadRequestException(`Apple verification failed (Status ${response.status})`);
        }
        catch (error) {
            this.logger.error('Apple verification error', error.stack);
            throw new common_1.BadRequestException(`Apple verification failed: ${error.message}`);
        }
    }
    async verifyAppleJWS(signedTransaction) {
        try {
            const parts = signedTransaction.split('.');
            if (parts.length !== 3) {
                throw new common_1.BadRequestException('Invalid JWS token format');
            }
            const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
            const x5c = header.x5c;
            if (!x5c || x5c.length < 1) {
                throw new common_1.BadRequestException('No x5c certificate chain found');
            }
            this.validateAppleCertificateChain(x5c);
            const leafCertPem = `-----BEGIN CERTIFICATE-----\n${x5c[0]}\n-----END CERTIFICATE-----`;
            const publicKey = await (0, jose_1.importX509)(leafCertPem, header.alg || 'ES256');
            const { payload } = await (0, jose_1.jwtVerify)(signedTransaction, publicKey, {
                algorithms: ['ES256'],
            });
            const transaction = payload;
            this.logger.log(`StoreKit 2 Verification Successful: ${transaction.productId}`);
            return {
                success: true,
                expiryDate: transaction.expiresDate ? new Date(transaction.expiresDate) : null,
                transactionId: transaction.transactionId,
                originalTransactionId: transaction.originalTransactionId,
                productId: transaction.productId,
                bundleId: transaction.bundleId,
                data: transaction
            };
        }
        catch (error) {
            this.logger.error('Apple StoreKit 2 verification error', error.stack);
            throw new common_1.BadRequestException(`Apple JWS verification failed: ${error.message}`);
        }
    }
    validateAppleCertificateChain(x5c) {
        try {
            const rootCert = new crypto.X509Certificate(APPLE_ROOT_CA_G3_PEM);
            const certs = x5c.map((c) => new crypto.X509Certificate(`-----BEGIN CERTIFICATE-----\n${c}\n-----END                  
  CERTIFICATE-----`));
            for (let i = 0; i < certs.length - 1; i++) {
                if (!certs[i].verify(certs[i + 1].publicKey)) {
                    throw new common_1.BadRequestException(`Certificate chain signature invalid at index ${i}`);
                }
            }
            const lastCert = certs[certs.length - 1];
            const isSignedByRoot = lastCert.verify(rootCert.publicKey);
            const isSelfSignedRoot = lastCert.fingerprint256 === rootCert.fingerprint256;
            if (!isSignedByRoot && !isSelfSignedRoot) {
                this.logger.warn('Certificate chain could not be verified against Apple Root CA. Issuer: ' +
                    lastCert.issuer);
            }
            else {
                this.logger.log('Apple certificate chain validation successful');
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            this.logger.warn(`Certificate chain validation warning: ${error.message}`);
        }
    }
    async callAppleVerify(receiptData, password, production) {
        const url = production
            ? 'https://buy.itunes.apple.com/verifyReceipt'
            : 'https://sandbox.itunes.apple.com/verifyReceipt';
        try {
            const { data } = await axios_1.default.post(url, { 'receipt-data': receiptData, password });
            return data;
        }
        catch (error) {
            this.logger.error(`Error calling Apple verify API (${url})`, error.message);
            throw error;
        }
    }
    async verifyAppleNotificationV2(signedPayload) {
        try {
            const parts = signedPayload.split('.');
            if (parts.length !== 3) {
                throw new common_1.BadRequestException('Invalid notification JWS format');
            }
            const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
            const x5c = header.x5c;
            if (!x5c || x5c.length < 1) {
                throw new common_1.BadRequestException('No x5c certificate chain in notification');
            }
            this.validateAppleCertificateChain(x5c);
            const leafCertPem = `-----BEGIN CERTIFICATE-----\n${x5c[0]}\n-----END CERTIFICATE-----`;
            const publicKey = await (0, jose_1.importX509)(leafCertPem, header.alg || 'ES256');
            const { payload } = await (0, jose_1.jwtVerify)(signedPayload, publicKey, {
                algorithms: ['ES256'],
            });
            const notificationPayload = payload;
            this.logger.log(`Apple Notification V2 verified: ${notificationPayload.notificationType}`);
            let transactionInfo;
            const signedTransactionInfo = notificationPayload.data?.signedTransactionInfo;
            if (signedTransactionInfo) {
                const txResult = await this.verifyAppleJWS(signedTransactionInfo);
                transactionInfo = txResult.data;
            }
            return {
                notificationType: notificationPayload.notificationType,
                subtype: notificationPayload.subtype,
                transactionInfo,
            };
        }
        catch (error) {
            this.logger.error('Apple Notification V2 verification error', error.stack);
            throw new common_1.BadRequestException(`Apple notification verification failed: ${error.message}`);
        }
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