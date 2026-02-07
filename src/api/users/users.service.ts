import { BadRequestException, Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
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
import { RejectedUser } from './entities/rejected-user.entity';
import { GetUserListDto } from './dtos/get-user-list.dto';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(RejectedUser)
    private readonly rejectedUserRepository: Repository<RejectedUser>,
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
      .leftJoin('rejected_user', 'ru', 'ru.userId = u.id')
      .where('u.id != :authUserId', { authUserId: authUser.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('ru.id IS NULL').orWhere('ru.rejectedBy != :authUserId', {
            authUserId: authUser.id,
          });
        }),
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

    if (approveOrRejectDto.action === 'approve') {
      // user.isApproved = true;
      // await this.userRepository.save(user);
      return { message: 'User approved successfully' };
    }

    if (approveOrRejectDto.action === 'reject') {
      await this.rejectedUserRepository.save({
        user: user,
        rejectedBy: authUser,
      });

      return { message: 'User rejected successfully' };
    }

  }

}
