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
exports.GroupChatMessage = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("../../users/entities/user.entity");
const group_chat_entity_1 = require("./group-chat.entity");
const common_helper_1 = require("../../../common/helper/common.helper");
const constants_1 = require("../../../common/constants");
let GroupChatMessage = class GroupChatMessage {
};
exports.GroupChatMessage = GroupChatMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], GroupChatMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_chat_entity_1.GroupChat, (groupChat) => groupChat.messages, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", group_chat_entity_1.GroupChat)
], GroupChatMessage.prototype, "groupChat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, (user) => user.id, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    __metadata("design:type", user_entity_1.Users)
], GroupChatMessage.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], GroupChatMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: constants_1.MessageTypes.TEXT, enum: constants_1.MessageTypes, type: 'enum' }),
    __metadata("design:type", String)
], GroupChatMessage.prototype, "messageType", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GroupChatMessage.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GroupChatMessage.prototype, "updatedAt", void 0);
exports.GroupChatMessage = GroupChatMessage = __decorate([
    (0, typeorm_1.Entity)()
], GroupChatMessage);
//# sourceMappingURL=group-chat-message.entity.js.map