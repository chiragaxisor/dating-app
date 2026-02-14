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
exports.UpdateSubscriptionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateSubscriptionDto {
}
exports.UpdateSubscriptionDto = UpdateSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'sir_19_1m',
        description: 'Subscription Product ID',
        enum: ['isr_199_1y', 'sir_19_1m'],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "subscriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'GPA.3312-4451-...', description: 'Purchase token from store' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "purchaseToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'com.dating.app', description: 'Package name' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "packageName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ios',
        description: 'Platform of purchase',
        enum: ['android', 'ios'],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['android', 'ios']),
    __metadata("design:type", String)
], UpdateSubscriptionDto.prototype, "platform", void 0);
//# sourceMappingURL=update-subscription.dto.js.map