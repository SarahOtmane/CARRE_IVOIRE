<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useAdminProducts } from "@carre-ivoire/composables";

const { products, isLoading, fetchAll, update } = useAdminProducts();
const restockValues = ref<Record<number, number>>({});

onMounted(() => fetchAll());

const lowStockProducts = computed(() =>
  [...products.value]
    .filter((p) => p.stock < 12)
    .sort((a, b) => a.stock - b.stock),
);

function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2).replace(".", ",")} €`;
}

const catalogValue = computed(() =>
  products.value.reduce((sum, p) => sum + (p.price / 100) * p.stock, 0),
);

async function restock(productId: number, currentStock: number) {
  const quantity = restockValues.value[productId] || 0;
  if (quantity <= 0) return;
  await update(productId, { stock: currentStock + quantity });
  restockValues.value[productId] = 0;
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div>
        <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45">
          04 — Stocks
        </div>
        <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl">
          Le stock, <span class="italic text-cocoa/55">à portée de main.</span>
        </h2>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-3">
      <article class="border border-cocoa/12 bg-ivory p-5">
        <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Produits suivis</div>
        <div class="mt-3 font-display text-4xl text-cocoa">{{ products.length }}</div>
      </article>
      <article class="border border-cocoa/12 bg-ivory p-5">
        <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Stock bas</div>
        <div class="mt-3 font-display text-4xl text-gold">{{ lowStockProducts.length }}</div>
      </article>
      <article class="border border-cocoa/12 bg-ivory p-5">
        <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Valeur catalogue</div>
        <div class="mt-3 font-display text-4xl text-cocoa">
          {{ catalogValue.toFixed(2).replace(".", ",") }} €
        </div>
      </article>
    </section>

    <div v-if="isLoading && products.length === 0" class="py-16 text-center font-body text-sm italic text-cocoa/45">
      Chargement…
    </div>

    <section v-else class="overflow-hidden border border-cocoa/12 bg-ivory">
      <div
        class="grid grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_92px_132px_96px] border-b border-cocoa/12 px-6 py-4 font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
      >
        <span>Produit</span>
        <span>Catégorie</span>
        <span class="text-right">Stock</span>
        <span>Réassort</span>
        <span class="text-right">Action</span>
      </div>

      <div
        v-for="product in lowStockProducts"
        :key="product.id"
        class="grid grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_92px_132px_96px] items-center gap-4 border-b border-cocoa/8 px-6 py-5 last:border-b-0"
      >
        <div>
          <div class="font-display text-xl text-cocoa">{{ product.name }}</div>
          <div class="font-body text-[11px] text-cocoa/55">
            {{ formatPrice(product.price) }} · {{ product.slug }}
          </div>
        </div>
        <div class="font-body text-sm text-cocoa">{{ product.category?.name ?? "—" }}</div>
        <div
          class="text-right font-body text-sm tabular-nums"
          :class="product.stock < 5 ? 'text-red-700' : 'text-gold'"
        >
          {{ product.stock }}
        </div>
        <label class="flex items-center gap-3 border-b border-cocoa/20 pb-2">
          <span class="font-body text-[10px] uppercase tracking-[0.2em] text-cocoa/45">+ stock</span>
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
            @click="restock(product.id, product.stock)"
          >
            Réassort
          </button>
        </div>
      </div>

      <div v-if="lowStockProducts.length === 0 && !isLoading" class="px-6 py-12 text-center font-body text-sm italic text-cocoa/45">
        Tous les stocks sont suffisants.
      </div>
    </section>
  </div>
</template>
