import { Injectable, Logger } from '@nestjs/common'
import puppeteer from 'puppeteer-core'

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name)
  private readonly executablePath = process.env.PUPPETEER_EXECUTABLE_PATH ?? '/usr/bin/chromium-browser'

  async generateFromHtml(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      executablePath: this.executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      headless: true,
    })

    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      })
      return Buffer.from(pdf)
    } finally {
      await browser.close().catch(() => {
        this.logger.warn('Erreur lors de la fermeture du browser Puppeteer')
      })
    }
  }
}
