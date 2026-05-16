<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CategoryGlyph from './CategoryGlyph.vue'

const router = useRouter()
const hoveredSlug = ref<string | null>(null)

const categories = [
  { slug: 'carres-signature', num: '01', label: 'Carrés Signature', tagline: 'bonbons au chocolat',        bg: 'var(--brun-cacao)',   fg: 'var(--ivoire)',     featured: true },
  { slug: 'mini-carres',      num: '02', label: 'Mini Carrés',       tagline: 'format dégustation',         bg: 'var(--rose-poudre)', fg: 'var(--brun-cacao)' },
  { slug: 'tablettes',        num: '03', label: 'Tablettes',          tagline: 'pur cacao, grand format',    bg: 'var(--beige-doux)',  fg: 'var(--brun-cacao)' },
  { slug: 'gourmandises',     num: '04', label: 'Gourmandises',       tagline: 'praliné, caramel, noisette', bg: 'var(--ivoire-deep)', fg: 'var(--brun-cacao)' },
  { slug: 'sables',           num: '05', label: 'Sablés',             tagline: 'biscuits au beurre',         bg: 'var(--rose-poudre)', fg: 'var(--brun-cacao)' },
  { slug: 'mendiants',        num: '06', label: 'Mendiants',          tagline: 'fruits secs & cacao',        bg: 'var(--beige-doux)',  fg: 'var(--brun-cacao)' },
  { slug: 'oursons',          num: '07', label: 'Oursons',            tagline: 'guimauve enrobée',           bg: 'var(--ivoire-deep)', fg: 'var(--brun-cacao)' },
  { slug: 'chocobombs',       num: '08', label: 'Chocobombs',         tagline: 'édition printemps',          bg: 'var(--brun-cacao-2)', fg: 'var(--ivoire)' },
  { slug: 'pates-a-tartiner', num: '09', label: 'Pâtes à tartiner',   tagline: 'noisette & cacao',           bg: 'var(--rose-poudre)', fg: 'var(--brun-cacao)' },
]
</script>

<template>
  <section style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)">

    <!-- En-tête de section -->
    <div class="mb-20 flex flex-wrap items-end justify-between gap-10">
      <div class="max-w-[620px]">
        <span class="ci-eyebrow">01 — La boutique</span>
        <h2
          class="mt-4 font-serif font-medium text-brun-cacao"
          style="font-size: clamp(32px, 4.5vw, 64px); line-height: 1; letter-spacing: -0.01em"
        >
          Neuf familles,<br/>
          <em class="text-brun-cacao-2">une même obsession.</em>
        </h2>
      </div>
      <div class="flex flex-col items-end gap-3">
        <span class="font-sans text-[11px] uppercase tracking-[0.22em] text-brun-cacao-3">— I / IV</span>
        <RouterLink
          to="/boutique"
          class="border-b border-brun-cacao pb-0.5 font-sans text-[13px] text-brun-cacao"
        >
          Voir la boutique →
        </RouterLink>
      </div>
    </div>

    <!-- Grille des catégories -->
    <div
      class="grid grid-cols-12"
      style="gap: 2px; border-top: 1px solid var(--cacao-a24); border-left: 1px solid var(--cacao-a24)"
    >
      <div
        v-for="(cat, i) in categories"
        :key="cat.slug"
        class="relative cursor-pointer overflow-hidden transition-[filter] duration-400"
        :class="i === 0 ? 'col-span-6 row-span-2' : 'col-span-3'"
        :style="{
          aspectRatio: i === 0 ? undefined : '1/1',
          background: cat.bg,
          color: cat.fg,
          padding: i === 0 ? 'clamp(24px, 3vw, 44px)' : 'clamp(16px, 2vw, 28px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid var(--cacao-a24)',
          borderBottom: '1px solid var(--cacao-a24)',
        }"
        @mouseenter="hoveredSlug = cat.slug"
        @mouseleave="hoveredSlug = null"
        @click="router.push('/boutique/' + cat.slug)"
      >
        <!-- Numéro + badge Signature + glyph -->
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="font-sans text-[10px] tracking-[0.22em]" style="opacity: 0.6">{{ cat.num }}</div>
            <div
              v-if="cat.featured"
              class="mt-2 inline-block border px-2 py-1 font-sans text-[9px] uppercase tracking-[0.22em]"
              :style="{ borderColor: cat.fg, opacity: 0.9 }"
            >Signature</div>
          </div>
          <div
            :style="{ width: i === 0 ? '72px' : '44px', height: i === 0 ? '72px' : '44px', opacity: 0.85, flexShrink: 0 }"
          >
            <CategoryGlyph :slug="cat.slug" />
          </div>
        </div>

        <!-- Titre + tagline + flèche -->
        <div>
          <h3
            class="font-serif font-medium leading-none transition-all duration-200"
            :style="{
              fontSize: i === 0 ? 'clamp(36px, 5vw, 72px)' : 'clamp(22px, 2.2vw, 32px)',
              letterSpacing: '-0.01em',
              fontStyle: hoveredSlug === cat.slug ? 'italic' : 'normal',
              color: cat.fg,
            }"
          >{{ cat.label }}</h3>

          <div class="mt-2.5 flex items-baseline justify-between gap-3">
            <div
              class="font-sans"
              :style="{ fontSize: i === 0 ? '13px' : '11px', opacity: 0.7, letterSpacing: '0.02em' }"
            >{{ cat.tagline }}</div>
            <div
              class="shrink-0 font-sans text-[11px] uppercase tracking-[0.22em] transition-opacity duration-200"
              :style="{ opacity: hoveredSlug === cat.slug ? 1 : 0.6 }"
            >Voir →</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
