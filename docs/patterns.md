# Patterns de Développement

## Backend (NestJS)

### 1. Repository Pattern

Coupler l'accès BDD dans un Repository dédié. Le Service ne contient que la logique métier.

```typescript
// product.repository.ts
@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product) private readonly db: typeof Product,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.db.findAll({ where: { status: 'active' } })
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.db.findOne({ where: { slug } })
  }

  async create(data: CreateProductDto): Promise<Product> {
    return this.db.create(data as any)
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    await this.db.update(data, { where: { id } })
    return this.findById(id)
  }

  async delete(id: string): Promise<void> {
    await this.db.destroy({ where: { id } })
  }
}

// product.service.ts
@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async getAll(): Promise<Product[]> {
    return this.repository.findAll()
  }

  async getBySlug(slug: string): Promise<Product> {
    const product = await this.repository.findBySlug(slug)
    if (!product) throw new NotFoundException(`Produit introuvable : ${slug}`)
    return product
  }
}
```

**Règle absolue :** jamais `Product.findAll()` ou `this.db.*` directement dans un Service.

---

### 2. DTOs avec class-validator

Valider toutes les données entrantes via un DTO. Le ValidationPipe global (`whitelist: true`) supprime les champs non déclarés.

```typescript
// create-product.dto.ts
import { IsString, IsNumber, IsOptional, Min, MinLength, MaxLength, IsArray } from 'class-validator'

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string

  @IsString()
  @MinLength(10)
  description: string

  @IsNumber()
  @Min(0)
  price: number

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPrice?: number

  @IsArray()
  @IsString({ each: true })
  tags: string[]
}

// Dans le controller
@Post()
@UseGuards(JwtAuthGuard, AdminGuard)
async create(@Body() dto: CreateProductDto) {
  return this.service.create(dto)
}
```

---

### 3. Guards

```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) throw new UnauthorizedException('Token manquant')

    try {
      request.user = this.jwtService.verify(token)
      return true
    } catch {
      throw new UnauthorizedException('Token invalide')
    }
  }
}

// admin.guard.ts
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest()
    if (user?.role !== 'admin') throw new ForbiddenException('Accès admin requis')
    return true
  }
}

// Usage
@UseGuards(JwtAuthGuard)            // client connecté
@UseGuards(JwtAuthGuard, AdminGuard) // admin seulement
```

---

### 4. Format de réponse standard

```typescript
// Succès (intercepteur global)
{ "success": true, "data": { ... }, "timestamp": "2026-01-01T..." }

// Erreur (filtre global)
{ "success": false, "error": { "code": "PRODUCT_NOT_FOUND", "message": "..." } }
```

---

### 5. Transactions Sequelize (stock)

```typescript
async decrementStock(productId: string, quantity: number): Promise<void> {
  await this.sequelize.transaction(async (t) => {
    const [rowsAffected] = await Product.update(
      { stock: Sequelize.literal(`stock - ${quantity}`) },
      {
        where: {
          id: productId,
          stock: { [Op.gte]: quantity },
        },
        transaction: t,
      },
    )

    if (rowsAffected === 0) {
      throw new ConflictException('Stock insuffisant')
      // La transaction est automatiquement rollback
    }
  })
}
```

---

## Frontend (Vue 3)

### 1. Page = Orchestrateur

Les pages ne contiennent aucune logique : elles composent des composables et des composants.

```vue
<!-- pages/produits/[slug].vue -->
<template>
  <div v-if="isLoading" class="...">Chargement...</div>
  <ProductDetail v-else-if="product" :product="product" @add-to-cart="handleAdd" />
  <div v-else>Produit introuvable.</div>
</template>

<script setup lang="ts">
const route = useRoute()
const { product, isLoading } = useProduct(route.params.slug as string)
const cart = useCartStore()
const { success } = useNotification()

const handleAdd = (qty: number) => {
  cart.addItem({ ...product.value!, quantity: qty })
  success('Ajouté au panier')
}
</script>
```

---

### 2. Composable = Logique réutilisable

```typescript
// composables/useProduct.ts
export function useProduct(slug: string) {
  const product = ref<ProductResponse | null>(null)
  const { isLoading, withLoading } = useLoading()
  const api = useApi()

  const fetch = () =>
    withLoading(async () => {
      const res = await api.get(`/products/${slug}`)
      product.value = res.data.data
    })

  onMounted(fetch)

  return { product, isLoading, refresh: fetch }
}
```

Règles :
- Un composable par domaine logique
- Retourner uniquement ce qui est consommé
- Ne jamais faire d'appel API dans un composant présentationnel

---

### 3. Composant présentationnel

```vue
<!-- components/product/ProductCard.vue -->
<template>
  <article class="border bg-papier p-4" @click="$emit('select', product)">
    <img :src="product.image" :alt="product.name" class="w-full aspect-square object-cover" />
    <h3 class="font-display text-lg text-brun-cacao mt-3">{{ product.name }}</h3>
    <p class="font-body text-dore mt-1">{{ formatPrice(product.price) }}</p>
  </article>
</template>

<script setup lang="ts">
import type { ProductResponse } from '@carre-ivoire/types'

interface Props {
  product: ProductResponse
}

defineProps<Props>()
defineEmits<{ select: [product: ProductResponse] }>()

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price / 100)
</script>
```

Règles :
- Pas d'appels API
- Props typées avec interface
- Émet des events plutôt que de muter l'état global

---

### 4. Store Pinia (Setup Store)

```typescript
// stores/cart.store.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const count = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))
  const total = computed(() => items.value.reduce((acc, i) => acc + i.price * i.quantity, 0))

  function addItem(item: CartItem) {
    const existing = items.value.find(
      (i) => i.productId === item.productId && i.format === item.format,
    )
    if (existing) {
      existing.quantity += item.quantity
    } else {
      items.value.push({ ...item })
    }
  }

  function removeItem(productId: string, format?: string) {
    items.value = items.value.filter(
      (i) => !(i.productId === productId && i.format === format),
    )
  }

  function clearCart() {
    items.value = []
  }

  return { items, count, total, addItem, removeItem, clearCart }
}, { persist: true })
```

---

### 5. useApi — Appels HTTP

```typescript
// Dans un composable (setup context)
const api = useApi() // → instance Axios avec JWT auto

// GET
const res = await api.get('/products')
const products = res.data.data // { success, data }

// POST
const res = await api.post('/orders', orderDto)

// Avec gestion d'erreur
try {
  const res = await api.post('/auth/login', credentials)
  authStore.setAuth(res.data.data.token, res.data.data.user)
} catch {
  // useApi intercepte l'erreur et affiche une notification automatiquement
}
```

---

### 6. Tailwind — Design tokens

```vue
<!-- Utiliser uniquement les tokens du preset, jamais de valeurs arbitraires -->

<!-- Fond principal -->
<div class="bg-ivoire">

<!-- Texte -->
<p class="font-body text-brun-cacao">Corps de texte</p>
<h1 class="font-display text-brun-cacao italic">Titre</h1>

<!-- Bouton primaire -->
<button class="bg-brun-cacao text-papier px-4 py-2 font-body">
  Ajouter au panier
</button>

<!-- Prix -->
<span class="font-body text-dore">29,90 €</span>

<!-- Badge nouveau -->
<span class="font-label text-dore border border-dore px-3 py-1 uppercase tracking-widest text-xs">
  Nouveau
</span>
```

Ou avec les composants partagés :
```vue
import { Button, Badge } from '@carre-ivoire/ui'

<Button variant="primary">Ajouter au panier</Button>
<Badge variant="accent">Nouveau</Badge>
```

---

Voir aussi : `ARCHITECTURE.md` · `CONTRIBUTING.md`
