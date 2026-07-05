<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { useRouter } from "vue-router";
import { useHistoire } from "@carre-ivoire/composables";

const router = useRouter();
const { sections } = useHistoire();

useHead({
  title: "Mon histoire — Carré Ivoire",
  meta: [
    {
      name: "description",
      content:
        "De la Côte d'Ivoire à la France : découvrez l'histoire de Carré Ivoire, chocolaterie artisanale Bean-to-Bar née d'un souvenir d'enfance.",
    },
  ],
});
</script>

<template>
  <div class="bg-ivoire">
    <!-- Hero -->
    <section
      class="bg-ivoire"
      style="
        padding: clamp(88px, 10vw, 160px) clamp(20px, 6vw, 104px)
          clamp(72px, 8vw, 128px);
      "
    >
      <div class="mx-auto max-w-[860px] text-center">
        <span class="ci-eyebrow">Mon histoire</span>
        <h1
          class="mt-4 font-serif font-medium text-cacao"
          style="
            font-size: clamp(44px, 6vw, 88px);
            line-height: 1;
            letter-spacing: -0.03em;
          "
        >
          Il existe des souvenirs<br />
          <em class="text-cacao-2">qui ne nous quittent jamais.</em>
        </h1>
      </div>
    </section>

    <!-- Sections alternées image / texte -->
    <section
      v-for="(section, index) in sections"
      :key="section.id"
      :class="index % 2 === 0 ? 'bg-ivoire' : 'bg-rose-poudre'"
      style="padding: clamp(64px, 8vw, 128px) clamp(20px, 6vw, 104px)"
    >
      <div
        class="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <!-- Image -->
        <div
          class="border border-cacao-a12 bg-papier p-4"
          :class="section.imageSide === 'right' ? 'lg:order-2' : 'lg:order-1'"
        >
          <img
            :src="section.image"
            :alt="section.imageAlt"
            class="aspect-[4/3] w-full object-cover"
          />
        </div>

        <!-- Texte -->
        <div
          class="space-y-6"
          :class="section.imageSide === 'right' ? 'lg:order-1' : 'lg:order-2'"
        >
          <p
            v-for="(paragraphe, pIndex) in section.paragraphs"
            :key="pIndex"
            class="font-sans text-cacao-2"
            style="font-size: clamp(16px, 1.7vw, 18px); line-height: 1.8"
          >
            {{ paragraphe }}
          </p>
        </div>
      </div>
    </section>

    <!-- Conclusion -->
    <section
      class="bg-beige-doux"
      style="padding: clamp(96px, 12vw, 192px) clamp(20px, 6vw, 104px)"
    >
      <div class="mx-auto max-w-[860px] text-center">
        <div class="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            class="border border-cacao bg-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
            @click="router.push('/boutique')"
          >
            Découvrir la boutique
          </button>
          <button
            class="border border-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-cacao transition-all duration-180 hover:bg-cacao hover:text-ivoire active:translate-y-px"
            @click="router.push('/engagements')"
          >
            Nos engagements
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
