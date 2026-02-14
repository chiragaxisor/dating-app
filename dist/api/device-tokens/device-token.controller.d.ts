import { HttpStatus } from '@nestjs/common';
import { Users } from '../users/entities/user.entity';
import { DeviceTokenService } from './device-token.service';
import { CreateDeviceTokenDto } from './dtos/create-device-token.dto';
import { SendNotificationDto } from './dtos/send-notification.dto';
export declare class DeviceTokenController {
    private readonly deviceTokenService;
    constructor(deviceTokenService: DeviceTokenService);
    create(authUser: Users, createDeviceTokenDto: CreateDeviceTokenDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    sendPush(sendNotificationDto: SendNotificationDto): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
