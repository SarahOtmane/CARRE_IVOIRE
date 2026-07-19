<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

const router = useRouter()

useHead({
  title: 'Nos événements — Carré Ivoire',
  meta: [{ name: 'description', content: 'Marchés, ateliers de dégustation et collaborations : retrouvez Carré Ivoire lors de nos prochains événements.' }],
})

interface Evenement {
  id: string
  date: string
  mois: string
  annee: string
  titre: string
  type: string
  lieu: string
  description: string
  complet: boolean
  tag: string | null
}

const evenements: Evenement[] = [
  {
    id: 'ouverture-atelier-boutique',
    date: '14',
    mois: 'Septembre',
    annee: '2026',
    titre: 'Ouverture de l\'atelier / boutique',
    type: 'Visite',
    lieu: 'Atelier — 29 rue de Vauparfonds, LUISANT',
    description: 'Notre atelier / boutique ouvre ces portes, venez nous rendre visite. Nous vous accuillerons avec toutes nos gourmandises',
    complet: false,
    tag: 'A venir',
  },
  {
    id: 'telethon-de-luisant',
    date: '31',
    mois: 'Octobre',
    annee: '2026',
    titre: 'Téléthon de Luisant',
    type: 'Exposition',
    lieu: 'Salle André Malraux — Cour Charles Brune, LUISANT',
    description: 'Le Téléthon de Luisant vous propose un salon des artisants et professionnels du bien-être de la région.',
    complet: false,
    tag: 'A venir',
  },
  {
    id: 'salon-du-bien-etre',
    date: '29',
    mois: 'Novembre',
    annee: '2026',
    titre: 'Salon du bien être de Chateaudun',
    type: 'Exposition',
    lieu: 'CHATEAUDUN',
    description: 'Salon des artisants et professionnel de Chatraudun vous accueil dans une ambiance zen et festive .',
    complet: false,
    tag: 'A venir',
  },
  {
    id: 'marcher-de-noel',
    date: '12-13',
    mois: 'Décembre',
    annee: '2026',
    titre: 'Marché de Noël de Luisant',
    type: 'Exposition',
    lieu: 'LUISANT',
    description: 'Préparez-vous pour les fêtes, venez nous rendre visite au Marché de Noël de luisant.',
    complet: false,
    tag: 'A venir',
  },
]

const types = ['Tous', 'Dégustation', 'Visite', 'Atelier', 'Exposition']

const selectedType = ref('Tous')

const filteredEvenements = computed(() =>
  selectedType.value === 'Tous'
    ? evenements
    : evenements.filter((evt) => evt.type === selectedType.value),
)
</script>

<template>
  <div>

    <!-- ── Intro ───────────────────────────────────────────── -->
    <section
      class="bg-ivoire"
      style="padding: 120px clamp(20px, 6vw, 104px) clamp(80px, 12vw, 192px)"
    >
      <div class="max-w-[880px]">
        <span class="ci-eyebrow">Nos Événements</span>
        <h1
          class="mt-4 font-serif font-medium text-cacao"
          style="font-size: clamp(48px, 7vw, 96px); line-height: 0.95; letter-spacing: -0.02em"
        >
          L'atelier<br/>
          <em class="text-cacao-2">vous ouvre ses portes.</em>
        </h1>
        <p
          class="mt-12 max-w-[560px] font-sans text-cacao-2"
          style="font-size: 18px; line-height: 1.7"
        >
          Dégustations, visites, masterclasses. Des moments pour comprendre
          ce que signifie faire du chocolat à la main.
        </p>
      </div>
    </section>

    <!-- ── Liste des événements ───────────────────────────── -->
    <section
      class="bg-ivoire"
      style="padding: 0 clamp(20px, 6vw, 104px) clamp(80px, 12vw, 192px)"
    >

      <!-- En-tête de liste -->
      <div
        class="mb-12 flex items-end justify-between border-b pb-6"
        style="border-color: var(--cacao-a12)"
      >
        <span class="ci-eyebrow">{{ evenements.length }} événements à venir</span>
        <div class="hidden gap-6 sm:flex">
          <a
            v-for="type in types"
            :key="type"
            class="cursor-pointer border-b pb-0.5 font-sans text-[12px] tracking-[0.04em] transition-[border-color,color] duration-180"
            :class="selectedType === type
              ? 'border-cacao text-cacao'
              : 'border-transparent text-cacao-2 hover:border-cacao hover:text-cacao'"
            @click="selectedType = type"
          >{{ type }}</a>
        </div>
      </div>

      <!-- Événements -->
      <div class="space-y-0">
        <article
          v-for="evt in filteredEvenements"
          :key="evt.id"
          class="group grid grid-cols-1 items-start gap-8 border-t py-12 lg:grid-cols-[140px_1fr_200px]"
          :class="evt.complet ? 'opacity-50' : 'cursor-pointer'"
          style="border-color: var(--cacao-a12)"
        >
          <!-- Date -->
          <div class="flex items-baseline gap-2 lg:flex-col lg:gap-0">
            <div
              class="font-serif font-medium leading-none text-dore"
              style="font-size: clamp(40px, 5vw, 56px)"
            >{{ evt.date }}</div>
            <div class="font-sans text-[13px] uppercase tracking-[0.1em] text-cacao-3">
              {{ evt.mois }} {{ evt.annee }}
            </div>
          </div>

          <!-- Corps -->
          <div>
            <div class="mb-3 flex flex-wrap items-center gap-3">
              <span class="ci-eyebrow">{{ evt.type }}</span>
              <span
                v-if="evt.tag"
                class="font-sans text-[9px] uppercase tracking-[0.22em]"
                :class="evt.tag === 'Édition limitée' ? 'bg-cacao text-ivoire' : 'border border-[var(--cacao-a24)] text-cacao'"
                style="padding: 4px 8px"
              >{{ evt.tag }}</span>
              <span
                v-if="evt.complet"
                class="font-sans text-[9px] uppercase tracking-[0.22em] text-cacao-3"
                style="padding: 4px 8px; border: 1px solid var(--cacao-a24)"
              >Complet</span>
            </div>

            <h2
              class="font-serif font-medium text-cacao"
              style="font-size: clamp(22px, 2.5vw, 30px); line-height: 1.1"
            >{{ evt.titre }}</h2>

            <p class="mt-3 font-sans text-[14px] leading-relaxed text-cacao-2" style="max-width: 520px">
              {{ evt.description }}
            </p>

            <div class="mt-4 flex items-center gap-2">
              <svg
                width="12" height="12" fill="none" stroke="currentColor"
                stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter"
                viewBox="0 0 12 12" class="text-cacao-3"
              >
                <circle cx="6" cy="5" r="2.5" />
                <path d="M6 12C6 12 1.5 7.5 1.5 5a4.5 4.5 0 019 0C10.5 7.5 6 12 6 12z" />
              </svg>
              <span class="font-sans text-[12px] text-cacao-3">{{ evt.lieu }}</span>
            </div>
          </div>

          <!-- CTA 
          <div class="flex items-start lg:justify-end">
            <button
              v-if="!evt.complet"
              class="border border-cacao px-6 py-3 font-sans text-[12px] tracking-[0.08em] text-cacao transition-all duration-180 hover:bg-cacao hover:text-ivoire active:translate-y-px"
            >
              Réserver
            </button>
            <span
              v-else
              class="font-sans text-[12px] tracking-[0.04em] text-cacao-3"
            >
              Liste d'attente →
            </span>
          </div> -->
        </article>

        <div class="border-t" style="border-color: var(--cacao-a12)" />
      </div>
    </section>

    <!-- ── Lettre ──────────────────────────────────────────── -->
    <section
      class="bg-beige-doux"
      style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)"
    >
      <div class="grid grid-cols-1 items-end gap-16 lg:grid-cols-2">
        <div>
          <span class="ci-eyebrow">Ne rien manquer</span>
          <h2
            class="mt-4 font-serif font-medium text-cacao"
            style="font-size: clamp(32px, 4vw, 52px); line-height: 1"
          >
            Les places partent vite.<br/>
            <em class="text-cacao-2">La lettre arrive à temps.</em>
          </h2>
          <p class="mt-6 font-sans text-[15px] leading-relaxed text-cacao-2" style="max-width: 440px">
            Une fois par mois, les événements du trimestre, les nouvelles fèves,
            ce qui se passe dans l'atelier. Rien de superflu.
          </p>
        </div>

        <div>
          <div
            class="flex"
            style="border-bottom: 1px solid var(--cacao-a24)"
          >
            <input
              type="email"
              placeholder="vous@domaine.fr"
              class="flex-1 bg-transparent py-3 font-sans text-[14px] text-cacao placeholder-cacao-3 outline-none"
            />
            <button
              class="flex shrink-0 cursor-pointer items-center py-3 text-cacao transition-opacity duration-180 hover:opacity-60"
              aria-label="S'inscrire"
            >
              <svg
                width="16" height="16" fill="none" stroke="currentColor"
                stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter"
                viewBox="0 0 16 16"
              >
                <line x1="1" y1="8" x2="15" y2="8" />
                <polyline points="10,3 15,8 10,13" />
              </svg>
            </button>
          </div>
          <p class="mt-3 font-sans text-[11px] uppercase tracking-[0.14em] text-cacao-3">
            Désabonnement en un clic — toujours.
          </p>
        </div>
      </div>
    </section>

    <!-- ── CTA ────────────────────────────────────────────── -->
    <section
      class="bg-ivoire"
      style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)"
    >
      <div class="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-[560px]">
          <span class="ci-eyebrow">En attendant</span>
          <h2
            class="mt-4 font-serif font-medium text-cacao"
            style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
          >
            La boutique,<br/>
            <em class="text-cacao-2">Accessible tous les jours.</em>
          </h2>
        </div>
        <div class="flex flex-col gap-4 sm:flex-row">
          <button
            class="border border-cacao bg-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
            @click="router.push('/boutique')"
          >
            Découvrir la boutique
          </button>
          <button
            class="border border-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-cacao transition-all duration-180 hover:bg-cacao hover:text-ivoire active:translate-y-px"
            @click="router.push('/engagements')"
          >
            Nos engagements →
          </button>
        </div>
      </div>
    </section>

  </div>
</template>
