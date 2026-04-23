import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string

  @IsString()
  @MaxLength(100)
  firstName: string

  @IsString()
  @MaxLength(100)
  lastName: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string
}
