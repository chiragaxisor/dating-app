import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    example:
      'dbeee84d-9487-44c4-b7c9-6720d17f2b42-dbeee84d-dbeee84d-9487-44c4-b7c9-6720d17f2b429487-44c4-b7c9-6720d17f2b42-44c4-b7c9-6720d17f2b42',
  })
  @IsNotEmpty()
  deviceId: string;
}
