import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({
    example:
      'dbeee84d-9487-44c4-b7c9-6720d17f2b42-dbeee84d-dbeee84d-9487-44c4-b7c9-6720d17f2b429487-44c4-b7c9-6720d17f2b42-44c4-b7c9-6720d17f2b42',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'Loosh app',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Hello everyone!',
  })
  @IsNotEmpty()
  notification: string;
}
