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
exports.GroupChat = void 0;
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const common_helper_1 = require("../../../common/helper/common.helper");
const group_chat_message_entity_1 = require("./group-chat-message.entity");
const group_chat_member_entity_1 = require("./group-chat-member.entity");
let GroupChat = class GroupChat {
};
exports.GroupChat = GroupChat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
    }),
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Transform)(({ value }) => Number(value)),
    __metadata("design:type", Number)
], GroupChat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GroupChat.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], GroupChat.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => group_chat_message_entity_1.GroupChatMessage, (message) => message.groupChat),
    __metadata("design:type", Array)
], GroupChat.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => group_chat_member_entity_1.GroupChatMember, (member) => member.groupChat),
    __metadata("design:type", Array)
], GroupChat.prototype, "members", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    (0, class_transformer_1.Expose)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GroupChat.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GroupChat.prototype, "updatedAt", void 0);
exports.GroupChat = GroupChat = __decorate([
    (0, typeorm_1.Entity)()
], GroupChat);
//# sourceMappingURL=group-chat.entity.js.map