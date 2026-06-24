<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ProductResponse } from '@carre-ivoire/types'
import { useAuth, useFavorites } from '@carre-ivoire/composables'

const props = defineProps<{ product: ProductResponse }>()
const router = useRouter()
const { isAuthenticated } = useAuth()
const { isFavorite, add, remove } = useFavorites()

const hovered = ref(false)
const togglingFavorite = ref(false)

const isFav = computed(() => isFavorite(props.product.id))

async function toggleFavorite(event: MouseEvent) {
  event.stopPropagation()
  if (!isAuthenticated.value) {
    router.push({ path: '/connexion', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }
  if (togglingFavorite.value) return
  togglingFavorite.value = true
  try {
    if (isFav.value) {
      await remove(props.product.id)
    } else {
      await add(props.product.id)
    }
  } finally {
    togglingFavorite.value = false
  }
}

function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2).replace('.', ',')} €`
}

const displayPrice = computed(() => {
  if (props.product.variants.length === 0) return formatPrice(props.product.price)
  const cheapest = Math.min(...props.product.variants.map((v) => v.price))
  return `À partir de ${formatPrice(cheapest)}`
})

const badgeVariants: Record<string, string> = {
  'NOUVEAU':         'bg-papier text-cacao border border-[var(--cacao-a24)]',
  'Édition limitée': 'bg-cacao text-ivoire',
  'Signature':       'text-dore border border-dore',
}
</script>

<template>
  <article
    class="cursor-pointer"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="router.push('/produits/' + product.slug)"
  >
    <!-- Image 1:1 sur fond papier -->
    <div class="relative overflow-hidden bg-papier" style="aspect-ratio: 1/1">
      <!-- Badge -->
      <div
        v-if="product.badge"
        class="absolute left-3 top-3 z-10 font-sans text-[9px] uppercase tracking-[0.22em]"
        :class="badgeVariants[product.badge] ?? 'bg-papier text-cacao border border-[var(--cacao-a24)]'"
        style="padding: 5px 9px"
      >{{ product.badge }}</div>

      <!-- Favori -->
      <button
        type="button"
        class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center bg-papier transition-opacity duration-180 disabled:cursor-not-allowed disabled:opacity-60"
        :aria-label="isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        :aria-pressed="isFav"
        :disabled="togglingFavorite"
        @click="toggleFavorite"
      >
        <svg width="16" height="16" :fill="isFav ? 'var(--dore)' : 'none'" stroke="var(--brun-cacao)" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
          <use href="/assets/icons/sprite.svg#ci-heart" />
        </svg>
      </button>

      <!-- Image -->
      <img
        :src="product.imageUrl ?? '/assets/placeholder.svg'"
        :alt="product.name"
        loading="lazy"
        decoding="async"
        width="400"
        height="400"
        class="h-full w-full object-cover transition-transform duration-800"
        :style="{ transform: hovered ? 'scale(1.03)' : 'scale(1)' }"
      />

      <!-- Overlay CTA sur hover -->
      <div
        class="absolute inset-x-0 bottom-0 bg-cacao py-3.5 text-center font-sans text-[11px] uppercase tracking-[0.18em] text-ivoire transition-transform duration-400"
        :style="{ transform: hovered ? 'translateY(0)' : 'translateY(100%)' }"
      >
        Voir le produit
      </div>
    </div>

    <!-- Infos produit -->
    <div class="pt-5">
      <span v-if="product.shortDescription" class="ci-eyebrow">{{ product.shortDescription }}</span>
      <div class="mt-1.5 font-serif text-[22px] leading-[1.15] tracking-[-0.005em] text-cacao">
        {{ product.name }}
      </div>
      <div class="mt-2 font-sans text-[13px] text-dore" style="letter-spacing: 0.02em; font-variant-numeric: tabular-nums">
        {{ displayPrice }}
      </div>
    </div>
  </article>
</template>
