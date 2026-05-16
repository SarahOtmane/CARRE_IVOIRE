<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const orderId = route.params.id as string;

const allOrders = [
  {
    id: "CI-2026-0142",
    date: "18 mars 2026",
    total: 62,
    status: "Livrée",
    livraison: "ChronoFresh — livré le 20 mars 2026",
    adresse: "14 rue Vivienne, 75002 Paris",
    items: [
      {
        name: "Coffret Découverte",
        origin: "9 carrés · 3 origines",
        qty: 1,
        price: 48,
        image: "/assets/products/coffret-decouverte.svg",
        format: "9 carrés",
      },
      {
        name: "Noir Pur — 72%",
        origin: "Venezuela · Porcelana",
        qty: 1,
        price: 14,
        image: "/assets/products/tablet-noir-pur.svg",
        format: "70g",
      },
    ],
  },
  {
    id: "CI-2026-0098",
    date: "5 février 2026",
    total: 48,
    status: "Livrée",
    livraison: "Coursier Paris — livré le 6 février 2026",
    adresse: "14 rue Vivienne, 75002 Paris",
    items: [
      {
        name: "Coffret Découverte",
        origin: "9 carrés · 3 origines",
        qty: 1,
        price: 48,
        image: "/assets/products/coffret-decouverte.svg",
        format: "9 carrés",
      },
    ],
  },
  {
    id: "CI-2025-0891",
    date: "22 décembre 2025",
    total: 124,
    status: "Livrée",
    livraison: "ChronoFresh — livré le 24 décembre 2025",
    adresse: "14 rue Vivienne, 75002 Paris",
    items: [
      {
        name: "Coffret Signature",
        origin: "16 carrés · 5 origines",
        qty: 1,
        price: 64,
        image: "/assets/products/coffret-decouverte.svg",
        format: "16 carrés",
      },
      {
        name: "Truffes Noires",
        origin: "Ghana · Forastero",
        qty: 2,
        price: 22,
        image: "/assets/products/truffes-noires.svg",
        format: "Boîte 12",
      },
      {
        name: "Praliné Noisette",
        origin: "Piémont · Tonda Gentile",
        qty: 1,
        price: 16,
        image: "/assets/products/tablet-praline-noisette.svg",
        format: "70g",
      },
    ],
  },
  {
    id: "CI-2025-0744",
    date: "10 novembre 2025",
    total: 38,
    status: "Livrée",
    livraison: "Retrait boutique — retiré le 11 novembre 2025",
    adresse: "4 rue du Nil, 75002 Paris",
    items: [
      {
        name: "Praliné Noisette",
        origin: "Piémont · Tonda Gentile",
        qty: 1,
        price: 16,
        image: "/assets/products/tablet-praline-noisette.svg",
        format: "70g",
      },
      {
        name: "Lait Madagascar",
        origin: "Madagascar · Sambirano",
        qty: 1,
        price: 15,
        image: "/assets/products/tablet-noir-pur.svg",
        format: "70g",
      },
      {
        name: "Noir Pur — 72%",
        origin: "Venezuela · Porcelana",
        qty: 1,
        price: 14,
        image: "/assets/products/tablet-noir-pur.svg",
        format: "70g",
      },
    ],
  },
];

const order = computed(() => allOrders.find((o) => o.id === orderId));
const subtotal = computed(() =>
  order.value
    ? order.value.items.reduce((acc, i) => acc + i.price * i.qty, 0)
    : 0,
);

const timeline = [
  { label: "Commande passée", value: "18 mars 2026" },
  { label: "Préparation", value: "19 mars 2026" },
  { label: "Expédition", value: "19 mars 2026" },
  { label: "Livraison", value: "20 mars 2026" },
];
</script>

<template>
  <div v-if="order">
    <section class="mb-10 border-b pb-8" style="border-color: var(--cacao-a12)">
      <span class="ci-eyebrow">Détail commande</span>
      <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div
            class="font-sans text-[11px] uppercase tracking-[0.18em] text-brun-cacao-2"
          >
            {{ order.id }}
          </div>
          <h2
            class="mt-2 font-serif text-brun-cacao"
            style="
              font-size: clamp(32px, 4vw, 56px);
              line-height: 1;
              font-weight: 500;
            "
          >
            {{ order.date }}
          </h2>
        </div>
        <span
          class="font-sans text-[11px] uppercase tracking-[0.18em] text-dore"
        >
          {{ order.status }}
        </span>
      </div>
      <p
        class="mt-5 max-w-[560px] font-sans text-[15px] leading-[1.7] text-brun-cacao-2"
      >
        Votre colis suit sa trajectoire. Articles, adresse, total et chronologie
        sont réunis ci-dessous.
      </p>
    </section>

    <div class="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
        <div
          class="mb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Chronologie
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="step in timeline"
            :key="step.label"
            class="border-t pt-4"
            style="border-color: var(--cacao-a08)"
          >
            <div
              class="font-sans text-[10px] uppercase tracking-[0.18em] text-dore"
            >
              {{ step.label }}
            </div>
            <div
              class="mt-2 font-serif text-[18px] font-medium text-brun-cacao"
            >
              {{ step.value }}
            </div>
          </div>
        </div>
      </div>

      <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
        <div
          class="mb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Livraison
        </div>
        <p class="font-sans text-[14px] leading-relaxed text-brun-cacao-2">
          {{ order.livraison }}<br />{{ order.adresse }}
        </p>
      </div>
    </div>

    <!-- Articles -->
    <div class="mb-8">
      <div
        v-for="(item, i) in order.items"
        :key="i"
        class="flex gap-5 border-b py-5"
        style="border-color: var(--cacao-a08)"
      >
        <div class="h-[88px] w-[88px] shrink-0 bg-papier">
          <img
            :src="item.image"
            :alt="item.name"
            class="h-full w-full object-cover"
          />
        </div>
        <div class="flex flex-1 flex-col justify-between">
          <div>
            <div class="font-serif text-[18px] font-medium text-brun-cacao">
              {{ item.name }}
            </div>
            <div
              class="mt-1 font-sans text-[11px] uppercase tracking-[0.18em] text-brun-cacao-2"
            >
              {{ item.origin }} · Format {{ item.format }} · Qté {{ item.qty }}
            </div>
          </div>
          <div
            class="font-sans text-[13px] text-dore"
            style="font-variant-numeric: tabular-nums"
          >
            {{ (item.price * item.qty).toFixed(2).replace(".", ",") }} €
          </div>
        </div>
      </div>
    </div>

    <div class="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
        <div
          class="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-3"
        >
          Récapitulatif
        </div>
        <div class="flex justify-between py-2 font-sans text-[13px]">
          <span class="text-brun-cacao-2">Sous-total</span>
          <span
            class="text-brun-cacao"
            style="font-variant-numeric: tabular-nums"
          >
            {{ subtotal.toFixed(2).replace(".", ",") }} €
          </span>
        </div>
        <div class="flex justify-between py-2 font-sans text-[13px]">
          <span class="text-brun-cacao-2">Livraison</span>
          <span class="text-brun-cacao">Offerte</span>
        </div>
        <div
          class="flex justify-between border-t py-2 font-serif text-[18px] font-medium"
          style="border-color: var(--cacao-a12)"
        >
          <span class="text-brun-cacao">Total</span>
          <span class="text-dore" style="font-variant-numeric: tabular-nums">
            {{ order.total.toFixed(2).replace(".", ",") }} €
          </span>
        </div>
      </div>

      <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
        <div
          class="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-3"
        >
          Adresse de livraison
        </div>
        <p class="font-serif text-[18px] leading-[1.45] text-brun-cacao">
          {{ order.adresse }}
        </p>
      </div>
    </div>

    <button
      class="border-b border-brun-cacao pb-px font-sans text-[13px] text-brun-cacao transition-opacity duration-180 hover:opacity-60"
      @click="router.push('/compte/commandes')"
    >
      ← Retour aux commandes
    </button>
  </div>

  <!-- Commande introuvable -->
  <div v-else class="py-16 text-center">
    <span class="ci-eyebrow">Introuvable</span>
    <h2 class="mt-3 font-serif text-[28px] font-medium text-brun-cacao">
      Cette commande n'existe pas.
    </h2>
    <button
      class="mt-6 border-b border-brun-cacao pb-px font-sans text-[13px] text-brun-cacao"
      @click="router.push('/compte/commandes')"
    >
      ← Retour aux commandes
    </button>
  </div>
</template>
