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
exports.DeviceTokenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_tokens_entity_1 = require("./entities/device-tokens.entity");
const constants_1 = require("../../common/constants");
const common_helper_1 = require("../../common/helper/common.helper");
let DeviceTokenService = class DeviceTokenService {
    constructor(deviceTokenRepository) {
        this.deviceTokenRepository = deviceTokenRepository;
    }
    async create(createDeviceTokenDto, authUser) {
        const checkToken = await this.deviceTokenRepository.findOne({
            where: {
                deviceId: createDeviceTokenDto.deviceId,
                user: { id: authUser.id },
            },
        });
        if (checkToken) {
            return this.deviceTokenRepository.update({ id: checkToken.id }, createDeviceTokenDto);
        }
        else {
            return this.deviceTokenRepository.save({
                ...createDeviceTokenDto,
                user: { id: authUser.id },
            });
        }
    }
    async sendPush(sendNotificationDto) {
        return await (0, common_helper_1.sendPush)([sendNotificationDto.token], {
            notification: {
                title: sendNotificationDto.title,
                body: sendNotificationDto.notification,
            },
            data: {
                type: constants_1.NotificationTypes.DEFAULT_NOTIFICATION.toString(),
            },
        });
    }
    async sendPushToUser(title, body, notificationType, user) {
        if (user.isNotificationOn) {
            const tokens = await this.getTokensByUserID(user.id);
            return await (0, common_helper_1.sendPush)(tokens, {
                notification: {
                    title: title,
                    body: body,
                },
                data: {
                    type: notificationType.toString(),
                },
            });
        }
        else {
            return true;
        }
    }
    async remove(deviceId, user) {
        return this.deviceTokenRepository.delete({
            deviceId,
            user: { id: user.id },
        });
    }
    async removeByToken(token) {
        return this.deviceTokenRepository.delete({
            token,
        });
    }
    async getTokensByUserID(userId) {
        const deviceTokens = await this.deviceTokenRepository
            .createQueryBuilder('dt')
            .select('DISTINCT(token)')
            .where('userId = :userId', { userId: userId })
            .getRawMany();
        return deviceTokens.map((s) => s.token);
    }
};
exports.DeviceTokenService = DeviceTokenService;
exports.DeviceTokenService = DeviceTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_tokens_entity_1.DeviceTokens)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeviceTokenService);
//# sourceMappingURL=device-token.service.js.map