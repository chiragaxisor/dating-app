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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const access_tokens_service_1 = require("../access-tokens/access-tokens.service");
const refresh_tokens_service_1 = require("../refresh-tokens/refresh-tokens.service");
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt_helper_1 = require("../../common/helper/bcrypt.helper");
const users_service_1 = require("../users/users.service");
const moment = require("moment");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const device_tokens_entity_1 = require("../device-tokens/entities/device-tokens.entity");
let AuthService = class AuthService {
    constructor(usersService, accessTokensService, refreshTokensService, mailerService, configService, userRepository, deviceTokenRepository) {
        this.usersService = usersService;
        this.accessTokensService = accessTokensService;
        this.refreshTokensService = refreshTokensService;
        this.mailerService = mailerService;
        this.configService = configService;
        this.userRepository = userRepository;
        this.deviceTokenRepository = deviceTokenRepository;
    }
    async register(registerDto) {
        const user = await this.usersService.findByEmail(registerDto.email);
        if (user) {
            throw new common_1.BadRequestException('This email is already registered with us');
        }
        const registeredUser = await this.usersService.createOrUpdate({
            ...registerDto,
            password: (0, bcrypt_helper_1.encodePassword)(registerDto.password),
        });
        const tokens = await this.generateTokens(registeredUser);
        return {
            ...registeredUser,
            authentication: { ...tokens },
        };
    }
    async login(loginDto) {
        const user = await this.userRepository.findOne({
            where: {
                email: loginDto.email,
                isBlocked: false,
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('This email is not registered with us. Please register first!');
        }
        if (user.deletedAt) {
            throw new common_1.BadRequestException('Your account has been temporarily disabled. Contact the administrator for more information.');
        }
        if (!(0, bcrypt_helper_1.comparePassword)(loginDto.password, user.password)) {
            throw new common_1.ConflictException('Invalid password! Please check your password and try again.');
        }
        const registeredUser = await this.usersService.createOrUpdate({
            ...user,
        }, user.id);
        console.log(registeredUser);
        const tokens = await this.generateTokens(registeredUser);
        return {
            ...user,
            authentication: { ...tokens },
        };
    }
    async generateTokens(user) {
        const { decodedToken, jwtToken } = await this.accessTokensService.createToken(user);
        const refreshToken = await this.refreshTokensService.createToken(decodedToken);
        return {
            accessToken: jwtToken,
            refreshToken,
            expiresAt: decodedToken['exp'],
        };
    }
    async forgetPassword(forgotPasswordDto) {
        const user = await this.usersService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            throw new common_1.BadRequestException('This email is not register with us!');
        }
        const forgotPasswordCode = Math.floor(100000 + Math.random() * 900000);
        const forgotPasswordCodeExpiredAt = moment()
            .add(10, 'minutes')
            .format('YYYY-MM-DD HH:mm:ss');
        await this.usersService.createOrUpdate({ forgotPasswordCode, forgotPasswordCodeExpiredAt }, user.id);
    }
    async verifyResetPasswordOtp(verifyResetPasswordOtpDto) {
        const user = await this.usersService.findByEmailNotSocialLogin(verifyResetPasswordOtpDto.email);
        if (!user) {
            throw new common_1.BadRequestException('This email is not register with us');
        }
        if (user.forgotPasswordCode !== verifyResetPasswordOtpDto.otp) {
            throw new common_1.BadRequestException('Incorrect OTP. Please check your OTP and try again!');
        }
        if (Date.now() > user.forgotPasswordCodeExpiredAt.getTime()) {
            throw new common_1.BadRequestException('Password reset code has expired! Please try to send reset password email again');
        }
    }
    async resetPassword(resetPasswordDto) {
        const user = await this.usersService.findByEmailNotSocialLogin(resetPasswordDto.email);
        if (!user) {
            throw new common_1.BadRequestException('This email is not register with us');
        }
        await this.usersService.createOrUpdate({ password: (0, bcrypt_helper_1.encodePassword)(resetPasswordDto.password) }, user.id);
    }
    async logout(user, logoutDto) {
        if (logoutDto.deviceId) {
            await this.deviceTokenRepository.delete({ deviceId: logoutDto.deviceId });
        }
        await Promise.all([
            this.accessTokensService.revokeToken(user.jti),
            this.refreshTokensService.revokeTokenUsingJti(user.jti),
        ]);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __param(6, (0, typeorm_1.InjectRepository)(device_tokens_entity_1.DeviceTokens)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        access_tokens_service_1.AccessTokensService,
        refresh_tokens_service_1.RefreshTokensService,
        mailer_1.MailerService,
        config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map