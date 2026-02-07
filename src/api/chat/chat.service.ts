import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Brackets, Not, Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import * as moment from 'moment';
import { Users } from '../users/entities/user.entity';
import { castToStorage } from 'src/common/helper/fileupload.helper';
import { ChatJoinDto } from './dto/chat-join.dto';
import { MessageTypes } from 'src/common/constants';

// import { UserBlocks } from '../users/entities/user-blocks.entity';
import { UserBlocks } from '../users/entities/user-blocks.entity';
import { isUrlValid } from 'src/common/helper/common.helper';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GroupChat } from './entities/group-chat.entity';
import { GroupChatMember } from './entities/group-chat-member.entity';
import { GroupChatMessage } from './entities/group-chat-message.entity';


@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(UserBlocks)
    private readonly userBlocksRepository: Repository<UserBlocks>,
    @InjectRepository(GroupChat)
    private readonly groupChatRepository: Repository<GroupChat>,
    @InjectRepository(GroupChatMember)
    private readonly groupChatMemberRepository: Repository<GroupChatMember>,
    @InjectRepository(GroupChatMessage)
    private readonly groupChatMessageRepository: Repository<GroupChatMessage>,
  ) {}

  /**
   * Chat List
   * @param authUser object
   * @param take number
   * @param skip number
   * @param search string
   * @returns
   */
  async chatList(authUser: Users, page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;

    search = String(search).trim().toLowerCase();

    const qb = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.receiver', 'receiver')
      .leftJoinAndMapOne(
        'chat.chatMessage',
        ChatMessage,
        'cm',
        'cm.chatId = chat.id',
      )
      .leftJoinAndMapOne(
        'sender.isBlockedByUser',
        UserBlocks,
        'sub',
        'sub.blockedUserId = sender.id AND sub.userId = :authUserId',
        { authUserId: authUser.id },
      )
      .leftJoinAndMapOne(
        'receiver.isBlockedByUser',
        UserBlocks,
        'rub',
        'rub.blockedUserId = receiver.id AND rub.userId = :authUserId',
        { authUserId: authUser.id },
      )
      .leftJoinAndMapOne(
        'sender.isBlockedByMe',
        UserBlocks,
        'subme',
        'subme.userId = sender.id AND subme.blockedUserId = :authUserId',
        { authUserId: authUser.id },
      )
      .leftJoinAndMapOne(
        'receiver.isBlockedByMe',
        UserBlocks,
        'rubme',
        'rubme.userId = receiver.id AND rubme.blockedUserId = :authUserId',
        { authUserId: authUser.id },
      )
      // .leftJoinAndMapOne(
      //   'sender.followStatus',
      //   FollowedUsers,
      //   'fluss',
      //   'fluss.userId = :authUserId AND fluss.followedUserId = sender.id',
      //   { authUserId: authUser.id },
      // )
      // .leftJoinAndMapOne(
      //   'sender.isFollowedYou',
      //   FollowedUsers,
      //   'flusys',
      //   'flusys.userId = sender.id AND flusys.followedUserId = :authUserId',
      //   { authUserId: authUser.id },
      // )
      // .leftJoinAndMapOne(
      //   'receiver.followStatus',
      //   FollowedUsers,
      //   'flusr',
      //   'flusr.userId = :authUserId AND flusr.followedUserId = receiver.id',
      //   { authUserId: authUser.id },
      // )
      // .leftJoinAndMapOne(
      //   'receiver.isFollowedYou',
      //   FollowedUsers,
      //   'flusyr',
      //   'flusyr.userId = receiver.id AND flusyr.followedUserId = :authUserId',
      //   { authUserId: authUser.id },
      // )
      .where(
        new Brackets((qb) => {
          qb.where('sender.id = :authUserId1', {
            authUserId1: authUser.id,
          }).orWhere('receiver.id = :authUserId2', {
            authUserId2: authUser.id,
          });
        }),
      )
      .andWhere('sender.isBlocked = false')
      .andWhere('receiver.isBlocked = false')
      .groupBy('chat.id')
      .orderBy('cm.createdAt', 'DESC');

    if (search && search !== '' && search !== 'undefined') {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where(
            'LOWER(sender.firstName) LIKE :search OR LOWER(sender.lastName) LIKE :search OR LOWER(sender.email) LIKE :search',
            {
              search: `%${search}%`,
            },
          ).orWhere(
            'LOWER(receiver.firstName) LIKE :search OR LOWER(receiver.lastName) LIKE :search OR LOWER(receiver.email) LIKE :search',
            {
              search: `%${search}%`,
            },
          );
        }),
      );
    }

    const total = await qb.getCount();

    const chats = limit
      ? await qb.take(limit).skip(skip).getMany()
      : await qb.getMany();

    const data = await Promise.all(
      chats.map(async (chat) => {
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
        } else {
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
        } else {
          unReadMessageCountQuery.andWhere('cm.isDeletedByReciever = false');
        }

        const unReadMessageCount = await unReadMessageCountQuery.getCount();

        const receiverUser =
          authUser.id === chat.sender.id ? chat.receiver : chat.sender;

        return {
          ...chat,
          receiverUser: receiverUser,
          lastMessage:
            lastMessageTime?.messageType === MessageTypes.IMAGE ||
            lastMessageTime?.messageType === MessageTypes.STICKER
              ? isUrlValid(lastMessageTime.message)
                ? lastMessageTime.message
                : castToStorage(lastMessageTime.message)
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
      }),
    );

    data.sort(function (a: any, b: any) {
      return (
        new Date(b.lastMessageAt).valueOf() -
        new Date(a.lastMessageAt).valueOf()
      );
    });
    // data.sort((a, b) => b.unReadMessageCount - a.unReadMessageCount);

    return [data, total];
  }

  /**
   * Join Chat
   * @param body object
   * @returns
   */
  async joinRoom(
    authUser: Users,
    joinChatDto: ChatJoinDto,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: joinChatDto.userId, isBlocked: false },
    });

    if (!user) {
      throw new BadRequestException(
        'The user you are trying to chat with does not exist.',
      );
    }

    // const blockedUser = await this.userBlocksRepository.findOne({
    //   where: {
    //     user: { id: authUser.id },
    //     blockedUser: { id: joinChatDto.userId },
    //   },
    // });

    // if (blockedUser) {
    //   throw new BadRequestException(
    //     i18n.t('exception.BAD_REQUEST.YOU_BLOCKED'),
    //   );
    // }

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
      await this.chatRepository.save(
        this.chatRepository.create({
          sender: { id: authUser.id },
          receiver: { id: joinChatDto.userId },
        }),
      );
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
      .leftJoinAndMapOne(
        'chat.chatMessage',
        ChatMessage,
        'cm',
        'cm.chatId = chat.id',
      )
      .leftJoinAndMapOne(
        'sender.isBlockedByUser',
        UserBlocks,
        'sub',
        'sub.blockedUserId = sender.id AND sub.userId = :authUserId',
        { authUserId: authUser.id },
      )
      .leftJoinAndMapOne(
        'receiver.isBlockedByUser',
        UserBlocks,
        'rub',
        'rub.blockedUserId = receiver.id AND rub.userId = :authUserId',
        { authUserId: authUser.id },
      )
      .leftJoinAndMapOne(
        'sender.isBlockedByMe',
        UserBlocks,
        'subme',
        'subme.userId = sender.id AND subme.blockedUserId = :authUserId',
        { authUserId: authUser.id },
      )
      .leftJoinAndMapOne(
        'receiver.isBlockedByMe',
        UserBlocks,
        'rubme',
        'rubme.userId = receiver.id AND rubme.blockedUserId = :authUserId',
        { authUserId: authUser.id },
      )
      .where(
        new Brackets((qb) => {
          qb.where('sender.id = :authUserId1', {
            authUserId1: authUser.id,
          }).orWhere('receiver.id = :authUserId2', {
            authUserId2: authUser.id,
          });
        }),
      )
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
          id: Not(authUser.id),
        },
        isSeen: false,
      },
    });

    const receiverUser =
      authUser.id === data.sender.id ? data.receiver : data.sender;

    return {
      ...data,
      receiverUser: receiverUser,
      lastMessage:
        lastMessageTime?.messageType === MessageTypes.IMAGE ||
        lastMessageTime?.messageType === MessageTypes.STICKER
          ? isUrlValid(lastMessageTime.message)
            ? lastMessageTime.message
            : castToStorage(lastMessageTime.message)
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

  /**
   * Chat Message List
   * @param chatId number
   * @param authUser object
   * @param take number
   * @param skip number
   * @returns
   */
  async chatMessageList(
    chatId: number,
    authUser: Users,
    limit: number,
    page: number,
  ) {
    const skip = (page - 1) * limit;

    await this.chatMessageRepository.update(
      { chat: { id: chatId }, sender: { id: Not(authUser.id) } },
      {
        isSeen: true,
      },
    );

    const queryBuilder = this.chatMessageRepository
      .createQueryBuilder('cm')
      // .select('cm.*')
      // .select('cm.message', 'message')
      .select([
        'cm.id AS messageId',
        'cm.message AS message',
        'cm.messageType AS messageType',
        'cm.chatId AS chatId',
        'cm.senderId AS senderId',
        'cm.createdAt AS createdAt',
        'cm.isSeen AS isSeen',
      ])
      // .leftJoinAndSelect('cm.chat', 'chat')
      // .leftJoinAndSelect('cm.sender', 'sender')
      // .leftJoinAndMapOne('cm.sender', User, 'us', 'us.id = cm.senderId')
      .where('chatId = :chatId', { chatId: chatId })
      .orderBy('id', 'DESC');
    // .getManyAndCount();

    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['sender'],
    });

    if (chat) {
      if (chat.sender.id === authUser.id) {
        queryBuilder.andWhere('cm.isDeletedBySender = false');
      } else {
        queryBuilder.andWhere('cm.isDeletedByReciever = false');
      }
    }

    const total = await queryBuilder.getCount();

    const chatList = limit
      ? await queryBuilder.skip(skip).take(limit).getRawMany()
      : await queryBuilder.getRawMany();

    chatList?.map(async (chatEle) => {
      if (
        chatEle.messageType === MessageTypes.IMAGE ||
        chatEle.messageType === MessageTypes.STICKER
      ) {
        chatEle.message = isUrlValid(chatEle.message)
          ? chatEle.message
          : castToStorage(chatEle.message);
      }
    });

    return [chatList, total];
  }

  /**
   * Save Chat Message
   * @param payload object
   * @returns
   */
  async storeChat(payload: any) {
    return await this.chatMessageRepository.save(
      this.chatMessageRepository.create({
        message: `${payload.message}`,
        chat: { id: payload.chatId },
        sender: { id: payload.senderId },
        messageType: payload.messageType,
      }),
    );
  }

  /**
   * Get Active Users
   * @param authUser
   * @param limit
   * @param page
   * @returns
   */
  async getActiveUsers(authUser: Users, limit: number, page: number) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.receiver', 'receiver')
      .leftJoinAndMapOne(
        'chat.chatMessage',
        ChatMessage,
        'cm',
        'cm.chatId = chat.id',
      )
      .leftJoinAndMapOne(
        'sender.blockedUsers',
        UserBlocks,
        'sub',
        'sub.blockedUserId = sender.id AND sub.userId = :authUserId',
        { authUserId: authUser.id },
      )
      .leftJoinAndMapOne(
        'receiver.blockedUsers',
        UserBlocks,
        'rub',
        'rub.blockedUserId = receiver.id AND rub.userId = :authUserId',
        { authUserId: authUser.id },
      )
      .where(
        new Brackets((qb) => {
          qb.where('sender.id = :authUserId1', {
            authUserId1: authUser.id,
          }).orWhere('receiver.id = :authUserId2', {
            authUserId2: authUser.id,
          });
        }),
      )
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

    let chatListData: any = chatList.map((chat) => {
      const receiverUser =
        authUser.id === chat.sender.id ? chat.receiver : chat.sender;

      delete chat.sender;
      delete chat.receiver;

      return {
        ...chat,
        receiverUser: receiverUser,
      };
    });

    chatListData = chatListData.map(
      (chatListIt: any) => chatListIt.receiverUser,
    );

    return [chatListData, total];
  }

  /**
   * Delete chat
   * @param chatId
   * @returns
   */
  async clearChat(
    chatId: number,
    authUser: Users,
  ) {
    const chat: Chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['sender'],
    });

    if (!chat) {
      throw new BadRequestException(
        'Chat not found.',
      );
    }

    await this.chatMessageRepository.update(
      { chat: { id: chat.id } },
      {
        ...(chat.sender.id === authUser.id
          ? {
              isDeletedBySender: true,
            }
          : {
              isDeletedByReciever: true,
            }),
      },
    );
  }

  /**
   * Delete cleared chats
   * EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT
   */
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async deleteClearedChats() {
    const chatMessages = await this.chatMessageRepository.find({
      where: { isDeletedByReciever: true, isDeletedBySender: true },
    });

    if (chatMessages) {
      await Promise.all(
        chatMessages?.map(async (chatMessage) => {
          if (chatMessage.messageType === MessageTypes.IMAGE) {
            // await this.awsService.deleteFromS3([chatMessage.message]);
          }
        }),
      );

      await this.chatMessageRepository.remove(chatMessages);
    }
  }

  /**
   * Add User to Gender Group
   * @param user
   */
  async addUserToGenderGroup(user: Users) {
    if (!user.gender) return;

    const groupName = `${
      user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
    } Group`;

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

  /**
   * Get Group Chat List
   * @param authUser
   */
  async getGroupChatList(authUser: Users) {
    const groups = await this.groupChatMemberRepository.find({
      where: { user: { id: authUser.id } },
      relations: ['groupChat'],
    });

    return groups.map((g) => g.groupChat);
  }

  /**
   * Get Group Chat Messages
   * @param groupId
   * @param page
   * @param limit
   */
  async getGroupChatMessages(groupId: number, page: number, limit: number) {
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

    messages?.map((msg: any) => {
      if (
        msg.messageType === MessageTypes.IMAGE ||
        msg.messageType === MessageTypes.STICKER
      ) {
        msg.message = isUrlValid(msg.message)
          ? msg.message
          : castToStorage(msg.message);
      }
    });

    return [messages, total];
  }

  /**
   * Store Group Chat Message
   * @param payload
   */
  async storeGroupChat(payload: any) {
    return await this.groupChatMessageRepository.save(
      this.groupChatMessageRepository.create({
        message: `${payload.message}`,
        groupChat: { id: payload.groupId },
        sender: { id: payload.senderId },
        messageType: payload.messageType,
      }),
    );
  }
}
