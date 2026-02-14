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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const users_service_1 = require("./users.service");
const user_entity_1 = require("../../api/users/entities/user.entity");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAllUsers(search, _page, _limit) {
        const page = Number(_page) || 1;
        const limit = Number(_limit);
        const [users, total] = await this.usersService.findAllUsers(search, page, limit);
        return {
            data: (0, class_transformer_1.plainToInstance)(user_entity_1.Users, users, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            }),
            meta: {
                totalItems: total,
                itemsPerPage: limit ? limit : total,
                totalPages: limit ? Math.ceil(Number(total) / limit) : 1,
                currentPage: page ? page : 1,
            },
        };
    }
    async blockUnblockUser(id) {
        const user = await this.usersService.blockUnblockUser(id);
        return {
            message: `User has been successfully ${user.isBlocked ? 'blocked' : 'unblocked'}`,
            data: (0, class_transformer_1.plainToInstance)(user_entity_1.Users, user, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            }),
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "blockUnblockUser", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)('admin/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map