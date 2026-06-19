import { Controller, Get, Header, Res } from '@nestjs/common'
import type { Response } from 'express'
import { ProductsRepository } from '@/modules/products/products.repository'
import { CategoriesRepository } from '@/modules/categories/categories.repository'

const BASE_URL = process.env.FRONTEND_URL ?? 'https://carre-ivoire.fr'

const STATIC_URLS = ['', '/boutique', '/histoire', '/engagements', '/contact']

function toDate(d: Date | undefined): string {
  return (d ?? new Date()).toISOString().slice(0, 10)
}

@Controller()
export class SitemapController {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  async getSitemap(@Res() res: Response) {
    const [products, categories] = await Promise.all([
      this.productsRepository.findAllActive(),
      this.categoriesRepository.findAll(),
    ])

    const urls: string[] = [
      ...STATIC_URLS.map(
        (path) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`,
      ),
      ...categories.map(
        (c) => `
  <url>
    <loc>${BASE_URL}/boutique/${c.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
      ),
      ...products.map(
        (p) => `
  <url>
    <loc>${BASE_URL}/produits/${p.slug}</loc>
    <lastmod>${toDate(p.updated_at)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`,
      ),
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`

    res.send(xml)
  }
}
