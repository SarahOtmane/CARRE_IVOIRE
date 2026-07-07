import { Test } from '@nestjs/testing'
import { SitemapController } from './sitemap.controller'
import { ProductsRepository } from '@/modules/products/products.repository'
import { CategoriesRepository } from '@/modules/categories/categories.repository'

describe('SitemapController', () => {
  let controller: SitemapController
  let productsRepo: jest.Mocked<ProductsRepository>
  let categoriesRepo: jest.Mocked<CategoriesRepository>

  const mockProducts = [
    { slug: 'carre-noir', updated_at: new Date('2026-01-01') },
    { slug: 'praline-rose', updated_at: undefined },
  ]
  const mockCategories = [{ slug: 'signature' }]

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SitemapController],
      providers: [
        {
          provide: ProductsRepository,
          useValue: { findAllActive: jest.fn().mockResolvedValue(mockProducts) },
        },
        {
          provide: CategoriesRepository,
          useValue: { findAll: jest.fn().mockResolvedValue(mockCategories) },
        },
      ],
    }).compile()

    controller = module.get(SitemapController)
    productsRepo = module.get(ProductsRepository)
    categoriesRepo = module.get(CategoriesRepository)
  })

  it('génère un sitemap XML valide', async () => {
    let sentXml = ''
    const res = { send: (xml: string) => { sentXml = xml } } as any
    await controller.getSitemap(res)

    expect(productsRepo.findAllActive).toHaveBeenCalled()
    expect(categoriesRepo.findAll).toHaveBeenCalled()
    expect(sentXml).toContain('<?xml version="1.0"')
    expect(sentXml).toContain('<urlset')
    expect(sentXml).toContain('carre-noir')
    expect(sentXml).toContain('praline-rose')
    expect(sentXml).toContain('signature')
  })

  it('inclut les URLs statiques', async () => {
    let sentXml = ''
    const res = { send: (xml: string) => { sentXml = xml } } as any
    await controller.getSitemap(res)
    expect(sentXml).toContain('/boutique')
  })

  it('gère un produit sans date de mise à jour', async () => {
    let sentXml = ''
    const res = { send: (xml: string) => { sentXml = xml } } as any
    await controller.getSitemap(res)
    expect(sentXml).toContain('praline-rose')
  })
})
