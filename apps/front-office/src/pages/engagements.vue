<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const engagements = [
  {
    num: '01',
    titre: 'Bean-to-bar',
    accroche: 'De la fève au carré, sans intermédiaire.',
    corps: 'Nous achetons les fèves directement auprès des producteurs. Venezuela, Madagascar, Ghana, Piémont. Chaque provenance est négociée en direct, à des prix justes, avec des producteurs que nous connaissons par leur prénom. Pas de courtiers. Pas de coopérative intermédiaire. Le prix que nous payons va, en totalité, au travail agricole.',
    details: [
      '12 origines sourcées directement',
      'Prix contractuels + 30 à 60 % au-dessus du marché',
      'Visites annuelles sur chaque origine principale',
    ],
    bg: 'var(--ivoire)',
  },
  {
    num: '02',
    titre: 'Agroforesterie',
    accroche: 'Le cacao pousse à l\'ombre. C\'est voulu.',
    corps: 'Le modèle industriel défriche pour maximiser le rendement. Nous faisons l\'inverse : nous sourceons exclusivement des parcelles en agroforesterie, où le cacaoyer cohabite avec des arbres forestiers natifs. Le rendement est plus faible. La complexité aromatique est incomparable. L\'écosystème, lui, reste intact.',
    details: [
      '100 % des fèves issues de parcelles agroforestières',
      'Première récolte directe en agroforesterie : Piémont, 2022',
      'Zéro déforestation dans notre chaîne d\'approvisionnement',
    ],
    bg: 'var(--rose-poudre)',
  },
  {
    num: '03',
    titre: 'Deux ingrédients',
    accroche: 'Fèves. Sucre de canne. Rien d\'autre.',
    corps: 'Pas de lécithine de soja pour corriger la texture. Pas d\'arômes pour masquer une fève médiocre. Pas d\'émulsifiants pour allonger la durée de vie. Si le chocolat ne tient pas avec deux ingrédients, c\'est que la fève ou la technique est en cause — et c\'est notre problème à résoudre, pas celui de l\'additif alimentaire.',
    details: [
      'Fèves + sucre de canne non raffiné — c\'est tout',
      'Aucun additif, aucun arôme, aucune lécithine',
      'DLC courte — signe de fraîcheur, pas de défaut',
    ],
    bg: 'var(--ivoire)',
  },
  {
    num: '04',
    titre: 'Paris, rue du Nil',
    accroche: 'Tout est fabriqué ici. À la main.',
    corps: 'Notre atelier est au 4 rue du Nil, dans le 2ᵉ arrondissement. Torréfaction, broyage, conchage, tempérage, moulage : chaque étape se déroule dans cet espace de 80 m². Nous ne sous-traitons pas la production. Nous ne faisons pas co-packer. Ce que vous recevez a été fait par les mains de ceux qui ont conçu la recette.',
    details: [
      'Atelier de 80 m², Paris 2ᵉ — ouvert sur rendez-vous',
      'Effectif permanent : 4 personnes',
      'Production limitée — jamais au-delà de ce que nos mains peuvent faire',
    ],
    bg: 'var(--beige-doux)',
  },
]

const chiffres = [
  { valeur: '12', unite: 'origines', detail: 'sourcées directement auprès des producteurs' },
  { valeur: '2', unite: 'ingrédients', detail: 'fèves de cacao et sucre de canne — rien d\'autre' },
  { valeur: '72h', unite: 'minimum', detail: 'de conchage pour chaque lot de couverture' },
  { valeur: '80', unite: 'm² d\'atelier', detail: 'rue du Nil, Paris 2ᵉ — toute la fabrication ici' },
]
</script>

<template>
  <div>

    <!-- ── Intro ───────────────────────────────────────────── -->
    <section
      class="bg-ivoire"
      style="padding: 120px clamp(20px, 6vw, 104px) clamp(80px, 12vw, 192px)"
    >
      <div class="max-w-[880px]">
        <span class="ci-eyebrow">Nos Engagements</span>
        <h1
          class="mt-4 font-serif font-medium text-brun-cacao"
          style="font-size: clamp(48px, 7vw, 96px); line-height: 0.95; letter-spacing: -0.02em"
        >
          Quatre principes,<br/>
          <em class="text-brun-cacao-2">sans compromis.</em>
        </h1>
        <p
          class="mt-12 max-w-[560px] font-sans text-brun-cacao-2"
          style="font-size: 18px; line-height: 1.7"
        >
          Nous aurions pu aller plus vite, moins cher, à plus grande échelle.
          Nous avons choisi autrement.
        </p>
      </div>
    </section>

    <!-- ── Engagements ────────────────────────────────────── -->
    <section
      v-for="eng in engagements"
      :key="eng.num"
      :style="{ background: eng.bg, padding: 'clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)' }"
    >
      <div class="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_1.5fr]">

        <!-- En-tête -->
        <div class="lg:sticky lg:top-[120px]">
          <span class="font-sans text-[11px] uppercase tracking-[0.22em] text-dore">{{ eng.num }}</span>
          <h2
            class="mt-3 font-serif font-medium text-brun-cacao"
            style="font-size: clamp(36px, 5vw, 64px); line-height: 0.95; letter-spacing: -0.02em"
          >
            {{ eng.titre }}
          </h2>
          <p
            class="mt-5 font-serif italic text-brun-cacao-2"
            style="font-size: clamp(18px, 2vw, 24px); line-height: 1.3"
          >
            {{ eng.accroche }}
          </p>
        </div>

        <!-- Corps -->
        <div>
          <p
            class="font-sans text-brun-cacao-2"
            style="font-size: 17px; line-height: 1.75; max-width: 600px"
          >
            {{ eng.corps }}
          </p>

          <ul class="mt-12 space-y-0">
            <li
              v-for="(detail, i) in eng.details"
              :key="i"
              class="flex items-baseline gap-4 border-t py-5"
              style="border-color: var(--cacao-a12)"
            >
              <span class="shrink-0 font-sans text-[11px] uppercase tracking-[0.18em] text-dore">—</span>
              <span class="font-sans text-[14px] leading-relaxed text-brun-cacao">{{ detail }}</span>
            </li>
            <li class="border-t" style="border-color: var(--cacao-a12)" />
          </ul>
        </div>
      </div>
    </section>

    <!-- ── Chiffres ────────────────────────────────────────── -->
    <section
      class="bg-brun-cacao"
      style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)"
    >
      <div class="mb-20">
        <span class="font-sans text-[11px] uppercase tracking-[0.22em] text-dore">En chiffres</span>
        <h2
          class="mt-4 font-serif font-medium text-ivoire"
          style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
        >
          Ce que nos engagements<br/>
          <em style="opacity: 0.6">signifient concrètement.</em>
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="item in chiffres"
          :key="item.unite"
          class="border-t py-10 pr-10"
          style="border-color: var(--ivoire-a15)"
        >
          <div
            class="font-serif font-medium leading-none text-dore"
            style="font-size: clamp(48px, 6vw, 72px)"
          >{{ item.valeur }}</div>
          <div class="mt-1 font-sans text-[11px] uppercase tracking-[0.18em] text-ivoire" style="opacity: 0.6">
            {{ item.unite }}
          </div>
          <p class="mt-4 font-sans text-[13px] leading-relaxed text-ivoire" style="opacity: 0.5">
            {{ item.detail }}
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
          <span class="ci-eyebrow">05 — La boutique</span>
          <h2
            class="mt-4 font-serif font-medium text-brun-cacao"
            style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
          >
            Des principes<br/>
            <em class="text-brun-cacao-2">que vous pouvez goûter.</em>
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
            @click="router.push('/histoire')"
          >
            Notre histoire →
          </button>
        </div>
      </div>
    </section>

  </div>
</template>
