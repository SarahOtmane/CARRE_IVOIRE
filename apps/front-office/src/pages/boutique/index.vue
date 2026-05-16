<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProducts, useCategories } from '@carre-ivoire/composables'
import ProductCard from '@/components/product/ProductCard.vue'

const { result, isLoading, fetch } = useProducts({ limit: 12 })
const { categories } = useCategories()

const selectedCategoryId = ref<number | undefined>()

const SORT_OPTIONS = [
  { value: 'nouveaute', label: 'Nouveauté' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
]

const sort = ref('nouveaute')
const sortOpen = ref(false)

const currentSort = computed(() => SORT_OPTIONS.find((s) => s.value === sort.value)!)

const sortedProducts = computed(() => {
  const list = result.value.items
  if (sort.value === 'prix-asc') return [...list].sort((a, b) => a.price - b.price)
  if (sort.value === 'prix-desc') return [...list].sort((a, b) => b.price - a.price)
  return list
})

function filterByCategory(categoryId?: number) {
  selectedCategoryId.value = categoryId
  fetch({ categoryId, limit: 12 })
}

function closeSort(e: MouseEvent) {
  if (!(e.target as Element)?.closest('[data-sort]')) sortOpen.value = false
}

onMounted(() => document.addEventListener('click', closeSort))
onUnmounted(() => document.removeEventListener('click', closeSort))
</script>

<template>
  <div style="padding: 120px clamp(20px, 6vw, 104px) clamp(80px, 10vw, 128px)">

    <!-- En-tête -->
    <div
      class="mb-12 pb-8"
      style="border-bottom: 1px solid var(--border)"
    >
      <span class="ci-eyebrow">Boutique</span>
      <h1
        class="mt-4 font-serif font-medium text-brun-cacao"
        style="font-size: clamp(40px, 6vw, 80px); line-height: 0.95; letter-spacing: -0.01em"
      >
        Chaque carré,<br/>
        <em class="text-brun-cacao-2">une origine.</em>
      </h1>
    </div>

    <!-- Filtres + tri -->
    <div class="mb-12 flex flex-wrap items-start justify-between gap-4">

      <!-- Filtres catégories -->
      <div class="flex flex-wrap gap-x-6 gap-y-3" style="max-width: 82%">
        <button
          class="flex cursor-pointer items-baseline gap-1.5 border-b pb-1 font-sans text-[12px] tracking-[0.02em] transition-[border-color,color,opacity] duration-180"
          :class="selectedCategoryId === undefined
            ? 'border-brun-cacao text-brun-cacao'
            : 'border-transparent text-brun-cacao-2 hover:border-brun-cacao hover:text-brun-cacao'"
          @click="filterByCategory(undefined)"
        >
          tous les produits
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="flex cursor-pointer items-baseline gap-1.5 border-b pb-1 font-sans text-[12px] tracking-[0.02em] transition-[border-color,color,opacity] duration-180"
          :class="selectedCategoryId === cat.id
            ? 'border-brun-cacao text-brun-cacao'
            : 'border-transparent text-brun-cacao-2 hover:border-brun-cacao hover:text-brun-cacao'"
          @click="filterByCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Tri -->
      <div class="relative" data-sort>
        <button
          class="flex items-center gap-1.5 font-sans text-[12px] text-brun-cacao-2"
          @click.stop="sortOpen = !sortOpen"
        >
          <span>Trier par</span>
          <span
            class="flex items-center gap-1.5 pb-0.5 text-brun-cacao"
            style="border-bottom: 1px solid var(--brun-cacao)"
          >
            {{ currentSort.label }}
            <svg
              width="12" height="12" fill="none" stroke="currentColor"
              stroke-width="1.25" stroke-linecap="square" viewBox="0 0 12 12"
              class="transition-transform duration-180"
              :style="{ transform: sortOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
            >
              <polyline points="2,4 6,8 10,4" />
            </svg>
          </span>
        </button>

        <div
          v-if="sortOpen"
          class="absolute right-0 top-full z-20 mt-1 bg-papier"
          style="border: 1px solid var(--border); min-width: 172px"
        >
          <button
            v-for="opt in SORT_OPTIONS"
            :key="opt.value"
            class="block w-full px-4 py-2.5 text-left font-sans text-[12px] tracking-[0.02em] transition-colors duration-180 hover:bg-ivoire"
            :class="sort === opt.value ? 'text-brun-cacao' : 'text-brun-cacao-2'"
            @click="sort = opt.value; sortOpen = false"
          >{{ opt.label }}</button>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="py-24 text-center">
      <span class="ci-eyebrow">Chargement</span>
    </div>

    <!-- Grille produits -->
    <div
      v-else-if="sortedProducts.length > 0"
      class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <ProductCard
        v-for="product in sortedProducts"
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
      <p class="mx-auto mb-8 mt-4 max-w-[420px] font-sans text-[15px] leading-relaxed text-brun-cacao-2">
        Inscrivez-vous à la lettre pour être prévenu de sa sortie.
      </p>
      <button
        class="pb-0.5 font-sans text-[13px] text-brun-cacao"
        style="border-bottom: 1px solid var(--brun-cacao)"
      >
        Me prévenir →
      </button>
    </div>

  </div>
</template>
