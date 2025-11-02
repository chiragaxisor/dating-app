import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/api/users/entities/user.entity';
import { AuthAdminMiddleware } from 'src/common/middlewar/auth-admin.middleware';
import { AdminController } from './admin.controller';
import { Admins } from './admin.entity';
import { AdminService } from './admin.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admins, Users]), UsersModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthAdminMiddleware)
      .forRoutes({ path: 'admin', method: RequestMethod.GET });
  }
}
