import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'aman@mailinator.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
