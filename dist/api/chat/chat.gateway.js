"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const constants_1 = require("../../common/constants");
const chat_entity_1 = require("./entities/chat.entity");
const class_transformer_1 = require("class-transformer");
const chat_message_entity_1 = require("./entities/chat-message.entity");
const moment = require("moment");
const chat_message_response_1 = require("./resources/chat-message.response");
const user_entity_1 = require("../users/entities/user.entity");
const device_token_service_1 = require("../device-tokens/device-token.service");
const common_helper_1 = require("../../common/helper/common.helper");
const fileupload_helper_1 = require("../../common/helper/fileupload.helper");
const web_socket_exception_filter_1 = require("../../common/web-socket-exception.filter");
const user_blocks_entity_1 = require("../users/entities/user-blocks.entity");
let ChatGateway = class ChatGateway {
    constructor(usersRepository, chatMessageRepository, chatRepository, chatService, deviceTokenService, userBlocksRepository) {
        this.usersRepository = usersRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.chatRepository = chatRepository;
        this.chatService = chatService;
        this.deviceTokenService = deviceTokenService;
        this.userBlocksRepository = userBlocksRepository;
    }
    async handleConnection(socket) {
        console.log(socket['user']);
        await this.usersRepository.update(socket['user'].id, { isOnline: true });
        socket.broadcast.emit('status online', {
            isOnline: 1,
            senderId: socket['user'].id,
        });
    }
    async joinRoom(data, socket) {
        socket.join(socket['userId']);
        socket.join(socket['userId']);
    }
    async joinGroup(data, socket) {
        socket.join(`group_${data.groupId}`);
    }
    async handleGroupMessage(data) {
        const message = await this.chatService.storeGroupChat(data);
        if (data.messageType === constants_1.MessageTypes.STICKER) {
            await this.chatService.spendCoinForSticker(data.senderId);
        }
        if (data.messageType === constants_1.MessageTypes.IMAGE ||
            data.messageType === constants_1.MessageTypes.STICKER) {
            data.message = (0, common_helper_1.isUrlValid)(data.message)
                ? data.message
                : (0, fileupload_helper_1.castToStorage)(data.message);
        }
        this.server.to(`group_${data.groupId}`).emit('group message', {
            ...message,
            message: data.message,
        });
    }
    async statusOnline(data) {
        const receiver = await this.usersRepository.findOne({
            where: { id: data.receiverId, isBlocked: false },
        });
        if (receiver)
            this.server.to(data.senderId).emit('status online', {
                isOnline: receiver.isOnline ? 1 : 0,
                senderId: String(receiver.id),
            });
    }
    async handleReadMessage(data) {
        await this.chatMessageRepository.update({ id: data.messageId, sender: { id: (0, typeorm_2.Not)(data.senderId) } }, { isSeen: true });
        const chat = await this.chatMessageRepository
            .createQueryBuilder('cm')
            .select([
            'cm.id AS messageId',
            'cm.message AS message',
            'cm.messageType AS messageType',
            'cm.chatId AS chatId',
            'cm.senderId AS senderId',
            'cm.createdAt AS createdAt',
            'cm.isSeen AS isSeen',
        ])
            .where('id = :messageId', { messageId: data.messageId })
            .getRawOne();
        this.server
            .to(data.senderId)
            .to(data.receiverId)
            .emit('read message', (0, class_transformer_1.plainToClass)(chat_message_response_1.ChatMessageResponse, chat, {
            excludeExtraneousValues: true,
        }));
    }
    async handlePrivateMessage(data) {
        const storeChat = await this.chatService.storeChat(data);
        if (data.messageType === constants_1.MessageTypes.STICKER) {
            await this.chatService.spendCoinForSticker(data.senderId);
        }
        if (data.messageType === constants_1.MessageTypes.IMAGE ||
            data.messageType === constants_1.MessageTypes.STICKER) {
            data.message = (0, common_helper_1.isUrlValid)(data.message)
                ? data.message
                : (0, fileupload_helper_1.castToStorage)(data.message);
        }
        const chatDetails = await this.chatRepository.findOne({
            where: {
                id: data.chatId,
            },
            relations: ['sender', 'receiver'],
        });
        const user = data.senderId === chatDetails.sender.id
            ? chatDetails.receiver
            : chatDetails.sender;
        const fromUser = data.senderId === chatDetails.sender.id
            ? chatDetails.sender
            : chatDetails.receiver;
        const deviceToken = await this.deviceTokenService.getTokensByUserID(user.id);
        const chat = {
            ...data,
            chatId: Number(data.chatId),
            senderId: Number(data.senderId),
            receiverId: user.id,
            messageId: storeChat.id,
            createdAt: Number(moment(storeChat.createdAt).format('X')),
        };
        this.server
            .to(data.senderId)
            .to(String(user.id))
            .emit('private message', chat);
        let lastMessageTime = null;
        const lastMessage = await this.chatMessageRepository.findOne({
            where: {
                chat: {
                    id: chatDetails.id,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });
        if (chatDetails.sender.id === fromUser.id) {
            lastMessageTime = lastMessage
                ? lastMessage?.isDeletedBySender
                    ? null
                    : lastMessage
                : null;
        }
        else {
            lastMessageTime = lastMessage
                ? lastMessage?.isDeletedByReciever
                    ? null
                    : lastMessage
                : null;
        }
        const unReadMessageCountQuery = this.chatMessageRepository
            .createQueryBuilder('cm')
            .leftJoin('cm.chat', 'cmc')
            .leftJoin('cm.sender', 'sender')
            .where('cmc.id = :chatId', { chatId: chatDetails.id })
            .andWhere('sender.id != :authUserId', { authUserId: fromUser.id })
            .andWhere('cm.isSeen = false');
        if (chatDetails.sender.id === fromUser.id) {
            unReadMessageCountQuery.andWhere('cm.isDeletedBySender = false');
        }
        else {
            unReadMessageCountQuery.andWhere('cm.isDeletedByReciever = false');
        }
        const unReadMessageCount = await unReadMessageCountQuery.getCount();
        const chatDetailsData = await this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.sender', 'sender')
            .leftJoinAndSelect('chat.receiver', 'receiver')
            .leftJoinAndMapOne('chat.chatMessage', chat_message_entity_1.ChatMessage, 'cm', 'cm.chatId = chat.id')
            .leftJoinAndMapOne('sender.isBlockedByUser', user_blocks_entity_1.UserBlocks, 'sub', 'sub.blockedUserId = sender.id AND sub.userId = :authUserId', { authUserId: user.id })
            .leftJoinAndMapOne('receiver.isBlockedByUser', user_blocks_entity_1.UserBlocks, 'rub', 'rub.blockedUserId = receiver.id AND rub.userId = :authUserId', { authUserId: user.id })
            .leftJoinAndMapOne('sender.isBlockedByMe', user_blocks_entity_1.UserBlocks, 'subme', 'subme.userId = sender.id AND subme.blockedUserId = :authUserId', { authUserId: user.id })
            .leftJoinAndMapOne('receiver.isBlockedByMe', user_blocks_entity_1.UserBlocks, 'rubme', 'rubme.userId = receiver.id AND rubme.blockedUserId = :authUserId', { authUserId: user.id })
            .where(new typeorm_2.Brackets((qb) => {
            qb.where('sender.id = :authUserId1', {
                authUserId1: user.id,
            }).orWhere('receiver.id = :authUserId2', {
                authUserId2: user.id,
            });
        }))
            .andWhere('chat.id = :chatId', { chatId: data.chatId })
            .getOne();
        const lastMessageData = {
            ...chatDetailsData,
            receiverUser: chatDetailsData.sender.id === data.senderId
                ? chatDetailsData.sender
                : chatDetailsData.receiver,
            lastMessage: lastMessageTime?.message ? lastMessageTime.message : null,
            messageType: lastMessageTime?.messageType
                ? lastMessageTime?.messageType
                : null,
            unReadMessageCount: unReadMessageCount ? unReadMessageCount : 0,
            lastMessageAt: lastMessageTime?.createdAt
                ? parseInt(moment(lastMessageTime.createdAt).format('X'))
                : null,
        };
        this.server.emit('last message', (0, class_transformer_1.plainToInstance)(chat_entity_1.Chat, lastMessageData, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true,
        }));
        const notificationData = {
            ...chatDetailsData,
            receiverUser: chatDetailsData.sender.id === data.senderId
                ? chatDetailsData.sender
                : chatDetailsData.receiver,
            chatId: Number(chat.chatId),
            unReadMessageCount: unReadMessageCount,
            lastMessageAt: lastMessageTime?.createdAt
                ? parseInt(moment(lastMessageTime?.createdAt).format('X'))
                : null,
        };
        if (user.isNotificationOn) {
            const ifUserBlocked = await this.userBlocksRepository.findOne({
                where: { user: { id: user.id }, blockedUser: { id: fromUser.id } },
            });
        }
    }
    async handleActiveUsers(data) {
        data.authUserId = '7';
        const chatList = await this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.sender', 'sender')
            .leftJoinAndSelect('chat.receiver', 'receiver')
            .leftJoinAndMapOne('chat.chatMessage', chat_message_entity_1.ChatMessage, 'cm', 'cm.chatId = chat.id')
            .leftJoinAndMapOne('sender.blockedUsers', user_blocks_entity_1.UserBlocks, 'sub', 'sub.blockedUserId = sender.id AND sub.userId = :authUserId', { authUserId: Number(data.authUserId) })
            .leftJoinAndMapOne('receiver.blockedUsers', user_blocks_entity_1.UserBlocks, 'rub', 'rub.blockedUserId = receiver.id AND rub.userId = :authUserId', { authUserId: Number(data.authUserId) })
            .where(new typeorm_2.Brackets((qb) => {
            qb.where('sender.id = :authUserId1', {
                authUserId1: Number(data.authUserId),
            }).orWhere('receiver.id = :authUserId2', {
                authUserId2: Number(data.authUserId),
            });
        }))
            .andWhere('sender.isOnline = true')
            .andWhere('receiver.isOnline = true')
            .andWhere('sub.id IS NULL')
            .andWhere('rub.id IS NULL')
            .groupBy('chat.id')
            .orderBy('cm.createdAt', 'DESC')
            .skip(0)
            .take(20)
            .getMany();
        let chatListData = chatList.map((chat) => {
            const receiverUser = data.authUserId === chat.sender.id ? chat.receiver : chat.sender;
            delete chat.sender;
            delete chat.receiver;
            return {
                ...chat,
                receiverUser: receiverUser,
            };
        });
        chatListData = chatListData.map((chatListIt) => chatListIt.receiverUser);
        this.server.to(data.authUserId).emit('active users', (0, class_transformer_1.plainToInstance)(user_entity_1.Users, chatListData, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true,
        }));
    }
    async handleDisconnect(socket) {
        socket.broadcast.emit('status online', {
            isOnline: 0,
            senderId: socket['user'].id,
        });
        await this.usersRepository.update(socket['user'].id, { isOnline: false });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('connection'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleConnection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join group'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinGroup", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('group message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGroupMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('status online'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "statusOnline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('read message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleReadMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('private message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handlePrivateMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('active users'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleActiveUsers", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('disconnect'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDisconnect", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        credentials: true,
    }),
    (0, common_1.UseFilters)(web_socket_exception_filter_1.WebsocketExceptionsFilter),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(5, (0, typeorm_1.InjectRepository)(user_blocks_entity_1.UserBlocks)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        chat_service_1.ChatService,
        device_token_service_1.DeviceTokenService,
        typeorm_2.Repository])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map