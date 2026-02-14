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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const JWT = require("jsonwebtoken");
const config_1 = require("@nestjs/config");
const bcrypt_helper_1 = require("../common/helper/bcrypt.helper");
let AdminController = class AdminController {
    constructor(adminService, configService) {
        this.adminService = adminService;
        this.configService = configService;
    }
    async login(req, res) {
        const user = await this.adminService.findByEmail(req.body.email);
        if (user) {
            const hashedPasswordMatch = (0, bcrypt_helper_1.comparePassword)(req.body.password, user.password);
            if (hashedPasswordMatch) {
                const payload = {
                    user: user,
                };
                JWT.sign(payload, this.configService.get('APP_KEY'), { expiresIn: 31536000 }, (err, token) => {
                    if (err) {
                        console.log(err);
                        return res.render('errors/500');
                    }
                    req.session.token = token;
                    return res.status(200).json({
                        data: {
                            accessToken: token,
                            email: user.email,
                        },
                        message: 'You are successfully logged in',
                    });
                });
            }
            else {
                throw new common_1.BadRequestException('Please enter correct password');
            }
        }
        else {
            throw new common_1.BadRequestException('Please enter correct email address');
        }
    }
    async changePassword(req, res) {
        await this.adminService.changePassword(req);
        return res.json({
            statusCode: common_1.HttpStatus.OK,
            message: 'Password has been changed successfully',
        });
    }
    async logout(req, res) {
        delete req.session.token;
        return res.redirect('/admin/login');
    }
    async dashboard(req, res) {
        const data = await this.adminService.dashboardData();
        return res.json({
            data,
        });
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('/logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "dashboard", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        config_1.ConfigService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map