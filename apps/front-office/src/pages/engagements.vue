<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

const router = useRouter()

useHead({
  title: 'Nos engagements — Carré Ivoire',
  meta: [{ name: 'description', content: 'Bean-to-bar, origines tracées, emballages sobres : découvrez les engagements de Carré Ivoire pour un chocolat artisanal responsable.' }],
})

const engagements = [
  {
    num: '01',
    titre: 'Valoriser le cacao ivoirien',
    accroche: 'Nous souhaitons faire découvrir oute la richesse du cacao ivoirien, de ses terroirs et de ses arômes.',
    corps: 'Pour Carré Ivoire, le cacao n\'est pas une simple matière première :',
    details: [
      'il apporte une histoire, ',
      'une coulture ',
      'et le savoire-faire des femmes et des hommes qui le cultivent.',
    ],
    bg: 'var(--ivoire)',
  },
  {
    num: '02',
    titre: 'Fabriquer de la fève à la tablette',
    accroche: 'Npous transformons nous même les fèves de cacao dans notre attelier de Luisant.',
    corps: 'Chaque étape est réalisée avec patience afin de préserver la personnalité du cacao :',
    details: [
      'Torréfaction, ',
      'Broyage, ',
      'Affinage, ',
      'Conchage, ',
      'Tempérage et Moulage',
    ],
    bg: 'var(--rose-poudre)',
  },
  {
    num: '03',
    titre: 'Respecter le travail des producteurs',
    accroche: 'Derrière chaque fève se trouvent des femmes et des hommes dont le travail mérite d\'être reconnu et valorisé.',
    corps: 'Nous souhaitons développer progressivement des relations avec les producteurs et les coopératives :',
    details: [
      'plus directes, ',
      'durables ',
      ' et transparentes',
    ],
    bg: 'var(--ivoire)',
  },
  {
    num: '04',
    titre: 'Favoriser la traçabilité',
    accroche: 'Connaître l\'origine de nos fèves et suivre leur transformation est essentiel.',
    corps: 'Nous avançons vers des approvisionnements toujours mieux identifiés afin de proposer',
    details: [
      'un chocolat plus transparent, ',
      'de la plantation jusqu\'au produit fini.',
    ],
    bg: 'var(--beige-doux)',
  },
   {
    num: '05',
    titre: 'Protéger les terres et l\'enfance',
    accroche: 'Le cacao ne doit jamais être produit au détriment des enfants ni des écosystèmes.',
    corps: 'Nous défendons une filière respectueuse :',
    details: [
      'de la scolarisation, ',
      'des familles productrices, ',
      'des sols, des forêts ',
      'et du développement de pratiques agricoles plus durables.'
    ],
    bg: 'var(--beige-doux)',
  },
   {
    num: '06',
    titre: 'Produire avec sincérité',
    accroche: 'Nos chocolats sont fabriqués en petites séries, avec des recettes maîtrisées et des ingrédients sélectionnés avec soin',
    corps: 'Carré Ivoire est une jeune chocolaterie qui apprend et progresse. Nous préférons parler avec honnêteté de notre démarche plutôt que promettre une perfection qui n’existe pas encore.',
    
    bg: 'var(--beige-doux)',
  },
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
          class="mt-4 font-serif font-medium text-cacao"
          style="font-size: clamp(48px, 7vw, 96px); line-height: 0.95; letter-spacing: -0.02em"
        >
          Chez Carré Ivoire, le chocolat ne se résume pas à une gourmandise.<br/>
          <em class="text-cacao-2">sans compromis.</em>
        </h1>
        <p
          class="mt-12 max-w-[560px] font-sans text-cacao-2"
          style="font-size: 18px; line-height: 1.7"
        >
         Il relie une terre, des producteurs, un savoir-faire et les personnes qui le dégustent.
         Nous avançons avec une ambition simple : créer un chocolat artisanal, sincère et porteur de sens.
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
            class="mt-3 font-serif font-medium text-cacao"
            style="font-size: clamp(36px, 5vw, 64px); line-height: 0.95; letter-spacing: -0.02em"
          >
            {{ eng.titre }}
          </h2>
          <p
            class="mt-5 font-serif italic text-cacao-2"
            style="font-size: clamp(18px, 2vw, 24px); line-height: 1.3"
          >
            {{ eng.accroche }}
          </p>
        </div>

        <!-- Corps -->
        <div>
          <p
            class="font-sans text-cacao-2"
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
              <span class="font-sans text-[14px] leading-relaxed text-cacao">{{ detail }}</span>
            </li>
            <li class="border-t" style="border-color: var(--cacao-a12)" />
          </ul>
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
          <span class="ci-eyebrow">La boutique</span>
          <h2
            class="mt-4 font-serif font-medium text-cacao"
            style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
          >
            Le chocolat comme lien<br/>
            <em class="text-cacao-2"><ul>
              <li>Entre la Côte d\'Ivoire et la France.</li>
              <li>Entre les producteurs et les consommateurs.</li>
              <li>Entre les souvenirs, les terres et les créations de demain.</li>
            </ul>
            <p>Carré Ivoire — Le chocolat selon Koko.</p></em>
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
            @click="router.push('/histoire')"
          >
            Notre histoire →
          </button>
        </div>
      </div>
    </section>

  </div>
</template>
