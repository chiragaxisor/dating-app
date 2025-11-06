import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ImageUploadDto {
  @ApiProperty({
    format: 'binary',
  })
  @IsOptional()
  readonly image!: string;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  chatId: number;
}
