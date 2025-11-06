import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { AuthModule } from './auth/auth.module';
import { DeviceTokenModule } from './device-tokens/device-token.module';
import { AppVersionsModule } from './app-versions/app-versions.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, DeviceTokenModule, AppVersionsModule, ChatModule],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
