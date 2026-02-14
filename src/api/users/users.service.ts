import { BadRequestException, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import {
  comparePassword,
  encodePassword,
} from 'src/common/helper/bcrypt.helper';
import { generateUniqueId } from 'src/common/helper/common.helper';
import {
  deleteFile,
  imageFileFilter,
  uploadFile,
} from 'src/common/helper/fileupload.helper';
import { Brackets, Repository } from 'typeorm';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Users } from './entities/user.entity';
import { ApproveOrRejectDto } from './dtos/approve-or-reject.dto';
import { UserInteraction, InteractionType } from './entities/user-interaction.entity';
import { CoinHistory, TransactionType } from './entities/coin-history.entity';
import { StorePurchase, PurchaseType, PurchaseStatus, PlatformType } from './entities/store-purchase.entity';
import { PurchaseCoinsDto } from './dtos/purchase-coins.dto';
import { UpdateSubscriptionDto } from './dtos/update-subscription.dto';
import { GetUserListDto } from './dtos/get-user-list.dto';
import { ChatService } from '../chat/chat.service';
import { PurchaseVerificationService } from './purchase-verification.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(UserInteraction)
    private readonly userInteractionRepository: Repository<UserInteraction>,
    @InjectRepository(CoinHistory)
    private readonly coinHistoryRepository: Repository<CoinHistory>,
    @InjectRepository(StorePurchase)
    private readonly storePurchaseRepository: Repository<StorePurchase>,
    private readonly purchaseVerificationService: PurchaseVerificationService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  /**
   * Find user by id
   * @param id
   * @returns
   */
  async findById(id: number): Promise<Users> {
    return await this.userRepository.findOne({
      where: { id: id, isBlocked: false },
    });
  }

  /**
   * Find user by userUniqueId
   * @param userUniqueId
   * @returns
   */
  async findByUniqueId(userUniqueId: string): Promise<Users> {
    return await this.userRepository.findOne({
      where: {
        userUniqueId: userUniqueId,
        isBlocked: false,
      },
    });
  }

  /**
   * Find user by phone
   * @param phone
   * @returns
   */
  // async findByPhone(phone: string): Promise<Users> {
  //   return await this.userRepository.findOne({
  //     where: { phone: phone, isBlocked: false },
  //   });
  // }

  /**
   * Find user by email
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<Users> {
    return await this.userRepository.findOne({
      where: { email: email, isBlocked: false },
    });
  }

  /**
   * Find user by email
   * @param email
   * @returns
   */
  async findByEmailNotSocialLogin(email: string): Promise<Users> {
    return await this.userRepository.findOne({
      where: {
        email: email,
        // isSocialLoggedIn: false,
        isBlocked: false,
      },
    });
  }

  /**
   * Update user profile
   * @param updateProfileDto
   * @param userId
   * @returns
   */
  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    authUser: Users,
    profilePic: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: authUser.id, isBlocked: false },
    });

    if (profilePic) {
      if (!imageFileFilter(profilePic)) {
        throw new BadRequestException(
          'Only image files are allowed! Ex. jpg, jpeg, png, gif',
        );
      }

      deleteFile(user.profilePic);
      updateProfileDto.profilePic = uploadFile('profilePics', profilePic);
    }

    Object.keys(updateProfileDto).map((key) => {
      if (updateProfileDto[key] === '') {
        delete updateProfileDto[key];
      }
    });

    return await this.createOrUpdate(updateProfileDto, user.id);
  }

  /**
   * Create or update user
   * @param data
   * @param userId
   * @returns
   */
  async createOrUpdate(data: any, userId: number = null) {
    if (userId) {
      await this.userRepository.update(userId, data);
    } else {
      data.userUniqueId = await generateUniqueId('U');
      const user: Users = await this.userRepository.save(data);
      userId = user.id;
    }
    const savedUser = await this.findById(userId);
    await this.chatService.addUserToGenderGroup(savedUser);
    return savedUser;
  }

  /**
   * Change user password
   * @param changePasswordDto
   * @param authUser
   * @returns
   */
  async changePassword(changePasswordDto: ChangePasswordDto, authUser: Users) {
    if (!comparePassword(changePasswordDto.oldPassword, authUser.password)) {
      throw new BadRequestException('Please enter a valid old password');
    }
    return await this.createOrUpdate(
      { password: encodePassword(changePasswordDto.password) },
      authUser.id,
    );
  }

  /**
   * Delete user
   * @param authUser
   * @returns
   */
  async deleteProfile(authUser: Users) {
    const user: Users = await this.findById(authUser.id);

    if (!user) throw new BadRequestException('User not found!');

    // Delete profilePic
    if (user.profilePic) deleteFile(user.profilePic);

    await this.userRepository.delete({ id: authUser.id });
  }

  /** Toggle user notification
   * @param authUser
   * @returns
   */
  async toggleNotification(authUser: Users) {
    await this.userRepository.update(authUser.id, {
      isNotificationOn: !authUser.isNotificationOn,
    });

    return await this.userRepository.findOne({ where: { id: authUser.id } });
  }



  /** Get upcoming bookings
   * @param authUser
   * @param search
   * @param page
   * @param limit
   * @returns
   */
  async getUsers(
    query: GetUserListDto,
    authUser: Users,
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit);
    const skip = (page - 1) * limit;
    const search = query.search ? String(query.search).trim().toLowerCase() : '';

    const queryBuilder = this.userRepository
      .createQueryBuilder('u')
      .where('u.id != :authUserId', { authUserId: authUser.id })
      .andWhere('u.isBlocked = :isBlocked', { isBlocked: false })
      .andWhere(
        `NOT EXISTS (SELECT 1 FROM user_interaction ui WHERE ui.userId = u.id AND ui.actionById = :authUserId)`,
        { authUserId: authUser.id },
      );

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(u.name) LIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('LOWER(u.lastName) LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('LOWER(u.service) LIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
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


  /**
   *  Approve or Reject User
   * @param approveOrRejectDto 
   * @param authUser 
   * @returns 
   */
  async approveOrRejectUser(approveOrRejectDto: ApproveOrRejectDto,
    authUser: Users){

    const user = await this.userRepository.findOneBy({ id: approveOrRejectDto.userId });

    if (!user) throw new NotFoundException('User not found');

    // Subscription & Interaction Limit Check
    await this.checkInteractionLimit(authUser);

    if (approveOrRejectDto.action === 'approve') {
      await this.userInteractionRepository.save({
        user: user,
        actionBy: authUser,
        actionType: InteractionType.APPROVE,
      });

      // Check if the other user has already approved me
      const isMatch = await this.userInteractionRepository.findOne({
        where: {
          user: { id: authUser.id },
          actionBy: { id: user.id },
          actionType: InteractionType.APPROVE,
        },
      });

      if (isMatch) {
        // Create or join chat room
        await this.chatService.joinRoom(authUser, { userId: user.id });
      }

      return { message: isMatch ? 'Match! Chat room created.' : 'User approved successfully' };
    }

    if (approveOrRejectDto.action === 'reject') {
      await this.userInteractionRepository.save({
        user: user,
        actionBy: authUser,
        actionType: InteractionType.REJECT,
      });

      return { message: 'User rejected successfully' };
    }

  }

  /**
   * Purchase Coins (In-App Purchase Implementation)
   * @param purchaseCoinsDto 
   * @param authUser 
   * @returns 
   */
  async purchaseCoins(purchaseCoinsDto: PurchaseCoinsDto, authUser: Users) {
    let coinsToAdd = 0;
    if (purchaseCoinsDto.productId === 'com.dating.coins50') {
      coinsToAdd = 50;
    } else if (purchaseCoinsDto.productId === 'com.dating.coins25') {
      coinsToAdd = 25;
    } else {
      throw new BadRequestException('Invalid Product ID');
    }

    // SERVER-SIDE VALIDATION
    let verificationResult: any;
    if (purchaseCoinsDto.platform === 'android') {
      verificationResult = await this.purchaseVerificationService.verifyGoogleProduct(
        purchaseCoinsDto.packageName,
        purchaseCoinsDto.productId,
        purchaseCoinsDto.purchaseToken,
      );
    } else {
      verificationResult = await this.purchaseVerificationService.verifyAppleReceipt(
        purchaseCoinsDto.purchaseToken, // For Apple, token is usually the receipt string
      );
    }

    // Update user coins
    const user = await this.findById(authUser.id);
    user.coins = Number(user.coins || 0) + coinsToAdd;
    await this.userRepository.save(user);

    // Save history
    await this.coinHistoryRepository.save({
      user: user,
      coins: coinsToAdd,
      type: TransactionType.PURCHASE,
      productId: purchaseCoinsDto.productId,
      transactionId: purchaseCoinsDto.transactionId,
      description: `Purchased ${coinsToAdd} coins via ${purchaseCoinsDto.platform}. Package: ${purchaseCoinsDto.packageName || 'N/A'}. Token: ${purchaseCoinsDto.purchaseToken || 'N/A'}`,
    });

    // Save to Store Purchase History
    await this.storePurchaseRepository.save({
      user: user,
      productId: purchaseCoinsDto.productId,
      purchaseType: PurchaseType.COIN,
      platform: purchaseCoinsDto.platform as PlatformType,
      transactionId: purchaseCoinsDto.transactionId,
      purchaseToken: purchaseCoinsDto.purchaseToken,
      packageName: purchaseCoinsDto.packageName,
      status: PurchaseStatus.COMPLETED,
    });

    return { 
      message: 'Coins purchased successfully', 
      totalCoins: user.coins 
    };
  }

  /**
   * Spend Coin for Sticker
   * @param userId 
   * @returns 
   */
  async spendCoinForSticker(userId: number) {
    const user = await this.findById(userId);
    if (!user || Number(user.coins || 0) < 1) {
      throw new BadRequestException('Insufficient coins. Please purchase more coins to send stickers.');
    }

    user.coins = Number(user.coins) - 1;
    await this.userRepository.save(user);

    await this.coinHistoryRepository.save({
      user: user,
      coins: 1,
      type: TransactionType.SPENT,
      description: 'Spent 1 coin for sending a sticker',
    });
  }

  /**
   * Get Coin History
   * @param authUser 
   * @returns 
   */
  async getCoinHistory(authUser: Users) {
    return await this.coinHistoryRepository.find({
      where: { user: { id: authUser.id } },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Check if user has exceeded daily interaction limit
   * @param authUser 
   */
  async checkInteractionLimit(authUser: Users) {
    // If user is subscribed and subscription is not expired, then no limit
    if (authUser.isSubscribed) {
      if (!authUser.subscriptionExpiry || new Date(authUser.subscriptionExpiry) > new Date()) {
        return; // Valid subscription
      }
    }

    // Count interactions for today
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    const count = await this.userInteractionRepository
      .createQueryBuilder('ui')
      .where('ui.actionById = :userId', { userId: authUser.id })
      .andWhere('ui.createdAt BETWEEN :start AND :end', { start: startOfDay, end: endOfDay })
      .getCount();

    if (count >= 20) {
      throw new BadRequestException('Daily limit reached (20 free swipes). Please subscribe for unlimited swipes.');
    }
  }

  /**
   * Toggle subscription (for local testing/iOS simple integration)
   * @param authUser 
   * @param isSubscribed 
   * @returns 
   */
  async toggleSubscription(authUser: Users, isSubscribed: boolean) {
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

  /**
   * Update subscription with store data
   * @param dto 
   * @param authUser 
   */
  async updateSubscription(dto: UpdateSubscriptionDto, authUser: Users) {
    let expiryDate = moment();
    
    if (dto.subscriptionId === 'isr_199_1y') {
      expiryDate = expiryDate.add(1, 'year');
    } else if (dto.subscriptionId === 'sir_19_1m') {
      expiryDate = expiryDate.add(1, 'month');
    } else {
      throw new BadRequestException('Invalid Subscription Product ID');
    }

    // SERVER-SIDE VALIDATION
    let verificationResult: any;
    if (dto.platform === 'android') {
      verificationResult = await this.purchaseVerificationService.verifyGoogleSubscription(
        dto.packageName,
        dto.subscriptionId,
        dto.purchaseToken,
      );
      if (verificationResult.expiryDate) expiryDate = moment(verificationResult.expiryDate);
    } else {
      verificationResult = await this.purchaseVerificationService.verifyAppleReceipt(
        dto.purchaseToken,
      );
      if (verificationResult.expiryDate) expiryDate = moment(verificationResult.expiryDate);
    }

    await this.userRepository.update(authUser.id, {
      isSubscribed: true,
      subscriptionExpiry: expiryDate.toDate(),
    });

    // Save to Store Purchase History
    await this.storePurchaseRepository.save({
      user: authUser,
      productId: dto.subscriptionId,
      purchaseType: PurchaseType.SUBSCRIPTION,
      platform: dto.platform as PlatformType,
      purchaseToken: dto.purchaseToken,
      packageName: dto.packageName,
      status: PurchaseStatus.ACTIVE,
      expiryDate: expiryDate.toDate(),
    });

    return {
      message: 'Subscription updated successfully',
      isSubscribed: true,
      subscriptionExpiry: expiryDate.toDate(),
      plan: dto.subscriptionId
    };
  }

  /**
   * Get Store Purchase History
   * @param authUser 
   * @returns 
   */
  async getPurchaseHistory(authUser: Users) {
    return await this.storePurchaseRepository.find({
      where: { user: { id: authUser.id } },
      order: { createdAt: 'DESC' },
    });
  }
}
