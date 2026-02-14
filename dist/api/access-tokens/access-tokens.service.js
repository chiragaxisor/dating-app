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
exports.AccessTokensService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const crypto_1 = require("crypto");
const moment = require("moment");
const typeorm_2 = require("typeorm");
const access_tokens_entity_1 = require("./entities/access-tokens.entity");
let AccessTokensService = class AccessTokensService {
    constructor(accessTokenRepo, jwtService) {
        this.accessTokenRepo = accessTokenRepo;
        this.jwtService = jwtService;
    }
    findOne(id) {
        return this.accessTokenRepo.findOne({ where: { id: id } });
    }
    async createToken(user) {
        const jwtToken = this.jwtService.sign({
            username: user.email,
            sub: user.id,
            jti: (0, crypto_1.randomBytes)(32).toString('hex'),
        });
        const decodedToken = this.jwtService.decode(jwtToken);
        const createdAt = moment.unix(decodedToken['iat']).toDate();
        const expiresAt = moment.unix(decodedToken['exp']).toDate();
        const accessToken = this.accessTokenRepo.create({
            id: decodedToken['jti'],
            expiresAt,
            createdAt,
            user,
        });
        await this.accessTokenRepo.save(accessToken);
        return { accessToken, jwtToken, decodedToken };
    }
    async revokeToken(jwtUniqueIdentifier) {
        await this.accessTokenRepo.save({
            id: jwtUniqueIdentifier,
            revoked: 1,
        });
    }
    async hasTokenExpired(jwtToken) {
        const accessToken = await this.findOne(jwtToken['jti']);
        const todaysDate = new Date();
        return !accessToken ||
            accessToken.revoked == access_tokens_entity_1.AccessTokens.REVOKE_TOKEN ||
            accessToken.expiresAt < todaysDate
            ? true
            : false;
    }
};
exports.AccessTokensService = AccessTokensService;
exports.AccessTokensService = AccessTokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(access_tokens_entity_1.AccessTokens)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AccessTokensService);
//# sourceMappingURL=access-tokens.service.js.map