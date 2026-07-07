import { Test } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailService } from './mail.service'
import { PdfService } from './pdf.service'

const mockResendSend = jest.fn().mockResolvedValue({ data: { id: 'email-1' }, error: null })

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: mockResendSend,
    },
  })),
}))

describe('MailService', () => {
  let service: MailService
  let pdfService: { generateFromHtml: jest.Mock }

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => { })
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => { })
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => { })
    jest.clearAllMocks()
    pdfService = {
      generateFromHtml: jest.fn().mockResolvedValue(Buffer.from('pdf')),
    }
  })

  function buildConfig(withResendApiKey: boolean, withMailToOverride: boolean) {
    return {
      get: (key: string) => {
        const map: Record<string, any> = {
          MAIL_FROM: 'no-reply@test.com',
          RESEND_API_KEY: withResendApiKey ? 'resend-test-key' : undefined,
          ...(withMailToOverride ? {
            MAIL_TO_OVERRIDE: 'override@test.com',
          } : {}),
        }
        return map[key]
      },
    }
  }

  async function createService(withResendApiKey: boolean, withMailToOverride: boolean): Promise<MailService> {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: buildConfig(withResendApiKey, withMailToOverride) },
        { provide: PdfService, useValue: pdfService },
      ],
    }).compile()
    return module.get(MailService)
  }

  describe('sans RESEND_API_KEY (mode console)', () => {
    beforeEach(async () => { service = await createService(false, false) })

    it('sendOrderConfirmation se résout sans appel réseau', async () => {
      await expect(
        service.sendOrderConfirmation({
          to: 'a@b.com', firstName: 'J', lastName: 'D', orderNumber: 'CI-001', totalAmount: 390,
          items: [{ productName: 'Carré', quantity: 1, unitPrice: 390 }],
        }),
      ).resolves.toBeUndefined()
      expect(pdfService.generateFromHtml).toHaveBeenCalled()
      expect(mockResendSend).not.toHaveBeenCalled()
    })

    it('sendPasswordReset se résout sans appel réseau', async () => {
      await expect(
        service.sendPasswordReset({ to: 'a@b.com', firstName: 'J', resetUrl: 'https://x.com/r' }),
      ).resolves.toBeUndefined()
    })
  })

  describe('avec RESEND_API_KEY (envoi via Resend)', () => {
    beforeEach(async () => {
      service = await createService(true, true)
    })

    it('appelle resend.emails.send pour sendOrderConfirmation', async () => {
      await service.sendOrderConfirmation({
        to: 'a@b.com', firstName: 'J', lastName: 'D', orderNumber: 'CI-001', totalAmount: 390,
        items: [{ productName: 'Carré', quantity: 1, unitPrice: 390 }],
      })
      expect(mockResendSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ['override@test.com'],
          subject: expect.stringContaining('CI-001'),
          from: 'no-reply@test.com',
        }),
      )
    })

    it("passe le bcc quand aucun override destinataire n'est défini", async () => {
      service = await createService(true, false)
      await service.sendOrderConfirmation({
        to: 'a@b.com', firstName: 'J', lastName: 'D', orderNumber: 'CI-002', totalAmount: 390,
        items: [], bcc: 'bcc@test.com',
      })
      expect(mockResendSend).toHaveBeenCalledWith(expect.objectContaining({ bcc: ['bcc@test.com'] }))
    })

    it('appelle resend.emails.send pour sendPasswordReset', async () => {
      await service.sendPasswordReset({ to: 'a@b.com', firstName: 'J', resetUrl: 'https://x.com/r' })
      expect(mockResendSend).toHaveBeenCalledWith(expect.objectContaining({ to: ['override@test.com'] }))
    })
  })
})
