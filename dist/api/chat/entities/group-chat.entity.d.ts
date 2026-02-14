import { GroupChatMessage } from './group-chat-message.entity';
import { GroupChatMember } from './group-chat-member.entity';
export declare class GroupChat {
    id: number;
    name: string;
    gender: string;
    messages: GroupChatMessage[];
    members: GroupChatMember[];
    createdAt: Date;
    updatedAt: Date;
}
