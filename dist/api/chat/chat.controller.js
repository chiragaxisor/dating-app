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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_user_decorator_1 = require("../../common/decorators/auth-user.decorator");
const chat_join_dto_1 = require("./dto/chat-join.dto");
const chat_service_1 = require("./chat.service");
const class_transformer_1 = require("class-transformer");
const platform_express_1 = require("@nestjs/platform-express");
const image_upload_dto_1 = require("./dto/image-upload.dto");
const chat_message_response_1 = require("./resources/chat-message.response");
const swagger_response_1 = require("../../common/swagger.response");
const user_entity_1 = require("../users/entities/user.entity");
const fileupload_helper_1 = require("../../common/helper/fileupload.helper");
const jwt_auth_guard_1 = require("../../common/passport/jwt-auth.guard");
const chat_entity_1 = require("./entities/chat.entity");
const group_chat_entity_1 = require("./entities/group-chat.entity");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async getGroupChatList(authUser) {
        const groups = await this.chatService.getGroupChatList(authUser);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Successfully fetched group chat list.',
            data: (0, class_transformer_1.plainToInstance)(group_chat_entity_1.GroupChat, groups, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
        };
    }
    async getGroupChatMessages(authUser, groupId, _page, _limit) {
        const page = Number(_page) || 1;
        const limit = Number(_limit) || 20;
        const [messages, total] = await this.chatService.getGroupChatMessages(groupId, page, limit);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Successfully fetched group chat messages.',
            data: messages,
            meta: {
                totalItems: total,
                itemsPerPage: limit ? limit : total,
                totalPages: limit ? Math.ceil(Number(total) / limit) : 1,
                currentPage: page ? page : 1,
            },
        };
    }
    async chatList(authUser, _page, _limit, search) {
        const page = Number(_page) || 1;
        const limit = Number(_limit);
        const [data, total] = await this.chatService.chatList(authUser, page, limit, search);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Successfully fetched chat list.',
            data: (0, class_transformer_1.plainToInstance)(chat_entity_1.Chat, data, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
            meta: {
                totalItems: total,
                itemsPerPage: limit ? limit : total,
                totalPages: limit ? Math.ceil(Number(total) / limit) : 1,
                currentPage: page ? page : 1,
            },
        };
    }
    async uploadImage(authUser, imageUploadDto, file) {
        let data = '';
        if (file) {
            if (!(0, fileupload_helper_1.imageFileFilter)(file)) {
                throw new common_1.BadRequestException('Only image files are allowed! Ex. jpg, jpeg, png, gif');
            }
            data = (0, fileupload_helper_1.uploadFile)('chat', file);
        }
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Image uploaded successfully.',
            data: (0, fileupload_helper_1.castToStorage)(data),
        };
    }
    async joinRoom(authUser, chatJoinDto) {
        const data = await this.chatService.joinRoom(authUser, chatJoinDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Successfully joined chat room.',
            data: (0, class_transformer_1.plainToInstance)(chat_entity_1.Chat, data, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
        };
    }
    async getChatMessages(authUser, chatId, _page, _limit) {
        const page = Number(_page) || 1;
        const limit = Number(_limit);
        const [chat, total] = await this.chatService.chatMessageList(chatId, authUser, limit, page);
        return {
            data: (0, class_transformer_1.plainToInstance)(chat_message_response_1.ChatMessageResponse, chat, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
            meta: {
                totalItems: total,
                itemsPerPage: limit ? limit : total,
                totalPages: limit ? Math.ceil(Number(total) / limit) : 1,
                currentPage: page ? page : 1,
            },
        };
    }
    async getActiveUsers(authUser, _page, _limit) {
        const page = Number(_page) || 1;
        const limit = Number(_limit);
        const [chatUsers, total] = await this.chatService.getActiveUsers(authUser, limit, page);
        return {
            data: (0, class_transformer_1.plainToInstance)(user_entity_1.Users, chatUsers, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true,
            }),
            meta: {
                totalItems: total,
                itemsPerPage: limit ? limit : total,
                totalPages: limit ? Math.ceil(Number(total) / limit) : 1,
                currentPage: page ? page : 1,
            },
        };
    }
    async clearChat(authUser, chatId) {
        await this.chatService.clearChat(chatId, authUser);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Chat cleared successfully.',
        };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Group Chat List',
    }),
    (0, common_1.Get)('/group/list'),
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getGroupChatList", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Group Chat Messages',
    }),
    (0, common_1.Get)('/group-messages/:groupId'),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('groupId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users, Number, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getGroupChatMessages", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiOperation)({
        summary: 'Chat List',
    }),
    (0, common_1.Get)('/list'),
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    (0, swagger_1.ApiResponse)(swagger_response_1.BAD_REQUEST_RESPONSE),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users, String, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "chatList", null);
__decorate([
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiResponse)(swagger_response_1.POST_REQUEST_SUCCESS),
    (0, swagger_1.ApiResponse)(swagger_response_1.BAD_REQUEST_RESPONSE),
    (0, swagger_1.ApiOperation)({
        summary: 'Image Upload',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/upload-image'),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users,
        image_upload_dto_1.ImageUploadDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "uploadImage", null);
__decorate([
    (0, swagger_1.ApiResponse)(swagger_response_1.POST_REQUEST_SUCCESS),
    (0, swagger_1.ApiOperation)({
        summary: 'Join chat room',
    }),
    (0, common_1.Post)('/join'),
    (0, swagger_1.ApiResponse)(swagger_response_1.POST_REQUEST_SUCCESS),
    (0, swagger_1.ApiResponse)(swagger_response_1.BAD_REQUEST_RESPONSE),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users,
        chat_join_dto_1.ChatJoinDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "joinRoom", null);
__decorate([
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiOperation)({
        summary: 'Chat Messages',
    }),
    (0, common_1.Get)('/:chatId'),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('chatId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users, Number, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatMessages", null);
__decorate([
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    (0, swagger_1.ApiResponse)(swagger_response_1.BAD_REQUEST_RESPONSE),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiOperation)({
        summary: 'Active Users List',
    }),
    (0, common_1.Get)('/active-users/list'),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users, String, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getActiveUsers", null);
__decorate([
    (0, common_1.Delete)(':chatId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Clear chat',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiResponse)(swagger_response_1.GET_RESPONSE_SUCCESS),
    (0, swagger_1.ApiResponse)(swagger_response_1.BAD_REQUEST_RESPONSE),
    __param(0, (0, auth_user_decorator_1.AuthUser)()),
    __param(1, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.Users, Number]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "clearChat", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, common_1.Controller)('api/v1/chat'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map