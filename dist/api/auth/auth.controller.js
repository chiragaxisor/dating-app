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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const class_transformer_1 = require("class-transformer");
const login_dto_1 = require("./dto/login.dto");
const auth_user_decorator_1 = require("../../common/decorators/auth-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const swagger_response_1 = require("../../common/swagger.response");
const jwt_auth_guard_1 = require("../../common/passport/jwt-auth.guard");
const register_dto_1 = require("./dto/register.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const verify_reset_password_otp_dto_1 = require("./dto/verify-reset-password-otp.dto");
const logout_dto_1 = require("./dto/logout.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        const user = await this.authService.register(registerDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'You are successfully registered with us!',
            data: (0, class_transformer_1.plainToInstance)(user_entity_1.Users, user, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
        };
    }
    async login(loginDto) {
        const user = await this.authService.login(loginDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'You are successfully logged in',
            data: (0, class_transformer_1.plainToInstance)(user_entity_1.Users, user, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
        };
    }
    async forgotPassword(forgotPasswordDto) {
        await this.authService.forgetPassword(forgotPasswordDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'A authentication code has been sent to your registered email address',
        };
    }
    async verifyResetPasswordOTP(verifyResetPasswordOtpDto) {
        await this.authService.verifyResetPasswordOtp(verifyResetPasswordOtpDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'OTP has been successfully verified',
        };
    }
    async resetPassword(resetPasswordDto) {
        await this.authService.resetPassword(resetPasswordDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Password has been successfully changed',
        };
    }
    async logout(authUser, logoutDto) {
        await this.authService.logout(authUser, logoutDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'You are successfully logged out',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register user',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)(swagger_response_1.USER_REGISTRATION_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.USER_EXISTS_RESPONSE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Login user',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)(swagger_response_1.USER_LOGIN_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.INVALID_USER_RESPONSE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Forgot Password',
    }),
    (0, swagger_1.ApiResponse)(swagger_response_1.FORGOT_PASSWORD_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.INVALID_USER_RESPONSE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('verify-reset-password-otp'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify Reset Password OTP',
    }),
    (0, swagger_1.ApiResponse)(swagger_response_1.VERIFY_RESET_PASSWORD_OTP_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.BAD_REQUEST_RESPONSE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_reset_password_otp_dto_1.VerifyResetPasswordOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyResetPasswordOTP", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset Password',
    }),
    (0, swagger_1.ApiResponse)(swagger_response_1.RESET_PASSWORD_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.BAD_REQUEST_RESPONSE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Logout user',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)(swagger_response_1.USER_LOGOUT_RESPONSE),
    (0, swagger_1.ApiResponse)(swagger_response_1.UNAUTHORIZE_RESPONSE),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users, logout_dto_1.LogoutDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('api/v1'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map