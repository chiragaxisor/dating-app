import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceTokens } from './entities/device-tokens.entity';
import { CreateDeviceTokenDto } from './dtos/create-device-token.dto';
import { SendNotificationDto } from './dtos/send-notification.dto';
import { Users } from '../users/entities/user.entity';
import { NotificationTypes } from 'src/common/constants';
import { sendPush } from 'src/common/helper/common.helper';

@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectRepository(DeviceTokens)
    private deviceTokenRepository: Repository<DeviceTokens>,
  ) {}

  /**
   * Register device token for push notification
   * @param createDeviceTokenDto
   * @param authUser
   * @returns
   */
  async create(createDeviceTokenDto: CreateDeviceTokenDto, authUser: Users) {
    const checkToken = await this.deviceTokenRepository.findOne({
      where: {
        deviceId: createDeviceTokenDto.deviceId,
        user: { id: authUser.id },
      },
    });
    if (checkToken) {
      return this.deviceTokenRepository.update(
        { id: checkToken.id },
        createDeviceTokenDto,
      );
    } else {
      return this.deviceTokenRepository.save({
        ...createDeviceTokenDto,
        user: { id: authUser.id },
      });
    }
  }

  /**
   * Send test push notification
   * @param sendNotificationDto
   * @returns
   */
  async sendPush(sendNotificationDto: SendNotificationDto) {
    return await sendPush([sendNotificationDto.token], {
      notification: {
        title: sendNotificationDto.title,
        body: sendNotificationDto.notification,
      },
      data: {
        type: NotificationTypes.DEFAULT_NOTIFICATION.toString(),
      },
    });
  }

  /**
   * Send test push notification
   * @param sendNotificationDto
   * @returns
   */
  async sendPushToUser(
    title: string,
    body: string,
    notificationType: NotificationTypes,
    user: Users,
  ) {
    if (user.isNotificationOn) {
      const tokens = await this.getTokensByUserID(user.id);

      return await sendPush(tokens, {
        notification: {
          title: title,
          body: body,
        },
        data: {
          type: notificationType.toString(),
        },
      });
    } else {
      return true;
    }
  }

  /**
   * Remove device token
   * @param deviceId
   * @param user
   * @returns
   */
  async remove(deviceId: string, user: Users) {
    return this.deviceTokenRepository.delete({
      deviceId,
      user: { id: user.id },
    });
  }

  /**
   * Remove device token
   * @param token
   * @returns
   */
  async removeByToken(token: string) {
    return this.deviceTokenRepository.delete({
      token,
    });
  }

  /**
   * Select device token
   * @param userId
   * @returns
   */
  async getTokensByUserID(userId: number) {
    const deviceTokens = await this.deviceTokenRepository
      .createQueryBuilder('dt')
      .select('DISTINCT(token)')
      .where('userId = :userId', { userId: userId })
      .getRawMany();

    return deviceTokens.map((s) => s.token);
  }
}
