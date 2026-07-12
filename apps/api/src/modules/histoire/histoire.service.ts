import { Injectable } from '@nestjs/common'
import { HistoireSectionRepository } from './histoire-section.repository'
import { ErrorCodes } from '@/common/constants'
import throwApiError from '@/common/errors/throw-api-error'
import type { HistoireSection } from './histoire-section.model'
import type { UpdateHistoireSectionDto } from './dto/update-histoire-section.dto'
import type { HistoireSectionResponseDto } from './dto/histoire-section-response.dto'

@Injectable()
export class HistoireService {
  constructor(private readonly histoireSectionRepository: HistoireSectionRepository) {}

  async findAll(): Promise<HistoireSectionResponseDto[]> {
    const sections = await this.histoireSectionRepository.findAll()
    return sections.map((s) => this.toResponseDto(s))
  }

  async update(id: number, dto: UpdateHistoireSectionDto): Promise<HistoireSectionResponseDto> {
    const existing = await this.histoireSectionRepository.findById(id)
    if (!existing) {
      throwApiError(ErrorCodes.NOT_FOUND, 'Section introuvable')
    }
    const updated = await this.histoireSectionRepository.update(id, dto)
    return this.toResponseDto(updated!)
  }

  private toResponseDto(s: HistoireSection): HistoireSectionResponseDto {
    return {
      id: s.id,
      key: s.key,
      displayOrder: s.displayOrder,
      imageSide: s.displayOrder % 2 === 0 ? 'left' : 'right',
      image: s.image,
      imageAlt: s.imageAlt,
      paragraphs: s.paragraphs !== undefined ? JSON.parse(s.paragraphs) : null,
    }
  }
}
