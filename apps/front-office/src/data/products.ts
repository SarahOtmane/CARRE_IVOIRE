export interface CatalogProduct {
  id: string
  name: string
  origin: string
  price: number
  image: string
  badge?: string | null
  category: string
}

export const ALL_PRODUCTS: CatalogProduct[] = [
  // Tablettes
  {
    id: 'noir-pur-72',
    name: 'Noir Pur — 72%',
    origin: 'Venezuela · Porcelana',
    price: 14,
    image: '/assets/products/tablet-noir-pur.svg',
    badge: null,
    category: 'tablettes',
  },
  {
    id: 'praline-noisette',
    name: 'Praliné Noisette',
    origin: 'Piémont · Tonda Gentile',
    price: 16,
    image: '/assets/products/tablet-praline-noisette.svg',
    badge: 'Nouveau',
    category: 'tablettes',
  },
  {
    id: 'lait-madagascar',
    name: 'Lait Madagascar',
    origin: 'Madagascar · Sambirano',
    price: 15,
    image: '/assets/products/tablet-noir-pur.svg',
    badge: null,
    category: 'tablettes',
  },
  // Carrés Signature
  {
    id: 'coffret-decouverte',
    name: 'Coffret Découverte',
    origin: '9 carrés · 3 origines',
    price: 48,
    image: '/assets/products/coffret-decouverte.svg',
    badge: 'Signature',
    category: 'carres-signature',
  },
  {
    id: 'coffret-signature-16',
    name: 'Coffret Signature',
    origin: '16 carrés · 5 origines',
    price: 64,
    image: '/assets/products/coffret-decouverte.svg',
    badge: 'Signature',
    category: 'carres-signature',
  },
  // Gourmandises
  {
    id: 'truffes-noires',
    name: 'Truffes Noires',
    origin: 'Ghana · Forastero',
    price: 22,
    image: '/assets/products/truffes-noires.svg',
    badge: null,
    category: 'gourmandises',
  },
  {
    id: 'truffes-praline',
    name: 'Truffes Praliné',
    origin: 'Piémont · Tonda Gentile',
    price: 24,
    image: '/assets/products/truffes-noires.svg',
    badge: 'Nouveau',
    category: 'gourmandises',
  },
  // Mini Carrés
  {
    id: 'mini-carres-assortiment',
    name: 'Assortiment Mini Carrés',
    origin: '12 pièces · 4 origines',
    price: 28,
    image: '/assets/products/coffret-decouverte.svg',
    badge: null,
    category: 'mini-carres',
  },
]
