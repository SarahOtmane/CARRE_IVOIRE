<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAdminProducts, useAdminCategories } from "@carre-ivoire/composables";

const router = useRouter();
const { products, isLoading, fetchAll } = useAdminProducts();
const { categories } = useAdminCategories();

const search = ref("");
const categoryFilter = ref<number | "all">("all");

onMounted(() => fetchAll());

const filteredProducts = computed(() => {
  const query = search.value.trim().toLowerCase();
  return products.value.filter((product) => {
    if (categoryFilter.value !== "all" && product.categoryId !== categoryFilter.value) return false;
    if (query && !`${product.name} ${product.slug}`.toLowerCase().includes(query)) return false;
    return true;
  });
});

function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2).replace(".", ",")} €`;
}

function openProduct(productId: number) {
  router.push({ name: "admin-produits-modifier", params: { id: String(productId) } });
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45">
            02 — Produits
          </div>
          <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl">
            Le catalogue,
            <span class="italic text-cocoa/55">à votre main.</span>
          </h2>
        </div>
        <button
          type="button"
          class="border border-cocoa bg-cocoa px-5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-ivory transition-colors duration-200 hover:bg-ivory hover:text-cocoa"
          @click="router.push({ name: 'admin-produits-nouveau' })"
        >
          Nouveau produit
        </button>
      </div>
    </section>

    <section class="flex flex-wrap items-center gap-4 border border-cocoa/12 bg-ivory px-6 py-5">
      <label class="flex min-w-[240px] flex-1 items-center gap-3 border-b border-cocoa/20 pb-3">
        <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Recherche</span>
        <input
          v-model="search"
          type="search"
          placeholder="Nom, slug…"
          class="min-w-0 flex-1 bg-transparent font-body text-sm text-cocoa outline-none"
        />
      </label>

      <label class="flex items-center gap-3 border-b border-cocoa/20 pb-3">
        <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Catégorie</span>
        <select
          v-model="categoryFilter"
          class="bg-transparent font-body text-sm text-cocoa outline-none"
        >
          <option value="all">Toutes</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </label>

      <div class="ml-auto font-body text-[11px] uppercase tracking-[0.16em] text-cocoa/55">
        {{ filteredProducts.length }} résultat<span v-if="filteredProducts.length > 1">s</span>
      </div>
    </section>

    <div v-if="isLoading" class="py-16 text-center font-body text-sm italic text-cocoa/45">
      Chargement…
    </div>

    <section v-else class="overflow-hidden border border-cocoa/12 bg-ivory">
      <div
        class="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_108px_92px_110px_84px] border-b border-cocoa/12 px-6 py-4 font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
      >
        <span>Nom</span>
        <span>Catégorie</span>
        <span class="text-right">Prix</span>
        <span class="text-right">Stock</span>
        <span>Statut</span>
        <span class="text-right">Action</span>
      </div>

      <button
        v-for="product in filteredProducts"
        :key="product.id"
        type="button"
        class="grid w-full grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_108px_92px_110px_84px] items-center gap-4 border-b border-cocoa/8 px-6 py-5 text-left transition-colors duration-200 hover:bg-beige/50 last:border-b-0"
        @click="openProduct(product.id)"
      >
        <span class="min-w-0">
          <span class="block truncate font-display text-xl text-cocoa">{{ product.name }}</span>
          <span class="font-body text-[11px] text-cocoa/55">{{ product.slug }}</span>
        </span>
        <span class="font-body text-sm text-cocoa">{{ product.category?.name ?? "—" }}</span>
        <span class="text-right font-body text-sm tabular-nums text-gold">{{ formatPrice(product.price) }}</span>
        <span
          class="text-right font-body text-sm tabular-nums"
          :class="product.stock < 10 ? 'text-red-700' : 'text-cocoa'"
        >{{ product.stock }}</span>
        <span class="border border-cocoa/12 px-3 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/70">
          {{ product.isActive ? "Actif" : "Inactif" }}
        </span>
        <span class="text-right font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/55">Ouvrir</span>
      </button>

      <div v-if="filteredProducts.length === 0 && !isLoading" class="px-6 py-12 text-center font-body text-sm italic text-cocoa/45">
        Aucun produit trouvé.
      </div>
    </section>
  </div>
</template>
