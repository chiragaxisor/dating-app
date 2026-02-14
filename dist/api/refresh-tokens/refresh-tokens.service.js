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
exports.RefreshTokensService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const crypto_1 = require("crypto");
const moment = require("moment");
const common_helper_1 = require("../../common/helper/common.helper");
const typeorm_2 = require("typeorm");
const refresh_tokens_entity_1 = require("./entities/refresh-tokens.entity");
let RefreshTokensService = class RefreshTokensService {
    constructor(refreshTokenRepo) {
        this.refreshTokenRepo = refreshTokenRepo;
    }
    async findOne(id) {
        return this.refreshTokenRepo.findOne({
            where: { id },
            relations: ['accessToken', 'accessToken.user'],
        });
    }
    async createToken(decodedToken) {
        const refreshTokenLifeTime = moment
            .unix(decodedToken.exp)
            .add(30, 'd')
            .toDate();
        const refreshToken = (0, crypto_1.randomBytes)(64).toString('hex');
        await this.refreshTokenRepo.save(this.refreshTokenRepo.create({
            id: refreshToken,
            accessToken: decodedToken.jti,
            expiresAt: refreshTokenLifeTime,
        }));
        return (0, common_helper_1.encrypt)(refreshToken);
    }
    async revokeTokenUsingJti(jwtUniqueIdentifier) {
        const refreshToken = await this.refreshTokenRepo.findOne({
            where: { accessToken: { id: jwtUniqueIdentifier } },
        });
        refreshToken.revoked = 1;
        await this.refreshTokenRepo.save(refreshToken);
    }
};
exports.RefreshTokensService = RefreshTokensService;
exports.RefreshTokensService = RefreshTokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(refresh_tokens_entity_1.RefreshTokens)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RefreshTokensService);
//# sourceMappingURL=refresh-tokens.service.js.map