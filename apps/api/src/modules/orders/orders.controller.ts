import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { AdminGuard } from '@/modules/auth/guards/admin.guard'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import type { JwtUser } from '@/modules/auth/strategies/jwt.strategy'

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: JwtUser) {
    return this.ordersService.createOrder(dto, user.id)
  }

  @Get('me')
  findMyOrders(@CurrentUser() user: JwtUser) {
    return this.ordersService.findUserOrders(user.id)
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.findAll({ status, page, limit })
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtUser) {
    return this.ordersService.findById(id, user.id, user.role === 'admin')
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto)
  }
}
