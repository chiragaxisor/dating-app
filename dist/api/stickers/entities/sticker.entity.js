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
exports.Sticker = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const common_helper_1 = require("../../../common/helper/common.helper");
let Sticker = class Sticker {
};
exports.Sticker = Sticker;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], Sticker.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Sticker.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'sticker' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Sticker.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Sticker.prototype, "url", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Sticker.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Sticker.prototype, "updatedAt", void 0);
exports.Sticker = Sticker = __decorate([
    (0, typeorm_1.Entity)()
], Sticker);
//# sourceMappingURL=sticker.entity.js.map