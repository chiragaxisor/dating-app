import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyResetPasswordOtpDto {
  @ApiProperty({
    example: 'aman@mailinator.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
  })
  @IsNotEmpty()
  otp: string;
}
