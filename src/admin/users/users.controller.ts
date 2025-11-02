import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UsersService } from './users.service';
import { Users } from 'src/api/users/entities/user.entity';

@ApiExcludeController()
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAllUsers(
    @Query('search') search?: string,
    @Query('page') _page?: string,
    @Query('limit') _limit?: string,
  ) {
    const page = Number(_page) || 1;
    const limit = Number(_limit);

    const [users, total] = await this.usersService.findAllUsers(
      search,
      page,
      limit,
    );

    return {
      data: plainToInstance(Users, users, {
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

  @Get(':id')
  async blockUnblockUser(@Param('id') id: number): Promise<any> {
    const user = await this.usersService.blockUnblockUser(id);

    return {
      message: `User has been successfully ${
        user.isBlocked ? 'blocked' : 'unblocked'
      }`,
      data: plainToInstance(Users, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
    };
  }
}
