export declare class PurchaseCoinsDto {
    productId: string;
    transactionId: string;
    platform: 'android' | 'ios';
    purchaseToken?: string;
    packageName?: string;
}
