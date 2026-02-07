import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sticker } from './entities/sticker.entity';

@Injectable()
export class StickersService {
  constructor(
    @InjectRepository(Sticker)
    private readonly stickerRepository: Repository<Sticker>,
  ) {}

  async findAll() {
    // if (type) {
    //   return await this.stickerRepository.find({ where: { type } });
    // }
    return await this.stickerRepository.find();
  }
}
