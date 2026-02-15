import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { UsersModule } from '../users/users.module';
import { Users } from '../users/entities/user.entity';
import { StorePurchase } from '../users/entities/store-purchase.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Users, StorePurchase]),
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
