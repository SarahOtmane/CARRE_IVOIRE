import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { HistoireSection } from './histoire-section.model'
import type { UpdateHistoireSectionDto } from './dto/update-histoire-section.dto'

@Injectable()
export class HistoireSectionRepository {
  constructor(
    @InjectModel(HistoireSection)
    private readonly db: typeof HistoireSection,
  ) {}

  async findAll(): Promise<HistoireSection[]> {
    return this.db.findAll({ order: [['displayOrder', 'ASC']] })
  }

  async findById(id: number): Promise<HistoireSection | null> {
    return this.db.findByPk(id)
  }

  async update(id: number, dto: UpdateHistoireSectionDto): Promise<HistoireSection | null> {
    const data: Record<string, unknown> = {}
    if (dto.image !== undefined) data.image = dto.image
    if (dto.imageAlt !== undefined) data.imageAlt = dto.imageAlt
    if (dto.paragraphs !== undefined) data.paragraphs = dto.paragraphs

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Record<string,unknown> incompatible with Sequelize update attributes type
    await this.db.update(data as any, { where: { id } })
    return this.db.findByPk(id)
  }
}
