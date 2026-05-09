<script setup lang="ts">
import { computed, ref } from "vue";
import { useAdminStore } from "@/stores/admin.store";
import { formatCurrency } from "@/data/admin";

const adminStore = useAdminStore();
const restockValues = ref<Record<string, number>>({});

const lowStockProducts = computed(() =>
  adminStore.state.products
    .filter((product) => product.stock < 12)
    .sort((left, right) => left.stock - right.stock),
);

function restock(productId: string) {
  const quantity = restockValues.value[productId] || 0;
  if (quantity <= 0) {
    return;
  }

  adminStore.setState({
    ...adminStore.state,
    products: adminStore.state.products.map((product) =>
      product.id === productId
        ? {
            ...product,
            stock: product.stock + quantity,
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : product,
    ),
  });
  restockValues.value[productId] = 0;
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div>
        <div
          class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45"
        >
          04 — Stocks
        </div>
        <h2
          class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl"
        >
          Le stock, <span class="italic text-cocoa/55">à portée de main.</span>
        </h2>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-3">
      <article class="border border-cocoa/12 bg-ivory p-5">
        <div
          class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
        >
          Produits suivis
        </div>
        <div class="mt-3 font-display text-4xl text-cocoa">
          {{ adminStore.state.products.length }}
        </div>
      </article>
      <article class="border border-cocoa/12 bg-ivory p-5">
        <div
          class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
        >
          Stock bas
        </div>
        <div class="mt-3 font-display text-4xl text-gold">
          {{ lowStockProducts.length }}
        </div>
      </article>
      <article class="border border-cocoa/12 bg-ivory p-5">
        <div
          class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
        >
          Valeur catalogue
        </div>
        <div class="mt-3 font-display text-4xl text-cocoa">
          {{
            formatCurrency(
              adminStore.state.products.reduce(
                (sum, product) => sum + product.price * product.stock,
                0,
              ),
            )
          }}
        </div>
      </article>
    </section>

    <section class="overflow-hidden border border-cocoa/12 bg-ivory">
      <div
        class="grid grid-cols-[96px_minmax(0,2fr)_minmax(0,1.2fr)_92px_132px_96px] border-b border-cocoa/12 px-6 py-4 font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
      >
        <span>Réf.</span>
        <span>Produit</span>
        <span class="text-right">Catégorie</span>
        <span class="text-right">Stock</span>
        <span>Réassort</span>
        <span class="text-right">Action</span>
      </div>

      <div
        v-for="product in lowStockProducts"
        :key="product.id"
        class="grid grid-cols-[96px_minmax(0,2fr)_minmax(0,1.2fr)_92px_132px_96px] items-center gap-4 border-b border-cocoa/8 px-6 py-5 last:border-b-0"
      >
        <span class="font-body text-[11px] text-cocoa/55 tabular-nums">{{
          product.ref
        }}</span>
        <div>
          <div class="font-display text-xl text-cocoa">{{ product.name }}</div>
          <div class="font-body text-[11px] text-cocoa/55">
            {{ product.format }} · {{ product.origin }}
          </div>
        </div>
        <div class="text-right font-body text-sm text-cocoa">
          {{
            adminStore.state.categories.find(
              (category) => category.id === product.category,
            )?.label || "—"
          }}
        </div>
        <div
          class="text-right font-body text-sm tabular-nums"
          :class="product.stock < 5 ? 'text-red-700' : 'text-gold'"
        >
          {{ product.stock }}
        </div>
        <label class="flex items-center gap-3 border-b border-cocoa/20 pb-2">
          <span
            class="font-body text-[10px] uppercase tracking-[0.2em] text-cocoa/45"
            >+ stock</span
          >
          <input
            v-model.number="restockValues[product.id]"
            type="number"
            min="0"
            step="1"
            class="w-20 bg-transparent font-body text-sm text-cocoa outline-none"
          />
        </label>
        <div class="text-right">
          <button
            type="button"
            class="font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/55 hover:underline"
            @click="restock(product.id)"
          >
            Réassort
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
