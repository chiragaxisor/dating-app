import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokens } from './entities/access-tokens.entity';
import { AccessTokensService } from './access-tokens.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessTokens]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('APP_KEY'),
        signOptions: { expiresIn: '28 days' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AccessTokensService],
  exports: [AccessTokensService],
})
export class AccessTokensModule {}
