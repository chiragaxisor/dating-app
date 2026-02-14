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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../api/users/entities/user.entity");
const typeorm_2 = require("typeorm");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAllUsers(search, page, limit) {
        const skip = (page - 1) * limit;
        search = String(search).trim().toLowerCase();
        const queryBuilder = this.usersRepository
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.userType', 'utype')
            .orderBy('u.createdAt', 'DESC');
        if (search && search !== '' && search !== 'undefined') {
            queryBuilder.where(new typeorm_2.Brackets((qb) => {
                qb.where('LOWER(u.name) LIKE :search', {
                    search: `%${search}%`,
                })
                    .orWhere('LOWER(u.email) LIKE :search', {
                    search: `%${search}%`,
                })
                    .orWhere('LOWER(u.phone) LIKE :search', {
                    search: `%${search}%`,
                })
                    .orWhere('LOWER(u.location) LIKE :search', {
                    search: `%${search}%`,
                })
                    .orWhere('LOWER(utype.title) LIKE :search', {
                    search: `%${search}%`,
                });
            }));
        }
        const total = await queryBuilder.getCount();
        const data = limit
            ? await queryBuilder.take(limit).skip(skip).getMany()
            : await queryBuilder.getMany();
        return [data, total];
    }
    async blockUnblockUser(id) {
        const user = await this.usersRepository.findOne({ where: { id: id } });
        if (!user)
            throw new common_1.BadRequestException('User not found!');
        await this.usersRepository.update(user.id, {
            isBlocked: user.isBlocked ? false : true,
        });
        return await this.usersRepository.findOne({ where: { id: id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map