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
          src="/assets/parcours.jpg"
          alt="Mon parcours"
          class="h-full w-full object-cover"
        />
      </div>

      <!-- Texte -->
      <div>
        <span class="ci-eyebrow">03 — Parcours</span>

        <h2
          class="mb-8 mt-4 font-serif font-medium text-cacao"
          style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
        >
          Une histoire entre la Côte d'Ivoire et la France<br/>
          <em class="text-cacao-2">Carré Ivoire est née d'un lien profond avec la terre du cacao.</em>
        </h2>

        <p class="mb-5 max-w-[480px] font-sans leading-relaxed text-cacao-2" style="font-size: 18px; line-height: 1.7">
          Originaire de Côte d'Ivoire et issue d'une famille de planteurs, </p>

        <p class="mb-10 max-w-[480px] font-sans text-cacao-2" style="font-size: 18px; line-height: 1.7">
          Koko transforme aujourd'hui les fèves dans son atelier de Luisant, avec la volonté de faire découvrir un chocolat sincère, artisanal et porteur d'histoire
        </p>

        <button
          class="border border-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-cacao transition-all duration-180 hover:bg-cacao hover:text-ivoire active:translate-y-px"
          @click="router.push('/histoire')"
        >
          Découvrir l’histoire de Carré Ivoire
        </button>
      </div>
    </div>
  </section>
</template>
