<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCartStore } from "@carre-ivoire/stores";
import {
  useProductSearch,
  useCategories,
  usePublicSettings,
} from "@carre-ivoire/composables";
import { Logo } from "@carre-ivoire/ui";

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const {
  results: searchResults,
  isSearching,
  search: runSearch,
} = useProductSearch();
const { categories: megaCategories } = useCategories();
const { settings: publicSettings } = usePublicSettings();

const alwaysActive = true; // mettre false pour réactiver le comportement au scroll uniquement
const scrolled = ref(false);
const hovered = ref(false);
const boutiqueOpen = ref(false);
const searchOpen = ref(false);
const mobileMenuOpen = ref(false);
const query = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

function onScroll() {
  scrolled.value = window.scrollY > 40;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    searchOpen.value = false;
    query.value = "";
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  globalThis.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  globalThis.removeEventListener("keydown", onKeydown);
});

watch(searchOpen, (val) => {
  if (val) {
    boutiqueOpen.value = false;
    mobileMenuOpen.value = false;
    nextTick(() => inputRef.value?.focus());
  }
});

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  if (mobileMenuOpen.value) searchOpen.value = false;
}

function navigateMobile(path: string) {
  mobileMenuOpen.value = false;
  router.push(path);
}

const isActive = computed(
  () =>
    alwaysActive ||
    scrolled.value ||
    hovered.value ||
    searchOpen.value ||
    mobileMenuOpen.value,
);

const navItems = [
  { id: "boutique", label: "Boutique", path: "/boutique", hasMega: true },
  { id: "histoire", label: "Notre histoire", path: "/histoire" },
  { id: "engagements", label: "Nos engagements", path: "/engagements" },
  { id: "evenements", label: "Nos événements", path: "/evenements" },
  { id: "contact", label: "Nous contacter", path: "/contact" },
];

const boutiqueCats = megaCategories;

const suggestions = [
  "Carrés Signature",
  "Tablettes",
  "Madagascar",
  "Praliné",
  "Coffret cadeau",
];
const familles = ["Tablettes", "Mini Carrés", "Mendiants", "Pâtes à tartiner"];

watch(query, (val) => runSearch(val));

const hasQuery = computed(() => query.value.trim().length > 0);

function navigate(path: string) {
  boutiqueOpen.value = false;
  router.push(path);
}

function navigateAndClose(path: string) {
  searchOpen.value = false;
  query.value = "";
  router.push(path);
}

function onNavEnter(item: (typeof navItems)[number]) {
  if (!searchOpen.value) {
    boutiqueOpen.value = item.hasMega === true;
  }
}

function onHeaderLeave() {
  hovered.value = false;
  boutiqueOpen.value = false;
}

function toggleSearch() {
  searchOpen.value = !searchOpen.value;
  if (!searchOpen.value) query.value = "";
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 flex flex-col transition-all duration-400"
    :class="
      isActive
        ? 'border-b border-[var(--cacao-a12)]'
        : 'border-b border-transparent'
    "
    :style="
      isActive
        ? { background: 'var(--header-glass)', backdropFilter: 'blur(16px)' }
        : { background: 'transparent' }
    "
    @mouseenter="hovered = true"
    @mouseleave="onHeaderLeave"
  >
    <!-- Barre principale -->
    <div class="flex h-[80px] items-center justify-between px-5 lg:px-[104px]">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3.5 w-[120px] h-[80px]">
        <Logo :logo-url="publicSettings?.logoUrl" />
      </RouterLink>

      <!-- Navigation desktop -->
      <nav class="hidden items-center gap-7 lg:flex mt-[3px]">
        <a
          v-for="item in navItems"
          :key="item.id"
          class="cursor-pointer border-b pb-0.5 font-sans text-[14px] tracking-[0.06em] text-cacao transition-[border-color] duration-[240ms]"
          :class="
            (route.path.startsWith(item.path) && item.path !== '/') ||
            (item.hasMega && boutiqueOpen)
              ? 'border-cacao'
              : 'border-transparent'
          "
          @mouseenter="onNavEnter(item)"
          @click="navigate(item.path)"
          >{{ item.label }}</a
        >
      </nav>

      <!-- Icônes -->
      <div class="flex items-center gap-5 text-cacao">
        <!-- Recherche — toggle -->
        <button
          class="flex cursor-pointer items-center transition-opacity duration-180 hover:opacity-60"
          :aria-label="searchOpen ? 'Fermer la recherche' : 'Rechercher'"
          @click="toggleSearch"
        >
          <!-- Icône search -->
          <svg
            v-if="!searchOpen"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="square"
            stroke-linejoin="miter"
            viewBox="0 0 18 18"
          >
            <circle cx="7.5" cy="7.5" r="5" />
            <line x1="11.2" y1="11.2" x2="16.5" y2="16.5" />
          </svg>
          <!-- Icône close -->
          <svg
            v-else
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="square"
            stroke-linejoin="miter"
            viewBox="0 0 18 18"
          >
            <line x1="3" y1="3" x2="15" y2="15" />
            <line x1="15" y1="3" x2="3" y2="15" />
          </svg>
        </button>

        <!-- Compte -->
        <RouterLink
          to="/compte"
          class="flex items-center transition-opacity duration-180 hover:opacity-60"
          aria-label="Mon compte"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="square"
            stroke-linejoin="miter"
            viewBox="0 0 18 18"
          >
            <circle cx="9" cy="6" r="3" />
            <path d="M2.5 17c0-3.590 2.910-6.5 6.5-6.5s6.5 2.910 6.5 6.5" />
          </svg>
        </RouterLink>

        <!-- Panier -->
        <RouterLink
          to="/panier"
          class="flex items-center gap-1.5 transition-opacity duration-180 hover:opacity-60"
          aria-label="Panier"
        >
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="square"
            stroke-linejoin="miter"
            viewBox="0 0 18 18"
          >
            <path d="M1 1h2.5l2 9h9l2-9H17" />
            <circle cx="6" cy="15.5" r="1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="15.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          <span
            v-if="cartStore.count > 0"
            class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-cacao font-sans text-[10px] text-ivoire"
            >{{ cartStore.count }}</span
          >
        </RouterLink>

        <!-- Burger mobile -->
        <button
          class="flex items-center lg:hidden"
          :aria-label="mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-nav-panel"
          @click="toggleMobileMenu"
        >
          <svg
            v-if="!mobileMenuOpen"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="square"
            viewBox="0 0 18 18"
          >
            <line x1="1" y1="4" x2="17" y2="4" />
            <line x1="1" y1="9" x2="17" y2="9" />
            <line x1="1" y1="14" x2="17" y2="14" />
          </svg>
          <svg
            v-else
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="square"
            stroke-linejoin="miter"
            viewBox="0 0 18 18"
          >
            <line x1="3" y1="3" x2="15" y2="15" />
            <line x1="15" y1="3" x2="3" y2="15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Panneau de navigation mobile -->
    <div
      id="mobile-nav-panel"
      class="overflow-hidden transition-[max-height,opacity] duration-400 ease-ui lg:hidden"
      :class="mobileMenuOpen ? 'opacity-100' : 'opacity-0'"
      :style="{ maxHeight: mobileMenuOpen ? '80vh' : '0' }"
    >
      <nav
        class="flex flex-col gap-1 px-5 py-6"
        style="border-top: 1px solid var(--cacao-a12)"
      >
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="cursor-pointer py-3 text-left font-sans text-[14px] tracking-[0.06em] text-cacao transition-opacity duration-180 hover:opacity-60"
          @click="navigateMobile(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>
    </div>

    <!-- Mega menu boutique -->
    <div
      class="overflow-hidden transition-[max-height,opacity,border-color] duration-500"
      :class="boutiqueOpen && !searchOpen ? 'opacity-100' : 'opacity-0'"
      :style="{ maxHeight: boutiqueOpen && !searchOpen ? '520px' : '0' }"
      @mouseenter="boutiqueOpen = true"
    >
      <div
        class="grid grid-cols-2 gap-16 px-5 py-10 lg:px-[104px]"
        style="border-top: 1px solid var(--cacao-a12)"
      >
        <!-- Liste des catégories -->
        <div class="grid grid-cols-3 gap-x-8 gap-y-3.5">
          <div
            class="col-span-3 mb-2 font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3"
          >
            Catégories
          </div>
          <a
            v-for="cat in boutiqueCats"
            :key="cat.slug"
            class="cursor-pointer font-serif text-xl text-cacao transition-opacity duration-180 hover:opacity-60"
            @click="navigate('/boutique/' + cat.slug)"
            >{{ cat.name }}</a
          >
        </div>

        <!-- Cartes vedettes -->
        <div class="flex gap-6">
          <div
            class="flex flex-1 cursor-pointer flex-col justify-between bg-beige-doux p-6 transition-opacity duration-200 hover:opacity-90"
            style="aspect-ratio: 1/1"
            @click="navigate('/boutique/carres-signature')"
          >
            <span class="ci-label">À la une</span>
            <img src="http://api.carre-ivoire.fr/uploads/3192bba8-422a-44b2-8d10-b73662569e8b.webp" alt="Coffret de 12 bonbons de chocolat" loading="lazy" decoding="async" class="h-[150px] w-[150px] object-cover">
            <div>
              <div class="font-serif text-[22px] leading-[1.1] text-cacao">
                Coffret<br /><em>Signature</em>
              </div>
              <div class="mt-1.5 font-sans text-[11px] text-cacao-3">
                16 carrés — 22 €
              </div>
            </div>
          </div>
          <div
            class="flex flex-1 cursor-pointer flex-col justify-between bg-rose-poudre p-6 transition-opacity duration-200 hover:opacity-90"
            style="aspect-ratio: 1/1"
            @click="navigate('/boutique/tablette')"
          >
            <span class="ci-label">Incontounables</span>
            <img src="http://api.carre-ivoire.fr/uploads/3df9f08b-f8f5-42d4-98ef-958a6273afa1.webp" alt="Escapade dans le Moronou" loading="lazy" decoding="async" class="h-[150px] w-[150px] object-cover">
            <div>
              <div class="font-serif text-[22px] leading-[1.1] text-cacao">
                Tablettes<br /><em>Origine Côte d'Ivoire</em>
              </div>
              <div class="mt-1.5 font-sans text-[11px] text-cacao-3">
                Cacao 70%, 75% et 80%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Panneau de recherche ──────────────────────────────────────── -->
    <div
      class="overflow-hidden transition-[max-height,opacity,border-color]"
      style="
        transition-duration: 500ms, 320ms, 320ms;
        transition-timing-function:
          var(--ease-ambient), var(--ease-ui), var(--ease-ui);
      "
      :class="searchOpen ? 'opacity-100' : 'opacity-0'"
      :style="{ maxHeight: searchOpen ? '80vh' : '0' }"
    >
      <div
        class="px-5 lg:px-[104px]"
        style="
          border-top: 1px solid var(--cacao-a12);
          padding-top: clamp(32px, 5vw, 64px);
          padding-bottom: clamp(32px, 5vw, 64px);
        "
      >
        <!-- Ligne de saisie -->
        <div
          class="flex items-baseline gap-4 pb-4"
          style="border-bottom: 1px solid var(--brun-cacao)"
        >
          <!-- Icône search fixe -->
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="square"
            stroke-linejoin="miter"
            viewBox="0 0 18 18"
            class="shrink-0 text-cacao-3"
          >
            <circle cx="7.5" cy="7.5" r="5" />
            <line x1="11.2" y1="11.2" x2="16.5" y2="16.5" />
          </svg>

          <!-- Input -->
          <input
            ref="inputRef"
            v-model="query"
            type="search"
            placeholder="Chercher un carré, une origine, une famille…"
            class="flex-1 bg-transparent font-serif text-cacao outline-none placeholder:text-cacao-3"
            style="
              font-size: clamp(20px, 3vw, 36px);
              letter-spacing: -0.005em;
              border: none;
            "
          />

          <!-- Effacer -->
          <button
            v-if="hasQuery"
            class="shrink-0 cursor-pointer font-sans text-[11px] uppercase tracking-[0.14em] text-cacao-3 transition-opacity duration-180 hover:opacity-60"
            @click="query = ''"
          >
            Effacer
          </button>

          <!-- Hint ESC -->
          <span
            class="hidden shrink-0 font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3 lg:inline"
          >
            ESC pour fermer
          </span>
        </div>

        <!-- ── État par défaut (pas de query) ───────────────────────── -->
        <div
          v-if="!hasQuery"
          class="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          <!-- Suggestions -->
          <div>
            <div
              class="mb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3"
            >
              Suggestions
            </div>
            <div class="flex flex-col gap-2">
              <button
                v-for="s in suggestions"
                :key="s"
                class="cursor-pointer text-left font-serif text-[18px] italic text-cacao transition-opacity duration-180 hover:opacity-60"
                @click="query = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <!-- Familles -->
          <div>
            <div
              class="mb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3"
            >
              Familles
            </div>
            <div class="flex flex-col gap-2">
              <a
                v-for="f in familles"
                :key="f"
                class="cursor-pointer font-serif text-[18px] text-cacao transition-opacity duration-180 hover:opacity-60"
                @click="navigateAndClose('/boutique')"
                >{{ f }}</a
              >
            </div>
          </div>

          <!-- Populaires -->
          <div>
            <div
              class="mb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3"
            >
              Populaires
            </div>
            <a
              class="cursor-pointer font-serif text-[18px] text-cacao transition-opacity duration-180 hover:opacity-60"
              @click="navigateAndClose('/boutique')"
              >Découvrir la collection</a
            >
          </div>
        </div>

        <!-- ── Recherche en cours ───────────────────────────────────── -->
        <div
          v-else-if="isSearching && searchResults.length === 0"
          class="mt-12 pb-8"
        >
          <span class="ci-eyebrow">Recherche</span>
        </div>

        <!-- ── Résultats ─────────────────────────────────────────────── -->
        <div v-else-if="searchResults.length > 0" class="mt-8">
          <div
            class="mb-5 font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3"
          >
            {{ searchResults.length }} résultat{{
              searchResults.length > 1 ? "s" : ""
            }}
          </div>
          <div class="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="p in searchResults"
              :key="p.id"
              class="flex cursor-pointer items-center gap-4 border-t py-3 pr-4 transition-opacity duration-180 hover:opacity-70"
              style="border-color: var(--cacao-a08)"
              @click="navigateAndClose('/produits/' + p.slug)"
            >
              <div class="h-16 w-16 shrink-0 bg-papier">
                <img
                  :src="p.imageUrl ?? '/assets/placeholder.svg'"
                  :alt="p.name"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="min-w-0 flex-1">
                <div
                  class="font-sans text-[10px] uppercase tracking-[0.18em] text-cacao-3"
                >
                  {{ p.category?.name }}
                </div>
                <div
                  class="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap font-serif text-[18px] text-cacao"
                >
                  {{ p.name }}
                </div>
                <div
                  class="mt-1 font-sans text-[13px] text-dore"
                  style="font-variant-numeric: tabular-nums"
                >
                  {{ (p.price / 100).toFixed(2).replace(".", ",") }} €
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── État vide ─────────────────────────────────────────────── -->
        <div v-else class="mt-12 pb-8">
          <span class="ci-eyebrow">Aucun résultat</span>
          <h3
            class="mt-3 font-serif font-medium text-cacao"
            style="font-size: clamp(22px, 3vw, 32px); line-height: 1.1"
          >
            Rien pour <em>« {{ query.trim() }} »</em>.
          </h3>
          <p
            class="mt-3 font-sans text-[14px] leading-relaxed text-cacao-2"
            style="max-width: 420px"
          >
            Essayez une origine (Madagascar, Pérou), une famille (tablette,
            mendiant) ou
            <a
              class="cursor-pointer border-b border-cacao-2 pb-px"
              @click="navigateAndClose('/contact')"
              >contactez-nous</a
            >, nous trouverons.
          </p>
        </div>
      </div>
    </div>
  </header>
</template>
