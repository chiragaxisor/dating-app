import { HttpStatus } from '@nestjs/common';
import { ChatJoinDto } from './dto/chat-join.dto';
import { ChatService } from './chat.service';
import { ImageUploadDto } from './dto/image-upload.dto';
import { ChatMessageResponse } from './resources/chat-message.response';
import { Users } from '../users/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { GroupChat } from './entities/group-chat.entity';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getGroupChatList(authUser: Users): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: GroupChat[];
    }>;
    getGroupChatMessages(authUser: Users, groupId: number, _page?: string, _limit?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: number | import("./entities/group-chat-message.entity").GroupChatMessage[];
        meta: {
            totalItems: number | import("./entities/group-chat-message.entity").GroupChatMessage[];
            itemsPerPage: number | import("./entities/group-chat-message.entity").GroupChatMessage[];
            totalPages: number;
            currentPage: number;
        };
    }>;
    chatList(authUser: Users, _page?: string, _limit?: string, search?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: Chat;
        meta: {
            totalItems: number | any[];
            itemsPerPage: number | any[];
            totalPages: number;
            currentPage: number;
        };
    }>;
    uploadImage(authUser: Users, imageUploadDto: ImageUploadDto, file: Express.Multer.File): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: string;
    }>;
    joinRoom(authUser: Users, chatJoinDto: ChatJoinDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: Chat;
    }>;
    getChatMessages(authUser: Users, chatId: number, _page?: string, _limit?: string): Promise<{
        data: ChatMessageResponse;
        meta: {
            totalItems: number | any[];
            itemsPerPage: number | any[];
            totalPages: number;
            currentPage: number;
        };
    }>;
    getActiveUsers(authUser: Users, _page?: string, _limit?: string): Promise<{
        data: Users;
        meta: {
            totalItems: any;
            itemsPerPage: any;
            totalPages: number;
            currentPage: number;
        };
    }>;
    clearChat(authUser: Users, chatId: number): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
