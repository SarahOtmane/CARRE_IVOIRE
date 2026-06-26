import { Injectable } from '@nestjs/common'
import { SettingsRepository } from './settings.repository'
import type { UpdateSettingsDto } from './dto/update-settings.dto'

export interface SettingsResponse {
  shippingFlat: number
  shippingFreeFrom: number
  bccEmail: string
  address: string
}

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async getAll(): Promise<SettingsResponse> {
    const raw = await this.settingsRepository.getAll()
    return {
      shippingFlat: parseInt(raw.shipping_flat ?? '800', 10),
      shippingFreeFrom: parseInt(raw.shipping_free_from ?? '7000', 10),
      bccEmail: raw.bcc_email ?? '',
      address: raw.address ?? '',
    }
  }

  async update(dto: UpdateSettingsDto): Promise<SettingsResponse> {
    const entries: Record<string, string> = {}
    if (dto.shippingFlat !== undefined) entries.shipping_flat = String(dto.shippingFlat)
    if (dto.shippingFreeFrom !== undefined) entries.shipping_free_from = String(dto.shippingFreeFrom)
    if (dto.bccEmail !== undefined) entries.bcc_email = dto.bccEmail
    if (dto.address !== undefined) entries.address = dto.address

    if (Object.keys(entries).length > 0) {
      await this.settingsRepository.setMany(entries)
    }
    return this.getAll()
  }
}
