import { Users } from 'src/api/users/entities/user.entity';
import { GroupChat } from './group-chat.entity';
import { MessageTypes } from 'src/common/constants';
export declare class GroupChatMessage {
    id: number;
    groupChat: GroupChat;
    sender: Users;
    message: string;
    messageType: MessageTypes;
    createdAt: Date;
    updatedAt: Date;
}
