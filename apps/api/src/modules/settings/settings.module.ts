import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Setting } from './setting.model'
import { SettingsRepository } from './settings.repository'
import { SettingsService } from './settings.service'
import { SettingsController } from './settings.controller'
import { AuthModule } from '@/modules/auth/auth.module'

@Module({
  imports: [SequelizeModule.forFeature([Setting]), AuthModule],
  providers: [SettingsRepository, SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
