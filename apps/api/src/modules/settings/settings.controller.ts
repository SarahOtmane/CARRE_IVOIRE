import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { UpdateSettingsDto } from './dto/update-settings.dto'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { AdminGuard } from '@/modules/auth/guards/admin.guard'

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  async getPublic() {
    const { shippingFlat, shippingFreeFrom } = await this.settingsService.getAll()
    return { shippingFlat, shippingFreeFrom }
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAll() {
    return this.settingsService.getAll()
  }

  @Patch()
  @UseGuards(JwtAuthGuard, AdminGuard)
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(dto)
  }
}
