export interface HistoireSectionResponseDto {
  id: number
  key: string
  displayOrder: number
  imageSide: 'left' | 'right'
  image: string
  imageAlt: string
  paragraphs: string[]
}
