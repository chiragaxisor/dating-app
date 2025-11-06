import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository } from 'typeorm';
import { MessageTypes, NotificationTypes } from 'src/common/constants';
import { Chat } from './entities/chat.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ChatMessage } from './entities/chat-message.entity';
import * as moment from 'moment';
import { ChatMessageResponse } from './resources/chat-message.response';
import { Users } from '../users/entities/user.entity';
import { DeviceTokenService } from '../device-tokens/device-token.service';
import {
  decryptMessage,
  isUrlValid,
  sendPush,
} from 'src/common/helper/common.helper';
import { castToStorage } from 'src/common/helper/fileupload.helper';
import { WebsocketExceptionsFilter } from 'src/common/web-socket-exception.filter';
import { UserBlocks } from '../users/entities/user-blocks.entity';

@WebSocketGateway({
  credentials: true,
  // middlewares: [AuthenticationGatewayMiddleware]
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class ChatGateway {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private readonly chatService: ChatService,
    private readonly deviceTokenService: DeviceTokenService,
    @InjectRepository(UserBlocks)
    private readonly userBlocksRepository: Repository<UserBlocks>,
  ) {}

  @WebSocketServer() server: Server;

  // Connect
  @SubscribeMessage('connection')
  async handleConnection(@ConnectedSocket() socket: Socket) {
    // Status online

    console.log(socket['user']);
    

    await this.usersRepository.update(socket['user'].id, { isOnline: true });

    socket.broadcast.emit('status online', {
      isOnline: 1,
      senderId: socket['user'].id,
    });
  }

  // Join Room
  @SubscribeMessage('join room')
  async joinRoom(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
    socket.join(socket['userId']);
  }

  // Status online
  @SubscribeMessage('status online')
  async statusOnline(@MessageBody() data: any) {
    const receiver = await this.usersRepository.findOne({
      where: { id: data.receiverId, isBlocked: false },
    });

    if (receiver)
      this.server.to(data.senderId).emit('status online', {
        isOnline: receiver.isOnline ? 1 : 0,
        senderId: String(receiver.id),
      });
  }

  // Read Message
  @SubscribeMessage('read message')
  async handleReadMessage(@MessageBody() data: any) {
    await this.chatMessageRepository.update(
      { id: data.messageId, sender: { id: Not(data.senderId) } },
      { isSeen: true },
    );

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
      .emit(
        'read message',
        plainToClass(ChatMessageResponse, chat, {
          excludeExtraneousValues: true,
        }),
      );
  }

  // Private Message
  @SubscribeMessage('private message')
  async handlePrivateMessage(@MessageBody() data: any) {
    // console.log('==============================');
    // console.log(
    //   'private message recieved data',
    //   data,
    //   decryptMessage(data.message),
    // );

    const storeChat = await this.chatService.storeChat(data);

    if (data.messageType === MessageTypes.IMAGE) {
      // const images = [];

      // data.message.map(async (image: any) => {
      //   images.push((isUrlValid(image) ? image : castToStorage(image)));
      // });
      // data.message = images;

      data.message = isUrlValid(data.message)
        ? data.message
        : castToStorage(data.message);
    }

    const chatDetails = await this.chatRepository.findOne({
      where: {
        id: data.chatId,
      },
      relations: ['sender', 'receiver'],
    });

    const user =
      data.senderId === chatDetails.sender.id
        ? chatDetails.receiver
        : chatDetails.sender;

    const fromUser =
      data.senderId === chatDetails.sender.id
        ? chatDetails.sender
        : chatDetails.receiver;

    const deviceToken = await this.deviceTokenService.getTokensByUserID(
      user.id,
    );

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
    // await this.server.to(data.chatId).emit('private message', chat);

    // console.log('private message emit', chat, decryptMessage(data.message));
    // console.log('==============================');

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
      .where('cmc.id = :chatId', { chatId: chatDetails.id })
      .andWhere('sender.id != :authUserId', { authUserId: fromUser.id })
      .andWhere('cm.isSeen = false');

    if (chatDetails.sender.id === fromUser.id) {
      unReadMessageCountQuery.andWhere('cm.isDeletedBySender = false');
    } else {
      unReadMessageCountQuery.andWhere('cm.isDeletedByReciever = false');
    }

    const unReadMessageCount = await unReadMessageCountQuery.getCount();

    // const lastMessageTime = await this.chatMessageRepository.findOne({
    //   where: {
    //     chat: {
    //       id: Number(data.chatId),
    //     },
    //   },
    //   order: {
    //     createdAt: 'DESC',
    //   },
    // });

    // const unReadMessageCount = await this.chatMessageRepository.count({
    //   where: {
    //     chat: {
    //       id: Number(data.chatId),
    //     },
    //     sender: {
    //       id: Number(data.senderId),
    //     },
    //     isSeen: false,
    //   },
    // });

    const chatDetailsData = await this.chatRepository
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
        { authUserId: user.id },
      )
      .leftJoinAndMapOne(
        'receiver.isBlockedByUser',
        UserBlocks,
        'rub',
        'rub.blockedUserId = receiver.id AND rub.userId = :authUserId',
        { authUserId: user.id },
      )
      .leftJoinAndMapOne(
        'sender.isBlockedByMe',
        UserBlocks,
        'subme',
        'subme.userId = sender.id AND subme.blockedUserId = :authUserId',
        { authUserId: user.id },
      )
      .leftJoinAndMapOne(
        'receiver.isBlockedByMe',
        UserBlocks,
        'rubme',
        'rubme.userId = receiver.id AND rubme.blockedUserId = :authUserId',
        { authUserId: user.id },
      )
      // .leftJoinAndMapOne(
      //   'sender.followStatus',
      //   FollowedUsers,
      //   'fluss',
      //   'fluss.userId = :authUserId AND fluss.followedUserId = sender.id',
      //   { authUserId: user.id },
      // )
      // .leftJoinAndMapOne(
      //   'sender.isFollowedYou',
      //   FollowedUsers,
      //   'flusys',
      //   'flusys.userId = sender.id AND flusys.followedUserId = :authUserId',
      //   { authUserId: user.id },
      // )
      // .leftJoinAndMapOne(
      //   'receiver.followStatus',
      //   FollowedUsers,
      //   'flusr',
      //   'flusr.userId = :authUserId AND flusr.followedUserId = receiver.id',
      //   { authUserId: user.id },
      // )
      // .leftJoinAndMapOne(
      //   'receiver.isFollowedYou',
      //   FollowedUsers,
      //   'flusyr',
      //   'flusyr.userId = receiver.id AND flusyr.followedUserId = :authUserId',
      //   { authUserId: user.id },
      // )
      .where(
        new Brackets((qb) => {
          qb.where('sender.id = :authUserId1', {
            authUserId1: user.id,
          }).orWhere('receiver.id = :authUserId2', {
            authUserId2: user.id,
          });
        }),
      )
      .andWhere('chat.id = :chatId', { chatId: data.chatId })
      .getOne();

    const lastMessageData = {
      ...chatDetailsData,
      receiverUser:
        chatDetailsData.sender.id === data.senderId
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

    this.server.emit(
      'last message',
      plainToInstance(Chat, lastMessageData, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    );

    // const chatData = await this.chatRepository
    //   .createQueryBuilder('chat')
    //   .leftJoinAndSelect('chat.sender', 'sender')
    //   .leftJoinAndSelect('chat.receiver', 'receiver')
    //   .where('chat.id = :chatId', { chatId: chat.chatId })
    //   .getOne();

    const notificationData = {
      ...chatDetailsData,
      receiverUser:
        chatDetailsData.sender.id === data.senderId
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

      // if (!ifUserBlocked) {
      //   await sendPush(deviceToken, {
      //     notification: {
      //       title: this.i18n.t('notification.MESSAGE_SENT', {
      //         args: {
      //           user:
      //             data.senderId === chatDetails.sender.id
      //               ? chatDetails.sender.username
      //                 ? chatDetails.sender.username
      //                 : chatDetails.sender.email
      //               : chatDetails.receiver.username
      //               ? chatDetails.receiver.username
      //               : chatDetails.receiver.email,
      //         },
      //         lang: user.language,
      //       }),
      //       body:
      //         data.messageType === MessageTypes.IMAGE
      //           ? this.i18n.t('notification.SENT_IMAGE', {
      //               lang: user.language,
      //             })
      //           : decryptMessage(String(data.message)),
      //     },
      //     data: {
      //       chat: JSON.stringify(
      //         plainToInstance(Chat, notificationData, {
      //           enableImplicitConversion: true,
      //           excludeExtraneousValues: true,
      //         }),
      //       ),
      //       type: NotificationTypes.CHAT.toString(),
      //     },
      //   });
      // }

    }
  }

  // Active Users
  @SubscribeMessage('active users')
  async handleActiveUsers(@MessageBody() data: any) {
    data.authUserId = '7';
    const chatList = await this.chatRepository
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
        { authUserId: Number(data.authUserId) },
      )
      .leftJoinAndMapOne(
        'receiver.blockedUsers',
        UserBlocks,
        'rub',
        'rub.blockedUserId = receiver.id AND rub.userId = :authUserId',
        { authUserId: Number(data.authUserId) },
      )
      .where(
        new Brackets((qb) => {
          qb.where('sender.id = :authUserId1', {
            authUserId1: Number(data.authUserId),
          }).orWhere('receiver.id = :authUserId2', {
            authUserId2: Number(data.authUserId),
          });
        }),
      )
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
      const receiverUser =
        data.authUserId === chat.sender.id ? chat.receiver : chat.sender;

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

    this.server.to(data.authUserId).emit(
      'active users',
      plainToInstance(Users, chatListData, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    );
  }

  // Disconnect
  @SubscribeMessage('disconnect')
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    socket.broadcast.emit('status online', {
      isOnline: 0,
      senderId: socket['user'].id,
    });

    await this.usersRepository.update(socket['user'].id, { isOnline: false });
  }
}
