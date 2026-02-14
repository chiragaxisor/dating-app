import { Users } from '../../users/entities/user.entity';
export declare class AccessTokens {
    static REVOKE_TOKEN: number;
    constructor(id?: string);
    id: string;
    user: Users;
    revoked: number;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
