import { Users } from './user.entity';
export declare enum PurchaseType {
    COIN = "coin",
    SUBSCRIPTION = "subscription"
}
export declare enum PurchaseStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    COMPLETED = "completed",
    REFUNDED = "refunded",
    CANCELLED = "cancelled"
}
export declare enum PlatformType {
    ANDROID = "android",
    IOS = "ios"
}
export declare class StorePurchase {
    id: number;
    user: Users;
    productId: string;
    purchaseType: PurchaseType;
    platform: PlatformType;
    transactionId: string;
    purchaseToken: string;
    packageName: string;
    status: PurchaseStatus;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
