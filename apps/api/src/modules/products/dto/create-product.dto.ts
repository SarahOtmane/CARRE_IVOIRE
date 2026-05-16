import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator'

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string

  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  @MaxLength(255)
  slug: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsInt()
  @Min(0)
  price: number

  @IsOptional()
  @IsInt()
  @Min(0)
  discountPrice?: number

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string

  @IsInt()
  @Min(1)
  categoryId: number

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsOptional()
  @IsBoolean()
  isSeasonal?: boolean

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number

  @IsOptional()
  @IsString()
  @MaxLength(100)
  badge?: string

  @IsOptional()
  @IsString()
  ingredients?: string

  @IsOptional()
  @IsString()
  allergens?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  weightGrams?: number
}
