<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useHead } from '@unhead/vue'
import { useProducts, useCategories } from '@carre-ivoire/composables'
import { Button } from '@carre-ivoire/ui'
import ProductCard from '@/components/product/ProductCard.vue'

useHead({
  title: 'Boutique — Carré Ivoire',
  meta: [
    { name: 'description', content: 'Découvrez notre catalogue de chocolats artisanaux : carrés signature, tablettes grand cru, ganaches et gourmandises.' },
    { property: 'og:title', content: 'Boutique — Carré Ivoire' },
    { property: 'og:type', content: 'website' },
  ],
})

const { result, isLoading, fetch } = useProducts({ limit: 12 })
const { categories } = useCategories()

const selectedCategoryId = ref<number | undefined>()
const searchTerm = ref('')
let searchTimeout: ReturnType<typeof setTimeout> | undefined

const SORT_OPTIONS = [
  { value: 'display_order', label: 'Nouveauté', apiValue: 'display_order' as const },
  { value: 'price_asc', label: 'Prix croissant', apiValue: 'price_asc' as const },
  { value: 'price_desc', label: 'Prix décroissant', apiValue: 'price_desc' as const },
]

const sort = ref('display_order')
const sortOpen = ref(false)

const currentSort = computed(() => SORT_OPTIONS.find((s) => s.value === sort.value)!)
const sortedProducts = computed(() => result.value.items)

function applyFilters() {
  fetch({
    search: searchTerm.value.trim() || undefined,
    categoryId: selectedCategoryId.value,
    sort: currentSort.value.apiValue,
    limit: 12,
  })
}

function filterByCategory(categoryId?: number) {
  selectedCategoryId.value = categoryId
  applyFilters()
}

watch(searchTerm, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(applyFilters, 350)
})

function closeSort(e: MouseEvent) {
  if (!(e.target as Element)?.closest('[data-sort]')) sortOpen.value = false
}

onMounted(() => document.addEventListener('click', closeSort))
onUnmounted(() => {
  document.removeEventListener('click', closeSort)
  if (searchTimeout) clearTimeout(searchTimeout)
})
</script>

<template>
  <div style="padding: 120px clamp(20px, 6vw, 104px) clamp(80px, 10vw, 128px)">

    <!-- En-tête -->
    <div
      class="mb-12 pb-8"
      style="border-bottom: 1px solid var(--cacao-a12)"
    >
      <span class="ci-eyebrow">Boutique</span>
      <h1
        class="mt-4 font-serif font-medium text-cacao"
        style="font-size: clamp(40px, 6vw, 80px); line-height: 0.95; letter-spacing: -0.01em"
      >
        Chaque carré,<br />
        <em class="text-cacao-2">une origine.</em>
      </h1>
    </div>

    <!-- Barre de recherche -->
    <div
      class="mb-8 flex items-center gap-3"
      style="border-bottom: 1px solid var(--cacao-a24); max-width: 480px"
    >
      <svg
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="square"
        stroke-linejoin="miter"
        viewBox="0 0 16 16"
        class="shrink-0 text-cacao-2"
      >
        <circle cx="6.5" cy="6.5" r="5" />
        <line x1="10.5" y1="10.5" x2="15" y2="15" />
      </svg>
      <input
        v-model="searchTerm"
        type="search"
        placeholder="Rechercher un chocolat…"
        class="flex-1 bg-transparent py-2.5 font-sans text-[14px] text-cacao outline-none placeholder:text-cacao-2 placeholder:opacity-50"
      />
      <button
        v-if="searchTerm"
        type="button"
        class="shrink-0 font-sans text-[11px] uppercase tracking-[0.1em] text-cacao-2 transition-opacity hover:opacity-70"
        @click="searchTerm = ''"
      >
        Effacer
      </button>
    </div>

    <!-- Filtres + tri -->
    <div class="mb-12 flex flex-wrap items-start justify-between gap-4">

      <!-- Filtres catégories -->
      <div class="flex flex-wrap gap-x-6 gap-y-3" style="max-width: 82%">
        <button
          class="flex cursor-pointer items-baseline gap-1.5 border-b pb-1 font-sans text-[12px] tracking-[0.02em] transition-[border-color,color,opacity] duration-180"
          :class="selectedCategoryId === undefined
            ? 'border-cacao text-cacao'
            : 'border-transparent text-cacao-2 hover:border-cacao hover:text-cacao'"
          @click="filterByCategory(undefined)"
        >
          tous les produits
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="flex cursor-pointer items-baseline gap-1.5 border-b pb-1 font-sans text-[12px] tracking-[0.02em] transition-[border-color,color,opacity] duration-180"
          :class="selectedCategoryId === cat.id
            ? 'border-cacao text-cacao'
            : 'border-transparent text-cacao-2 hover:border-cacao hover:text-cacao'"
          @click="filterByCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Tri -->
      <div class="relative" data-sort>
        <button
          class="flex items-center gap-1.5 font-sans text-[12px] text-cacao-2"
          @click.stop="sortOpen = !sortOpen"
        >
          <span>Trier par</span>
          <span
            class="flex items-center gap-1.5 pb-0.5 text-cacao"
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
          style="border: 1px solid var(--cacao-a12); min-width: 172px"
        >
          <button
            v-for="opt in SORT_OPTIONS"
            :key="opt.value"
            class="block w-full px-4 py-2.5 text-left font-sans text-[12px] tracking-[0.02em] transition-colors duration-180 hover:bg-ivoire"
            :class="sort === opt.value ? 'text-cacao' : 'text-cacao-2'"
            @click="sort = opt.value; sortOpen = false; applyFilters()"
          >{{ opt.label }}</button>
        </div>
      </div>
    </div>

    <!-- Label résultat recherche -->
    <div
      v-if="searchTerm && !isLoading"
      class="mb-8 font-sans text-[12px] text-cacao-2"
    >
      {{ result.total }} résultat{{ result.total !== 1 ? 's' : '' }} pour
      <span class="text-cacao">&laquo;&nbsp;{{ searchTerm }}&nbsp;&raquo;</span>
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
      <span class="ci-eyebrow">{{ searchTerm ? 'Aucun résultat' : 'Bientôt' }}</span>
      <h2
        class="mx-auto mt-4 font-serif font-medium"
        style="font-size: clamp(28px, 3.5vw, 44px); line-height: 1.1; max-width: 520px"
      >
        <template v-if="searchTerm">
          <em class="text-cacao-2">Aucun chocolat</em>
          <span class="text-cacao"> ne correspond à cette recherche.</span>
        </template>
        <template v-else>
          <em class="text-cacao-2">Cette collection</em>
          <span class="text-cacao"> arrive dans nos vitrines.</span>
        </template>
      </h2>
      <p class="mx-auto mb-8 mt-4 max-w-[420px] font-sans text-[15px] leading-relaxed text-cacao-2">
        <template v-if="searchTerm">
          Essayez un autre terme ou parcourez toutes nos créations.
        </template>
        <template v-else>
          Inscrivez-vous à la lettre pour être prévenu de sa sortie.
        </template>
      </p>
      <Button v-if="searchTerm" variant="secondary" size="sm" @click="searchTerm = ''">
        Voir tout le catalogue
      </Button>
      <Button v-else variant="secondary" size="sm">
        Me prévenir
      </Button>
    </div>

  </div>
</template>
