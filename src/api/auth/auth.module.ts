import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AccessTokensModule } from '../access-tokens/access-tokens.module';
import { JwtStrategy } from 'src/common/passport/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { DeviceTokens } from '../device-tokens/entities/device-tokens.entity';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from 'src/common/passport/api-key.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, DeviceTokens]),
    UsersModule,
    AccessTokensModule,
    RefreshTokensModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AuthModule {}
