<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useAuth, useFavorites, useProduct, useProducts } from '@carre-ivoire/composables'
import { useCartStore } from '@carre-ivoire/stores'
import { Button, Badge } from '@carre-ivoire/ui'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const { isAuthenticated } = useAuth()
const { isFavorite, add: addFavorite, remove: removeFavorite } = useFavorites()
const togglingFavorite = ref(false)

const slug = route.params.slug as string
const { product, isLoading } = useProduct(slug)

const { result: relatedResult, fetch: refetchRelated } = useProducts({ limit: 4 })

// Refetch related products with the current product's category once loaded
watch(product, (p) => {
  if (p?.categoryId) refetchRelated({ categoryId: p.categoryId, limit: 4 })
}, { immediate: false })

useHead(computed(() => ({
  title: product.value ? `${product.value.name} — Carré Ivoire` : 'Carré Ivoire',
  meta: [
    { name: 'description', content: product.value?.shortDescription ?? 'Chocolaterie artisanale Carré Ivoire.' },
    { property: 'og:title', content: product.value?.name ?? 'Carré Ivoire' },
    { property: 'og:description', content: product.value?.shortDescription ?? '' },
    { property: 'og:image', content: product.value?.imageUrl ?? '' },
    { property: 'og:type', content: 'product' },
  ],
})))

const relatedProducts = computed(() => {
  if (!product.value) return relatedResult.value.items.slice(0, 3)
  return relatedResult.value.items.filter((p) => p.id !== product.value!.id).slice(0, 3)
})

const quantity = ref(1)
const tab = ref<'composition' | 'degustation' | 'conservation' | 'allergenes'>('composition')
const added = ref(false)
const selectedVariantId = ref<number | null>(null)

watch(
  () => product.value?.variants,
  (variants) => {
    if (!variants || variants.length === 0) {
      selectedVariantId.value = null
      return
    }
    const firstAvailable = variants.find((v) => v.stockStatus !== 'out_of_stock') ?? variants[0]
    selectedVariantId.value = firstAvailable.id
  },
  { immediate: true },
)

const selectedVariant = computed(() =>
  product.value?.variants.find((v) => v.id === selectedVariantId.value) ?? null,
)

const compositionItems = computed(() => {
  if (!product.value?.ingredients) return []
  return product.value.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
})

function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2).replace('.', ',')} €`
}

// Prix HT — affiché partout sur la fiche produit. La TVA ne s'applique qu'au moment de l'ajout au panier.
const activePrice = computed(() => selectedVariant.value?.price ?? product.value?.price ?? 0)

const unitTotal = computed(() => activePrice.value * quantity.value)

function addToCart() {
  if (!product.value) return
  const taxRate = selectedVariant.value?.taxRate ?? product.value.taxRate
  const priceTtc = taxRate ? Math.round(activePrice.value * (1 + taxRate.rate / 100)) : activePrice.value
  cartStore.addItem({
    productId: product.value.id,
    variantId: selectedVariant.value?.id,
    name: product.value.name,
    imageUrl: product.value.imageUrl ?? '',
    price: priceTtc / 100,
    quantity: quantity.value,
    format: selectedVariant.value?.label,
    taxRateId: taxRate?.id,
    taxRateLabel: taxRate?.label,
    taxRatePercent: taxRate?.rate,
  })
  added.value = true
  setTimeout(() => { added.value = false }, 2000)
}

const isFav = computed(() => (product.value ? isFavorite(product.value.id) : false))

async function toggleFavorite() {
  if (!product.value) return
  if (!isAuthenticated.value) {
    router.push({ path: '/connexion', query: { redirect: route.fullPath } })
    return
  }
  if (togglingFavorite.value) return
  togglingFavorite.value = true
  try {
    if (isFav.value) {
      await removeFavorite(product.value.id)
    } else {
      await addFavorite(product.value.id)
    }
  } finally {
    togglingFavorite.value = false
  }
}
</script>

<template>
  <!-- Loader -->
  <div v-if="isLoading" class="px-5 py-[120px] text-center lg:px-[104px]">
    <span class="ci-eyebrow">Chargement</span>
  </div>

  <!-- Produit introuvable -->
  <div v-else-if="!product" class="px-5 py-[120px] lg:px-[104px]">
    <span class="ci-eyebrow">Introuvable</span>
    <h1
      class="mt-4 font-serif text-cacao"
      style="font-size: clamp(36px, 6vw, 72px); line-height: 1; font-weight: 500"
    >
      Cette fiche produit n'existe pas.
    </h1>
    <Button class="mt-8" @click="router.push('/boutique')">
      Retour à la boutique
    </Button>
  </div>

  <!-- Fiche produit -->
  <div v-else>
    <nav
      class="px-5 pt-14 font-sans text-[11px] uppercase tracking-[0.18em] text-cacao-2 lg:px-[104px] lg:pt-16"
    >
      <button class="transition-opacity duration-180 hover:opacity-60" type="button" @click="router.push('/')">accueil</button>
      <span class="mx-3">·</span>
      <button class="transition-opacity duration-180 hover:opacity-60" type="button" @click="router.push('/boutique')">boutique</button>
      <span class="mx-3">·</span>
      <span class="text-cacao">{{ product.name }}</span>
    </nav>

    <section
      class="grid grid-cols-1 gap-14 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 lg:px-[104px] lg:py-14"
    >
      <!-- Visuel -->
      <div class="lg:sticky lg:top-[96px] lg:self-start">
        <div class="overflow-hidden bg-papier" style="aspect-ratio: 1 / 1">
          <img
            :src="product.imageUrl ?? '/assets/placeholder.svg'"
            :alt="product.name"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover"
          />
        </div>
      </div>

      <!-- Infos -->
      <div>
        <div v-if="product.badge" class="mb-5">
          <Badge variant="accent">{{ product.badge }}</Badge>
        </div>

        <div class="flex items-start justify-between gap-4">
          <span class="ci-eyebrow">{{ product.category?.name ?? 'Carré Ivoire' }}</span>
          <button
            type="button"
            class="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-[var(--cacao-a24)] transition-opacity duration-180 disabled:cursor-not-allowed disabled:opacity-60"
            :aria-label="isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'"
            :aria-pressed="isFav"
            :disabled="togglingFavorite"
            @click="toggleFavorite"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
              <path
                d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"
                :fill="isFav ? 'var(--dore)' : 'none'"
                :stroke="isFav ? 'var(--dore)' : 'var(--brun-cacao)'"
              />
            </svg>
          </button>
        </div>
        <h1
          class="mt-4 font-serif text-cacao"
          style="font-size: clamp(44px, 6vw, 80px); line-height: 0.95; font-weight: 500; letter-spacing: -0.02em"
        >
          {{ product.name }}
        </h1>
        <p
          v-if="product.shortDescription"
          class="mt-5 max-w-[520px] font-sans text-[18px] leading-[1.7] text-cacao-2"
        >
          {{ product.shortDescription }}
        </p>

        <!-- Variantes -->
        <div v-if="product.variants.length > 0" class="mt-8 border-t pt-6" style="border-color: var(--cacao-a12)">
          <span class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">Format</span>
          <div class="mt-4 flex flex-wrap gap-3">
            <button
              v-for="variant in product.variants"
              :key="variant.id"
              type="button"
              :disabled="variant.stockStatus === 'out_of_stock'"
              class="border px-4 py-3 font-sans text-[13px] transition-all duration-180 disabled:cursor-not-allowed disabled:opacity-40"
              :class="
                selectedVariantId === variant.id
                  ? 'border-cacao bg-cacao text-ivoire'
                  : 'border-cacao text-cacao'
              "
              @click="selectedVariantId = variant.id"
            >
              {{ variant.label }} — {{ formatPrice(variant.price) }}
              <span v-if="variant.stockStatus === 'out_of_stock'" class="ml-1 text-[11px] italic">(rupture)</span>
            </button>
          </div>
        </div>

        <!-- Quantité + panier -->
        <div class="mt-8 border-t pt-6" style="border-color: var(--cacao-a12)">
          <div class="flex items-center gap-5">
            <span class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">Quantité</span>
            <div class="flex items-center border border-cacao">
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center text-cacao"
                @click="quantity = Math.max(1, quantity - 1)"
              >
                −
              </button>
              <span class="min-w-10 px-2 text-center font-sans text-[13px] tabular-nums text-cacao">{{ quantity }}</span>
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center text-cacao"
                @click="quantity += 1"
              >
                +
              </button>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              :disabled="selectedVariant?.stockStatus === 'out_of_stock'"
              @click="addToCart"
            >
              Ajouter au panier — {{ formatPrice(unitTotal) }}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              @click="router.push('/panier')"
            >
              Voir le panier
            </Button>
            <span
              v-if="added"
              class="font-sans text-[12px] uppercase tracking-[0.14em] text-dore"
            >
              Produit ajouté
            </span>
          </div>
        </div>

        <!-- Onglets détail -->
        <div class="mt-10 border-t pt-6" style="border-color: var(--cacao-a12)">
          <div class="flex flex-wrap gap-6 border-b pb-4" style="border-color: var(--cacao-a12)">
            <button
              type="button"
              class="border-b pb-1 font-sans text-[11px] uppercase tracking-[0.22em]"
              :class="tab === 'composition' ? 'border-cacao text-cacao' : 'border-transparent text-cacao-3'"
              @click="tab = 'composition'"
            >Composition</button>
            <button
              type="button"
              class="border-b pb-1 font-sans text-[11px] uppercase tracking-[0.22em]"
              :class="tab === 'degustation' ? 'border-cacao text-cacao' : 'border-transparent text-cacao-3'"
              @click="tab = 'degustation'"
            >Dégustation</button>
            <button
              type="button"
              class="border-b pb-1 font-sans text-[11px] uppercase tracking-[0.22em]"
              :class="tab === 'conservation' ? 'border-cacao text-cacao' : 'border-transparent text-cacao-3'"
              @click="tab = 'conservation'"
            >Conservation</button>
            <button
              type="button"
              class="border-b pb-1 font-sans text-[11px] uppercase tracking-[0.22em]"
              :class="tab === 'allergenes' ? 'border-cacao text-cacao' : 'border-transparent text-cacao-3'"
              @click="tab = 'allergenes'"
            >Allergènes</button>
          </div>

          <div class="pt-5">
            <ul v-if="tab === 'composition' && compositionItems.length" class="space-y-0">
              <li
                v-for="(item, index) in compositionItems"
                :key="item"
                class="flex items-baseline justify-between border-b py-3 font-sans text-[14px] text-cacao"
                style="border-color: var(--cacao-a08)"
              >
                <span>{{ item }}</span>
                <span class="text-cacao-3">0{{ index + 1 }}</span>
              </li>
            </ul>
            <p v-else-if="tab === 'composition'" class="font-sans text-[15px] leading-[1.8] text-cacao-2">
              Composition non renseignée.
            </p>

            <p v-else-if="tab === 'degustation'" class="max-w-[540px] font-sans text-[15px] leading-[1.8] text-cacao-2">
              {{ product.description ?? product.shortDescription ?? 'Notes de dégustation à venir.' }}
            </p>

            <p v-else-if="tab === 'conservation'" class="max-w-[540px] font-sans text-[15px] leading-[1.8] text-cacao-2">
              Conserver dans un endroit frais et sec, à l'abri de la lumière et des odeurs. Température idéale : entre 16 et 18 °C.
            </p>

            <div v-else>
              <p v-if="product.allergens" class="max-w-[540px] font-sans text-[15px] leading-[1.8] text-cacao-2">
                {{ product.allergens }}
              </p>
              <p v-else class="font-sans text-[15px] leading-[1.8] text-cacao-2">
                Allergènes non renseignés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Histoire -->
    <section v-if="product.description" class="bg-rose-poudre px-5 py-16 lg:px-[104px] lg:py-24">
      <div class="mx-auto max-w-[760px] text-center">
        <span class="ci-eyebrow">L'histoire</span>
        <h2
          class="mt-5 font-serif text-cacao"
          style="font-size: clamp(32px, 4vw, 56px); line-height: 1.05; font-style: italic; font-weight: 500"
        >
          « {{ product.name }} »
        </h2>
        <p class="mt-6 font-sans text-[17px] leading-[1.8] text-cacao-2">
          {{ product.description }}
        </p>
      </div>
    </section>

    <!-- Produits liés -->
    <section v-if="relatedProducts.length" class="px-5 py-16 lg:px-[104px] lg:py-24">
      <div class="mb-8">
        <span class="ci-eyebrow">Aussi dans la maison</span>
        <h2
          class="mt-4 font-serif text-cacao"
          style="font-size: clamp(28px, 4vw, 48px); line-height: 1; font-weight: 500"
        >
          D'autres carrés.
        </h2>
      </div>
      <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          v-for="related in relatedProducts"
          :key="related.id"
          :product="related"
        />
      </div>
    </section>
  </div>
</template>
