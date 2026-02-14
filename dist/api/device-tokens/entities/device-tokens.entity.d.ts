import { Users } from 'src/api/users/entities/user.entity';
import { DeviceTypes } from 'src/common/constants';
export declare class DeviceTokens {
    id: number;
    deviceId: string;
    deviceType: DeviceTypes;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    user: Users;
}
