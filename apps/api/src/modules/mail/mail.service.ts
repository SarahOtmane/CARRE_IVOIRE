import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

@Injectable()
export class MailService {
  private readonly transporter: Transporter | null = null
  private readonly from: string
  private readonly logger = new Logger(MailService.name)

  constructor(private readonly config: ConfigService) {
    const host = config.get<string>('MAIL_HOST')
    this.from = config.get<string>('MAIL_FROM') ?? 'commandes@carre-ivoire.fr'

    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: config.get<number>('MAIL_PORT') ?? 587,
        auth: {
          user: config.get<string>('MAIL_USER'),
          pass: config.get<string>('MAIL_PASS'),
        },
      })
    } else {
      this.logger.warn('MAIL_HOST non configuré — les emails seront loggés en console')
    }
  }

  async sendOrderConfirmation(params: {
    to: string
    firstName: string
    orderNumber: string
    totalAmount: number
    items: { productName: string; quantity: number; unitPrice: number }[]
  }): Promise<void> {
    const total = (params.totalAmount / 100).toFixed(2).replace('.', ',')
    const itemsHtml = params.items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px 0;font-family:Inter,sans-serif;font-size:14px;color:#3A1F14;border-bottom:1px solid rgba(58,31,20,0.08)">${item.productName}</td>
            <td style="padding:8px 0;font-family:Inter,sans-serif;font-size:14px;color:#3A1F14;text-align:center;border-bottom:1px solid rgba(58,31,20,0.08)">${item.quantity}</td>
            <td style="padding:8px 0;font-family:Inter,sans-serif;font-size:14px;color:#B08A4F;text-align:right;border-bottom:1px solid rgba(58,31,20,0.08)">${((item.unitPrice * item.quantity) / 100).toFixed(2).replace('.', ',')} €</td>
          </tr>`,
      )
      .join('')

    const html = `
      <div style="max-width:560px;margin:0 auto;background:#FFFBF7;padding:48px 40px;font-family:Inter,sans-serif">
        <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.45);margin:0 0 32px">Carré Ivoire</p>
        <h1 style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:#3A1F14;margin:0 0 8px;line-height:1">Commande confirmée.</h1>
        <p style="font-size:14px;color:rgba(58,31,20,0.6);margin:0 0 40px">Bonjour ${params.firstName}, nous avons bien reçu votre commande.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <thead>
            <tr>
              <th style="text-align:left;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.45);padding-bottom:8px;border-bottom:1px solid rgba(58,31,20,0.15)">Produit</th>
              <th style="text-align:center;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.45);padding-bottom:8px;border-bottom:1px solid rgba(58,31,20,0.15)">Qté</th>
              <th style="text-align:right;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.45);padding-bottom:8px;border-bottom:1px solid rgba(58,31,20,0.15)">Prix</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p style="text-align:right;font-family:Georgia,serif;font-size:24px;color:#B08A4F;margin:0 0 40px">Total : ${total} €</p>
        <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.45);margin:0 0 4px">Référence commande</p>
        <p style="font-family:Georgia,serif;font-size:20px;color:#3A1F14;margin:0 0 40px">${params.orderNumber}</p>
        <p style="font-size:13px;line-height:1.6;color:rgba(58,31,20,0.6);margin:0">Vous recevrez une notification dès l'expédition de votre commande.<br>Pour toute question, contactez-nous à <a href="mailto:contact@carre-ivoire.fr" style="color:#3A1F14">contact@carre-ivoire.fr</a>.</p>
      </div>
    `

    await this.send({ to: params.to, subject: `Commande ${params.orderNumber} confirmée — Carré Ivoire`, html })
  }

  async sendPasswordReset(params: { to: string; firstName: string; resetUrl: string }): Promise<void> {
    const html = `
      <div style="max-width:560px;margin:0 auto;background:#FFFBF7;padding:48px 40px;font-family:Inter,sans-serif">
        <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.45);margin:0 0 32px">Carré Ivoire</p>
        <h1 style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:#3A1F14;margin:0 0 8px;line-height:1">Réinitialisation.</h1>
        <p style="font-size:14px;color:rgba(58,31,20,0.6);margin:0 0 32px">Bonjour ${params.firstName}, vous avez demandé à réinitialiser votre mot de passe.</p>
        <a href="${params.resetUrl}" style="display:inline-block;background:#3A1F14;color:#F6E8DE;font-family:Inter,sans-serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;padding:14px 28px;text-decoration:none;margin-bottom:32px">Définir un nouveau mot de passe</a>
        <p style="font-size:12px;color:rgba(58,31,20,0.45);margin:0">Ce lien expire dans 6 heures. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      </div>
    `

    await this.send({ to: params.to, subject: 'Réinitialisation de votre mot de passe — Carré Ivoire', html })
  }

  private async send(params: { to: string; subject: string; html: string }): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[EMAIL] To: ${params.to} | Subject: ${params.subject}`)
      return
    }
    await this.transporter.sendMail({ from: this.from, ...params })
  }
}
