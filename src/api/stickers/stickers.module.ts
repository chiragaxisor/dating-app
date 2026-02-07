import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StickersController } from './stickers.controller';
import { StickersService } from './stickers.service';
import { Sticker } from './entities/sticker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sticker])],
  controllers: [StickersController],
  providers: [StickersService],
  exports: [StickersService],
})
export class StickersModule {}
