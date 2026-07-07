import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsInt,
  IsIn,
  Min,
} from 'class-validator'

export class UpdateVariantDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  label?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  weightGrams?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  taxRateId?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number

  @IsOptional()
  @IsIn(['in_stock', 'out_of_stock'])
  stockStatus?: 'in_stock' | 'out_of_stock'

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
