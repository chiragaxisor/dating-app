import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatService } from './chat.service';
import { ChatMessage } from './entities/chat-message.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { Users } from '../users/entities/user.entity';
import { DeviceTokens } from '../device-tokens/entities/device-tokens.entity';
import { DeviceTokenModule } from '../device-tokens/device-token.module';
import { UserBlocks } from '../users/entities/user-blocks.entity';
// import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chat,
      ChatMessage,
      Users,
      DeviceTokens,
      UserBlocks,
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '365 days' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    DeviceTokenModule,
    // AwsModule,
  ],

  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
// implements NestModule
export class ChatModule {}
