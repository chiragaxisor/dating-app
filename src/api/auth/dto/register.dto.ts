import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Gender } from 'src/common/constants';
import { IsNotDisposableEmail } from 'src/common/validator/is-not-disposable-email.valodator';

export class RegisterDto {
  @ApiProperty({
    example: 'aman@mailinator.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsNotDisposableEmail()
  email: string;

  // @ApiProperty({
  //   example: '+91',
  // })
  // @IsNotEmpty()
  // countryCode: string;

  // @ApiProperty({
  //   example: '9978678789',
  // })
  // @IsNotEmpty()
  // phone: string;

  @ApiProperty({
    example: 'password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Aman Verma',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: Gender.MALE,
    enum: Gender,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  // @ApiProperty({
  //   example: 30,
  // })
  // @IsNotEmpty()
  // age: number;

  // @ApiProperty({
  //   example: '90 Bedford Street, Manhattan',
  // })
  // @IsNotEmpty()
  // address: string;

  // @ApiProperty({
  //   example: 'United States',
  // })
  // @IsNotEmpty()
  // country: string;

  // @ApiProperty({
  //   example: 'New York',
  // })
  // @IsNotEmpty()
  // state: string;

  // @ApiProperty({
  //   example: 'Manhattan',
  // })
  // @IsNotEmpty()
  // city: string;

  // @ApiProperty({
  //   example: 100149,
  // })
  // @IsNotEmpty()
  // postalCode: number;
}
