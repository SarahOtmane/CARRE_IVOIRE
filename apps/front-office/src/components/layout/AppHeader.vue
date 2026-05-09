<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart.store'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const scrolled = ref(false)
const hovered = ref(false)
const boutiqueOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 40
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const isActive = computed(() => scrolled.value || hovered.value)

const navItems = [
  { id: 'boutique', label: 'boutique', path: '/boutique', hasMega: true },
  { id: 'histoire', label: 'notre histoire', path: '/histoire' },
  { id: 'engagements', label: 'nos engagements', path: '/engagements' },
  { id: 'evenements', label: 'nos événements', path: '/evenements' },
  { id: 'contact', label: 'nous contacter', path: '/contact' },
]

const boutiqueCats = [
  { label: 'Carrés Signature', slug: 'carres-signature' },
  { label: 'Mini Carrés', slug: 'mini-carres' },
  { label: 'Tablettes', slug: 'tablettes' },
  { label: 'Gourmandises', slug: 'gourmandises' },
  { label: 'Sablés', slug: 'sables' },
  { label: 'Mendiants', slug: 'mendiants' },
  { label: 'Oursons', slug: 'oursons' },
  { label: 'Chocobombs', slug: 'chocobombs' },
  { label: 'Pâtes à tartiner', slug: 'pates-a-tartiner' },
]

function navigate(path: string) {
  boutiqueOpen.value = false
  router.push(path)
}

function onNavEnter(item: typeof navItems[number]) {
  boutiqueOpen.value = item.hasMega === true
}

function onHeaderLeave() {
  hovered.value = false
  boutiqueOpen.value = false
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 flex flex-col transition-all duration-400"
    :class="isActive ? 'border-b border-[var(--cacao-a12)]' : 'border-b border-transparent'"
    :style="isActive
      ? { background: 'var(--header-glass)', backdropFilter: 'blur(16px)' }
      : { background: 'transparent' }"
    @mouseenter="hovered = true"
    @mouseleave="onHeaderLeave"
  >
    <!-- Barre principale -->
    <div class="flex h-[72px] items-center justify-between px-5 lg:px-[104px]">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3.5">
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center border border-brun-cacao font-serif text-[15px] font-medium text-brun-cacao"
        >CI</div>
        <span class="hidden font-serif text-[13px] font-medium tracking-[0.22em] text-brun-cacao lg:block">
          CARRÉ IVOIRE
        </span>
      </RouterLink>

      <!-- Navigation desktop -->
      <nav class="hidden items-center gap-7 lg:flex">
        <a
          v-for="item in navItems"
          :key="item.id"
          class="cursor-pointer border-b pb-0.5 font-sans text-[12px] tracking-[0.06em] text-brun-cacao transition-[border-color] duration-[240ms]"
          :class="(route.path.startsWith(item.path) && item.path !== '/') || (item.hasMega && boutiqueOpen)
            ? 'border-brun-cacao'
            : 'border-transparent'"
          @mouseenter="onNavEnter(item)"
          @click="navigate(item.path)"
        >{{ item.label }}</a>
      </nav>

      <!-- Icônes -->
      <div class="flex items-center gap-5 text-brun-cacao">
        <!-- Recherche -->
        <button class="flex cursor-pointer items-center hover:text-brun-cacao-2" aria-label="Rechercher">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter" viewBox="0 0 18 18">
            <circle cx="7.5" cy="7.5" r="5" />
            <line x1="11.2" y1="11.2" x2="16.5" y2="16.5" />
          </svg>
        </button>

        <!-- Compte -->
        <RouterLink to="/compte" class="flex items-center hover:text-brun-cacao-2" aria-label="Mon compte">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter" viewBox="0 0 18 18">
            <circle cx="9" cy="6" r="3" />
            <path d="M2.5 17c0-3.590 2.910-6.5 6.5-6.5s6.5 2.910 6.5 6.5" />
          </svg>
        </RouterLink>

        <!-- Panier -->
        <RouterLink to="/panier" class="flex items-center gap-1.5 hover:text-brun-cacao-2" aria-label="Panier">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter" viewBox="0 0 18 18">
            <path d="M1 1h2.5l2 9h9l2-9H17" />
            <circle cx="6" cy="15.5" r="1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="15.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          <span
            v-if="cartStore.count > 0"
            class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-brun-cacao font-sans text-[10px] text-ivoire"
          >{{ cartStore.count }}</span>
        </RouterLink>

        <!-- Burger mobile -->
        <button class="flex items-center lg:hidden" aria-label="Menu">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" viewBox="0 0 18 18">
            <line x1="1" y1="4" x2="17" y2="4" />
            <line x1="1" y1="9" x2="17" y2="9" />
            <line x1="1" y1="14" x2="17" y2="14" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mega menu boutique -->
    <div
      class="overflow-hidden transition-[max-height,opacity] duration-500"
      :class="boutiqueOpen ? 'opacity-100' : 'opacity-0'"
      :style="{ maxHeight: boutiqueOpen ? '520px' : '0' }"
      @mouseenter="boutiqueOpen = true"
    >
      <div
        class="grid grid-cols-2 gap-16 px-5 py-10 lg:px-[104px]"
        style="border-top: 1px solid var(--cacao-a12)"
      >
        <!-- Liste des catégories -->
        <div class="grid grid-cols-3 gap-x-8 gap-y-3.5">
          <div class="col-span-3 mb-2 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-3">
            Catégories
          </div>
          <a
            v-for="cat in boutiqueCats"
            :key="cat.slug"
            class="group cursor-pointer font-serif text-xl text-brun-cacao transition-all duration-200 hover:italic"
            @click="navigate('/boutique/' + cat.slug)"
          >{{ cat.label }}</a>
        </div>

        <!-- Cartes vedettes -->
        <div class="flex gap-6">
          <div
            class="flex flex-1 cursor-pointer flex-col justify-between bg-beige-doux p-6 transition-opacity duration-200 hover:opacity-90"
            style="aspect-ratio: 1/1"
            @click="navigate('/boutique/carres-signature')"
          >
            <span class="ci-label">À la une</span>
            <div>
              <div class="font-serif text-[22px] leading-[1.1] text-brun-cacao">
                Coffret<br/><em>Signature</em>
              </div>
              <div class="mt-1.5 font-sans text-[11px] text-brun-cacao-3">16 carrés — 42 €</div>
            </div>
          </div>
          <div
            class="flex flex-1 cursor-pointer flex-col justify-between bg-rose-poudre p-6 transition-opacity duration-200 hover:opacity-90"
            style="aspect-ratio: 1/1"
            @click="navigate('/boutique/chocobombs')"
          >
            <span class="ci-label">Saison</span>
            <div>
              <div class="font-serif text-[22px] leading-[1.1] text-brun-cacao">
                Chocobombs<br/><em>printemps</em>
              </div>
              <div class="mt-1.5 font-sans text-[11px] text-brun-cacao-3">Édition limitée</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
