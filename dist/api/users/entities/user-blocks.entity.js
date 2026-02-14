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
exports.UserBlocks = void 0;
const class_transformer_1 = require("class-transformer");
const common_helper_1 = require("../../../common/helper/common.helper");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserBlocks = class UserBlocks {
};
exports.UserBlocks = UserBlocks;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], UserBlocks.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, (users) => users.id, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", user_entity_1.Users)
], UserBlocks.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, (users) => users.id, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", user_entity_1.Users)
], UserBlocks.prototype, "blockedUser", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserBlocks.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserBlocks.prototype, "updatedAt", void 0);
exports.UserBlocks = UserBlocks = __decorate([
    (0, typeorm_1.Entity)()
], UserBlocks);
//# sourceMappingURL=user-blocks.entity.js.map