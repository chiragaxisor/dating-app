import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class UpdateSubscriptionDto {
  @ApiProperty({
    example: 'sir_19_1m',
    description: 'Subscription Product ID',
    enum: ['isr_199_1y', 'sir_19_1m'],
  })
  @IsNotEmpty()
  @IsString()
  subscriptionId: string;

  @ApiProperty({ example: 'GPA.3312-4451-...', description: 'Purchase token from store' })
  @IsNotEmpty()
  @IsString()
  purchaseToken: string;

  @ApiProperty({ example: 'com.dating.app', description: 'Package name' })
  @IsNotEmpty()
  @IsString()
  packageName: string;

  @ApiProperty({
    example: 'ios',
    description: 'Platform of purchase',
    enum: ['android', 'ios'],
  })
  @IsNotEmpty()
  @IsEnum(['android', 'ios'])
  platform: 'android' | 'ios';
}
