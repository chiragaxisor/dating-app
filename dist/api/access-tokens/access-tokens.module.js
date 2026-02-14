"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokensModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const access_tokens_entity_1 = require("./entities/access-tokens.entity");
const access_tokens_service_1 = require("./access-tokens.service");
let AccessTokensModule = class AccessTokensModule {
};
exports.AccessTokensModule = AccessTokensModule;
exports.AccessTokensModule = AccessTokensModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([access_tokens_entity_1.AccessTokens]),
            jwt_1.JwtModule.registerAsync({
                useFactory: (configService) => ({
                    secret: configService.get('APP_KEY'),
                    signOptions: { expiresIn: '28 days' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [access_tokens_service_1.AccessTokensService],
        exports: [access_tokens_service_1.AccessTokensService],
    })
], AccessTokensModule);
//# sourceMappingURL=access-tokens.module.js.map