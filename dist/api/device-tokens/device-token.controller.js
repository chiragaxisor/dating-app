"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTokenController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_user_decorator_1 = require("../../common/decorators/auth-user.decorator");
const swagger_response_1 = require("../../common/swagger.response");
const user_entity_1 = require("../users/entities/user.entity");
const device_token_service_1 = require("./device-token.service");
const create_device_token_dto_1 = require("./dtos/create-device-token.dto");
const send_notification_dto_1 = require("./dtos/send-notification.dto");
const jwt_auth_guard_1 = require("../../common/passport/jwt-auth.guard");
let DeviceTokenController = class DeviceTokenController {
    constructor(deviceTokenService) {
        this.deviceTokenService = deviceTokenService;
    }
    async create(authUser, createDeviceTokenDto) {
        await this.deviceTokenService.create(createDeviceTokenDto, authUser);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Device token registered successfully',
        };
    }
    async sendPush(sendNotificationDto) {
        await this.deviceTokenService.sendPush(sendNotificationDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Notification successfully sent',
        };
    }
};
exports.DeviceTokenController = DeviceTokenController;
__decorate([
    (0, common_1.Post)('device-tokens'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register device token for push notification',
        description: '    deviceType: iOS | Android',
    }),
    (0, swagger_1.ApiResponse)(swagger_response_1.REGISTER_DEVICE_TOKEN_RESPONSE),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users,
        create_device_token_dto_1.CreateDeviceTokenDto]),
    __metadata("design:returntype", Promise)
], DeviceTokenController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('send-notification'),
    (0, swagger_1.ApiOperation)({
        summary: 'Send test push notification',
    }),
    (0, swagger_1.ApiResponse)(swagger_response_1.SEND_PUSH_RESPONSE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_notification_dto_1.SendNotificationDto]),
    __metadata("design:returntype", Promise)
], DeviceTokenController.prototype, "sendPush", null);
exports.DeviceTokenController = DeviceTokenController = __decorate([
    (0, swagger_1.ApiTags)('Device Token'),
    (0, common_1.Controller)('api/v1/'),
    (0, swagger_1.ApiSecurity)('api_key', ['Api-Key']),
    __metadata("design:paramtypes", [device_token_service_1.DeviceTokenService])
], DeviceTokenController);
//# sourceMappingURL=device-token.controller.js.map