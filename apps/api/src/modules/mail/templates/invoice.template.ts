export interface InvoiceParams {
  orderNumber: string
  orderDate: Date
  firstName: string
  lastName: string
  shippingAddress?: {
    line1?: string
    postalCode?: string
    city?: string
    country?: string
  } | null
  items: { productName: string; quantity: number; unitPrice: number; format?: string; taxRateLabel?: string; taxRatePercent?: number }[]
  totalAmount: number
}

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="200" height="50" fill="none">
  <rect x="1" y="1" width="78" height="78" stroke="#3A1F14" stroke-width="1.25" fill="none"/>
  <text x="40" y="52" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-weight="500" fill="#3A1F14" letter-spacing="0.02em">CI</text>
  <text x="100" y="36" font-family="Georgia,serif" font-size="22" font-weight="500" fill="#3A1F14" letter-spacing="0.18em">CARRÉ</text>
  <text x="100" y="62" font-family="Georgia,serif" font-size="22" font-weight="500" fill="#3A1F14" letter-spacing="0.18em" font-style="italic">ivoire</text>
</svg>`

function fmt(centimes: number): string {
  return (centimes / 100).toFixed(2).replace('.', ',') + ' €'
}

function fmtDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function fmtRate(rate: number): string {
  return rate.toFixed(2).replace(/\.?0+$/, '').replace('.', ',') + ' %'
}

export function buildInvoiceHtml(params: InvoiceParams): string {
  const itemsHtml = params.items.map((item) => `
    <tr>
      <td style="padding:12px 0;font-family:Arial,sans-serif;font-size:13px;color:#3A1F14;border-bottom:1px solid rgba(58,31,20,0.08)">
        ${item.productName}${item.format ? `<br><span style="font-size:11px;color:rgba(58,31,20,0.5)">${item.format}</span>` : ''}
      </td>
      <td style="padding:12px 0;font-family:Arial,sans-serif;font-size:13px;color:#3A1F14;text-align:center;border-bottom:1px solid rgba(58,31,20,0.08)">${item.quantity}</td>
      <td style="padding:12px 0;font-family:Arial,sans-serif;font-size:13px;color:rgba(58,31,20,0.6);text-align:right;border-bottom:1px solid rgba(58,31,20,0.08)">${fmt(item.unitPrice)}</td>
      <td style="padding:12px 0;font-family:Arial,sans-serif;font-size:13px;color:rgba(58,31,20,0.6);text-align:right;border-bottom:1px solid rgba(58,31,20,0.08)">${item.taxRatePercent !== undefined ? fmtRate(item.taxRatePercent) : '—'}</td>
      <td style="padding:12px 0;font-family:Arial,sans-serif;font-size:13px;color:#B08A4F;text-align:right;border-bottom:1px solid rgba(58,31,20,0.08);font-weight:500">${fmt(item.unitPrice * item.quantity)}</td>
    </tr>
  `).join('')

  const totalVat = params.items.reduce((acc, item) => {
    if (item.taxRatePercent === undefined) return acc
    const unitHt = Math.round(item.unitPrice / (1 + item.taxRatePercent / 100))
    return acc + (item.unitPrice - unitHt) * item.quantity
  }, 0)
  const totalHt = params.totalAmount - totalVat

  const vatByRate = new Map<string, number>()
  for (const item of params.items) {
    if (item.taxRatePercent === undefined) continue
    const unitHt = Math.round(item.unitPrice / (1 + item.taxRatePercent / 100))
    const label = `${item.taxRateLabel ?? 'TVA'} (${fmtRate(item.taxRatePercent)})`
    vatByRate.set(label, (vatByRate.get(label) ?? 0) + (item.unitPrice - unitHt) * item.quantity)
  }
  const vatBreakdownHtml = Array.from(vatByRate.entries()).map(([label, amount]) => `
    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12px;color:rgba(58,31,20,0.6)">
      <span>${label}</span>
      <span>${fmt(amount)}</span>
    </div>
  `).join('')

  const address = params.shippingAddress
  const addressHtml = address
    ? `${params.firstName} ${params.lastName}<br>${address.line1 ?? ''}<br>${address.postalCode ?? ''} ${address.city ?? ''}<br>${address.country ?? 'France'}`
    : `${params.firstName} ${params.lastName}`

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #FFFBF7; font-family: Arial, sans-serif; color: #3A1F14; }
    @page { margin: 0; }
  </style>
</head>
<body>
  <div style="padding:56px 64px;min-height:100vh;background:#FFFBF7">

    <!-- En-tête -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:56px">
      <div>${LOGO_SVG}</div>
      <div style="text-align:right">
        <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);margin-bottom:8px">Facture</p>
        <p style="font-family:Georgia,serif;font-size:22px;color:#3A1F14;margin-bottom:4px">${params.orderNumber}</p>
        <p style="font-family:Arial,sans-serif;font-size:12px;color:rgba(58,31,20,0.55)">${fmtDate(params.orderDate)}</p>
      </div>
    </div>

    <!-- Adresses -->
    <div style="display:flex;justify-content:space-between;margin-bottom:48px;padding-bottom:40px;border-bottom:1px solid rgba(58,31,20,0.12)">
      <div>
        <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);margin-bottom:12px">Émetteur</p>
        <p style="font-family:Georgia,serif;font-size:16px;margin-bottom:6px">Carré Ivoire</p>
        <p style="font-size:12px;line-height:1.7;color:rgba(58,31,20,0.6)">
          29 rue de Vauparfonds<br>28600 LUISANT<br>contact@carre-ivoire.fr
        </p>
      </div>
      <div style="text-align:right">
        <p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);margin-bottom:12px">Facturé à</p>
        <p style="font-size:12px;line-height:1.7;color:rgba(58,31,20,0.6)">${addressHtml}</p>
      </div>
    </div>

    <!-- Tableau produits -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      <thead>
        <tr>
          <th style="text-align:left;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);padding-bottom:12px;border-bottom:1px solid rgba(58,31,20,0.2);font-weight:400">Désignation</th>
          <th style="text-align:center;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);padding-bottom:12px;border-bottom:1px solid rgba(58,31,20,0.2);font-weight:400">Qté</th>
          <th style="text-align:right;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);padding-bottom:12px;border-bottom:1px solid rgba(58,31,20,0.2);font-weight:400">Prix unit.</th>
          <th style="text-align:right;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);padding-bottom:12px;border-bottom:1px solid rgba(58,31,20,0.2);font-weight:400">TVA</th>
          <th style="text-align:right;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);padding-bottom:12px;border-bottom:1px solid rgba(58,31,20,0.2);font-weight:400">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <!-- Total -->
    <div style="display:flex;justify-content:flex-end;margin-bottom:56px">
      <div style="min-width:280px">
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:rgba(58,31,20,0.7)">
          <span>Total HT</span>
          <span>${fmt(totalHt)}</span>
        </div>
        ${vatBreakdownHtml}
        <div style="display:flex;justify-content:space-between;padding:16px 0;border-top:2px solid #3A1F14;margin-top:8px">
          <span style="font-family:Georgia,serif;font-size:18px;color:#3A1F14">Total TTC</span>
          <span style="font-family:Georgia,serif;font-size:22px;color:#B08A4F;font-weight:500">${fmt(params.totalAmount)}</span>
        </div>
      </div>
    </div>

    <!-- Pied de page -->
    <div style="border-top:1px solid rgba(58,31,20,0.12);padding-top:24px;display:flex;justify-content:space-between;align-items:center">
      <p style="font-size:11px;color:rgba(58,31,20,0.4)">Paiement effectué par carte bancaire via Stripe</p>
      <p style="font-size:11px;color:rgba(58,31,20,0.4)">Carré Ivoire — LUISANT, France</p>
    </div>

  </div>
</body>
</html>`
}
