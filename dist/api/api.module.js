"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("./api.service");
const api_controller_1 = require("./api.controller");
const auth_module_1 = require("./auth/auth.module");
const device_token_module_1 = require("./device-tokens/device-token.module");
const app_versions_module_1 = require("./app-versions/app-versions.module");
const chat_module_1 = require("./chat/chat.module");
const stickers_module_1 = require("./stickers/stickers.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
let ApiModule = class ApiModule {
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, device_token_module_1.DeviceTokenModule, app_versions_module_1.AppVersionsModule, chat_module_1.ChatModule, stickers_module_1.StickersModule, webhooks_module_1.WebhooksModule],
        controllers: [api_controller_1.ApiController],
        providers: [api_service_1.ApiService],
        exports: [api_service_1.ApiService],
    })
], ApiModule);
//# sourceMappingURL=api.module.js.map