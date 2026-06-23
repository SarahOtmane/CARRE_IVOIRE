<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useProducts } from '@carre-ivoire/composables'
import ProductCard from '@/components/product/ProductCard.vue'

const router = useRouter()
const { result } = useProducts({ limit: 3 })
</script>

<template>
  <section
    class="bg-rose-poudre"
    style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)"
  >
    <!-- En-tête -->
    <div class="mb-16 flex items-end justify-between">
      <div>
        <span class="ci-eyebrow-accent">02 — Signature</span>
        <h2
          class="mt-4 font-serif font-medium text-brun-cacao"
          style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
        >
          Nos carrés<br/>
          <em>de mars.</em>
        </h2>
      </div>
      <span class="font-sans text-[11px] uppercase tracking-[0.22em] text-brun-cacao-3">— II</span>
    </div>

    <!-- Grille produits -->
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <ProductCard
        v-for="product in result.items.slice(0, 3)"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Lien vers boutique -->
    <div class="mt-16 text-center">
      <button
        class="border border-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-brun-cacao transition-all duration-180 hover:bg-brun-cacao hover:text-ivoire active:translate-y-px"
        @click="router.push('/boutique')"
      >
        Voir toute la boutique
      </button>
    </div>
  </section>
</template>
