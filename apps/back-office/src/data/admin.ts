export const ADMIN_STORAGE_KEY = 'ci_admin_state_v1'

export interface AdminCategory {
    id: string
    label: string
    tagline: string
    count: number
    status: 'active' | 'draft' | 'archived'
    order: number
}

export interface AdminProduct {
    id: string
    ref: string
    name: string
    category: string
    origin: string
    format: string
    price: number
    stock: number
    status: 'active' | 'draft' | 'archived'
    updatedAt: string
    description: string
}

export interface AdminCustomer {
    id: string
    ref: string
    first: string
    last: string
    email: string
    city: string
    segment: 'Nouveau' | 'Fidèle' | 'VIP' | 'Professionnel'
    orders: number
    total: number
    since: string
    favorite: boolean
}

export interface AdminOrderItem {
    pid: string
    name: string
    qty: number
    price: number
}

export interface AdminOrder {
    id: string
    ref: string
    customerId: string
    customer: string
    city: string
    date: string
    items: AdminOrderItem[]
    subtotal: number
    shipping: number
    total: number
    status: 'Nouvelle' | 'En préparation' | 'Expédiée' | 'Livrée' | 'Annulée'
    payment: 'CB' | 'PayPal' | 'Apple Pay'
    notes: string
}

export interface AdminPageEntry {
    id: string
    title: string
    slug: string
    template: string
    status: 'published' | 'draft' | 'archived'
    updatedAt: string
    path: string
}

export interface AdminSettings {
    currency: 'EUR' | 'USD' | 'GBP' | 'CHF'
    taxRate: number
    shippingFlat: number
    shippingFreeFrom: number
    bccEmail: string
    address: string
    maker: string
    conditioning: string
}

export interface AdminState {
    categories: AdminCategory[]
    products: AdminProduct[]
    customers: AdminCustomer[]
    orders: AdminOrder[]
    pages: AdminPageEntry[]
    settings: AdminSettings
    version: number
}

export const adminOrderStatuses = ['Nouvelle', 'En préparation', 'Expédiée', 'Livrée', 'Annulée'] as const
export const adminCustomerSegments = ['Nouveau', 'Fidèle', 'VIP', 'Professionnel'] as const
export const adminProductStatuses = ['active', 'draft', 'archived'] as const
export const adminProductFormats = ['70 g', '100 g', '140 g', '200 g', '300 g', 'Coffret 8', 'Coffret 16', 'Coffret 24'] as const
export const adminOrigins = ['Madagascar', 'Pérou', 'Équateur', 'Vénézuela', 'République Dominicaine', 'Côte d’Ivoire', 'Tanzanie', 'Mexique', 'Vietnam'] as const

const seedCategories = [
    { id: 'carres-signature', label: 'Carrés Signature', tagline: 'bonbons au chocolat', order: 1, status: 'active' as const },
    { id: 'mini-carres', label: 'Mini Carrés', tagline: 'format dégustation', order: 2, status: 'active' as const },
    { id: 'tablettes', label: 'Tablettes', tagline: 'pur cacao, grand format', order: 3, status: 'active' as const },
    { id: 'gourmandises', label: 'Gourmandises', tagline: 'praliné, caramel, noisette', order: 4, status: 'active' as const },
    { id: 'sables', label: 'Sablés', tagline: 'biscuits au beurre', order: 5, status: 'active' as const },
    { id: 'mendiants', label: 'Mendiants', tagline: 'fruits secs & cacao', order: 6, status: 'active' as const },
    { id: 'oursons', label: 'Oursons', tagline: 'guimauve enrobée', order: 7, status: 'draft' as const },
    { id: 'chocobombs', label: 'Chocobombs', tagline: 'édition saisonnière', order: 8, status: 'active' as const },
    { id: 'pates-a-tartiner', label: 'Pâtes à tartiner', tagline: 'noisette & cacao', order: 9, status: 'active' as const },
]

const productNames: Record<string, string[]> = {
    'carres-signature': ['Carré Origine', 'Carré Praliné', 'Carré Caramel', 'Carré Yuzu', 'Carré Café'],
    'mini-carres': ['Mini Lait 40%', 'Mini Noir 70%', 'Mini Praliné', 'Mini Sel'],
    'tablettes': ['Noir Pur 72%', 'Noir Intense 85%', 'Lait 40%', 'Lait Noisette', 'Cru 100%'],
    gourmandises: ['Truffe Cacao', 'Caramel Tendre', 'Noisette Enrobée'],
    sables: ['Sablé Cacao', 'Sablé Vanille', 'Sablé Praliné'],
    mendiants: ['Mendiant Noir', 'Mendiant Lait', 'Mendiant Or'],
    oursons: ['Ourson Guimauve'],
    chocobombs: ['Chocobomb Noir', 'Chocobomb Lait', 'Chocobomb Praliné'],
    'pates-a-tartiner': ['Pâte Noisette', 'Pâte Cacao Pur'],
}

const customerNames = [
    ['Camille', 'Lefèvre'], ['Antoine', 'Roussel'], ['Inès', 'Bertin'], ['Léa', 'Marchand'],
    ['Hugo', 'Aubert'], ['Margaux', 'Vidal'], ['Théo', 'Charpentier'], ['Élise', 'Garnier'],
    ['Noah', 'Perrin'], ['Manon', 'Dubois'], ['Clara', 'Renaud'], ['Lucas', 'Faure'],
    ['Sarah', 'Morin'], ['Romain', 'Lemoine'], ['Juliette', 'Roy'], ['Maxime', 'Lambert'],
    ['Nina', 'Gauthier'], ['Adrien', 'Robin'], ['Émilie', 'Caron'], ['Pierre', 'Henry'],
]

const cities = ['Paris', 'Lyon', 'Bordeaux', 'Lille', 'Marseille', 'Nantes', 'Strasbourg', 'Toulouse']

export function slugify(value: string): string {
    const normalized = stripDiacritics(value.toLowerCase())
    let result = ''
    let previousDash = false

    for (const character of normalized) {
        if (/[a-z0-9]/.test(character)) {
            result += character
            previousDash = false
            continue
        }

        if (!previousDash) {
            result += '-'
            previousDash = true
        }
    }

    while (result.startsWith('-')) {
        result = result.slice(1)
    }

    while (result.endsWith('-')) {
        result = result.slice(0, -1)
    }

    return result
}

function stripDiacritics(value: string): string {
    return Array.from(value.normalize('NFD'))
        .filter((character) => !/\p{Diacritic}/u.test(character))
        .join('')
}

function seedProducts(): AdminProduct[] {
    const out: AdminProduct[] = []
    let index = 0

    Object.entries(productNames).forEach(([categoryId, names]) => {
        names.forEach((name, nameIndex) => {
            index += 1
            const origin = adminOrigins[(index + nameIndex) % adminOrigins.length]
            out.push({
                id: `p-${index}`,
                ref: `CI-${String(1000 + index)}`,
                name,
                category: categoryId,
                origin,
                format: adminProductFormats[(index * 3) % adminProductFormats.length],
                price: Math.round((9 + ((index * 2.7) % 28)) * 100) / 100,
                stock: (index * 7) % 80,
                status: index % 3 === 0 ? 'draft' : 'active',
                updatedAt: `2026-04-${String((index % 28) + 1).padStart(2, '0')}`,
                description: `Sourcé en ${origin}. Conché 72 heures.`,
            })
        })
    })

    return out
}

function seedCustomers(): AdminCustomer[] {
    return customerNames.map((entry, index) => ({
        ...(() => {
            const localPart = Array.from(stripDiacritics(`${entry[0]}.${entry[1]}`.toLowerCase()))
                .filter((character) => /[a-z.]/.test(character))
                .join('')

            return {
                id: `c-${index + 1}`,
                ref: `CI-${String(2000 + index + 1)}`,
                first: entry[0],
                last: entry[1],
                email: `${localPart}@maison.fr`,
                city: cities[index % cities.length],
                segment: adminCustomerSegments[index % adminCustomerSegments.length],
                orders: (index * 3) % 14 + (index % 3 === 0 ? 0 : 1),
                total: Math.round((40 + ((index * 23) % 480)) * 100) / 100,
                since: `202${3 + (index % 3)}-${String((index % 12) + 1).padStart(2, '0')}-${String(((index * 5) % 28) + 1).padStart(2, '0')}`,
                favorite: index % 5 === 0,
            }
        })(),
    }))
}

function seedOrders(products: AdminProduct[], customers: AdminCustomer[]): AdminOrder[] {
    const out: AdminOrder[] = []

    for (let index = 0; index < 25; index += 1) {
        const customer = customers[index % customers.length]
        const itemCount = ((index * 2) % 4) + 1
        const items: AdminOrderItem[] = []
        let subtotal = 0

        for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
            const product = products[(index * 3 + itemIndex) % products.length]
            const quantity = (itemIndex % 3) + 1
            items.push({ pid: product.id, name: product.name, qty: quantity, price: product.price })
            subtotal += product.price * quantity
        }

        const shipping = subtotal > 60 ? 0 : 6.9

        out.push({
            id: `o-${index + 1}`,
            ref: `CI-${String(8000 + index + 1)}`,
            customerId: customer.id,
            customer: `${customer.first} ${customer.last}`,
            city: customer.city,
            date: `2026-04-${String(((index * 2) % 28) + 1).padStart(2, '0')}`,
            items,
            subtotal: Math.round(subtotal * 100) / 100,
            shipping,
            total: Math.round((subtotal + shipping) * 100) / 100,
            status: ['Nouvelle', 'En préparation', 'Expédiée', 'Livrée', 'Annulée'][index % 5] as AdminOrder['status'],
            payment: ['CB', 'PayPal', 'Apple Pay'][index % 3] as AdminOrder['payment'],
            notes: index % 4 === 0 ? 'Cadeau — joindre une carte.' : '',
        })
    }

    return out
}

function seedPages(): AdminPageEntry[] {
    return [
        { id: 'home', title: 'Accueil', slug: 'accueil', template: 'Homepage', status: 'published', updatedAt: '2026-04-18', path: '/' },
        { id: 'catalog', title: 'Boutique', slug: 'boutique', template: 'Catalog', status: 'published', updatedAt: '2026-04-20', path: '/boutique' },
        { id: 'product', title: 'Fiche produit', slug: 'produit', template: 'Product', status: 'published', updatedAt: '2026-04-19', path: '/produits/:slug' },
        { id: 'contact', title: 'Contact', slug: 'contact', template: 'Contact', status: 'published', updatedAt: '2026-04-17', path: '/contact' },
        { id: 'account', title: 'Mon compte', slug: 'compte', template: 'Account', status: 'published', updatedAt: '2026-04-16', path: '/compte' },
        { id: 'checkout', title: 'Panier & paiement', slug: 'commande', template: 'Shopping', status: 'draft', updatedAt: '2026-04-21', path: '/commande' },
    ]
}

export function createAdminSeedState(): AdminState {
    const products = seedProducts()
    const customers = seedCustomers()
    const orders = seedOrders(products, customers)
    const categories = seedCategories.map((category) => ({
        ...category,
        count: products.filter((product) => product.category === category.id).length,
    }))

    return {
        categories,
        products,
        customers,
        orders,
        pages: seedPages(),
        settings: {
            currency: 'EUR',
            taxRate: 5.5,
            shippingFlat: 6.9,
            shippingFreeFrom: 60,
            bccEmail: 'commandes@carre-ivoire.fr',
            address: '4 rue du Nil, 75002 Paris',
            maker: 'Atelier Carré Ivoire — Paris',
            conditioning: 'Maintenir entre 14 °C et 18 °C, à l’abri de la lumière.',
        },
        version: 1,
    }
}

export function loadAdminState(): AdminState {
    if (!globalThis.window) {
        return createAdminSeedState()
    }

    try {
        const raw = globalThis.window.localStorage.getItem(ADMIN_STORAGE_KEY)
        if (!raw) {
            return createAdminSeedState()
        }

        const parsed = JSON.parse(raw) as Partial<AdminState> | null
        if (!parsed?.products || !parsed?.categories) {
            return createAdminSeedState()
        }

        return parsed as AdminState
    } catch {
        return createAdminSeedState()
    }
}

export function saveAdminState(state: AdminState): void {
    if (!globalThis.window) {
        return
    }

    try {
        globalThis.window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state))
    } catch {
        // Ignore persistence errors in preview mode.
    }
}

export function resetAdminState(): AdminState {
    if (globalThis.window) {
        globalThis.window.localStorage.removeItem(ADMIN_STORAGE_KEY)
    }

    return createAdminSeedState()
}

export function formatCurrency(value: number | null | undefined, currency: AdminSettings['currency'] = 'EUR'): string {
    if (value == null || Number.isNaN(value)) {
        return '—'
    }

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}

export function formatDate(value: string | null | undefined): string {
    if (!value) {
        return '—'
    }

    const parts = value.split('-')
    if (parts.length !== 3) {
        return value
    }

    return `${parts[2]}.${parts[1]}.${parts[0]}`
}

export function createProductDraft(state: AdminState) {
    return {
        id: '',
        ref: `CI-${1000 + state.products.length + 1}`,
        name: '',
        category: state.categories[0]?.id || '',
        origin: '',
        format: adminProductFormats[0],
        price: 12,
        stock: 0,
        status: 'draft' as const,
        description: '',
        updatedAt: new Date().toISOString().slice(0, 10),
    }
}

export function createCategoryDraft(state: AdminState) {
    return {
        id: '',
        label: '',
        tagline: '',
        count: 0,
        status: 'draft' as const,
        order: state.categories.length + 1,
    }
}

export function createPageDraft(state: AdminState) {
    const count = state.pages.length + 1

    return {
        id: '',
        title: '',
        slug: `page-${count}`,
        template: 'Default',
        status: 'draft' as const,
        updatedAt: new Date().toISOString().slice(0, 10),
        path: `/page-${count}`,
    }
}