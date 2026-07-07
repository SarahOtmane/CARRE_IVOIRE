import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  IsOptional,
} from 'class-validator'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  @MaxLength(100)
  @Matches(/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/, {
    message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.',
  })
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
