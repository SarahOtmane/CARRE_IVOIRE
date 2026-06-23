<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

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
    id: 'degustation-porcelana-juin-2026',
    date: '14',
    mois: 'Juin',
    annee: '2026',
    titre: 'Dégustation Porcelana',
    type: 'Dégustation',
    lieu: 'Atelier — 4 rue du Nil, Paris 2ᵉ',
    description: 'Une séance autour de la Porcelana vénézuélienne. Trois millésimes, deux expressions. Vingt participants maximum. Animée par nos chocolatiers.',
    complet: false,
    tag: null,
  },
  {
    id: 'visite-atelier-juillet-2026',
    date: '05',
    mois: 'Juillet',
    annee: '2026',
    titre: 'Visite de l\'atelier',
    type: 'Visite',
    lieu: 'Atelier — 4 rue du Nil, Paris 2ᵉ',
    description: 'Portes ouvertes sur notre fabrication. Torréfaction en direct, broyage, tempérage. Vous repartez avec un carré fait pendant la visite.',
    complet: false,
    tag: 'Nouveau',
  },
  {
    id: 'masterclass-temperage-juillet-2026',
    date: '19',
    mois: 'Juillet',
    annee: '2026',
    titre: 'Masterclass Tempérage',
    type: 'Atelier',
    lieu: 'Atelier — 4 rue du Nil, Paris 2ᵉ',
    description: 'Trois heures pour comprendre et pratiquer le tempérage sur marbre. Vous repartez avec vos propres tablettes. Niveau intermédiaire — une expérience chocolat est recommandée.',
    complet: true,
    tag: null,
  },
  {
    id: 'parcours-bean-to-bar-aout-2026',
    date: '22',
    mois: 'Août',
    annee: '2026',
    titre: 'Parcours Bean-to-Bar',
    type: 'Atelier',
    lieu: 'Atelier — 4 rue du Nil, Paris 2ᵉ',
    description: 'Une journée entière. De la fève brute au carré final. Torréfaction, broyage, conchage, moulage. Déjeuner inclus. Huit participants.',
    complet: false,
    tag: null,
  },
  {
    id: 'degustation-millésimes-septembre-2026',
    date: '10',
    mois: 'Septembre',
    annee: '2026',
    titre: 'Millésimes 2025',
    type: 'Dégustation',
    lieu: 'Atelier — 4 rue du Nil, Paris 2ᵉ',
    description: 'Présentation des fèves de la récolte 2025. Comparaison avec les millésimes précédents. Un moment pour les amateurs de cacao fin qui souhaitent comprendre comment une fève évolue.',
    complet: false,
    tag: 'Édition limitée',
  },
]

const types = ['Tous', 'Dégustation', 'Visite', 'Atelier']
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
          class="mt-4 font-serif font-medium text-brun-cacao"
          style="font-size: clamp(48px, 7vw, 96px); line-height: 0.95; letter-spacing: -0.02em"
        >
          L\'atelier<br/>
          <em class="text-brun-cacao-2">vous ouvre ses portes.</em>
        </h1>
        <p
          class="mt-12 max-w-[560px] font-sans text-brun-cacao-2"
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
            class="cursor-pointer font-sans text-[12px] tracking-[0.04em] text-brun-cacao-2 transition-colors duration-180 hover:text-brun-cacao"
          >{{ type }}</a>
        </div>
      </div>

      <!-- Événements -->
      <div class="space-y-0">
        <article
          v-for="evt in evenements"
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
            <div class="font-sans text-[13px] uppercase tracking-[0.1em] text-brun-cacao-3">
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
                :class="evt.tag === 'Édition limitée' ? 'bg-brun-cacao text-ivoire' : 'border border-[var(--cacao-a24)] text-brun-cacao'"
                style="padding: 4px 8px"
              >{{ evt.tag }}</span>
              <span
                v-if="evt.complet"
                class="font-sans text-[9px] uppercase tracking-[0.22em] text-brun-cacao-3"
                style="padding: 4px 8px; border: 1px solid var(--cacao-a24)"
              >Complet</span>
            </div>

            <h2
              class="font-serif font-medium text-brun-cacao"
              style="font-size: clamp(22px, 2.5vw, 30px); line-height: 1.1"
            >{{ evt.titre }}</h2>

            <p class="mt-3 font-sans text-[14px] leading-relaxed text-brun-cacao-2" style="max-width: 520px">
              {{ evt.description }}
            </p>

            <div class="mt-4 flex items-center gap-2">
              <svg
                width="12" height="12" fill="none" stroke="currentColor"
                stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter"
                viewBox="0 0 12 12" class="text-brun-cacao-3"
              >
                <circle cx="6" cy="5" r="2.5" />
                <path d="M6 12C6 12 1.5 7.5 1.5 5a4.5 4.5 0 019 0C10.5 7.5 6 12 6 12z" />
              </svg>
              <span class="font-sans text-[12px] text-brun-cacao-3">{{ evt.lieu }}</span>
            </div>
          </div>

          <!-- CTA -->
          <div class="flex items-start lg:justify-end">
            <button
              v-if="!evt.complet"
              class="border border-brun-cacao px-6 py-3 font-sans text-[12px] tracking-[0.08em] text-brun-cacao transition-all duration-180 hover:bg-brun-cacao hover:text-ivoire active:translate-y-px"
            >
              Réserver
            </button>
            <span
              v-else
              class="font-sans text-[12px] tracking-[0.04em] text-brun-cacao-3"
            >
              Liste d\'attente →
            </span>
          </div>
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
            class="mt-4 font-serif font-medium text-brun-cacao"
            style="font-size: clamp(32px, 4vw, 52px); line-height: 1"
          >
            Les places partent vite.<br/>
            <em class="text-brun-cacao-2">La lettre arrive à temps.</em>
          </h2>
          <p class="mt-6 font-sans text-[15px] leading-relaxed text-brun-cacao-2" style="max-width: 440px">
            Une fois par mois, les événements du trimestre, les nouvelles fèves,
            ce qui se passe dans l\'atelier. Rien de superflu.
          </p>
        </div>

        <div>
          <div
            class="flex"
            style="border-bottom: 1px solid var(--cacao-a24)"
          >
            <input
              type="email"
              placeholder="vous@maison.fr"
              class="flex-1 bg-transparent py-3 font-sans text-[14px] text-brun-cacao placeholder-brun-cacao-3 outline-none"
            />
            <button
              class="flex shrink-0 cursor-pointer items-center py-3 text-brun-cacao transition-opacity duration-180 hover:opacity-60"
              aria-label="S\'inscrire"
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
          <p class="mt-3 font-sans text-[11px] uppercase tracking-[0.14em] text-brun-cacao-3">
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
          <span class="ci-eyebrow">Pendant ce temps</span>
          <h2
            class="mt-4 font-serif font-medium text-brun-cacao"
            style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
          >
            La boutique,<br/>
            <em class="text-brun-cacao-2">elle, n\'attend pas.</em>
          </h2>
        </div>
        <div class="flex flex-col gap-4 sm:flex-row">
          <button
            class="border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
            @click="router.push('/boutique')"
          >
            Découvrir la boutique
          </button>
          <button
            class="border border-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-brun-cacao transition-all duration-180 hover:bg-brun-cacao hover:text-ivoire active:translate-y-px"
            @click="router.push('/engagements')"
          >
            Nos engagements →
          </button>
        </div>
      </div>
    </section>

  </div>
</template>
