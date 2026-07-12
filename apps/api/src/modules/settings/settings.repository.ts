import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Setting } from './setting.model'

const DEFAULT_SETTINGS: Record<string, string> = {
  shipping_flat: '800',        // en centimes
  shipping_free_from: '7000',  // en centimes
  bcc_email: '',
  address: '29 rue de Vauparfonds, 28600 LUISANT',
  logo_url: '',
}

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectModel(Setting)
    private readonly model: typeof Setting,
  ) {}

  async getAll(): Promise<Record<string, string>> {
    const rows = await this.model.findAll()
    const result = { ...DEFAULT_SETTINGS }
    for (const row of rows) {
      result[row.key] = row.value ?? ''
    }
    return result
  }

  async set(key: string, value: string): Promise<void> {
    await this.model.upsert({ key, value } as any)
  }

  async setMany(entries: Record<string, string>): Promise<void> {
    await Promise.all(
      Object.entries(entries).map(([key, value]) => this.set(key, value)),
    )
  }
}
