import { HttpStatus } from '@nestjs/common';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Users } from './entities/user.entity';
import { UsersService } from './users.service';
import { ApproveOrRejectDto } from './dtos/approve-or-reject.dto';
import { GetUserListDto } from './dtos/get-user-list.dto';
import { PurchaseCoinsDto } from './dtos/purchase-coins.dto';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';
import { CoinHistory } from './entities/coin-history.entity';
import { StorePurchase } from './entities/store-purchase.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    userDetails(authUser: Users): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: Users;
    }>;
    userlists(authUser: Users, query: GetUserListDto): Promise<{
        message: string;
        data: Users;
        meta: {
            totalItems: number | Users[];
            itemsPerPage: number | Users[];
            totalPages: number;
            currentPage: number;
        };
    }>;
    updateProfile(authUser: Users, updateProfileDto: UpdateProfileDto, profilePic: Express.Multer.File): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: Users;
    }>;
    approveOrRejectUser(authUser: Users, approveOrRejectDto: ApproveOrRejectDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    changePassword(authUser: Users, changePasswordDto: ChangePasswordDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    purchaseCoins(authUser: Users, purchaseCoinsDto: PurchaseCoinsDto): Promise<{
        message: string;
        totalCoins: number;
    }>;
    getCoinHistory(authUser: Users): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: CoinHistory[];
    }>;
    toggleSubscription(authUser: Users, isSubscribed: boolean): Promise<{
        message: string;
        isSubscribed: boolean;
        expiry: Date;
    }>;
    updateSubscription(authUser: Users, updateSubscriptionDto: UpdateSubscriptionDto): Promise<{
        message: string;
        isSubscribed: boolean;
        subscriptionExpiry: Date;
        plan: string;
    }>;
    getPurchaseHistory(authUser: Users): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: StorePurchase[];
    }>;
}
