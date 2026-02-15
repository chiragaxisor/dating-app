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
import { json, urlencoded } from 'express';
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

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

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
    .setTitle(configService.get<string>('APP_NAME') || 'Dating App API')
    .setDescription(
      `APIs for ${
        configService.get<string>('APP_NAME') || 'Dating App'
      } native app.`,
    )
    .addServer(process.env.APP_URL)
    .setVersion(process.env.API_VERSION || '1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  try {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error.message);
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

  app.useWebSocketAdapter(
    new SocketAdapter(
      app,
      app.get(JwtService),
      app.get(AccessTokensService),
      app.get(UsersService),
    ),
  );

  const allowedOrigins = configService.get<string>('CORS_DOMAINS') || '';
  const allowedOriginsArray = allowedOrigins
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');

  app.enableCors({
    origin: allowedOriginsArray.length > 0 ? allowedOriginsArray : '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  });

  // Session
  app.use(
    session({
      secret: configService.get('APP_KEY') || 'secret',
      resave: false,
      saveUninitialized: true,
    }),
  );
  await app.listen(configService.get('PORT', 3000), () => {
    console.log(`Application started on: ${configService.get('APP_URL')}`);
  });
}
bootstrap();
