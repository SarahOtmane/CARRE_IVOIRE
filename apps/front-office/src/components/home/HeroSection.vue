<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section
    class="relative overflow-hidden"
    style="height: 100vh; min-height: 720px; margin-top: -72px"
  >
    <!-- Image de fond -->
    <video
      src="/assets/heroChocolate.mp4"
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
      autoplay
      muted
      loop
    />

    <!-- Voile pour lisibilité -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to top, var(--cacao-a78) 0%, var(--cacao-a08) 60%, transparent 100%)"
    />

    <!-- Contenu bas-gauche -->
    <div
      class="absolute inset-0 flex flex-col justify-end"
      style="padding: clamp(40px, 8vw, 104px)"
    >
      <div class="flex max-w-[600px] flex-col" style="color: var(--ivoire)">

        <!-- Eyebrow -->
        <span class="mb-7 font-sans text-[10px] uppercase tracking-[0.32em]" style="opacity: 0.75">
          Chocolaterie Bean-to-Bar à Luisant · Fabrication artisanale<br />
          CARRÉ IVOIRE — LE CARRÉ, À L'ÉTAT PUR
        </span>

        <!-- H1 -->
        <h1
          class="mb-14 font-serif font-normal"
          style="font-size: clamp(34px, 6vw, 54px); line-height: 0.95; letter-spacing: -0.02em; color: var(--ivoire)"
        >
          Le cacao ivoirien, transformé ici<br/><br/>
          <em>Des chocolats artisanaux fabriqués de la fève à la tablette dans notre atelier de Luisant</em>
        </h1>

        <!-- CTAs -->
        <div class="flex flex-wrap items-center gap-5">
          <button
            class="px-7 py-4 font-sans text-[13px] tracking-[0.08em] transition-all duration-180 active:translate-y-px"
            style="background: var(--ivoire); border: 1px solid var(--ivoire); color: var(--brun-cacao)"
            @click="router.push('/boutique')"
          >
            Découvrir la boutique
          </button>
          <RouterLink
            to="/histoire"
            class="pb-0.5 font-sans text-[13px]"
            style="color: var(--ivoire); border-bottom: 1px solid var(--ivoire)"
          >
            Notre histoire →
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
