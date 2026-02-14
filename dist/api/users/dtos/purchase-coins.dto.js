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
exports.PurchaseCoinsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PurchaseCoinsDto {
}
exports.PurchaseCoinsDto = PurchaseCoinsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'com.dating.coins50',
        description: 'Product ID purchased from store',
        enum: ['com.dating.coins50', 'com.dating.coins25'],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseCoinsDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'GPA.3312-4451-...', description: 'Transaction ID from store' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PurchaseCoinsDto.prototype, "transactionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'android',
        description: 'Platform of purchase',
        enum: ['android', 'ios'],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['android', 'ios']),
    __metadata("design:type", String)
], PurchaseCoinsDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'token_from_google_play', description: 'Purchase token (Android only)', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PurchaseCoinsDto.prototype, "purchaseToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'com.dating.app', description: 'Package name (Android only)', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PurchaseCoinsDto.prototype, "packageName", void 0);
//# sourceMappingURL=purchase-coins.dto.js.map