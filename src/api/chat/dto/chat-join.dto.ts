import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChatJoinDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  readonly userId: number;
}
