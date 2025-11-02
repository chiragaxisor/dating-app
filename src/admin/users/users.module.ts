import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from 'src/api/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthAdminMiddleware } from 'src/common/middlewar/auth-admin.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthAdminMiddleware).forRoutes('admin/users');
  }
}
