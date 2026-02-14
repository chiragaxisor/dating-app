import { Gender } from 'src/common/constants';
export declare class AuthTokenResource {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}
export declare class Users {
    jti?: string;
    id: number;
    userUniqueId: string;
    name: string;
    email: string;
    password: string;
    address: string;
    country: string;
    city: string;
    state: string;
    gender: Gender;
    coins: number;
    isSubscribed: boolean;
    subscriptionExpiry: Date;
    profilePic: string;
    isNotificationOn: boolean;
    isOnline: boolean;
    forgotPasswordCode: string;
    forgotPasswordCodeExpiredAt: Date;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    dateOfBirth: Date;
    imlooking: string;
    relationship: string;
    about: string;
    interested: string;
    authentication: AuthTokenResource;
}
