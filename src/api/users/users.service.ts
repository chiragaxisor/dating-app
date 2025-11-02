import { BadRequestException, Injectable } from '@nestjs/common';
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
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
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
    return await this.findById(userId);
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
}
