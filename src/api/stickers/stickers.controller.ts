import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StickersService } from './stickers.service';
import { GET_RESPONSE_SUCCESS } from 'src/common/swagger.response';
import { plainToInstance } from 'class-transformer';
import { Sticker } from './entities/sticker.entity';

@ApiTags('Stickers')
@Controller('api/v1/stickers')
export class StickersController {
  constructor(private readonly stickersService: StickersService) {}

  @ApiOperation({
    summary: 'Get Sticker List',
  })
  @Get('/list')
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const stickers = await this.stickersService.findAll();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully fetched sticker list.',
      data: plainToInstance(Sticker, stickers, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }
}
