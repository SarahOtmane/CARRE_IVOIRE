<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useProducts, useCategories } from '@carre-ivoire/composables'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const router = useRouter()

const { categories } = useCategories()
const { result, isLoading, fetch } = useProducts({ limit: 50 })

const slug = computed(() => route.params.categorie as string)

const currentCategory = computed(() =>
  categories.value.find((c) => c.slug === slug.value) ?? null,
)

useHead(computed(() => ({
  title: currentCategory.value ? `${currentCategory.value.name} — Carré Ivoire` : 'Boutique — Carré Ivoire',
  meta: [
    { name: 'description', content: currentCategory.value?.description ?? 'Chocolats artisanaux Carré Ivoire.' },
    { property: 'og:title', content: currentCategory.value?.name ?? 'Carré Ivoire' },
    { property: 'og:type', content: 'website' },
  ],
})))

watch(
  [categories, slug],
  ([cats, s]) => {
    const cat = cats.find((c) => c.slug === s)
    if (cats.length > 0 && !cat) {
      router.replace({ name: 'boutique' })
      return
    }
    if (cat) fetch({ categoryId: cat.id, limit: 50 })
  },
  { immediate: true },
)
</script>

<template>
  <div style="padding: 120px clamp(20px, 6vw, 104px) clamp(80px, 10vw, 128px)">

    <!-- En-tête -->
    <div class="mb-12 pb-8" style="border-bottom: 1px solid var(--border)">
      <RouterLink
        to="/boutique"
        class="mb-6 inline-flex items-center gap-2 font-sans text-[12px] tracking-[0.06em] text-brun-cacao-2 transition-colors duration-180 hover:text-brun-cacao"
      >
        ← Boutique
      </RouterLink>

      <div v-if="currentCategory">
        <span class="ci-eyebrow">{{ currentCategory.name }}</span>
        <h1
          class="mt-4 font-serif font-medium text-brun-cacao"
          style="font-size: clamp(40px, 6vw, 80px); line-height: 0.95; letter-spacing: -0.01em"
        >
          <em class="text-brun-cacao-2">{{ currentCategory.name }}</em>
        </h1>
        <p
          v-if="currentCategory.description"
          class="mt-4 max-w-[560px] font-sans text-[15px] leading-relaxed text-brun-cacao-2"
        >{{ currentCategory.description }}</p>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="py-24 text-center">
      <span class="ci-eyebrow">Chargement</span>
    </div>

    <!-- Grille produits -->
    <div
      v-else-if="result.items.length > 0"
      class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ProductCard
        v-for="product in result.items"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- État vide -->
    <div
      v-else
      class="py-24 text-center"
      style="border-top: 1px solid var(--cacao-a08)"
    >
      <span class="ci-eyebrow">Bientôt</span>
      <h2
        class="mx-auto mt-4 font-serif font-medium"
        style="font-size: clamp(28px, 3.5vw, 44px); line-height: 1.1; max-width: 520px"
      >
        <em class="text-brun-cacao-2">Cette collection</em>
        <span class="text-brun-cacao"> arrive dans nos vitrines.</span>
      </h2>
    </div>

  </div>
</template>
