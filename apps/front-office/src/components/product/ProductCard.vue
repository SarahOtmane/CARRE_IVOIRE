<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export interface Product {
  id: string
  name: string
  origin: string
  price: number
  image: string
  badge?: string | null
}

const props = defineProps<{ product: Product }>()
const router = useRouter()

const hovered = ref(false)

const badgeVariants: Record<string, string> = {
  'Nouveau':         'bg-papier text-brun-cacao border border-[var(--cacao-a24)]',
  'Édition limitée': 'bg-brun-cacao text-ivoire',
  'Signature':       'text-dore border border-dore',
}
</script>

<template>
  <article
    class="cursor-pointer"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="router.push('/produits/' + product.id)"
  >
    <!-- Image 1:1 sur fond papier -->
    <div class="relative overflow-hidden bg-papier" style="aspect-ratio: 1/1">
      <!-- Badge -->
      <div
        v-if="product.badge"
        class="absolute left-3 top-3 z-10 font-sans text-[9px] uppercase tracking-[0.22em]"
        :class="badgeVariants[product.badge] ?? 'bg-papier text-brun-cacao border border-[var(--cacao-a24)]'"
        style="padding: 5px 9px"
      >{{ product.badge }}</div>

      <!-- Image -->
      <img
        :src="product.image"
        :alt="product.name"
        class="h-full w-full object-cover transition-transform duration-800"
        :style="{ transform: hovered ? 'scale(1.03)' : 'scale(1)' }"
      />

      <!-- Overlay CTA sur hover -->
      <div
        class="absolute inset-x-0 bottom-0 bg-brun-cacao py-3.5 text-center font-sans text-[11px] uppercase tracking-[0.18em] text-ivoire transition-transform duration-400"
        :style="{ transform: hovered ? 'translateY(0)' : 'translateY(100%)' }"
      >
        Voir le produit
      </div>
    </div>

    <!-- Infos produit -->
    <div class="pt-5">
      <span class="ci-eyebrow">{{ product.origin }}</span>
      <div class="mt-1.5 font-serif text-[22px] leading-[1.15] tracking-[-0.005em] text-brun-cacao">
        {{ product.name }}
      </div>
      <div class="mt-2 font-sans text-[13px] text-dore" style="letter-spacing: 0.02em; font-variant-numeric: tabular-nums">
        {{ product.price.toFixed(2).replace('.', ',') }} €
      </div>
    </div>
  </article>
</template>
