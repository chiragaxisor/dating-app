"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTokenModule = void 0;
const common_1 = require("@nestjs/common");
const device_token_service_1 = require("./device-token.service");
const device_token_controller_1 = require("./device-token.controller");
const typeorm_1 = require("@nestjs/typeorm");
const device_tokens_entity_1 = require("./entities/device-tokens.entity");
let DeviceTokenModule = class DeviceTokenModule {
};
exports.DeviceTokenModule = DeviceTokenModule;
exports.DeviceTokenModule = DeviceTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([device_tokens_entity_1.DeviceTokens])],
        controllers: [device_token_controller_1.DeviceTokenController],
        providers: [
            device_token_service_1.DeviceTokenService,
        ],
        exports: [device_token_service_1.DeviceTokenService],
    })
], DeviceTokenModule);
//# sourceMappingURL=device-token.module.js.map