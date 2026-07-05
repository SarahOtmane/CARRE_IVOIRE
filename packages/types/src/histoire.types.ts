export interface HistoireSectionResponse {
  id: number
  key: string
  displayOrder: number
  imageSide: 'left' | 'right'
  image: string
  imageAlt: string
  paragraphs: string[]
}

export interface UpdateHistoireSectionDto {
  image?: string
  imageAlt?: string
  paragraphs?: string[]
}
