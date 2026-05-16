<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminProducts, useAdminCategories } from "@carre-ivoire/composables";

const router = useRouter();
const { create, isLoading } = useAdminProducts();
const { categories } = useAdminCategories();

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

function autoSlug() {
  if (!draft.value.slug) {
    draft.value.slug = draft.value.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
}

async function save() {
  if (!draft.value.name.trim() || !draft.value.slug.trim() || !draft.value.categoryId) return;
  await create({
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
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div>
        <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45">
          02 — Produits
        </div>
        <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl">
          Nouveau produit,
          <span class="italic text-cocoa/55">au catalogue.</span>
        </h2>
      </div>
    </section>

    <form
      class="grid gap-8 border border-cocoa/12 bg-ivory p-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]"
      @submit.prevent="save"
    >
      <div class="grid gap-6">
        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Nom du produit</span>
          <input
            v-model="draft.name"
            type="text"
            placeholder="Ex. Noir Pur 72%"
            required
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            @blur="autoSlug"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Slug (URL)</span>
          <input
            v-model="draft.slug"
            type="text"
            placeholder="noir-pur-72"
            required
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
          />
        </label>

        <div class="grid gap-6 lg:grid-cols-2">
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Catégorie</span>
            <select
              v-model.number="draft.categoryId"
              required
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            >
              <option value="0" disabled>Choisir…</option>
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
              required
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
            placeholder="Ganache grand cru, éclat de sel…"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Description</span>
          <textarea
            v-model="draft.description"
            rows="4"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base leading-7 text-cocoa outline-none"
            placeholder="Quelques mots sensoriels…"
          />
        </label>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Ingrédients</span>
          <input
            v-model="draft.ingredients"
            type="text"
            placeholder="Pâte de cacao, sucre, beurre de cacao…"
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
            {{ draft.categoryId ? categories.find((c) => c.id === draft.categoryId)?.name ?? "—" : "—" }}
          </div>
        </div>

        <div class="border border-cocoa/12 bg-ivory p-5">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Slug généré</div>
          <div class="mt-3 font-display text-2xl text-cocoa">
            {{ draft.slug || "—" }}
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
            type="submit"
            :disabled="isLoading"
            class="border border-cocoa bg-cocoa px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-ivory disabled:opacity-50"
          >
            {{ isLoading ? "Enregistrement…" : "Enregistrer" }}
          </button>
        </div>
      </aside>
    </form>
  </div>
</template>
