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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const typeorm_2 = require("typeorm");
const chat_message_entity_1 = require("./entities/chat-message.entity");
const moment = require("moment");
const user_entity_1 = require("../users/entities/user.entity");
const fileupload_helper_1 = require("../../common/helper/fileupload.helper");
const constants_1 = require("../../common/constants");
const user_blocks_entity_1 = require("../users/entities/user-blocks.entity");
const common_helper_1 = require("../../common/helper/common.helper");
const schedule_1 = require("@nestjs/schedule");
const group_chat_entity_1 = require("./entities/group-chat.entity");
const group_chat_member_entity_1 = require("./entities/group-chat-member.entity");
const group_chat_message_entity_1 = require("./entities/group-chat-message.entity");
const users_service_1 = require("../users/users.service");
let ChatService = class ChatService {
    constructor(chatRepository, chatMessageRepository, usersRepository, userBlocksRepository, groupChatRepository, groupChatMemberRepository, groupChatMessageRepository, usersService) {
        this.chatRepository = chatRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.usersRepository = usersRepository;
        this.userBlocksRepository = userBlocksRepository;
        this.groupChatRepository = groupChatRepository;
        this.groupChatMemberRepository = groupChatMemberRepository;
        this.groupChatMessageRepository = groupChatMessageRepository;
        this.usersService = usersService;
    }
    async chatList(authUser, page, limit, search) {
        const skip = (page - 1) * limit;
        search = String(search).trim().toLowerCase();
        const qb = this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.sender', 'sender')
            .leftJoinAndSelect('chat.receiver', 'receiver')
            .leftJoinAndMapOne('chat.chatMessage', chat_message_entity_1.ChatMessage, 'cm', 'cm.chatId = chat.id')
            .leftJoinAndMapOne('sender.isBlockedByUser', user_blocks_entity_1.UserBlocks, 'sub', 'sub.blockedUserId = sender.id AND sub.userId = :authUserId', { authUserId: authUser.id })
            .leftJoinAndMapOne('receiver.isBlockedByUser', user_blocks_entity_1.UserBlocks, 'rub', 'rub.blockedUserId = receiver.id AND rub.userId = :authUserId', { authUserId: authUser.id })
            .leftJoinAndMapOne('sender.isBlockedByMe', user_blocks_entity_1.UserBlocks, 'subme', 'subme.userId = sender.id AND subme.blockedUserId = :authUserId', { authUserId: authUser.id })
            .leftJoinAndMapOne('receiver.isBlockedByMe', user_blocks_entity_1.UserBlocks, 'rubme', 'rubme.userId = receiver.id AND rubme.blockedUserId = :authUserId', { authUserId: authUser.id })
            .where(new typeorm_2.Brackets((qb) => {
            qb.where('sender.id = :authUserId1', {
                authUserId1: authUser.id,
            }).orWhere('receiver.id = :authUserId2', {
                authUserId2: authUser.id,
            });
        }))
            .andWhere('sender.isBlocked = false')
            .andWhere('receiver.isBlocked = false')
            .groupBy('chat.id')
            .orderBy('cm.createdAt', 'DESC');
        if (search && search !== '' && search !== 'undefined') {
            qb.andWhere(new typeorm_2.Brackets((qb) => {
                qb.where('LOWER(sender.firstName) LIKE :search OR LOWER(sender.lastName) LIKE :search OR LOWER(sender.email) LIKE :search', {
                    search: `%${search}%`,
                }).orWhere('LOWER(receiver.firstName) LIKE :search OR LOWER(receiver.lastName) LIKE :search OR LOWER(receiver.email) LIKE :search', {
                    search: `%${search}%`,
                });
            }));
        }
        const total = await qb.getCount();
        const chats = limit
            ? await qb.take(limit).skip(skip).getMany()
            : await qb.getMany();
        const data = await Promise.all(chats.map(async (chat) => {
            let lastMessageTime = null;
            const lastMessage = await this.chatMessageRepository.findOne({
                where: {
                    chat: {
                        id: chat.id,
                    },
                },
                order: {
                    createdAt: 'DESC',
                },
            });
            if (chat.sender.id === authUser.id) {
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
                .where('cmc.id = :chatId', { chatId: chat.id })
                .andWhere('sender.id != :authUserId', { authUserId: authUser.id })
                .andWhere('cm.isSeen = false');
            if (chat.sender.id === authUser.id) {
                unReadMessageCountQuery.andWhere('cm.isDeletedBySender = false');
            }
            else {
                unReadMessageCountQuery.andWhere('cm.isDeletedByReciever = false');
            }
            const unReadMessageCount = await unReadMessageCountQuery.getCount();
            const receiverUser = authUser.id === chat.sender.id ? chat.receiver : chat.sender;
            return {
                ...chat,
                receiverUser: receiverUser,
                lastMessage: lastMessageTime?.messageType === constants_1.MessageTypes.IMAGE ||
                    lastMessageTime?.messageType === constants_1.MessageTypes.STICKER
                    ? (0, common_helper_1.isUrlValid)(lastMessageTime.message)
                        ? lastMessageTime.message
                        : (0, fileupload_helper_1.castToStorage)(lastMessageTime.message)
                    : lastMessageTime?.message
                        ? lastMessageTime.message
                        : null,
                messageType: lastMessageTime?.messageType
                    ? lastMessageTime?.messageType
                    : null,
                unReadMessageCount: unReadMessageCount ? unReadMessageCount : 0,
                lastMessageAt: lastMessageTime?.createdAt
                    ? parseInt(moment(lastMessageTime.createdAt).format('X'))
                    : null,
            };
        }));
        const uniqueChatsMap = new Map();
        data.forEach((item) => {
            const otherUserId = item.receiverUser.id;
            if (!uniqueChatsMap.has(otherUserId)) {
                uniqueChatsMap.set(otherUserId, item);
            }
            else {
                const existing = uniqueChatsMap.get(otherUserId);
                if (item.lastMessageAt > existing.lastMessageAt) {
                    uniqueChatsMap.set(otherUserId, item);
                }
            }
        });
        const dedupedData = Array.from(uniqueChatsMap.values());
        dedupedData.sort(function (a, b) {
            return (new Date(b.lastMessageAt).valueOf() -
                new Date(a.lastMessageAt).valueOf());
        });
        return [dedupedData, dedupedData.length];
    }
    async joinRoom(authUser, joinChatDto) {
        const user = await this.usersRepository.findOne({
            where: { id: joinChatDto.userId, isBlocked: false },
        });
        if (!user) {
            throw new common_1.BadRequestException('The user you are trying to chat with does not exist.');
        }
        const chat = await this.chatRepository.findOne({
            where: [
                {
                    sender: { id: authUser.id },
                    receiver: { id: joinChatDto.userId },
                },
                {
                    sender: { id: joinChatDto.userId },
                    receiver: { id: authUser.id },
                },
            ],
        });
        if (!chat) {
            await this.chatRepository.save(this.chatRepository.create({
                sender: { id: authUser.id },
                receiver: { id: joinChatDto.userId },
            }));
        }
        const dataChat = await this.chatRepository.findOne({
            where: [
                {
                    sender: { id: authUser.id },
                    receiver: { id: joinChatDto.userId },
                },
                {
                    sender: { id: joinChatDto.userId },
                    receiver: { id: authUser.id },
                },
            ],
        });
        const data = await this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.sender', 'sender')
            .leftJoinAndSelect('chat.receiver', 'receiver')
            .leftJoinAndMapOne('chat.chatMessage', chat_message_entity_1.ChatMessage, 'cm', 'cm.chatId = chat.id')
            .leftJoinAndMapOne('sender.isBlockedByUser', user_blocks_entity_1.UserBlocks, 'sub', 'sub.blockedUserId = sender.id AND sub.userId = :authUserId', { authUserId: authUser.id })
            .leftJoinAndMapOne('receiver.isBlockedByUser', user_blocks_entity_1.UserBlocks, 'rub', 'rub.blockedUserId = receiver.id AND rub.userId = :authUserId', { authUserId: authUser.id })
            .leftJoinAndMapOne('sender.isBlockedByMe', user_blocks_entity_1.UserBlocks, 'subme', 'subme.userId = sender.id AND subme.blockedUserId = :authUserId', { authUserId: authUser.id })
            .leftJoinAndMapOne('receiver.isBlockedByMe', user_blocks_entity_1.UserBlocks, 'rubme', 'rubme.userId = receiver.id AND rubme.blockedUserId = :authUserId', { authUserId: authUser.id })
            .where(new typeorm_2.Brackets((qb) => {
            qb.where('sender.id = :authUserId1', {
                authUserId1: authUser.id,
            }).orWhere('receiver.id = :authUserId2', {
                authUserId2: authUser.id,
            });
        }))
            .andWhere('chat.id = :chatId', { chatId: dataChat.id })
            .getOne();
        const lastMessageTime = await this.chatMessageRepository.findOne({
            where: {
                chat: {
                    id: data.id,
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });
        const unReadMessageCount = await this.chatMessageRepository.count({
            where: {
                chat: {
                    id: data.id,
                },
                sender: {
                    id: (0, typeorm_2.Not)(authUser.id),
                },
                isSeen: false,
            },
        });
        const receiverUser = authUser.id === data.sender.id ? data.receiver : data.sender;
        return {
            ...data,
            receiverUser: receiverUser,
            lastMessage: lastMessageTime?.messageType === constants_1.MessageTypes.IMAGE ||
                lastMessageTime?.messageType === constants_1.MessageTypes.STICKER
                ? (0, common_helper_1.isUrlValid)(lastMessageTime.message)
                    ? lastMessageTime.message
                    : (0, fileupload_helper_1.castToStorage)(lastMessageTime.message)
                : lastMessageTime?.message
                    ? lastMessageTime.message
                    : null,
            messageType: lastMessageTime?.messageType
                ? lastMessageTime?.messageType
                : null,
            unReadMessageCount: unReadMessageCount,
            lastMessageAt: lastMessageTime?.createdAt
                ? parseInt(moment(lastMessageTime.createdAt).format('X'))
                : null,
        };
    }
    async chatMessageList(chatId, authUser, limit, page) {
        const skip = (page - 1) * limit;
        await this.chatMessageRepository.update({ chat: { id: chatId }, sender: { id: (0, typeorm_2.Not)(authUser.id) } }, {
            isSeen: true,
        });
        const queryBuilder = this.chatMessageRepository
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
            .where('chatId = :chatId', { chatId: chatId })
            .orderBy('id', 'DESC');
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ['sender'],
        });
        if (chat) {
            if (chat.sender.id === authUser.id) {
                queryBuilder.andWhere('cm.isDeletedBySender = false');
            }
            else {
                queryBuilder.andWhere('cm.isDeletedByReciever = false');
            }
        }
        const total = await queryBuilder.getCount();
        const chatList = limit
            ? await queryBuilder.skip(skip).take(limit).getRawMany()
            : await queryBuilder.getRawMany();
        chatList?.map(async (chatEle) => {
            if (chatEle.messageType === constants_1.MessageTypes.IMAGE ||
                chatEle.messageType === constants_1.MessageTypes.STICKER) {
                chatEle.message = (0, common_helper_1.isUrlValid)(chatEle.message)
                    ? chatEle.message
                    : (0, fileupload_helper_1.castToStorage)(chatEle.message);
            }
        });
        return [chatList, total];
    }
    async storeChat(payload) {
        return await this.chatMessageRepository.save(this.chatMessageRepository.create({
            message: `${payload.message}`,
            chat: { id: payload.chatId },
            sender: { id: payload.senderId },
            messageType: payload.messageType,
        }));
    }
    async getActiveUsers(authUser, limit, page) {
        const skip = (page - 1) * limit;
        const queryBuilder = this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.sender', 'sender')
            .leftJoinAndSelect('chat.receiver', 'receiver')
            .leftJoinAndMapOne('chat.chatMessage', chat_message_entity_1.ChatMessage, 'cm', 'cm.chatId = chat.id')
            .leftJoinAndMapOne('sender.blockedUsers', user_blocks_entity_1.UserBlocks, 'sub', 'sub.blockedUserId = sender.id AND sub.userId = :authUserId', { authUserId: authUser.id })
            .leftJoinAndMapOne('receiver.blockedUsers', user_blocks_entity_1.UserBlocks, 'rub', 'rub.blockedUserId = receiver.id AND rub.userId = :authUserId', { authUserId: authUser.id })
            .where(new typeorm_2.Brackets((qb) => {
            qb.where('sender.id = :authUserId1', {
                authUserId1: authUser.id,
            }).orWhere('receiver.id = :authUserId2', {
                authUserId2: authUser.id,
            });
        }))
            .andWhere('sender.isOnline = true')
            .andWhere('receiver.isOnline = true')
            .andWhere('sub.id IS NULL')
            .andWhere('rub.id IS NULL')
            .groupBy('chat.id')
            .orderBy('cm.createdAt', 'DESC');
        const total = await queryBuilder.getCount();
        const chatList = limit
            ? await queryBuilder.skip(skip).take(limit).getMany()
            : await queryBuilder.getMany();
        let chatListData = chatList.map((chat) => {
            const receiverUser = authUser.id === chat.sender.id ? chat.receiver : chat.sender;
            delete chat.sender;
            delete chat.receiver;
            return {
                ...chat,
                receiverUser: receiverUser,
            };
        });
        chatListData = chatListData.map((chatListIt) => chatListIt.receiverUser);
        return [chatListData, total];
    }
    async clearChat(chatId, authUser) {
        const chat = await this.chatRepository.findOne({
            where: { id: chatId },
            relations: ['sender'],
        });
        if (!chat) {
            throw new common_1.BadRequestException('Chat not found.');
        }
        await this.chatMessageRepository.update({ chat: { id: chat.id } }, {
            ...(chat.sender.id === authUser.id
                ? {
                    isDeletedBySender: true,
                }
                : {
                    isDeletedByReciever: true,
                }),
        });
    }
    async deleteClearedChats() {
        const chatMessages = await this.chatMessageRepository.find({
            where: { isDeletedByReciever: true, isDeletedBySender: true },
        });
        if (chatMessages) {
            await Promise.all(chatMessages?.map(async (chatMessage) => {
                if (chatMessage.messageType === constants_1.MessageTypes.IMAGE) {
                }
            }));
            await this.chatMessageRepository.remove(chatMessages);
        }
    }
    async addUserToGenderGroup(user) {
        if (!user.gender)
            return;
        const groupName = `${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)} Group`;
        let group = await this.groupChatRepository.findOne({
            where: { name: groupName },
        });
        if (!group) {
            group = this.groupChatRepository.create({
                name: groupName,
                gender: user.gender,
            });
            await this.groupChatRepository.save(group);
        }
        const isMember = await this.groupChatMemberRepository.findOne({
            where: {
                groupChat: { id: group.id },
                user: { id: user.id },
            },
        });
        if (!isMember) {
            const member = this.groupChatMemberRepository.create({
                groupChat: group,
                user: user,
            });
            await this.groupChatMemberRepository.save(member);
        }
    }
    async getGroupChatList(authUser) {
        const groups = await this.groupChatMemberRepository.find({
            where: { user: { id: authUser.id } },
            relations: ['groupChat'],
        });
        return groups.map((g) => g.groupChat);
    }
    async getGroupChatMessages(groupId, page, limit) {
        page = Number(page) || 1;
        limit = Number(limit) || 20;
        const skip = (page - 1) * limit;
        const [messages, total] = await this.groupChatMessageRepository.findAndCount({
            where: { groupChat: { id: groupId } },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
            relations: ['sender'],
        });
        messages?.map((msg) => {
            if (msg.messageType === constants_1.MessageTypes.IMAGE ||
                msg.messageType === constants_1.MessageTypes.STICKER) {
                msg.message = (0, common_helper_1.isUrlValid)(msg.message)
                    ? msg.message
                    : (0, fileupload_helper_1.castToStorage)(msg.message);
            }
        });
        return [messages, total];
    }
    async storeGroupChat(payload) {
        return await this.groupChatMessageRepository.save(this.groupChatMessageRepository.create({
            message: `${payload.message}`,
            groupChat: { id: payload.groupId },
            sender: { id: payload.senderId },
            messageType: payload.messageType,
        }));
    }
    async spendCoinForSticker(userId) {
        await this.usersService.spendCoinForSticker(userId);
    }
};
exports.ChatService = ChatService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatService.prototype, "deleteClearedChats", null);
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __param(3, (0, typeorm_1.InjectRepository)(user_blocks_entity_1.UserBlocks)),
    __param(4, (0, typeorm_1.InjectRepository)(group_chat_entity_1.GroupChat)),
    __param(5, (0, typeorm_1.InjectRepository)(group_chat_member_entity_1.GroupChatMember)),
    __param(6, (0, typeorm_1.InjectRepository)(group_chat_message_entity_1.GroupChatMessage)),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], ChatService);
//# sourceMappingURL=chat.service.js.map