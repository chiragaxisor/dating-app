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
exports.ApiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let ApiController = class ApiController {
    async apiChangeLogs() {
        return true;
    }
    async Chat() {
        return null;
    }
    async ChatChangelog() {
        return null;
    }
};
exports.ApiController = ApiController;
__decorate([
    (0, common_1.Get)('api/changelogs'),
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.Render)('api/change-logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "apiChangeLogs", null);
__decorate([
    (0, common_1.Get)('chat'),
    (0, common_1.Render)('chat/index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "Chat", null);
__decorate([
    (0, common_1.Get)('chat/changelogs'),
    (0, common_1.Render)('chat/changelogs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "ChatChangelog", null);
exports.ApiController = ApiController = __decorate([
    (0, common_1.Controller)('api')
], ApiController);
//# sourceMappingURL=api.controller.js.map