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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StickersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stickers_service_1 = require("./stickers.service");
const swagger_response_1 = require("../../common/swagger.response");
const class_transformer_1 = require("class-transformer");
const sticker_entity_1 = require("./entities/sticker.entity");
let StickersController = class StickersController {
    constructor(stickersService) {
        this.stickersService = stickersService;
    }
    async findAll() {
        const stickers = await this.stickersService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Successfully fetched sticker list.',
            data: (0, class_transformer_1.plainToInstance)(sticker_entity_1.Sticker, stickers, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
        };
    }
};
exports.StickersController = StickersController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get Sticker List',
    }),
    (0, common_1.Get)('/list'),
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StickersController.prototype, "findAll", null);
exports.StickersController = StickersController = __decorate([
    (0, swagger_1.ApiTags)('Stickers'),
    (0, common_1.Controller)('api/v1/stickers'),
    __metadata("design:paramtypes", [stickers_service_1.StickersService])
], StickersController);
//# sourceMappingURL=stickers.controller.js.map