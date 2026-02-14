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
exports.ChatMessage = void 0;
const typeorm_1 = require("typeorm");
const chat_entity_1 = require("./chat.entity");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("../../users/entities/user.entity");
const common_helper_1 = require("../../../common/helper/common.helper");
const constants_1 = require("../../../common/constants");
let ChatMessage = class ChatMessage {
};
exports.ChatMessage = ChatMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], ChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => chat_entity_1.Chat, (chat) => chat.id, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", chat_entity_1.Chat)
], ChatMessage.prototype, "chat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, (user) => user.id, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", user_entity_1.Users)
], ChatMessage.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: constants_1.MessageTypes.TEXT, enum: constants_1.MessageTypes, type: 'enum' }),
    __metadata("design:type", String)
], ChatMessage.prototype, "messageType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isSeen", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isDeletedBySender", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ChatMessage.prototype, "isDeletedByReciever", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChatMessage.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ChatMessage.prototype, "updatedAt", void 0);
exports.ChatMessage = ChatMessage = __decorate([
    (0, typeorm_1.Entity)()
], ChatMessage);
//# sourceMappingURL=chat-message.entity.js.map