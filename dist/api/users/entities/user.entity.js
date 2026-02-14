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
exports.Users = exports.AuthTokenResource = void 0;
const class_transformer_1 = require("class-transformer");
const constants_1 = require("../../../common/constants");
const common_helper_1 = require("../../../common/helper/common.helper");
const fileupload_helper_1 = require("../../../common/helper/fileupload.helper");
const typeorm_1 = require("typeorm");
class AuthTokenResource {
}
exports.AuthTokenResource = AuthTokenResource;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AuthTokenResource.prototype, "accessToken", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AuthTokenResource.prototype, "refreshToken", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AuthTokenResource.prototype, "expiresAt", void 0);
let Users = class Users {
};
exports.Users = Users;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "userUniqueId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "state", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: constants_1.Gender,
        nullable: true,
    }),
    __metadata("design:type", String)
], Users.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => (value ? Number(value) : 0)),
    __metadata("design:type", Number)
], Users.prototype, "coins", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 0 }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], Users.prototype, "isSubscribed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    __metadata("design:type", Date)
], Users.prototype, "subscriptionExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: null }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => ((0, common_helper_1.isUrlValid)(value) ? value : (0, fileupload_helper_1.castToStorage)(value))),
    __metadata("design:type", String)
], Users.prototype, "profilePic", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'tinyint',
        default: 1,
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], Users.prototype, "isNotificationOn", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], Users.prototype, "isOnline", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: null,
    }),
    __metadata("design:type", String)
], Users.prototype, "forgotPasswordCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: null,
    }),
    __metadata("design:type", Date)
], Users.prototype, "forgotPasswordCodeExpiredAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.Column)({
        type: 'tinyint',
        default: 0,
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "isBlocked", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], Users.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    __metadata("design:type", Date)
], Users.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "imlooking", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "relationship", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "about", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Users.prototype, "interested", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => AuthTokenResource),
    __metadata("design:type", AuthTokenResource)
], Users.prototype, "authentication", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Entity)()
], Users);
//# sourceMappingURL=user.entity.js.map