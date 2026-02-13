import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class PurchaseCoinsDto {
  @ApiProperty({
    example: 'com.dating.coins50',
    description: 'Product ID purchased from store',
    enum: ['com.dating.coins50', 'com.dating.coins25'],
  })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ example: 'GPA.3312-4451-...', description: 'Transaction ID from store' })
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @ApiProperty({
    example: 'android',
    description: 'Platform of purchase',
    enum: ['android', 'ios'],
  })
  @IsNotEmpty()
  @IsEnum(['android', 'ios'])
  platform: 'android' | 'ios';

  @ApiProperty({ example: 'token_from_google_play', description: 'Purchase token (Android only)', required: false })
  @IsString()
  @IsNotEmpty()
  purchaseToken?: string;

  @ApiProperty({ example: 'com.dating.app', description: 'Package name (Android only)', required: false })
  @IsString()
  @IsNotEmpty()
  packageName?: string;
}
