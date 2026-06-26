import { Controller, Get, Patch, Query, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UserQueryDto } from './dto/user-query.dto'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { AdminGuard } from '@/modules/auth/guards/admin.guard'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import type { JwtUser } from '@/modules/auth/strategies/jwt.strategy'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query)
  }

  @Get('me')
  getMe(@CurrentUser() user: JwtUser) {
    return this.usersService.findById(user.id)
  }

  @Patch('me')
  updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateUserDto) {
    return this.usersService.update(user.id, dto)
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(@CurrentUser() user: JwtUser, @Body() dto: ChangePasswordDto) {
    await this.usersService.changePassword(user.id, dto)
  }
}
