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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt_helper_1 = require("../../common/helper/bcrypt.helper");
const common_helper_1 = require("../../common/helper/common.helper");
const fileupload_helper_1 = require("../../common/helper/fileupload.helper");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_interaction_entity_1 = require("./entities/user-interaction.entity");
const coin_history_entity_1 = require("./entities/coin-history.entity");
const store_purchase_entity_1 = require("./entities/store-purchase.entity");
const chat_service_1 = require("../chat/chat.service");
const purchase_verification_service_1 = require("./purchase-verification.service");
let UsersService = class UsersService {
    constructor(userRepository, userInteractionRepository, coinHistoryRepository, storePurchaseRepository, purchaseVerificationService, chatService) {
        this.userRepository = userRepository;
        this.userInteractionRepository = userInteractionRepository;
        this.coinHistoryRepository = coinHistoryRepository;
        this.storePurchaseRepository = storePurchaseRepository;
        this.purchaseVerificationService = purchaseVerificationService;
        this.chatService = chatService;
    }
    async findById(id) {
        return await this.userRepository.findOne({
            where: { id: id, isBlocked: false },
        });
    }
    async findByUniqueId(userUniqueId) {
        return await this.userRepository.findOne({
            where: {
                userUniqueId: userUniqueId,
                isBlocked: false,
            },
        });
    }
    async findByEmail(email) {
        return await this.userRepository.findOne({
            where: { email: email, isBlocked: false },
        });
    }
    async findByEmailNotSocialLogin(email) {
        return await this.userRepository.findOne({
            where: {
                email: email,
                isBlocked: false,
            },
        });
    }
    async updateProfile(updateProfileDto, authUser, profilePic) {
        const user = await this.userRepository.findOne({
            where: { id: authUser.id, isBlocked: false },
        });
        if (profilePic) {
            if (!(0, fileupload_helper_1.imageFileFilter)(profilePic)) {
                throw new common_1.BadRequestException('Only image files are allowed! Ex. jpg, jpeg, png, gif');
            }
            (0, fileupload_helper_1.deleteFile)(user.profilePic);
            updateProfileDto.profilePic = (0, fileupload_helper_1.uploadFile)('profilePics', profilePic);
        }
        Object.keys(updateProfileDto).map((key) => {
            if (updateProfileDto[key] === '') {
                delete updateProfileDto[key];
            }
        });
        return await this.createOrUpdate(updateProfileDto, user.id);
    }
    async createOrUpdate(data, userId = null) {
        if (userId) {
            await this.userRepository.update(userId, data);
        }
        else {
            data.userUniqueId = await (0, common_helper_1.generateUniqueId)('U');
            const user = await this.userRepository.save(data);
            userId = user.id;
        }
        const savedUser = await this.findById(userId);
        await this.chatService.addUserToGenderGroup(savedUser);
        return savedUser;
    }
    async changePassword(changePasswordDto, authUser) {
        if (!(0, bcrypt_helper_1.comparePassword)(changePasswordDto.oldPassword, authUser.password)) {
            throw new common_1.BadRequestException('Please enter a valid old password');
        }
        return await this.createOrUpdate({ password: (0, bcrypt_helper_1.encodePassword)(changePasswordDto.password) }, authUser.id);
    }
    async deleteProfile(authUser) {
        const user = await this.findById(authUser.id);
        if (!user)
            throw new common_1.BadRequestException('User not found!');
        if (user.profilePic)
            (0, fileupload_helper_1.deleteFile)(user.profilePic);
        await this.userRepository.delete({ id: authUser.id });
    }
    async toggleNotification(authUser) {
        await this.userRepository.update(authUser.id, {
            isNotificationOn: !authUser.isNotificationOn,
        });
        return await this.userRepository.findOne({ where: { id: authUser.id } });
    }
    async getUsers(query, authUser) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit);
        const skip = (page - 1) * limit;
        const search = query.search ? String(query.search).trim().toLowerCase() : '';
        const queryBuilder = this.userRepository
            .createQueryBuilder('u')
            .where('u.id != :authUserId', { authUserId: authUser.id })
            .andWhere('u.isBlocked = :isBlocked', { isBlocked: false })
            .andWhere(`NOT EXISTS (SELECT 1 FROM user_interaction ui WHERE ui.userId = u.id AND ui.actionById = :authUserId)`, { authUserId: authUser.id });
        if (search) {
            queryBuilder.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('LOWER(u.name) LIKE :search', {
                    search: `%${search}%`,
                })
                    .orWhere('LOWER(u.lastName) LIKE :search', {
                    search: `%${search}%`,
                })
                    .orWhere('LOWER(u.service) LIKE :search', {
                    search: `%${search}%`,
                });
            }));
        }
        if (query.relationship) {
            queryBuilder.andWhere('u.relationship = :relationship', {
                relationship: query.relationship,
            });
        }
        if (query.imlooking) {
            queryBuilder.andWhere('u.imlooking = :imlooking', {
                imlooking: query.imlooking,
            });
        }
        const total = await queryBuilder.getCount();
        const booking = limit
            ? await queryBuilder.take(limit).skip(skip).getMany()
            : await queryBuilder.getMany();
        return [booking, total];
    }
    async approveOrRejectUser(approveOrRejectDto, authUser) {
        const user = await this.userRepository.findOneBy({ id: approveOrRejectDto.userId });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.checkInteractionLimit(authUser);
        if (approveOrRejectDto.action === 'approve') {
            await this.userInteractionRepository.save({
                user: user,
                actionBy: authUser,
                actionType: user_interaction_entity_1.InteractionType.APPROVE,
            });
            const isMatch = await this.userInteractionRepository.findOne({
                where: {
                    user: { id: authUser.id },
                    actionBy: { id: user.id },
                    actionType: user_interaction_entity_1.InteractionType.APPROVE,
                },
            });
            if (isMatch) {
                await this.chatService.joinRoom(authUser, { userId: user.id });
            }
            return { message: isMatch ? 'Match! Chat room created.' : 'User approved successfully' };
        }
        if (approveOrRejectDto.action === 'reject') {
            await this.userInteractionRepository.save({
                user: user,
                actionBy: authUser,
                actionType: user_interaction_entity_1.InteractionType.REJECT,
            });
            return { message: 'User rejected successfully' };
        }
    }
    async purchaseCoins(purchaseCoinsDto, authUser) {
        let coinsToAdd = 0;
        if (purchaseCoinsDto.productId === 'com.dating.coins50') {
            coinsToAdd = 50;
        }
        else if (purchaseCoinsDto.productId === 'com.dating.coins25') {
            coinsToAdd = 25;
        }
        else {
            throw new common_1.BadRequestException('Invalid Product ID');
        }
        let verificationResult;
        if (purchaseCoinsDto.platform === 'android') {
            verificationResult = await this.purchaseVerificationService.verifyGoogleProduct(purchaseCoinsDto.packageName, purchaseCoinsDto.productId, purchaseCoinsDto.purchaseToken);
        }
        else {
            verificationResult = await this.purchaseVerificationService.verifyAppleReceipt(purchaseCoinsDto.purchaseToken);
        }
        const user = await this.findById(authUser.id);
        user.coins = Number(user.coins || 0) + coinsToAdd;
        await this.userRepository.save(user);
        await this.coinHistoryRepository.save({
            user: user,
            coins: coinsToAdd,
            type: coin_history_entity_1.TransactionType.PURCHASE,
            productId: purchaseCoinsDto.productId,
            transactionId: purchaseCoinsDto.transactionId,
            description: `Purchased ${coinsToAdd} coins via ${purchaseCoinsDto.platform}. Package: ${purchaseCoinsDto.packageName || 'N/A'}. Token: ${purchaseCoinsDto.purchaseToken || 'N/A'}`,
        });
        await this.storePurchaseRepository.save({
            user: user,
            productId: purchaseCoinsDto.productId,
            purchaseType: store_purchase_entity_1.PurchaseType.COIN,
            platform: purchaseCoinsDto.platform,
            transactionId: purchaseCoinsDto.transactionId,
            purchaseToken: purchaseCoinsDto.purchaseToken,
            packageName: purchaseCoinsDto.packageName,
            status: store_purchase_entity_1.PurchaseStatus.COMPLETED,
        });
        return {
            message: 'Coins purchased successfully',
            totalCoins: user.coins
        };
    }
    async spendCoinForSticker(userId) {
        const user = await this.findById(userId);
        if (!user || Number(user.coins || 0) < 1) {
            throw new common_1.BadRequestException('Insufficient coins. Please purchase more coins to send stickers.');
        }
        user.coins = Number(user.coins) - 1;
        await this.userRepository.save(user);
        await this.coinHistoryRepository.save({
            user: user,
            coins: 1,
            type: coin_history_entity_1.TransactionType.SPENT,
            description: 'Spent 1 coin for sending a sticker',
        });
    }
    async getCoinHistory(authUser) {
        return await this.coinHistoryRepository.find({
            where: { user: { id: authUser.id } },
            order: { createdAt: 'DESC' },
        });
    }
    async checkInteractionLimit(authUser) {
        if (authUser.isSubscribed) {
            if (!authUser.subscriptionExpiry || new Date(authUser.subscriptionExpiry) > new Date()) {
                return;
            }
        }
        const startOfDay = moment().startOf('day').toDate();
        const endOfDay = moment().endOf('day').toDate();
        const count = await this.userInteractionRepository
            .createQueryBuilder('ui')
            .where('ui.actionById = :userId', { userId: authUser.id })
            .andWhere('ui.createdAt BETWEEN :start AND :end', { start: startOfDay, end: endOfDay })
            .getCount();
        if (count >= 20) {
            throw new common_1.BadRequestException('Daily limit reached (20 free swipes). Please subscribe for unlimited swipes.');
        }
    }
    async toggleSubscription(authUser, isSubscribed) {
        const expiry = isSubscribed ? moment().add(1, 'month').toDate() : null;
        await this.userRepository.update(authUser.id, {
            isSubscribed: isSubscribed,
            subscriptionExpiry: expiry,
        });
        return {
            message: `Subscription successfully ${isSubscribed ? 'activated' : 'deactivated'}`,
            isSubscribed,
            expiry
        };
    }
    async updateSubscription(dto, authUser) {
        let expiryDate = moment();
        if (dto.subscriptionId === 'isr_199_1y') {
            expiryDate = expiryDate.add(1, 'year');
        }
        else if (dto.subscriptionId === 'sir_19_1m') {
            expiryDate = expiryDate.add(1, 'month');
        }
        else {
            throw new common_1.BadRequestException('Invalid Subscription Product ID');
        }
        let verificationResult;
        if (dto.platform === 'android') {
            verificationResult = await this.purchaseVerificationService.verifyGoogleSubscription(dto.packageName, dto.subscriptionId, dto.purchaseToken);
            if (verificationResult.expiryDate)
                expiryDate = moment(verificationResult.expiryDate);
        }
        else {
            verificationResult = await this.purchaseVerificationService.verifyAppleReceipt(dto.purchaseToken);
            if (verificationResult.expiryDate)
                expiryDate = moment(verificationResult.expiryDate);
        }
        await this.userRepository.update(authUser.id, {
            isSubscribed: true,
            subscriptionExpiry: expiryDate.toDate(),
        });
        await this.storePurchaseRepository.save({
            user: authUser,
            productId: dto.subscriptionId,
            purchaseType: store_purchase_entity_1.PurchaseType.SUBSCRIPTION,
            platform: dto.platform,
            purchaseToken: dto.purchaseToken,
            packageName: dto.packageName,
            status: store_purchase_entity_1.PurchaseStatus.ACTIVE,
            expiryDate: expiryDate.toDate(),
        });
        return {
            message: 'Subscription updated successfully',
            isSubscribed: true,
            subscriptionExpiry: expiryDate.toDate(),
            plan: dto.subscriptionId
        };
    }
    async getPurchaseHistory(authUser) {
        return await this.storePurchaseRepository.find({
            where: { user: { id: authUser.id } },
            order: { createdAt: 'DESC' },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(user_interaction_entity_1.UserInteraction)),
    __param(2, (0, typeorm_1.InjectRepository)(coin_history_entity_1.CoinHistory)),
    __param(3, (0, typeorm_1.InjectRepository)(store_purchase_entity_1.StorePurchase)),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => chat_service_1.ChatService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        purchase_verification_service_1.PurchaseVerificationService,
        chat_service_1.ChatService])
], UsersService);
//# sourceMappingURL=users.service.js.map