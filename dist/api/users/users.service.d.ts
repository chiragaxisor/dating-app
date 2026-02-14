import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Users } from './entities/user.entity';
import { ApproveOrRejectDto } from './dtos/approve-or-reject.dto';
import { UserInteraction } from './entities/user-interaction.entity';
import { CoinHistory } from './entities/coin-history.entity';
import { StorePurchase } from './entities/store-purchase.entity';
import { PurchaseCoinsDto } from './dtos/purchase-coins.dto';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';
import { GetUserListDto } from './dtos/get-user-list.dto';
import { ChatService } from '../chat/chat.service';
import { PurchaseVerificationService } from './purchase-verification.service';
export declare class UsersService {
    private readonly userRepository;
    private readonly userInteractionRepository;
    private readonly coinHistoryRepository;
    private readonly storePurchaseRepository;
    private readonly purchaseVerificationService;
    private readonly chatService;
    constructor(userRepository: Repository<Users>, userInteractionRepository: Repository<UserInteraction>, coinHistoryRepository: Repository<CoinHistory>, storePurchaseRepository: Repository<StorePurchase>, purchaseVerificationService: PurchaseVerificationService, chatService: ChatService);
    findById(id: number): Promise<Users>;
    findByUniqueId(userUniqueId: string): Promise<Users>;
    findByEmail(email: string): Promise<Users>;
    findByEmailNotSocialLogin(email: string): Promise<Users>;
    updateProfile(updateProfileDto: UpdateProfileDto, authUser: Users, profilePic: Express.Multer.File): Promise<Users>;
    createOrUpdate(data: any, userId?: number): Promise<Users>;
    changePassword(changePasswordDto: ChangePasswordDto, authUser: Users): Promise<Users>;
    deleteProfile(authUser: Users): Promise<void>;
    toggleNotification(authUser: Users): Promise<Users>;
    getUsers(query: GetUserListDto, authUser: Users): Promise<(number | Users[])[]>;
    approveOrRejectUser(approveOrRejectDto: ApproveOrRejectDto, authUser: Users): Promise<{
        message: string;
    }>;
    purchaseCoins(purchaseCoinsDto: PurchaseCoinsDto, authUser: Users): Promise<{
        message: string;
        totalCoins: number;
    }>;
    spendCoinForSticker(userId: number): Promise<void>;
    getCoinHistory(authUser: Users): Promise<CoinHistory[]>;
    checkInteractionLimit(authUser: Users): Promise<void>;
    toggleSubscription(authUser: Users, isSubscribed: boolean): Promise<{
        message: string;
        isSubscribed: boolean;
        expiry: Date;
    }>;
    updateSubscription(dto: UpdateSubscriptionDto, authUser: Users): Promise<{
        message: string;
        isSubscribed: boolean;
        subscriptionExpiry: Date;
        plan: string;
    }>;
    getPurchaseHistory(authUser: Users): Promise<StorePurchase[]>;
}
