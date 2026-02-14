import { Repository } from 'typeorm';
import { Sticker } from './entities/sticker.entity';
export declare class StickersService {
    private readonly stickerRepository;
    constructor(stickerRepository: Repository<Sticker>);
    findAll(): Promise<Sticker[]>;
}
