import { IsEmail, MaxLength } from 'class-validator'

export class SubscribeNewsletterDto {
  @IsEmail()
  @MaxLength(255)
  email: string
}
