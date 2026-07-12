import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { PdfService } from './pdf.service'
import { buildInvoiceHtml } from './templates/invoice.template'

export interface OrderConfirmationParams {
  to: string
  firstName: string
  lastName: string
  orderNumber: string
  totalAmount: number
  orderDate?: Date
  shippingAddress?: { line1?: string; postalCode?: string; city?: string; country?: string } | null
  items: { productName: string; quantity: number; unitPrice: number; format?: string; taxRateLabel?: string; taxRatePercent?: number }[]
  bcc?: string
}

@Injectable()
export class MailService {
  private readonly resend: Resend | null = null
  private readonly from: string
  private readonly logger = new Logger(MailService.name)

  constructor(
    private readonly config: ConfigService,
    private readonly pdfService: PdfService,
  ) {
    const apiKey = config.get<string>('RESEND_API_KEY')
    this.from = config.get<string>('MAIL_FROM') ?? 'commandes@carre-ivoire.fr'

    if (apiKey) {
      this.resend = new Resend(apiKey)
    } else {
      this.logger.warn('RESEND_API_KEY non configuré — les emails seront loggués en console')
    }
  }

  async sendOrderConfirmation(params: OrderConfirmationParams): Promise<void> {
    const date = params.orderDate ?? new Date()
    const fmtDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
    const fmt = (c: number) => (c / 100).toFixed(2).replace('.', ',') + ' €'

    const invoiceHtml = buildInvoiceHtml({
      orderNumber: params.orderNumber,
      orderDate: date,
      firstName: params.firstName,
      lastName: params.lastName,
      shippingAddress: params.shippingAddress,
      items: params.items,
      totalAmount: params.totalAmount,
    })

    let pdfBuffer: Buffer | undefined
    try {
      pdfBuffer = await this.pdfService.generateFromHtml(invoiceHtml)
    } catch (err) {
      this.logger.error('Échec génération PDF facture', err)
    }

    const itemsHtml = params.items.map((item) => `
      <tr>
        <td style="padding:10px 0;font-family:Arial,sans-serif;font-size:14px;color:#3A1F14;border-bottom:1px solid rgba(58,31,20,0.08)">
          ${item.productName}${item.format ? ` <span style="color:rgba(58,31,20,0.5);font-size:12px">(${item.format})</span>` : ''}${item.taxRatePercent !== undefined ? ` <span style="color:rgba(58,31,20,0.4);font-size:11px">· TVA ${item.taxRatePercent}%</span>` : ''}
        </td>
        <td style="padding:10px 0;font-family:Arial,sans-serif;font-size:14px;color:rgba(58,31,20,0.6);text-align:center;border-bottom:1px solid rgba(58,31,20,0.08)">${item.quantity}</td>
        <td style="padding:10px 0;font-family:Arial,sans-serif;font-size:14px;color:#B08A4F;text-align:right;border-bottom:1px solid rgba(58,31,20,0.08);font-weight:500">${fmt(item.unitPrice * item.quantity)}</td>
      </tr>
    `).join('')

    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F0E8E0">
  <div style="max-width:600px;margin:40px auto;background:#FFFBF7;font-family:Arial,sans-serif">

    <!-- En-tête -->
    <div style="background:#3A1F14;padding:32px 40px">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(246,232,222,0.6);margin:0 0 8px">Carré Ivoire</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#F6E8DE;margin:0;line-height:1.1">Commande confirmée.</h1>
    </div>

    <!-- Corps -->
    <div style="padding:40px">
      <p style="font-family:Arial,sans-serif;font-size:14px;color:rgba(58,31,20,0.65);margin:0 0 32px;line-height:1.6">
        Bonjour ${params.firstName},<br>
        Votre commande a bien été enregistrée et votre paiement confirmé. Vous trouverez votre facture en pièce jointe.
      </p>

      <!-- Référence + date -->
      <div style="background:#F6E8DE;padding:20px 24px;margin-bottom:32px;display:flex;justify-content:space-between">
        <div>
          <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.45);margin:0 0 4px">Commande</p>
          <p style="font-family:Georgia,serif;font-size:18px;color:#3A1F14;margin:0">${params.orderNumber}</p>
        </div>
        <div style="text-align:right">
          <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.45);margin:0 0 4px">Date</p>
          <p style="font-family:Georgia,serif;font-size:16px;color:#3A1F14;margin:0">${fmtDate}</p>
        </div>
      </div>

      <!-- Tableau produits -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <thead>
          <tr>
            <th style="text-align:left;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);padding-bottom:10px;border-bottom:1px solid rgba(58,31,20,0.15);font-weight:400">Produit</th>
            <th style="text-align:center;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);padding-bottom:10px;border-bottom:1px solid rgba(58,31,20,0.15);font-weight:400">Qté</th>
            <th style="text-align:right;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);padding-bottom:10px;border-bottom:1px solid rgba(58,31,20,0.15);font-weight:400">Montant</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Total -->
      <div style="text-align:right;margin-bottom:40px">
        <span style="font-family:Georgia,serif;font-size:22px;color:#B08A4F">${fmt(params.totalAmount)}</span>
      </div>

      <!-- Message -->
      <p style="font-size:13px;line-height:1.7;color:rgba(58,31,20,0.6);margin:0 0 8px">
        Nous préparons votre commande avec soin. Vous serez notifié dès l'expédition.
      </p>
      <p style="font-size:13px;line-height:1.7;color:rgba(58,31,20,0.6);margin:0">
        Pour toute question : <a href="mailto:contact@carre-ivoire.fr" style="color:#3A1F14;text-decoration:underline">contact@carre-ivoire.fr</a>
      </p>
    </div>

    <!-- Pied de page -->
    <div style="border-top:1px solid rgba(58,31,20,0.12);padding:24px 40px;text-align:center">
      <p style="font-size:11px;color:rgba(58,31,20,0.4);margin:0">Carré Ivoire — 29 rue de Vauparfonds, 28600 LUISANT</p>
    </div>

  </div>
</body>
</html>`

    await this.send({
      to: params.to,
      bcc: params.bcc,
      subject: `Votre commande ${params.orderNumber} — Carré Ivoire`,
      html,
      attachments: pdfBuffer
        ? [{ filename: `facture-${params.orderNumber}.pdf`, content: pdfBuffer }]
        : [],
    })
  }

  async sendPasswordReset(params: { to: string; firstName: string; resetUrl: string }): Promise<void> {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F0E8E0">
  <div style="max-width:560px;margin:40px auto;background:#FFFBF7;font-family:Arial,sans-serif">
    <div style="background:#3A1F14;padding:32px 40px">
      <p style="font-family:Georgia,serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(246,232,222,0.6);margin:0 0 8px">Carré Ivoire</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#F6E8DE;margin:0">Réinitialisation.</h1>
    </div>
    <div style="padding:40px">
      <p style="font-size:14px;color:rgba(58,31,20,0.65);margin:0 0 32px;line-height:1.6">Bonjour ${params.firstName}, vous avez demandé à réinitialiser votre mot de passe.</p>
      <a href="${params.resetUrl}" style="display:inline-block;background:#3A1F14;color:#F6E8DE;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:14px 28px;text-decoration:none;margin-bottom:32px">Définir un nouveau mot de passe</a>
      <p style="font-size:12px;color:rgba(58,31,20,0.45);margin:0">Ce lien expire dans 6 heures. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    </div>
  </div>
</body>
</html>`

    await this.send({ to: params.to, subject: 'Réinitialisation de votre mot de passe — Carré Ivoire', html })
  }

  private async send(params: {
    to: string
    bcc?: string
    subject: string
    html: string
    attachments?: { filename: string; content: Buffer }[]
  }): Promise<void> {
    if (!this.resend) {
      this.logger.log(`[EMAIL] To: ${params.to} | Subject: ${params.subject}`)
      return
    }

    const override = this.config.get<string>('MAIL_TO_OVERRIDE')
    const to = [override ?? params.to]
    const bcc = params.bcc && !override ? [params.bcc] : undefined

    const attachments = params.attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
    }))

    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      bcc,
      subject: params.subject,
      html: params.html,
      attachments,
    })

    if (error) {
      this.logger.error(`Échec envoi email à ${params.to} — Resend: ${error.name} / ${error.message}`)
      throw new Error(error.message)
    }
  }
}
