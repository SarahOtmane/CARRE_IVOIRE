<script setup lang="ts">
import { useRouter } from "vue-router";
import { useFavorites } from "@carre-ivoire/composables";
import ProductCard from "@/components/product/ProductCard.vue";
import { useHead } from '@unhead/vue'

useHead({
  title: 'Mes favoris — Carré Ivoire',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const router = useRouter();
const { favorites, isLoading } = useFavorites();
</script>

<template>
  <div>
    <section class="mb-12 border-b pb-8" style="border-color: var(--cacao-a12)">
      <span class="ci-eyebrow">Mes favoris</span>
      <h2
        class="mt-4 font-serif text-cacao"
        style="
          font-size: clamp(32px, 4vw, 56px);
          line-height: 1;
          font-weight: 500;
        "
      >
        Les produits retenus.
      </h2>
      <p
        class="mt-5 max-w-[560px] font-sans text-[15px] leading-[1.7] text-cacao-2"
      >
        Vos choix se déposent ici. Tablettes, coffrets, gourmandises. Le cœur
        marque ce que vous gardez en vue.
      </p>
    </section>

    <div v-if="!isLoading" class="mb-8 flex items-center justify-between">
      <div
        class="font-sans text-[11px] uppercase tracking-[0.22em] text-cacao-2"
      >
        {{ favorites.length }} article<span v-if="favorites.length > 1">s</span>
      </div>
      <button
        class="border-b border-cacao pb-px font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
        @click="router.push({ name: 'boutique' })"
      >
        Ajouter d'autres produits →
      </button>
    </div>

    <!-- Chargement -->
    <div v-if="isLoading" class="py-16 text-center">
      <span class="ci-eyebrow">Chargement</span>
    </div>

    <!-- Grille favoris -->
    <div
      v-else-if="favorites.length > 0"
      class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
    >
      <ProductCard
        v-for="favorite in favorites"
        :key="favorite.id"
        :product="favorite.product"
      />
    </div>

    <!-- État vide -->
    <div v-else class="py-16 text-center">
      <p class="font-serif text-[22px] italic text-cacao-2">
        Aucun favori pour le moment.
      </p>
      <p class="mt-3 font-sans text-[14px] leading-relaxed text-cacao-3">
        Retrouvez le cœur sur chaque fiche produit pour les enregistrer ici.
      </p>
      <button
        class="mt-6 border-b border-cacao pb-px font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
        @click="router.push({ name: 'boutique' })"
      >
        Découvrir la boutique →
      </button>
    </div>
  </div>
</template>
