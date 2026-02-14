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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const auth_user_decorator_1 = require("../../common/decorators/auth-user.decorator");
const jwt_auth_guard_1 = require("../../common/passport/jwt-auth.guard");
const swagger_response_1 = require("../../common/swagger.response");
const change_password_dto_1 = require("./dtos/change-password.dto");
const update_profile_dto_1 = require("./dtos/update-profile.dto");
const user_entity_1 = require("./entities/user.entity");
const users_service_1 = require("./users.service");
const approve_or_reject_dto_1 = require("./dtos/approve-or-reject.dto");
const get_user_list_dto_1 = require("./dtos/get-user-list.dto");
const purchase_coins_dto_1 = require("./dtos/purchase-coins.dto");
const update_subscription_dto_1 = require("./dtos/update-subscription.dto");
const coin_history_entity_1 = require("./entities/coin-history.entity");
const store_purchase_entity_1 = require("./entities/store-purchase.entity");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async userDetails(authUser) {
        const user = await this.usersService.findById(authUser.id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Success',
            data: (0, class_transformer_1.plainToInstance)(user_entity_1.Users, user, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
        };
    }
    async userlists(authUser, query) {
        const [users, total] = await this.usersService.getUsers(query, authUser);
        return {
            message: 'Success',
            data: (0, class_transformer_1.plainToInstance)(user_entity_1.Users, users, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            }),
            meta: {
                totalItems: total,
                itemsPerPage: query.limit || total,
                totalPages: query.limit ? Math.ceil(Number(total) / query.limit) : 1,
                currentPage: query.page || 1,
            },
        };
    }
    async updateProfile(authUser, updateProfileDto, profilePic) {
        const user = await this.usersService.updateProfile(updateProfileDto, authUser, profilePic);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Your profile has been successfully updated',
            data: (0, class_transformer_1.plainToInstance)(user_entity_1.Users, user, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
        };
    }
    async approveOrRejectUser(authUser, approveOrRejectDto) {
        const message = await this.usersService.approveOrRejectUser(approveOrRejectDto, authUser);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: message.message,
        };
    }
    async changePassword(authUser, changePasswordDto) {
        await this.usersService.changePassword(changePasswordDto, authUser);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Password successfully changed',
        };
    }
    async purchaseCoins(authUser, purchaseCoinsDto) {
        return await this.usersService.purchaseCoins(purchaseCoinsDto, authUser);
    }
    async getCoinHistory(authUser) {
        const history = await this.usersService.getCoinHistory(authUser);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Success',
            data: (0, class_transformer_1.plainToInstance)(coin_history_entity_1.CoinHistory, history, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
        };
    }
    async toggleSubscription(authUser, isSubscribed) {
        return await this.usersService.toggleSubscription(authUser, isSubscribed);
    }
    async updateSubscription(authUser, updateSubscriptionDto) {
        return await this.usersService.updateSubscription(updateSubscriptionDto, authUser);
    }
    async getPurchaseHistory(authUser) {
        const history = await this.usersService.getPurchaseHistory(authUser);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Success',
            data: (0, class_transformer_1.plainToInstance)(store_purchase_entity_1.StorePurchase, history, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(''),
    (0, swagger_1.ApiOperation)({
        summary: 'Get login user details',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.USER_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.UNAUTHORIZE_RESPONSE),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userDetails", null);
__decorate([
    (0, common_1.Get)('list'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all user list',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.USER_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.UNAUTHORIZE_RESPONSE),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users,
        get_user_list_dto_1.GetUserListDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userlists", null);
__decorate([
    (0, common_1.Put)(''),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user details',
        description: `    Gender: male, female, other`,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePic')),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.USER_UPDATE_PROFILE_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.UNAUTHORIZE_RESPONSE),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users,
        update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('/approve-or-reject'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user details',
        description: `Action type: "approve" or "reject"`,
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.USER_UPDATE_PROFILE_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.UNAUTHORIZE_RESPONSE),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users,
        approve_or_reject_dto_1.ApproveOrRejectDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "approveOrRejectUser", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Change password',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.CHANGE_PASSWORD_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.BAD_REQUEST_RESPONSE),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users,
        change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('purchase-coins'),
    (0, swagger_1.ApiOperation)({
        summary: 'Purchase coins via In-App Purchase',
        description: `Product IDs: com.dating.coins50, com.dating.coins25`,
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    (0, swagger_1.ApiResponse)(swagger_response_1.BAD_REQUEST_RESPONSE),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users,
        purchase_coins_dto_1.PurchaseCoinsDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "purchaseCoins", null);
__decorate([
    (0, common_1.Get)('coin-history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user coin transaction history',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCoinHistory", null);
__decorate([
    (0, common_1.Post)('toggle-subscription'),
    (0, swagger_1.ApiOperation)({
        summary: 'Toggle Subscription (Simulate iOS subscription purchase)',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)('isSubscribed')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users, Boolean]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "toggleSubscription", null);
__decorate([
    (0, common_1.Post)('update-subscription'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update subscription from App Store/Google Play',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users,
        update_subscription_dto_1.UpdateSubscriptionDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Get)('purchase-history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get store purchase history (IAP & Subscriptions)',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPurchaseHistory", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('api/v1/users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiSecurity)('api_key', ['Api-Key']),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map