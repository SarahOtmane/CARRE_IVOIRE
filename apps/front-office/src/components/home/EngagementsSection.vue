<script setup lang="ts">
const engagements = [
  {
    num: '01',
    title: 'Valoriser le cacao ivoirien',
    text: 'Nous souhaitons faire découvrir toute la richesse du cacao ivoirien, de ses terroirs et de ses arômes.',
  },
  {
    num: '02',
    title: 'Fabriquer de la fève à la tablette',
    text: 'Nous transformons nous-mêmes les fèves de cacao dans notre atelier de Luisant.',
  },
  {
    num: '03',
    title: 'Respecter le travail des producteurs',
    text: 'Derrière chaque fève se trouvent des femmes et des hommes dont le travail mérite d\'être reconnu et valorisé',
  },
  {
    num: '04',
    title: 'Favoriser la traçabilité',
    text: 'Connaître l\'origine de nos fèves et suivre leur transformation est essentiel.',
  },
  {
    num: '05',
    title: 'Protéger les terres et l\'enfance',
    text: 'Le cacao ne doit jamais être produit au détriment des enfants ni des écosystèmes.',
  },
  {
    num: '06',
    title: 'Produire avec sincérité',
    text: 'Nos chocolats sont fabriqués en petites séries, avec des recettes maîtrisées et des ingrédients sélectionnés avec soin.',
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
        class="mt-4 font-serif font-medium text-cacao"
        style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
      >
        Six principes,<br/>
        <em>sans compromis.</em>
      </h2>
    </div>

    <!-- Grille des engagements -->
    <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="e in engagements"
        :key="e.num"
        class="border-t border-cacao pt-5"
      >
        <div class="mb-4 font-sans text-[11px] uppercase tracking-[0.22em] text-dore">
          {{ e.num }}
        </div>
        <h3 class="mb-3 font-serif text-2xl font-medium text-cacao">
          {{ e.title }}
        </h3>
        <p class="font-sans text-sm leading-relaxed text-cacao-2">
          {{ e.text }}
        </p>
      </div>
    </div>
  </section>
</template>
