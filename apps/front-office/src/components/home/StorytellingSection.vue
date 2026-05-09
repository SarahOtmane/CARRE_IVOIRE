<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)">
    <div class="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">

      <!-- Image 4:5 -->
      <div class="overflow-hidden" style="aspect-ratio: 4/5">
        <img
          src="/assets/maison-atelier.svg"
          alt="L'atelier Carré Ivoire, rue du Nil"
          class="h-full w-full object-cover"
        />
      </div>

      <!-- Texte -->
      <div>
        <span class="ci-eyebrow">03 — Maison</span>

        <h2
          class="mb-8 mt-4 font-serif font-medium text-brun-cacao"
          style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
        >
          Rue du Nil,<br/>
          <em class="text-brun-cacao-2">depuis 2019.</em>
        </h2>

        <p class="mb-5 max-w-[480px] font-sans leading-relaxed text-brun-cacao-2" style="font-size: 18px; line-height: 1.7">
          Nous choisissons les fèves. Nous les torréfions. Nous les broyons. Nous faisons le chocolat, en petite quantité, chaque semaine.
        </p>

        <p class="mb-10 max-w-[480px] font-sans text-brun-cacao-2" style="font-size: 18px; line-height: 1.7">
          Deux ingrédients suffisent : la fève et le sucre. Tout le reste est dans la main.
        </p>

        <button
          class="border border-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-brun-cacao transition-all duration-180 hover:bg-brun-cacao hover:text-ivoire active:translate-y-px"
          @click="router.push('/histoire')"
        >
          Visiter l'atelier
        </button>
      </div>
    </div>
  </section>
</template>
