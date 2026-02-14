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
exports.StorePurchase = exports.PlatformType = exports.PurchaseStatus = exports.PurchaseType = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const common_helper_1 = require("../../../common/helper/common.helper");
const user_entity_1 = require("./user.entity");
var PurchaseType;
(function (PurchaseType) {
    PurchaseType["COIN"] = "coin";
    PurchaseType["SUBSCRIPTION"] = "subscription";
})(PurchaseType || (exports.PurchaseType = PurchaseType = {}));
var PurchaseStatus;
(function (PurchaseStatus) {
    PurchaseStatus["ACTIVE"] = "active";
    PurchaseStatus["EXPIRED"] = "expired";
    PurchaseStatus["COMPLETED"] = "completed";
    PurchaseStatus["REFUNDED"] = "refunded";
    PurchaseStatus["CANCELLED"] = "cancelled";
})(PurchaseStatus || (exports.PurchaseStatus = PurchaseStatus = {}));
var PlatformType;
(function (PlatformType) {
    PlatformType["ANDROID"] = "android";
    PlatformType["IOS"] = "ios";
})(PlatformType || (exports.PlatformType = PlatformType = {}));
let StorePurchase = class StorePurchase {
};
exports.StorePurchase = StorePurchase;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], StorePurchase.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, { onDelete: 'CASCADE' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", user_entity_1.Users)
], StorePurchase.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], StorePurchase.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PurchaseType,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], StorePurchase.prototype, "purchaseType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlatformType,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], StorePurchase.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], StorePurchase.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], StorePurchase.prototype, "purchaseToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], StorePurchase.prototype, "packageName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PurchaseStatus,
        default: PurchaseStatus.COMPLETED,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], StorePurchase.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    __metadata("design:type", Date)
], StorePurchase.prototype, "expiryDate", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StorePurchase.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StorePurchase.prototype, "updatedAt", void 0);
exports.StorePurchase = StorePurchase = __decorate([
    (0, typeorm_1.Entity)()
], StorePurchase);
//# sourceMappingURL=store-purchase.entity.js.map