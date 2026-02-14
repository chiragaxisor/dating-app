"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const JWT = require("jsonwebtoken");
let AuthAdminMiddleware = class AuthAdminMiddleware {
    use(req, res, next) {
        const configService = new config_1.ConfigService();
        console.log(req.headers);
        if (!req.session.token) {
            throw new common_1.UnauthorizedException("You're logged out. Please login again!");
        }
        else {
            JWT.verify(req.session.token, configService.get('APP_KEY'), function (err) {
                if (err) {
                    throw new common_1.UnauthorizedException("You're logged out. Please login again!");
                }
            });
        }
        next();
    }
};
exports.AuthAdminMiddleware = AuthAdminMiddleware;
exports.AuthAdminMiddleware = AuthAdminMiddleware = __decorate([
    (0, common_1.Injectable)()
], AuthAdminMiddleware);
//# sourceMappingURL=auth-admin.middleware.js.map