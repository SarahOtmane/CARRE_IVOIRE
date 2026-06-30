import { Test } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailService } from './mail.service'
import * as nodemailer from 'nodemailer'

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'msg-1' }),
  }),
}))

describe('MailService', () => {
  let service: MailService

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {})
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {})
    jest.clearAllMocks()
  })

  function buildConfig(withHost: boolean) {
    return {
      get: (key: string) => {
        const map: Record<string, any> = {
          MAIL_FROM: 'no-reply@test.com',
          ...(withHost ? {
            MAIL_HOST: 'smtp.test.com',
            MAIL_PORT: 587,
            MAIL_USER: 'user',
            MAIL_PASS: 'pass',
          } : {}),
        }
        return map[key]
      },
    }
  }

  async function createService(withHost: boolean): Promise<MailService> {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: buildConfig(withHost) },
      ],
    }).compile()
    return module.get(MailService)
  }

  describe('sans MAIL_HOST (mode console)', () => {
    beforeEach(async () => { service = await createService(false) })

    it('sendOrderConfirmation se résout sans appel réseau', async () => {
      await expect(
        service.sendOrderConfirmation({
          to: 'a@b.com', firstName: 'J', orderNumber: 'CI-001', totalAmount: 390,
          items: [{ productName: 'Carré', quantity: 1, unitPrice: 390 }],
        }),
      ).resolves.toBeUndefined()
    })

    it('sendPasswordReset se résout sans appel réseau', async () => {
      await expect(
        service.sendPasswordReset({ to: 'a@b.com', firstName: 'J', resetUrl: 'https://x.com/r' }),
      ).resolves.toBeUndefined()
    })
  })

  describe('avec MAIL_HOST (envoi via transporter)', () => {
    let sendMailSpy: jest.Mock

    beforeEach(async () => {
      service = await createService(true)
      const transport = (nodemailer.createTransport as jest.Mock).mock.results.at(-1)?.value
      sendMailSpy = transport?.sendMail as jest.Mock
    })

    it('appelle sendMail pour sendOrderConfirmation', async () => {
      await service.sendOrderConfirmation({
        to: 'a@b.com', firstName: 'J', orderNumber: 'CI-001', totalAmount: 390,
        items: [{ productName: 'Carré', quantity: 1, unitPrice: 390 }],
      })
      expect(sendMailSpy).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'a@b.com', subject: expect.stringContaining('CI-001') }),
      )
    })

    it('appelle sendMail avec bcc si fourni', async () => {
      await service.sendOrderConfirmation({
        to: 'a@b.com', firstName: 'J', orderNumber: 'CI-002', totalAmount: 390,
        items: [], bcc: 'bcc@test.com',
      })
      expect(sendMailSpy).toHaveBeenCalledWith(expect.objectContaining({ bcc: 'bcc@test.com' }))
    })

    it('appelle sendMail pour sendPasswordReset', async () => {
      await service.sendPasswordReset({ to: 'a@b.com', firstName: 'J', resetUrl: 'https://x.com/r' })
      expect(sendMailSpy).toHaveBeenCalledWith(expect.objectContaining({ to: 'a@b.com' }))
    })
  })
})
