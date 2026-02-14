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
exports.SocialLoginDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const constants_1 = require("../../../common/constants");
class SocialLoginDto {
}
exports.SocialLoginDto = SocialLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: constants_1.ProviderTypes.APPLE,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SocialLoginDto.prototype, "providerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxla...',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SocialLoginDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'aman@mailinator.com',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SocialLoginDto.prototype, "email", void 0);
//# sourceMappingURL=social-login.dto.js.map