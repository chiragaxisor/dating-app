import { Repository } from 'typeorm';
import { Users } from '../users/entities/user.entity';
import { StorePurchase } from '../users/entities/store-purchase.entity';
import { PurchaseVerificationService } from '../users/purchase-verification.service';
export declare class WebhooksService {
    private readonly purchaseVerificationService;
    private readonly userRepository;
    private readonly storePurchaseRepository;
    private readonly logger;
    constructor(purchaseVerificationService: PurchaseVerificationService, userRepository: Repository<Users>, storePurchaseRepository: Repository<StorePurchase>);
    handleAppleWebhook(payload: any): Promise<{
        status: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
    }>;
    private handleRenewal;
    private handleExpired;
    private handleRefund;
    handleGoogleWebhook(payload: any): Promise<{
        status: string;
    }>;
}
