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
exports.AppVersionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const swagger_response_1 = require("../../common/swagger.response");
const app_versions_service_1 = require("./app-versions.service");
const check_app_version_dto_1 = require("./dto/check-app-version.dto");
let AppVersionsController = class AppVersionsController {
    constructor(appVersionsService) {
        this.appVersionsService = appVersionsService;
    }
    async checkVersion(checkAppVersionDto) {
        const data = await this.appVersionsService.check(checkAppVersionDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            ...data,
        };
    }
};
exports.AppVersionsController = AppVersionsController;
__decorate([
    (0, common_1.Post)('check-app-version'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Check app version',
        description: `    platform : iOS, Android
    status= 0: Up to date, 1: Force Update, 2: Recommended Update (Optional Update)`,
    }),
    (0, swagger_1.ApiResponse)(swagger_response_1.CHECK_APP_VERSION_RESPONSE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_app_version_dto_1.CheckAppVersionDto]),
    __metadata("design:returntype", Promise)
], AppVersionsController.prototype, "checkVersion", null);
exports.AppVersionsController = AppVersionsController = __decorate([
    (0, swagger_1.ApiTags)('App Version'),
    (0, common_1.Controller)('api/v1'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __metadata("design:paramtypes", [app_versions_service_1.AppVersionsService])
], AppVersionsController);
//# sourceMappingURL=app-versions.controller.js.map