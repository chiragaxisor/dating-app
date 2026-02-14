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
exports.ChatMessageResponse = void 0;
const class_transformer_1 = require("class-transformer");
const common_helper_1 = require("../../../common/helper/common.helper");
class ChatMessageResponse {
}
exports.ChatMessageResponse = ChatMessageResponse;
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ChatMessageResponse.prototype, "messageId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ChatMessageResponse.prototype, "message", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ChatMessageResponse.prototype, "messageType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ChatMessageResponse.prototype, "chatId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ChatMessageResponse.prototype, "senderId", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (0, common_helper_1.dateToTimestamp)(value)),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ChatMessageResponse.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ChatMessageResponse.prototype, "isSeen", void 0);
//# sourceMappingURL=chat-message.response.js.map