import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { PurchaseVerificationService } from './purchase-verification.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { UserInteraction } from './entities/user-interaction.entity';
import { CoinHistory } from './entities/coin-history.entity';
import { StorePurchase } from './entities/store-purchase.entity';
// import { ApiKeyGuard } from 'src/common/passport/api-key.guard';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserInteraction, CoinHistory, StorePurchase]),
    forwardRef(() => ChatModule),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    PurchaseVerificationService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ApiKeyGuard,
    // },
  ],
  exports: [UsersService, PurchaseVerificationService],
})
export class UsersModule {}
