import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as basicAuth from 'express-basic-auth';
import * as firebaseAdmin from 'firebase-admin';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import * as session from 'express-session';
import { SocketAdapter } from './api/chat/socket.adapter';
import { JwtService } from '@nestjs/jwt';
import { AccessTokensService } from './api/access-tokens/access-tokens.service';
import { UsersService } from './api/users/users.service';

async function bootstrap() {

  // SSL certificate path
  const isSecure = process.env.IS_SECURE === 'true';
  let httpsOptions: { key: Buffer; cert: Buffer; ca: Buffer[] };

  if (isSecure) {
    const certBasePath = process.env.SSL_CERT_BASE_PATH;
    httpsOptions = {
      key: fs.readFileSync(`${certBasePath}/privkey.pem`),
      cert: fs.readFileSync(`${certBasePath}/cert.pem`),
      ca: [
        fs.readFileSync(`${certBasePath}/cert.pem`),
        fs.readFileSync(`${certBasePath}/fullchain.pem`),
      ],
    };
  }

  const app = isSecure
    ? await NestFactory.create<NestExpressApplication>(AppModule, {
        httpsOptions,
      })
    : await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  if (process.env.ENVIRONMENT !== 'production') {
    /**
     * Swagger Documentation
     */
    app.use(
      ['/api/documentation'],
      basicAuth({
        challenge: true,
        users: {
          datingApp: '#$DatingApp:&$00',
        },
      }),
    );

    const config = new DocumentBuilder()
      .setTitle(configService.get<string>('APP_NAME') || 'App Name')
      .setDescription(
        `APIs for ${
          configService.get<string>('APP_NAME') || 'App Name'
        } native app.`,
      )
      .addServer(process.env.APP_URL)
      .setVersion(process.env.API_VERSION)
      // .addApiKey({
      //   type: 'apiKey',
      //   name: 'Api-Key',
      //   in: 'header',
      //   description: 'API Key',
      // })
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/documentation', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'src/views'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );

  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useWebSocketAdapter(
    new SocketAdapter(
      app,
      app.get(JwtService),
      app.get(AccessTokensService),
      app.get(UsersService),
    ),
  );


  const allowedOrigins = process.env.CORS_DOMAINS || '';

  const allowedOriginsArray = allowedOrigins
    .split(',')
    .map((item) => item.trim());

  app.enableCors({
    origin: allowedOriginsArray,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  });

  // Session
  app.use(
    session({
      secret: configService.get('APP_KEY'),
      resave: false,
      saveUninitialized: true,
    }),
  );

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
  });

  await app.listen(configService.get('PORT', 3000), () => {
    console.log(`Application started on: ${configService.get('APP_URL')}`);
  });
}
bootstrap();
