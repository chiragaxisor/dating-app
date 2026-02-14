import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Users } from '../users/entities/user.entity';
import { DeviceTokenService } from '../device-tokens/device-token.service';
import { UserBlocks } from '../users/entities/user-blocks.entity';
export declare class ChatGateway {
    private usersRepository;
    private chatMessageRepository;
    private chatRepository;
    private readonly chatService;
    private readonly deviceTokenService;
    private readonly userBlocksRepository;
    constructor(usersRepository: Repository<Users>, chatMessageRepository: Repository<ChatMessage>, chatRepository: Repository<Chat>, chatService: ChatService, deviceTokenService: DeviceTokenService, userBlocksRepository: Repository<UserBlocks>);
    server: Server;
    handleConnection(socket: Socket): Promise<void>;
    joinRoom(data: any, socket: Socket): Promise<void>;
    joinGroup(data: any, socket: Socket): Promise<void>;
    handleGroupMessage(data: any): Promise<void>;
    statusOnline(data: any): Promise<void>;
    handleReadMessage(data: any): Promise<void>;
    handlePrivateMessage(data: any): Promise<void>;
    handleActiveUsers(data: any): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
}
