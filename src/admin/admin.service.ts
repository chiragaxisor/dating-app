import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Users } from 'src/api/users/entities/user.entity';
import {
  comparePassword,
  encodePassword,
} from 'src/common/helper/bcrypt.helper';
import { Between, Repository } from 'typeorm';
import { Admins } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admins)
    private readonly adminRepository: Repository<Admins>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  /**
   * Find admin using email
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<Admins> {
    return await this.adminRepository
      .createQueryBuilder()
      .where({ email: email })
      .getOne();
  }

  /**
   * Dashboard data
   * @param email
   * @returns
   */
  async dashboardData() {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });

    const thisMonthUsers = await this.usersRepository.count({
      where: {
        createdAt: Between(
          moment().startOf('month').toDate(),
          moment().endOf('month').toDate(),
        ),
      },
    });

    const monthArrayList1 = [];
    let totalUsers = users.length + 1;
    users.length > 0 &&
      users.map((user: any) => {
        totalUsers -= 1;
        if (
          !monthArrayList1.includes(moment(user.createdAt).format('MMM, YYYY'))
        ) {
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
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return (
          moment(new Date(a.date)).unix() - moment(new Date(b.date)).unix()
        );
      }),
    };
  }

  /**
   * Change admin password
   * @param req
   * @param res
   * @returns
   */
  async changePassword(req) {
    const admin = await this.findByEmail(req.body.email);
    if (!admin) throw new BadRequestException('Admin not found!');

    const hashedPasswordMatch = comparePassword(
      req.body.oldPassword,
      admin.password,
    );

    if (!hashedPasswordMatch) {
      throw new BadRequestException('You entered wrong old password');
    }

    const hashedNewPasswordMatch = comparePassword(
      req.body.password,
      admin.password,
    );

    if (hashedNewPasswordMatch) {
      throw new BadRequestException(
        'You entered password same as current password',
      );
    }

    await this.adminRepository.update(admin.id, {
      password: encodePassword(req.body.password),
    });
  }
}
