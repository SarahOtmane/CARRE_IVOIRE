import { IsString, MaxLength, MinLength, IsNumber, Min, Max, IsOptional, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTaxRateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  label: string

  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  rate: number

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean
}
