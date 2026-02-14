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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    index() {
        return {
            message: `App Name API - Please read our documentation for more info: ${process.env.APP_URL}/api/documentation`,
        };
    }
    termsAndConditions() {
        return null;
    }
    aboutUs() {
        return null;
    }
    privacyPolicy() {
        return null;
    }
    support() {
        return null;
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "index", null);
__decorate([
    (0, common_1.Get)('terms-and-conditions'),
    (0, common_1.Render)('pages/terms-and-conditions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "termsAndConditions", null);
__decorate([
    (0, common_1.Get)('about-us'),
    (0, common_1.Render)('pages/about-us'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "aboutUs", null);
__decorate([
    (0, common_1.Get)('privacy-policy'),
    (0, common_1.Render)('pages/privacy-policy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "privacyPolicy", null);
__decorate([
    (0, common_1.Get)('support'),
    (0, common_1.Render)('pages/support'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "support", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiExcludeController)()
], AppController);
//# sourceMappingURL=app.controller.js.map