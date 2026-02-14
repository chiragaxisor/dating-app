import { HttpStatus } from '@nestjs/common';
import { StickersService } from './stickers.service';
import { Sticker } from './entities/sticker.entity';
export declare class StickersController {
    private readonly stickersService;
    constructor(stickersService: StickersService);
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: Sticker[];
    }>;
}
