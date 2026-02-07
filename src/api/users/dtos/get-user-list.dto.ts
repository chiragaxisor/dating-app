import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ImLookingType, RelationshipType } from 'src/common/constants';


export class GetUserListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiProperty({
    enum: RelationshipType,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(RelationshipType)
  relationship?: RelationshipType;

  @ApiProperty({
    enum: ImLookingType,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(ImLookingType)
  imlooking?: ImLookingType;
}
