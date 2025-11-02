import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsOptional } from 'class-validator';

export class UpdateAddressDto {
  @ApiProperty({
    example: '2464 Royal Ln. Opp Opera',
    required: false,
  })
  @IsOptional()
  street: string;

  @ApiProperty({
    example: 'House number A',
  })
  @IsOptional()
  houseNumber: string;

  @ApiProperty({
    example: '12',
  })
  @IsOptional()
  houseNumberExtension: string;

  @ApiProperty({
    example: 'United States',
  })
  @IsOptional()
  country: string;

  @ApiProperty({
    example: 'Los Angeles',
  })
  @IsOptional()
  city: string;

  @ApiProperty({
    example: '45463',
  })
  @IsOptional()
  postalCode: string;

  @ApiProperty({
    example: '72.00',
  })
  @IsOptional()
  @IsLongitude()
  readonly longitude?: number;

  @ApiProperty({
    example: '21.12',
  })
  @IsOptional()
  @IsLatitude()
  readonly latitude?: number;
}
