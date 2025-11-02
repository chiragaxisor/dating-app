import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ProviderTypes } from 'src/common/constants';

export class SocialLoginDto {
  @ApiProperty({
    example: ProviderTypes.APPLE,
  })
  @IsNotEmpty()
  providerType: ProviderTypes;

  @ApiProperty({
    example:
      'eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxla...',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'aman@mailinator.com',
  })
  @IsOptional()
  email: string;
}
