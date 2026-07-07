import { Test } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { UploadsController } from './uploads.controller'

jest.mock('sharp', () => {
  const chain = {
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue({}),
  }
  return jest.fn(() => chain)
})

jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
}))

describe('UploadsController', () => {
  let controller: UploadsController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UploadsController],
    }).compile()
    controller = module.get(UploadsController)
  })

  it('lève BadRequestException si aucun fichier n\'est fourni', async () => {
    const req = { protocol: 'http', get: () => 'localhost:3000' } as any
    await expect(controller.upload(undefined, req)).rejects.toThrow(BadRequestException)
  })

  it('retourne une URL WebP si le fichier est valide', async () => {
    const file = { buffer: Buffer.from('fake-image') } as any
    const req = { protocol: 'http', get: () => 'localhost:3000' } as any
    const result = await controller.upload(file, req)
    expect(result.url).toMatch(/^http:\/\/localhost:3000\/uploads\/.+\.webp$/)
  })

  it('utilise APP_URL si défini', async () => {
    process.env.APP_URL = 'https://api.carre-ivoire.fr'
    const file = { buffer: Buffer.from('fake') } as any
    const req = { protocol: 'http', get: () => 'localhost' } as any
    const result = await controller.upload(file, req)
    expect(result.url).toContain('https://api.carre-ivoire.fr')
    delete process.env.APP_URL
  })
})
