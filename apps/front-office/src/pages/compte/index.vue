<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();

const stats = [
  { label: "Commandes", value: "12" },
  { label: "Favoris", value: "4" },
  { label: "Adresses", value: "2" },
  { label: "Depuis", value: "2024" },
];

const orders = [
  { id: "CI-2026-0142", date: "18 mars 2026", total: 62, status: "Livrée" },
  { id: "CI-2026-0098", date: "5 février 2026", total: 48, status: "Livrée" },
];

const shortcuts = [
  { label: "Mes commandes", path: "/compte/commandes" },
  { label: "Mes favoris", path: "/compte/favoris" },
  { label: "Mes informations", path: "/compte/informations" },
];
</script>

<template>
  <div>
    <section
      class="mb-14 border-b pb-10"
      style="border-color: var(--cacao-a12)"
    >
      <span class="ci-eyebrow">Espace client</span>
      <h2
        class="mt-4 font-serif text-brun-cacao"
        style="
          font-size: clamp(36px, 5vw, 64px);
          line-height: 1;
          font-weight: 500;
        "
      >
        Bonjour,
        <em class="text-brun-cacao-2"
          >{{ authStore.user?.firstName ?? "vous" }}.</em
        >
      </h2>
      <p
        class="mt-5 max-w-[620px] font-sans text-[16px] leading-[1.7] text-brun-cacao-2"
      >
        Votre espace réunit vos commandes, vos favoris et vos informations. Tout
        est ici. Clair. Direct.
      </p>

      <div class="mt-8 flex flex-wrap gap-4">
        <button
          v-for="shortcut in shortcuts"
          :key="shortcut.path"
          class="border border-brun-cacao px-5 py-3 font-sans text-[12px] tracking-[0.08em] text-brun-cacao transition-all duration-180 hover:bg-brun-cacao hover:text-ivoire active:translate-y-px"
          @click="router.push(shortcut.path)"
        >
          {{ shortcut.label }}
        </button>
      </div>
    </section>

    <div class="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="border-t pt-4"
        style="border-color: var(--cacao-a12)"
      >
        <div
          class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          {{ stat.label }}
        </div>
        <div
          class="mt-2 font-serif text-[36px] font-medium leading-none text-brun-cacao"
        >
          {{ stat.value }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_0.75fr]">
      <div>
        <h3 class="mb-5 font-serif text-[28px] font-medium text-brun-cacao">
          Dernières commandes
        </h3>

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
            <div
              class="mt-1 font-serif text-[18px] font-medium text-brun-cacao"
            >
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
              class="cursor-pointer border-b border-brun-cacao pb-px font-sans text-[12px] text-brun-cacao"
              @click="router.push('/compte/commandes/' + order.id)"
              >Détail →</a
            >
          </div>
        </div>

        <div class="mt-8">
          <button
            class="border-b border-brun-cacao pb-px font-sans text-[13px] text-brun-cacao transition-opacity duration-180 hover:opacity-60"
            @click="router.push('/compte/commandes')"
          >
            Voir toutes mes commandes →
          </button>
        </div>
      </div>

      <div class="space-y-8">
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div
            class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Adresse par défaut
          </div>
          <div
            class="mt-3 font-serif text-[22px] leading-[1.35] text-brun-cacao"
          >
            4 rue du Nil<br />
            <span class="italic">75002 Paris</span>
          </div>
        </div>

        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div
            class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Raccourcis
          </div>
          <div class="mt-3 space-y-3">
            <button
              class="block w-full border-b border-brun-cacao pb-px text-left font-sans text-[13px] text-brun-cacao"
              @click="router.push('/compte/informations')"
            >
              Modifier mes informations →
            </button>
            <button
              class="block w-full border-b border-brun-cacao pb-px text-left font-sans text-[13px] text-brun-cacao"
              @click="router.push('/compte/favoris')"
            >
              Revoir mes favoris →
            </button>
            <button
              class="block w-full border-b border-brun-cacao pb-px text-left font-sans text-[13px] text-brun-cacao"
              @click="router.push('/compte/commandes')"
            >
              Suivre mes commandes →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
