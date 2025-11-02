import { Module } from '@nestjs/common';
import { AppVersionsService } from './app-versions.service';
import { AppVersionsController } from './app-versions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppVersions } from './entities/app-versions.entity';
import { APP_GUARD } from '@nestjs/core';
// import { ApiKeyGuard } from 'src/common/passport/api-key.guard';

@Module({
  imports: [TypeOrmModule.forFeature([AppVersions])],
  controllers: [AppVersionsController],
  providers: [
    AppVersionsService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ApiKeyGuard,
    // },
  ],
})
export class AppVersionsModule {}
