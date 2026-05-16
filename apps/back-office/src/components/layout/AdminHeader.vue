<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const sectionTitles: Record<string, string> = {
  dashboard: "Tableau de bord",
  "admin-categories": "Catégories",
  "admin-produits": "Produits",
  "admin-produits-nouveau": "Nouveau produit",
  "admin-produits-modifier": "Modifier le produit",
  "admin-commandes": "Commandes",
  "admin-commandes-detail": "Détail commande",
  "admin-stocks": "Stocks",
  "admin-pages": "Pages éditoriales",
  "admin-clients": "Clients",
  "admin-parametres": "Paramètres",
};

const currentTitle = computed(
  () => sectionTitles[String(route.name)] || "Atelier admin",
);

function logout() {
  authStore.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <header
    class="flex items-center justify-between border-b border-cocoa/12 bg-ivory px-6 py-4 lg:px-8"
  >
    <div class="min-w-0">
      <div class="flex flex-wrap items-baseline gap-3">
        <span
          class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/55"
          >Back-office</span
        >
        <span
          class="font-body text-[10px] uppercase tracking-[0.2em] text-cocoa/45"
          >Carré Ivoire</span
        >
      </div>
      <h1 class="mt-2 truncate font-display text-2xl text-cocoa sm:text-[2rem]">
        {{ currentTitle }}
      </h1>
    </div>

    <div class="flex items-center gap-3">
      <div class="hidden text-right sm:block">
        <div
          class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
        >
          Connecté
        </div>
        <div class="font-display text-lg text-cocoa">
          {{ authStore.fullName || "Équipe admin" }}
        </div>
      </div>

      <button
        type="button"
        class="border border-cocoa px-4 py-2 font-body text-[11px] uppercase tracking-[0.16em] text-cocoa transition-colors duration-200 hover:bg-cocoa hover:text-ivory"
        @click="logout"
      >
        Déconnexion
      </button>
    </div>
  </header>
</template>
