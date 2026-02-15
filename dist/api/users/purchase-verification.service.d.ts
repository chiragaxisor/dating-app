import { ConfigService } from '@nestjs/config';
export interface AppleTransactionPayload {
    transactionId: string;
    originalTransactionId: string;
    productId: string;
    purchaseDate: number;
    expiresDate: number;
    bundleId: string;
    environment: string;
    type: string;
}
export declare class PurchaseVerificationService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    verifyGoogleProduct(packageName: string, productId: string, purchaseToken: string): Promise<{
        success: boolean;
        data: import("googleapis").androidpublisher_v3.Schema$ProductPurchase;
    }>;
    verifyGoogleSubscription(packageName: string, subscriptionId: string, purchaseToken: string): Promise<{
        success: boolean;
        expiryDate: Date;
        data: import("googleapis").androidpublisher_v3.Schema$SubscriptionPurchase;
    }>;
    verifyAppleReceipt(receiptData: string): Promise<{
        success: boolean;
        expiryDate: Date;
        transactionId: any;
        originalTransactionId: any;
        bundleId: any;
        productId: any;
        data: any;
    }>;
    verifyAppleJWS(signedTransaction: string): Promise<{
        success: boolean;
        expiryDate: Date;
        transactionId: string;
        originalTransactionId: string;
        productId: string;
        bundleId: string;
        data: AppleTransactionPayload;
    }>;
    private validateAppleCertificateChain;
    private callAppleVerify;
    verifyAppleNotificationV2(signedPayload: string): Promise<{
        notificationType: string;
        subtype?: string;
        transactionInfo?: AppleTransactionPayload;
    }>;
    private getGoogleAuth;
}
