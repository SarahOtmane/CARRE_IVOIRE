import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { UpdateSettingsDto } from './dto/update-settings.dto'
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard'
import { AdminGuard } from '@/modules/auth/guards/admin.guard'

@Controller('settings')
@UseGuards(JwtAuthGuard, AdminGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAll() {
    return this.settingsService.getAll()
  }

  @Patch()
  update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(dto)
  }
}
