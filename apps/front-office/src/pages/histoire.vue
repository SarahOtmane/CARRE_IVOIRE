<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const etapes = [
  {
    num: '01',
    titre: 'Choisir',
    texte: 'Nous sélectionnons les fèves directement auprès des producteurs. Venezuela, Madagascar, Ghana. Chaque origine est testée pendant des semaines avant d\'être retenue.',
  },
  {
    num: '02',
    titre: 'Torréfier',
    texte: 'La torréfaction est le moment décisif. Trop courte, la fève reste acide. Trop longue, elle brûle. Nous torréfions à basse température, lentement, pour préserver les arômes.',
  },
  {
    num: '03',
    titre: 'Broyer',
    texte: '72 heures de broyage minimum. La masse de cacao devient liquide, puis pâte, puis couverture. Le conchage développe la rondeur et efface l\'amertume résiduelle.',
  },
  {
    num: '04',
    titre: 'Tempérer',
    texte: 'Le tempérage cristallise le beurre de cacao. C\'est ce qui donne le craquant net à la casse, le brillant à la surface, la fonte propre en bouche.',
  },
]

const dates = [
  { annee: '2019', fait: 'Ouverture rue du Nil. Deux fondateurs, un mélandeur, mille kilos de fèves.' },
  { annee: '2020', fait: 'Premières tablettes vendues. La Porcelana vénézuélienne devient la signature maison.' },
  { annee: '2021', fait: 'Lancement des Coffrets Signature. Neuf carrés, trois origines.' },
  { annee: '2022', fait: 'Première récolte en agroforesterie sourcée directement au Piémont.' },
  { annee: '2024', fait: '200 variétés de fèves testées. Douze retenues. Chacune pour une raison précise.' },
  { annee: '2026', fait: 'Ouverture de la boutique en ligne. Le carré franchit la porte de la manufacture.' },
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
        <span class="ci-eyebrow">Notre Maison</span>
        <h1
          class="mt-4 font-serif font-medium text-brun-cacao"
          style="font-size: clamp(48px, 7vw, 96px); line-height: 0.95; letter-spacing: -0.02em"
        >
          Rue du Nil,<br/>
          <em class="text-brun-cacao-2">une obsession.</em>
        </h1>
        <p
          class="mt-12 max-w-[560px] font-sans text-brun-cacao-2"
          style="font-size: 18px; line-height: 1.7"
        >
          Depuis 2019, nous fabriquons le chocolat à la main, dans notre atelier parisien.
          Deux ingrédients. Des fèves choisies. Rien d'autre.
        </p>
      </div>
    </section>

    <!-- ── Le processus ───────────────────────────────────── -->
    <section
      class="bg-ivoire"
      style="padding: 0 clamp(20px, 6vw, 104px) clamp(80px, 12vw, 192px)"
    >
      <div class="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">

        <!-- Image atelier -->
        <div class="overflow-hidden" style="aspect-ratio: 4/5">
          <img
            src="/assets/maison-atelier.svg"
            alt="L'atelier Carré Ivoire, rue du Nil, Paris"
            class="h-full w-full object-cover"
          />
        </div>

        <!-- Étapes de fabrication -->
        <div class="lg:pt-2">
          <span class="ci-eyebrow">01 — Le processus</span>
          <h2
            class="mb-14 mt-4 font-serif font-medium text-brun-cacao"
            style="font-size: clamp(28px, 3.5vw, 44px); line-height: 1.05"
          >
            De la fève<br/>
            <em class="text-brun-cacao-2">au carré.</em>
          </h2>

          <div
            v-for="etape in etapes"
            :key="etape.num"
            class="border-t py-7"
            style="border-color: var(--cacao-a12)"
          >
            <div class="flex items-baseline gap-5">
              <span
                class="shrink-0 font-sans text-[11px] uppercase tracking-[0.22em] text-dore"
                style="width: 24px"
              >{{ etape.num }}</span>
              <div>
                <h3 class="font-serif text-[20px] font-medium text-brun-cacao">{{ etape.titre }}</h3>
                <p class="mt-2 font-sans text-[14px] leading-relaxed text-brun-cacao-2">{{ etape.texte }}</p>
              </div>
            </div>
          </div>
          <div class="border-t" style="border-color: var(--cacao-a12)" />
        </div>
      </div>
    </section>

    <!-- ── Dates clés ─────────────────────────────────────── -->
    <section
      class="bg-rose-poudre"
      style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)"
    >
      <div class="mb-20">
        <span class="ci-eyebrow">02 — Chronologie</span>
        <h2
          class="mt-4 font-serif font-medium text-brun-cacao"
          style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
        >
          La maison,<br/>
          <em class="text-brun-cacao-2">année par année.</em>
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="d in dates"
          :key="d.annee"
          class="border-t py-10 pr-10"
          style="border-color: var(--cacao-a24)"
        >
          <div class="mb-4 font-serif text-[40px] font-medium leading-none text-dore">
            {{ d.annee }}
          </div>
          <p class="font-sans text-[14px] leading-relaxed text-brun-cacao-2">{{ d.fait }}</p>
        </div>
      </div>
    </section>

    <!-- ── Manifeste ──────────────────────────────────────── -->
    <section
      class="bg-beige-doux"
      style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)"
    >
      <div class="mx-auto max-w-[760px] text-center">
        <span class="ci-eyebrow">03 — Philosophie</span>
        <blockquote
          class="mt-8 font-serif italic text-brun-cacao"
          style="font-size: clamp(28px, 4vw, 52px); line-height: 1.1; letter-spacing: -0.01em"
        >
          « Deux ingrédients suffisent.<br/>
          Tout le reste est dans la main. »
        </blockquote>
        <p class="mt-8 font-sans text-[11px] uppercase tracking-[0.22em] text-brun-cacao-3">
          — Rue du Nil, 2019
        </p>
      </div>
    </section>

    <!-- ── CTA ────────────────────────────────────────────── -->
    <section
      class="bg-ivoire"
      style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)"
    >
      <div class="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-[560px]">
          <span class="ci-eyebrow">04 — La boutique</span>
          <h2
            class="mt-4 font-serif font-medium text-brun-cacao"
            style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
          >
            Le résultat,<br/>
            <em class="text-brun-cacao-2">vous pouvez le goûter.</em>
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
