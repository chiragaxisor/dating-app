import { ConfigService } from '@nestjs/config';
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
        data: any;
    }>;
    private callAppleVerify;
    private getGoogleAuth;
}
