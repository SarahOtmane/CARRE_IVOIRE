import { IsString, IsOptional, MaxLength, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator'

export class UpdateHistoireSectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageAlt?: string

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  paragraphs?: string[]
}
