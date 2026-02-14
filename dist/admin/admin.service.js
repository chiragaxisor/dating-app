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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment = require("moment");
const user_entity_1 = require("../api/users/entities/user.entity");
const bcrypt_helper_1 = require("../common/helper/bcrypt.helper");
const typeorm_2 = require("typeorm");
const admin_entity_1 = require("./admin.entity");
let AdminService = class AdminService {
    constructor(adminRepository, usersRepository) {
        this.adminRepository = adminRepository;
        this.usersRepository = usersRepository;
    }
    async findByEmail(email) {
        return await this.adminRepository
            .createQueryBuilder()
            .where({ email: email })
            .getOne();
    }
    async dashboardData() {
        const users = await this.usersRepository.find({
            order: { createdAt: 'DESC' },
        });
        const thisMonthUsers = await this.usersRepository.count({
            where: {
                createdAt: (0, typeorm_2.Between)(moment().startOf('month').toDate(), moment().endOf('month').toDate()),
            },
        });
        const monthArrayList1 = [];
        let totalUsers = users.length + 1;
        users.length > 0 &&
            users.map((user) => {
                totalUsers -= 1;
                if (!monthArrayList1.includes(moment(user.createdAt).format('MMM, YYYY'))) {
                    monthArrayList1.push({
                        date: moment(user.createdAt).format('MMM, YYYY'),
                        value: 1,
                        total: totalUsers,
                    });
                }
            });
        const usersGraphData = [];
        monthArrayList1.length > 0 &&
            monthArrayList1.reduce((res, value) => {
                if (!res[value.date]) {
                    res[value.date] = {
                        date: value.date,
                        value: 0,
                        total: value.total,
                    };
                    usersGraphData.push(res[value.date]);
                }
                res[value.date].value += value.value;
                return res;
            }, {});
        return {
            totalUsers: users.length,
            registeredThisMonthUsers: thisMonthUsers,
            usersGraphData: usersGraphData.slice(0, 6).sort(function (a, b) {
                return (moment(new Date(a.date)).unix() - moment(new Date(b.date)).unix());
            }),
        };
    }
    async changePassword(req) {
        const admin = await this.findByEmail(req.body.email);
        if (!admin)
            throw new common_1.BadRequestException('Admin not found!');
        const hashedPasswordMatch = (0, bcrypt_helper_1.comparePassword)(req.body.oldPassword, admin.password);
        if (!hashedPasswordMatch) {
            throw new common_1.BadRequestException('You entered wrong old password');
        }
        const hashedNewPasswordMatch = (0, bcrypt_helper_1.comparePassword)(req.body.password, admin.password);
        if (hashedNewPasswordMatch) {
            throw new common_1.BadRequestException('You entered password same as current password');
        }
        await this.adminRepository.update(admin.id, {
            password: (0, bcrypt_helper_1.encodePassword)(req.body.password),
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admins)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map