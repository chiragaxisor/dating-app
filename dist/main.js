"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fs = require("fs");
const config_1 = require("@nestjs/config");
const basicAuth = require("express-basic-auth");
const firebaseAdmin = require("firebase-admin");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const session = require("express-session");
const socket_adapter_1 = require("./api/chat/socket.adapter");
const jwt_1 = require("@nestjs/jwt");
const access_tokens_service_1 = require("./api/access-tokens/access-tokens.service");
const users_service_1 = require("./api/users/users.service");
async function bootstrap() {
    const isSecure = process.env.IS_SECURE === 'true';
    let httpsOptions;
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
        ? await core_1.NestFactory.create(app_module_1.AppModule, {
            httpsOptions,
        })
        : await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use(['/api/documentation'], basicAuth({
        challenge: true,
        users: {
            datingApp: '#$DatingApp:&$00',
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle(configService.get('APP_NAME') || 'Dating App API')
        .setDescription(`APIs for ${configService.get('APP_NAME') || 'Dating App'} native app.`)
        .addServer(process.env.APP_URL)
        .setVersion(process.env.API_VERSION || '1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/documentation', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    try {
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.applicationDefault(),
        });
    }
    catch (error) {
        console.error('Firebase Admin initialization failed:', error.message);
    }
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'src/views'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'src/views'));
    app.setViewEngine('ejs');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        exceptionFactory: (errors) => new common_1.BadRequestException(errors),
    }));
    app.useWebSocketAdapter(new socket_adapter_1.SocketAdapter(app, app.get(jwt_1.JwtService), app.get(access_tokens_service_1.AccessTokensService), app.get(users_service_1.UsersService)));
    const allowedOrigins = configService.get('CORS_DOMAINS') || '';
    const allowedOriginsArray = allowedOrigins
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '');
    app.enableCors({
        origin: allowedOriginsArray.length > 0 ? allowedOriginsArray : '*',
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        credentials: true,
    });
    app.use(session({
        secret: configService.get('APP_KEY') || 'secret',
        resave: false,
        saveUninitialized: true,
    }));
    await app.listen(configService.get('PORT', 3000), () => {
        console.log(`Application started on: ${configService.get('APP_URL')}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map