import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './common/passport/api-kay.strategy';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './common/passport/api-key.guard';
import { AdminModule } from './admin/admin.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormconfig = require('../ormconfig.js');

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: +configService.get<number>('MAIL_PORT'),
          ignoreTLS: configService.get<string>('MAIL_ENCRYPTION') !== 'tls',
          secure: configService.get<string>('MAIL_ENCRYPTION') !== 'tls',
          auth: {
            user: configService.get<string>('MAIL_USERNAME'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM_ADDRESS'),
        },
        template: {
          dir: join(__dirname, '/views/emails'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
    ScheduleModule.forRoot(),
    PassportModule.register({
      defaultStrategy: 'api-key',
    }),
    ApiModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ApiKeyStrategy,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
