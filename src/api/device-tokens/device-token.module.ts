import { Module } from '@nestjs/common';
import { DeviceTokenService } from './device-token.service';
import { DeviceTokenController } from './device-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceTokens } from './entities/device-tokens.entity';
import { APP_GUARD } from '@nestjs/core';
// import { ApiKeyGuard } from 'src/common/passport/api-key.guard';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceTokens])],
  controllers: [DeviceTokenController],
  providers: [
    DeviceTokenService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ApiKeyGuard,
    // },
  ],
  exports: [DeviceTokenService],
})
export class DeviceTokenModule {}
