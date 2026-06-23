<script setup lang="ts">
import { useRouter } from "vue-router";
import { Button } from "@carre-ivoire/ui";
const router = useRouter();
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cacao pb-8">
      <div>
        <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cacao/45">
          06 — Clients
        </div>
        <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cacao sm:text-6xl">
          Notre carnet <span class="italic text-cacao/55">d'adresses.</span>
        </h2>
      </div>
    </section>

    <div class="border border-cacao bg-ivoire px-8 py-16 text-center">
      <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/45">À venir</div>
      <h3 class="mt-4 font-display text-3xl text-cacao">
        Gestion des clients <span class="italic text-cacao/55">en cours de développement.</span>
      </h3>
      <p class="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-cacao/55">
        L'API clients sera disponible dans une prochaine version.
        Les commandes existantes sont accessibles depuis l'onglet Commandes.
      </p>
      <Button
        class="mt-8"
        @click="router.push({ name: 'admin-commandes' })"
      >
        Voir les commandes
      </Button>
    </div>
  </div>
</template>
