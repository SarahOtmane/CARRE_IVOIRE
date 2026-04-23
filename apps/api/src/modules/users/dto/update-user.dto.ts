import { IsOptional, IsString, MaxLength } from 'class-validator'

// email, customerNumber et role ne peuvent pas être modifiés via cet endpoint
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressStreet?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressCity?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  addressZip?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressCountry?: string
}
