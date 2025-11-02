import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Gender } from 'src/common/constants';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'Rachel Green',
    required: false,
  })
  @IsOptional()
  name: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  profilePic: string;

  @ApiProperty({
    example: '+91',
    required: false,
  })
  @IsOptional()
  countryCode: string;

  @ApiProperty({
    example: '8989897689',
    required: false,
  })
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: Gender.FEMALE,
    required: false,
    enum: Gender,
  })
  @IsOptional()
  gender: Gender;

  @ApiProperty({
    example: 32,
    required: false,
  })
  @IsOptional()
  age: number;

  @ApiProperty({
    example: '90 Bedford Street, Manhattan',
    required: false,
  })
  @IsOptional()
  address: string;

  @ApiProperty({
    example: 'United States',
    required: false,
  })
  @IsOptional()
  country: string;

  @ApiProperty({
    example: 'New York',
    required: false,
  })
  @IsOptional()
  state: string;

  @ApiProperty({
    example: 'Manhattan',
    required: false,
  })
  @IsOptional()
  city: string;

  @ApiProperty({
    example: 100149,
    required: false,
  })
  @IsOptional()
  postalCode: number;
}
