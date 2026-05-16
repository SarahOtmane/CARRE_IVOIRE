import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator'
import { Type } from 'class-transformer'

class OrderItemDto {
  @IsInt()
  @Min(1)
  productId: number

  @IsInt()
  @Min(1)
  quantity: number

  @IsOptional()
  @IsString()
  @MaxLength(100)
  format?: string
}

class ShippingAddressDto {
  @IsString() @MaxLength(100)
  firstName: string

  @IsString() @MaxLength(100)
  lastName: string

  @IsString() @MaxLength(255)
  line1: string

  @IsOptional() @IsString() @MaxLength(255)
  line2?: string

  @IsString() @MaxLength(20)
  postalCode: string

  @IsString() @MaxLength(100)
  city: string

  @IsString() @MaxLength(100)
  country: string
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto
}
