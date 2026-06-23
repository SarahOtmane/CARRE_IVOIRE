<script setup lang="ts">
const engagements = [
  {
    num: '01',
    title: 'Bean-to-bar',
    text: 'Nous choisissons la fève. Nous faisons le chocolat. De bout en bout.',
  },
  {
    num: '02',
    title: 'Agroforesterie',
    text: 'Toutes nos fèves proviennent de cacaoyers cultivés en agroforesterie.',
  },
  {
    num: '03',
    title: 'Deux ingrédients',
    text: 'Fèves de cacao et sucre de canne bio. Rien d\'autre, jamais.',
  },
  {
    num: '04',
    title: 'Paris, rue du Nil',
    text: 'Fabriqué à la main, dans notre manufacture-boutique.',
  },
]
</script>

<template>
  <section
    class="bg-beige-doux"
    style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)"
  >
    <!-- En-tête -->
    <div class="mb-20">
      <span class="ci-eyebrow">04 — Engagements</span>
      <h2
        class="mt-4 font-serif font-medium text-brun-cacao"
        style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
      >
        Quatre principes,<br/>
        <em>sans compromis.</em>
      </h2>
    </div>

    <!-- Grille des engagements -->
    <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="e in engagements"
        :key="e.num"
        class="border-t border-brun-cacao pt-5"
      >
        <div class="mb-4 font-sans text-[11px] uppercase tracking-[0.22em] text-dore">
          {{ e.num }}
        </div>
        <h3 class="mb-3 font-serif text-2xl font-medium text-brun-cacao">
          {{ e.title }}
        </h3>
        <p class="font-sans text-sm leading-relaxed text-brun-cacao-2">
          {{ e.text }}
        </p>
      </div>
    </div>
  </section>
</template>
