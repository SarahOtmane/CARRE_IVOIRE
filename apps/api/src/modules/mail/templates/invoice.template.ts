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
  items: { productName: string; quantity: number; unitPrice: number; format?: string }[]
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

export function buildInvoiceHtml(params: InvoiceParams): string {
  const itemsHtml = params.items.map((item) => `
    <tr>
      <td style="padding:12px 0;font-family:Arial,sans-serif;font-size:13px;color:#3A1F14;border-bottom:1px solid rgba(58,31,20,0.08)">
        ${item.productName}${item.format ? `<br><span style="font-size:11px;color:rgba(58,31,20,0.5)">${item.format}</span>` : ''}
      </td>
      <td style="padding:12px 0;font-family:Arial,sans-serif;font-size:13px;color:#3A1F14;text-align:center;border-bottom:1px solid rgba(58,31,20,0.08)">${item.quantity}</td>
      <td style="padding:12px 0;font-family:Arial,sans-serif;font-size:13px;color:rgba(58,31,20,0.6);text-align:right;border-bottom:1px solid rgba(58,31,20,0.08)">${fmt(item.unitPrice)}</td>
      <td style="padding:12px 0;font-family:Arial,sans-serif;font-size:13px;color:#B08A4F;text-align:right;border-bottom:1px solid rgba(58,31,20,0.08);font-weight:500">${fmt(item.unitPrice * item.quantity)}</td>
    </tr>
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
          4 rue du Nil<br>75002 Paris<br>contact@carre-ivoire.fr
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
          <th style="text-align:right;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(58,31,20,0.4);padding-bottom:12px;border-bottom:1px solid rgba(58,31,20,0.2);font-weight:400">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <!-- Total -->
    <div style="display:flex;justify-content:flex-end;margin-bottom:56px">
      <div style="min-width:260px">
        <div style="display:flex;justify-content:space-between;padding:16px 0;border-top:2px solid #3A1F14">
          <span style="font-family:Georgia,serif;font-size:18px;color:#3A1F14">Total TTC</span>
          <span style="font-family:Georgia,serif;font-size:22px;color:#B08A4F;font-weight:500">${fmt(params.totalAmount)}</span>
        </div>
        <p style="font-size:10px;color:rgba(58,31,20,0.4);text-align:right">TVA non applicable — Art. 293B du CGI</p>
      </div>
    </div>

    <!-- Pied de page -->
    <div style="border-top:1px solid rgba(58,31,20,0.12);padding-top:24px;display:flex;justify-content:space-between;align-items:center">
      <p style="font-size:11px;color:rgba(58,31,20,0.4)">Paiement effectué par carte bancaire via Stripe</p>
      <p style="font-size:11px;color:rgba(58,31,20,0.4)">Carré Ivoire — Paris, France</p>
    </div>

  </div>
</body>
</html>`
}
