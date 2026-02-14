import { Users } from 'src/api/users/entities/user.entity';
export declare class UserBlocks {
    id: number;
    user: Users;
    blockedUser: Users;
    createdAt: Date;
    updatedAt: Date;
}
