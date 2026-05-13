<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAdminProducts, useAdminCategories } from "@carre-ivoire/composables";

const route = useRoute();
const router = useRouter();
const { products, fetchAll, update, remove, isLoading } = useAdminProducts();
const { categories } = useAdminCategories();

const productId = computed(() => Number(route.params.id));

const draft = ref({
  name: "",
  slug: "",
  categoryId: 0,
  price: 0,
  stock: 0,
  shortDescription: "",
  description: "",
  isActive: true,
  ingredients: "",
  allergens: "",
  weightGrams: 0,
});

const found = ref(false);

onMounted(async () => {
  await fetchAll();
});

watch(
  [products, productId],
  ([list, id]) => {
    const product = list.find((p) => p.id === id);
    if (product) {
      found.value = true;
      draft.value = {
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId,
        price: product.price / 100,
        stock: product.stock,
        shortDescription: product.shortDescription ?? "",
        description: product.description ?? "",
        isActive: product.isActive,
        ingredients: product.ingredients ?? "",
        allergens: product.allergens ?? "",
        weightGrams: product.weightGrams ?? 0,
      };
    }
  },
  { immediate: true },
);

async function save() {
  if (!draft.value.name.trim() || !draft.value.slug.trim()) return;
  await update(productId.value, {
    name: draft.value.name,
    slug: draft.value.slug,
    categoryId: draft.value.categoryId,
    price: Math.round(draft.value.price * 100),
    stock: draft.value.stock,
    shortDescription: draft.value.shortDescription || undefined,
    description: draft.value.description || undefined,
    isActive: draft.value.isActive,
    ingredients: draft.value.ingredients || undefined,
    allergens: draft.value.allergens || undefined,
    weightGrams: draft.value.weightGrams || undefined,
  });
  router.push({ name: "admin-produits" });
}

async function archive() {
  if (!globalThis.window.confirm("Désactiver ce produit ?")) return;
  await update(productId.value, { isActive: false });
  router.push({ name: "admin-produits" });
}

async function deleteProduct() {
  if (!globalThis.window.confirm("Supprimer définitivement ce produit ?")) return;
  await remove(productId.value);
  router.push({ name: "admin-produits" });
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div>
        <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45">
          02 — Produits
        </div>
        <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl">
          Modifier le produit,
          <span class="italic text-cocoa/55">sans perdre la main.</span>
        </h2>
      </div>
    </section>

    <div v-if="isLoading && !found" class="py-16 text-center font-body text-sm italic text-cocoa/45">
      Chargement…
    </div>

    <div
      v-else-if="found"
      class="grid gap-8 border border-cocoa/12 bg-ivory p-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]"
    >
      <div class="grid gap-6">
        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Nom du produit</span>
          <input
            v-model="draft.name"
            type="text"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Slug (URL)</span>
          <input
            v-model="draft.slug"
            type="text"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
          />
        </label>

        <div class="grid gap-6 lg:grid-cols-2">
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Catégorie</span>
            <select
              v-model.number="draft.categoryId"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Statut</span>
            <select
              v-model="draft.isActive"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            >
              <option :value="true">Actif</option>
              <option :value="false">Inactif</option>
            </select>
          </label>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Prix (€)</span>
            <input
              v-model.number="draft.price"
              type="number"
              min="0"
              step="0.01"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Stock</span>
            <input
              v-model.number="draft.stock"
              type="number"
              min="0"
              step="1"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Poids (g)</span>
            <input
              v-model.number="draft.weightGrams"
              type="number"
              min="0"
              step="1"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>
        </div>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Accroche courte</span>
          <input
            v-model="draft.shortDescription"
            type="text"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Description</span>
          <textarea
            v-model="draft.description"
            rows="4"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base leading-7 text-cocoa outline-none"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Ingrédients</span>
          <input
            v-model="draft.ingredients"
            type="text"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
          />
        </label>
      </div>

      <aside class="space-y-6 border-t border-cocoa/12 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
        <div class="border border-cocoa/12 bg-beige/50 p-5">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Aperçu prix</div>
          <div class="mt-3 font-display text-4xl text-gold">
            {{ draft.price.toFixed(2).replace(".", ",") }} €
          </div>
          <div class="mt-2 font-body text-sm text-cocoa/60">
            {{ categories.find((c) => c.id === draft.categoryId)?.name ?? "—" }}
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="border border-cocoa/25 px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cocoa"
            @click="router.push({ name: 'admin-produits' })"
          >
            Annuler
          </button>
          <button
            type="button"
            class="border border-cocoa/25 px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cocoa"
            @click="archive"
          >
            Désactiver
          </button>
          <button
            type="button"
            class="border border-red-700/30 px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-red-700"
            @click="deleteProduct"
          >
            Supprimer
          </button>
          <button
            type="button"
            :disabled="isLoading"
            class="border border-cocoa bg-cocoa px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-ivory disabled:opacity-50"
            @click="save"
          >
            {{ isLoading ? "Enregistrement…" : "Enregistrer" }}
          </button>
        </div>
      </aside>
    </div>

    <div v-else class="border border-cocoa/12 bg-ivory px-8 py-12 text-center">
      <div class="font-display text-3xl text-cocoa">Produit introuvable.</div>
      <button
        type="button"
        class="mt-6 border border-cocoa bg-cocoa px-5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-ivory"
        @click="router.push({ name: 'admin-produits' })"
      >
        Retour au catalogue
      </button>
    </div>
  </div>
</template>
