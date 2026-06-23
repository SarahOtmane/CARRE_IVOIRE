import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { FavoritesService } from './favorites.service'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import type { JwtUser } from '@/modules/auth/strategies/jwt.strategy'

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.favoritesService.findByUser(user.id)
  }

  @Post(':productId')
  @HttpCode(HttpStatus.CREATED)
  add(
    @CurrentUser() user: JwtUser,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.favoritesService.add(user.id, productId)
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: JwtUser,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    await this.favoritesService.remove(user.id, productId)
  }
}
