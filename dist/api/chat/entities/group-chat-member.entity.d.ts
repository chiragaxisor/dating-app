import { Users } from 'src/api/users/entities/user.entity';
import { GroupChat } from './group-chat.entity';
export declare class GroupChatMember {
    id: number;
    groupChat: GroupChat;
    user: Users;
    joinedAt: Date;
}
