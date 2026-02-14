import { Repository } from 'typeorm';
import { DeviceTokens } from './entities/device-tokens.entity';
import { CreateDeviceTokenDto } from './dtos/create-device-token.dto';
import { SendNotificationDto } from './dtos/send-notification.dto';
import { Users } from '../users/entities/user.entity';
import { NotificationTypes } from 'src/common/constants';
export declare class DeviceTokenService {
    private deviceTokenRepository;
    constructor(deviceTokenRepository: Repository<DeviceTokens>);
    create(createDeviceTokenDto: CreateDeviceTokenDto, authUser: Users): Promise<import("typeorm").UpdateResult | ({
        user: {
            id: number;
        };
        deviceId: string;
        deviceType: import("src/common/constants").DeviceTypes;
        token: string;
    } & DeviceTokens)>;
    sendPush(sendNotificationDto: SendNotificationDto): Promise<void>;
    sendPushToUser(title: string, body: string, notificationType: NotificationTypes, user: Users): Promise<true | void>;
    remove(deviceId: string, user: Users): Promise<import("typeorm").DeleteResult>;
    removeByToken(token: string): Promise<import("typeorm").DeleteResult>;
    getTokensByUserID(userId: number): Promise<any[]>;
}
