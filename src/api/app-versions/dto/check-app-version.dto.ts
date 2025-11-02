import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { DeviceTypes } from 'src/common/constants';

export class CheckAppVersionDto {
  @ApiProperty({ example: DeviceTypes.IOS })
  @IsNotEmpty()
  @IsEnum(DeviceTypes)
  platform: DeviceTypes;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  version: number;
}
