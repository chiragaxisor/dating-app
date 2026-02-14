"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_controller_1 = require("./chat.controller");
const chat_gateway_1 = require("./chat.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const chat_service_1 = require("./chat.service");
const chat_message_entity_1 = require("./entities/chat-message.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_module_1 = require("../users/users.module");
const user_entity_1 = require("../users/entities/user.entity");
const device_tokens_entity_1 = require("../device-tokens/entities/device-tokens.entity");
const device_token_module_1 = require("../device-tokens/device-token.module");
const user_blocks_entity_1 = require("../users/entities/user-blocks.entity");
const group_chat_entity_1 = require("./entities/group-chat.entity");
const group_chat_member_entity_1 = require("./entities/group-chat-member.entity");
const group_chat_message_entity_1 = require("./entities/group-chat-message.entity");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                chat_entity_1.Chat,
                chat_message_entity_1.ChatMessage,
                user_entity_1.Users,
                device_tokens_entity_1.DeviceTokens,
                user_blocks_entity_1.UserBlocks,
                group_chat_entity_1.GroupChat,
                group_chat_member_entity_1.GroupChatMember,
                group_chat_message_entity_1.GroupChatMessage,
            ]),
            jwt_1.JwtModule.registerAsync({
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET_KEY'),
                    signOptions: { expiresIn: '365 days' },
                }),
                inject: [config_1.ConfigService],
            }),
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            device_token_module_1.DeviceTokenModule,
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_gateway_1.ChatGateway, chat_service_1.ChatService],
        exports: [chat_service_1.ChatService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map