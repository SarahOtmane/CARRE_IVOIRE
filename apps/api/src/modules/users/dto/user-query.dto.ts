import { IsOptional, IsInt, Min, Max, IsString, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class UserQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number
}
