import { IsOptional, IsInt, Min, IsEmail, IsString, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateSettingsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  shippingFlat?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  shippingFreeFrom?: number

  @IsOptional()
  @IsEmail()
  bccEmail?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string
}
