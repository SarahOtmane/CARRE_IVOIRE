<script setup lang="ts">
import { useRouter } from "vue-router";
import type { ProductResponse } from "@carre-ivoire/types";

const router = useRouter();

const favoris: ProductResponse[] = [];
</script>

<template>
  <div>
    <section class="mb-12 border-b pb-8" style="border-color: var(--cacao-a12)">
      <span class="ci-eyebrow">Mes favoris</span>
      <h2
        class="mt-4 font-serif text-brun-cacao"
        style="
          font-size: clamp(32px, 4vw, 56px);
          line-height: 1;
          font-weight: 500;
        "
      >
        Les produits retenus.
      </h2>
      <p
        class="mt-5 max-w-[560px] font-sans text-[15px] leading-[1.7] text-brun-cacao-2"
      >
        Vos choix se déposent ici. Tablettes, coffrets, gourmandises. Le cœur
        marque ce que vous gardez en vue.
      </p>
    </section>

    <div class="mb-8 flex items-center justify-between">
      <div
        class="font-sans text-[11px] uppercase tracking-[0.22em] text-brun-cacao-2"
      >
        {{ favoris.length }} article<span v-if="favoris.length > 1">s</span>
      </div>
      <button
        class="border-b border-brun-cacao pb-px font-sans text-[13px] text-brun-cacao transition-opacity duration-180 hover:opacity-60"
        @click="router.push('/boutique')"
      >
        Ajouter d'autres pièces →
      </button>
    </div>

    <!-- Grille favoris -->
    <div
      v-if="favoris.length > 0"
      class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
    >
      <ProductCard
        v-for="product in favoris"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- État vide -->
    <div v-else class="py-16 text-center">
      <p class="font-serif text-[22px] italic text-brun-cacao-2">
        Aucun favori pour le moment.
      </p>
      <p class="mt-3 font-sans text-[14px] leading-relaxed text-brun-cacao-3">
        Retrouvez le cœur sur chaque fiche produit pour les enregistrer ici.
      </p>
      <button
        class="mt-6 border-b border-brun-cacao pb-px font-sans text-[13px] text-brun-cacao transition-opacity duration-180 hover:opacity-60"
        @click="router.push('/boutique')"
      >
        Découvrir la boutique →
      </button>
    </div>
  </div>
</template>
