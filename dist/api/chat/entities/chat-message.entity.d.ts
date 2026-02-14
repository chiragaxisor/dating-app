import { Chat } from './chat.entity';
import { Users } from 'src/api/users/entities/user.entity';
import { MessageTypes } from 'src/common/constants';
export declare class ChatMessage {
    id: number;
    chat: Chat;
    sender: Users;
    message: string;
    messageType: MessageTypes;
    isSeen: boolean;
    isDeletedBySender: boolean;
    isDeletedByReciever: boolean;
    createdAt: Date;
    updatedAt: Date;
}
