import { Users } from 'src/api/users/entities/user.entity';
export declare class Chat {
    id: number;
    sender: Users;
    receiver: Users;
    receiverUser: Users;
    lastMessage: string;
    messageType: string;
    unReadMessageCount: number;
    lastMessageAt: number;
    createdAt: Date;
    updatedAt: Date;
}
