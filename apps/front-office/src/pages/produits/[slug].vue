<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProduct, useProducts } from '@carre-ivoire/composables'
import { useCartStore } from '@carre-ivoire/stores'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const slug = route.params.slug as string
const { product, isLoading } = useProduct(slug)

const { result: relatedResult } = useProducts({ limit: 3 })

const relatedProducts = computed(() => {
  if (!product.value) return relatedResult.value.items.slice(0, 3)
  return relatedResult.value.items.filter((p) => p.id !== product.value!.id).slice(0, 3)
})

const quantity = ref(1)
const tab = ref<'composition' | 'degustation' | 'conservation'>('composition')
const added = ref(false)

const compositionItems = computed(() => {
  if (!product.value?.ingredients) return []
  return product.value.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
})

function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2).replace('.', ',')} €`
}

const unitTotal = computed(() => {
  if (!product.value) return 0
  return product.value.price * quantity.value
})

function addToCart() {
  if (!product.value) return
  cartStore.addItem({
    productId: product.value.id,
    name: product.value.name,
    imageUrl: product.value.imageUrl ?? '',
    price: product.value.price / 100,
    quantity: quantity.value,
  })
  added.value = true
  setTimeout(() => { added.value = false }, 2000)
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
      class="mt-4 font-serif text-brun-cacao"
      style="font-size: clamp(36px, 6vw, 72px); line-height: 1; font-weight: 500"
    >
      Cette fiche produit n'existe pas.
    </h1>
    <button
      class="mt-8 border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire"
      @click="router.push('/boutique')"
    >
      Retour à la boutique
    </button>
  </div>

  <!-- Fiche produit -->
  <div v-else>
    <nav
      class="px-5 pt-14 font-sans text-[11px] uppercase tracking-[0.18em] text-brun-cacao-2 lg:px-[104px] lg:pt-16"
    >
      <button class="transition-opacity duration-180 hover:opacity-60" type="button" @click="router.push('/')">accueil</button>
      <span class="mx-3">·</span>
      <button class="transition-opacity duration-180 hover:opacity-60" type="button" @click="router.push('/boutique')">boutique</button>
      <span class="mx-3">·</span>
      <span class="text-brun-cacao">{{ product.name }}</span>
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
            class="h-full w-full object-cover"
          />
        </div>
      </div>

      <!-- Infos -->
      <div>
        <div v-if="product.badge" class="mb-5">
          <span
            class="inline-block border px-3 py-1 font-sans text-[9px] uppercase tracking-[0.22em] border-[var(--cacao-a24)] bg-papier text-brun-cacao"
          >
            {{ product.badge }}
          </span>
        </div>

        <span class="ci-eyebrow">{{ product.category?.name ?? 'Carré Ivoire' }}</span>
        <h1
          class="mt-4 font-serif text-brun-cacao"
          style="font-size: clamp(44px, 6vw, 80px); line-height: 0.95; font-weight: 500; letter-spacing: -0.02em"
        >
          {{ product.name }}
        </h1>
        <p
          v-if="product.shortDescription"
          class="mt-5 max-w-[520px] font-sans text-[18px] leading-[1.7] text-brun-cacao-2"
        >
          {{ product.shortDescription }}
        </p>

        <!-- Quantité + panier -->
        <div class="mt-8 border-t pt-6" style="border-color: var(--cacao-a12)">
          <div class="flex items-center gap-5">
            <span class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2">Quantité</span>
            <div class="flex items-center border border-brun-cacao">
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center text-brun-cacao"
                @click="quantity = Math.max(1, quantity - 1)"
              >
                −
              </button>
              <span class="min-w-10 px-2 text-center font-sans text-[13px] tabular-nums text-brun-cacao">{{ quantity }}</span>
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center text-brun-cacao"
                @click="quantity += 1"
              >
                +
              </button>
            </div>
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              class="border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
              @click="addToCart"
            >
              Ajouter au panier — {{ formatPrice(unitTotal) }}
            </button>
            <button
              type="button"
              class="border border-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-brun-cacao transition-all duration-180 hover:bg-brun-cacao hover:text-ivoire active:translate-y-px"
              @click="router.push('/panier')"
            >
              Voir le panier
            </button>
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
              :class="tab === 'composition' ? 'border-brun-cacao text-brun-cacao' : 'border-transparent text-brun-cacao-3'"
              @click="tab = 'composition'"
            >Composition</button>
            <button
              type="button"
              class="border-b pb-1 font-sans text-[11px] uppercase tracking-[0.22em]"
              :class="tab === 'degustation' ? 'border-brun-cacao text-brun-cacao' : 'border-transparent text-brun-cacao-3'"
              @click="tab = 'degustation'"
            >Dégustation</button>
            <button
              type="button"
              class="border-b pb-1 font-sans text-[11px] uppercase tracking-[0.22em]"
              :class="tab === 'conservation' ? 'border-brun-cacao text-brun-cacao' : 'border-transparent text-brun-cacao-3'"
              @click="tab = 'conservation'"
            >Conservation</button>
          </div>

          <div class="pt-5">
            <ul v-if="tab === 'composition' && compositionItems.length" class="space-y-0">
              <li
                v-for="(item, index) in compositionItems"
                :key="item"
                class="flex items-baseline justify-between border-b py-3 font-sans text-[14px] text-brun-cacao"
                style="border-color: var(--cacao-a08)"
              >
                <span>{{ item }}</span>
                <span class="text-brun-cacao-3">0{{ index + 1 }}</span>
              </li>
            </ul>
            <p v-else-if="tab === 'composition'" class="font-sans text-[15px] leading-[1.8] text-brun-cacao-2">
              Composition non renseignée.
            </p>

            <p v-else-if="tab === 'degustation'" class="max-w-[540px] font-sans text-[15px] leading-[1.8] text-brun-cacao-2">
              {{ product.description ?? product.shortDescription ?? 'Notes de dégustation à venir.' }}
            </p>

            <p v-else class="max-w-[540px] font-sans text-[15px] leading-[1.8] text-brun-cacao-2">
              {{ product.allergens ?? 'Informations de conservation à venir.' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Histoire -->
    <section v-if="product.description" class="bg-rose-poudre px-5 py-16 lg:px-[104px] lg:py-24">
      <div class="mx-auto max-w-[760px] text-center">
        <span class="ci-eyebrow">L'histoire</span>
        <h2
          class="mt-5 font-serif text-brun-cacao"
          style="font-size: clamp(32px, 4vw, 56px); line-height: 1.05; font-style: italic; font-weight: 500"
        >
          « {{ product.name }} »
        </h2>
        <p class="mt-6 font-sans text-[17px] leading-[1.8] text-brun-cacao-2">
          {{ product.description }}
        </p>
      </div>
    </section>

    <!-- Produits liés -->
    <section v-if="relatedProducts.length" class="px-5 py-16 lg:px-[104px] lg:py-24">
      <div class="mb-8">
        <span class="ci-eyebrow">Aussi dans la maison</span>
        <h2
          class="mt-4 font-serif text-brun-cacao"
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
