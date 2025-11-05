import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Gender } from 'src/common/constants';

export class ApproveOrRejectDto {
  @ApiProperty({ example: 12, description: 'User ID to approve or reject' })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 'approve',
    description: 'Action type: "approve" or "reject"',
    enum: ['approve', 'reject'],
  })
  @IsEnum(['approve', 'reject'])
  @IsNotEmpty()
  action: 'approve' | 'reject';

}
