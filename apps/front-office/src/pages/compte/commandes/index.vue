<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const orders = [
  { id: "CI-2026-0142", date: "18 mars 2026", total: 62, status: "Livrée" },
  { id: "CI-2026-0098", date: "5 février 2026", total: 48, status: "Livrée" },
  {
    id: "CI-2025-0891",
    date: "22 décembre 2025",
    total: 124,
    status: "Livrée",
  },
  { id: "CI-2025-0744", date: "10 novembre 2025", total: 38, status: "Livrée" },
];

const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);
</script>

<template>
  <div>
    <section class="mb-12 border-b pb-8" style="border-color: var(--cacao-a12)">
      <span class="ci-eyebrow">Mes commandes</span>
      <h2
        class="mt-4 font-serif text-brun-cacao"
        style="
          font-size: clamp(32px, 4vw, 56px);
          line-height: 1;
          font-weight: 500;
        "
      >
        Le fil des colis.
      </h2>
      <p
        class="mt-5 max-w-[560px] font-sans text-[15px] leading-[1.7] text-brun-cacao-2"
      >
        Un historique simple, lisible, sans bruit. Statut, date, montant. Chaque
        commande reste à portée.
      </p>
    </section>

    <div class="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
        <div
          class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Commandes
        </div>
        <div
          class="mt-2 font-serif text-[36px] font-medium leading-none text-brun-cacao"
        >
          {{ orders.length }}
        </div>
      </div>
      <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
        <div
          class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Montant total
        </div>
        <div
          class="mt-2 font-serif text-[36px] font-medium leading-none text-brun-cacao"
        >
          {{ totalSpent.toFixed(2).replace(".", ",") }} €
        </div>
      </div>
      <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
        <div
          class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Dernière
        </div>
        <div
          class="mt-2 font-serif text-[22px] font-medium leading-none text-brun-cacao"
        >
          {{ orders[0].date }}
        </div>
      </div>
      <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
        <div
          class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Statut
        </div>
        <div
          class="mt-2 font-serif text-[22px] font-medium leading-none text-dore"
        >
          {{ orders[0].status }}
        </div>
      </div>
    </div>

    <!-- En-tête colonnes -->
    <div
      class="mb-1 grid grid-cols-[1fr_auto] gap-4 border-b pb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-3"
      style="border-color: var(--cacao-a12)"
    >
      <span>Commande</span>
      <span>Montant</span>
    </div>

    <div
      v-for="order in orders"
      :key="order.id"
      class="flex flex-wrap items-center justify-between gap-4 border-b py-5"
      style="border-color: var(--cacao-a08)"
    >
      <div>
        <div
          class="font-sans text-[11px] uppercase tracking-[0.18em] text-brun-cacao-2"
        >
          {{ order.id }}
        </div>
        <div class="mt-1 font-serif text-[18px] font-medium text-brun-cacao">
          {{ order.date }}
        </div>
      </div>

      <div class="flex items-center gap-6">
        <span
          class="font-sans text-[11px] uppercase tracking-[0.18em] text-dore"
        >
          {{ order.status }}
        </span>
        <span
          class="font-sans text-[13px] text-dore"
          style="font-variant-numeric: tabular-nums"
        >
          {{ order.total.toFixed(2).replace(".", ",") }} €
        </span>
        <a
          class="cursor-pointer border-b border-brun-cacao pb-px font-sans text-[12px] text-brun-cacao transition-opacity duration-180 hover:opacity-60"
          @click="router.push('/compte/commandes/' + order.id)"
          >Détail →</a
        >
      </div>
    </div>

    <!-- État vide -->
    <div v-if="orders.length === 0" class="py-16 text-center">
      <p class="font-serif text-[22px] italic text-brun-cacao-2">
        Aucune commande pour le moment.
      </p>
      <button
        class="mt-6 border-b border-brun-cacao pb-px font-sans text-[13px] text-brun-cacao transition-opacity duration-180 hover:opacity-60"
        @click="router.push('/boutique')"
      >
        Découvrir la boutique →
      </button>
    </div>

    <div class="mt-10 border-t pt-5" style="border-color: var(--cacao-a12)">
      <button
        class="border-b border-brun-cacao pb-px font-sans text-[13px] text-brun-cacao transition-opacity duration-180 hover:opacity-60"
        @click="router.push('/boutique')"
      >
        Revenir à la boutique →
      </button>
    </div>
  </div>
</template>
