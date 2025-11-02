import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/api/users/entities/user.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findAllUsers(search: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    search = String(search).trim().toLowerCase();

    const queryBuilder = this.usersRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userType', 'utype')
      .orderBy('u.createdAt', 'DESC');

    if (search && search !== '' && search !== 'undefined') {
      queryBuilder.where(
        new Brackets((qb) => {
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
        }),
      );
    }

    const total = await queryBuilder.getCount();

    const data = limit
      ? await queryBuilder.take(limit).skip(skip).getMany()
      : await queryBuilder.getMany();

    return [data, total];
  }

  async blockUnblockUser(id: number) {
    const user = await this.usersRepository.findOne({ where: { id: id } });

    if (!user) throw new BadRequestException('User not found!');

    await this.usersRepository.update(user.id, {
      isBlocked: user.isBlocked ? false : true,
    });

    return await this.usersRepository.findOne({ where: { id: id } });
  }
}
