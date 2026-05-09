<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin.store";
import {
  adminOrigins,
  adminProductFormats,
  createProductDraft,
  formatCurrency,
  slugify,
} from "@/data/admin";

const router = useRouter();
const adminStore = useAdminStore();
const draft = ref(createProductDraft(adminStore.state));

const categoryOptions = computed(() => adminStore.state.categories);

function save() {
  if (!draft.value.name.trim()) {
    return;
  }

  const nextProduct = {
    ...draft.value,
    id: `p-${Date.now()}`,
    ref: draft.value.ref || `CI-${1000 + adminStore.state.products.length + 1}`,
    updatedAt: new Date().toISOString().slice(0, 10),
    description: draft.value.description || `Créé pour ${draft.value.name}.`,
  };

  adminStore.setState({
    ...adminStore.state,
    products: [...adminStore.state.products, nextProduct],
  });
  router.push({ name: "admin-produits" });
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div>
        <div
          class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45"
        >
          02 — Produits
        </div>
        <h2
          class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl"
        >
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
          <span
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
            >Référence</span
          >
          <input
            v-model="draft.ref"
            type="text"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
          />
        </label>

        <label class="grid gap-2">
          <span
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
            >Nom du produit</span
          >
          <input
            v-model="draft.name"
            type="text"
            placeholder="Ex. Noir Pur 72%"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
          />
        </label>

        <div class="grid gap-6 lg:grid-cols-2">
          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Catégorie</span
            >
            <select
              v-model="draft.category"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            >
              <option
                v-for="category in categoryOptions"
                :key="category.id"
                :value="category.id"
              >
                {{ category.label }}
              </option>
            </select>
          </label>

          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Origine</span
            >
            <select
              v-model="draft.origin"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            >
              <option value="">—</option>
              <option
                v-for="origin in adminOrigins"
                :key="origin"
                :value="origin"
              >
                {{ origin }}
              </option>
            </select>
          </label>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Format</span
            >
            <select
              v-model="draft.format"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            >
              <option
                v-for="format in adminProductFormats"
                :key="format"
                :value="format"
              >
                {{ format }}
              </option>
            </select>
          </label>

          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Prix</span
            >
            <input
              v-model.number="draft.price"
              type="number"
              min="0"
              step="0.5"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Stock</span
            >
            <input
              v-model.number="draft.stock"
              type="number"
              min="0"
              step="1"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>
        </div>

        <label class="grid gap-2">
          <span
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
            >Description</span
          >
          <textarea
            v-model="draft.description"
            rows="5"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base leading-7 text-cocoa outline-none"
            placeholder="Quelques mots sensoriels…"
          />
        </label>

        <div class="grid gap-2">
          <span
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
            >Statut</span
          >
          <select
            v-model="draft.status"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
          >
            <option value="active">Actif</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
      </div>

      <aside
        class="space-y-6 border-t border-cocoa/12 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"
      >
        <div class="border border-cocoa/12 bg-beige/50 p-5">
          <div
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >
            Aperçu prix
          </div>
          <div class="mt-3 font-display text-4xl text-gold">
            {{ formatCurrency(draft.price) }}
          </div>
          <div class="mt-2 font-body text-sm text-cocoa/60">
            {{ draft.format || "Format à définir" }}
          </div>
        </div>

        <div class="border border-cocoa/12 bg-ivory p-5">
          <div
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >
            Nom technique
          </div>
          <div class="mt-3 font-display text-2xl text-cocoa">
            {{ slugify(draft.name || "nouveau-produit") }}
          </div>
          <p class="mt-3 font-body text-sm leading-7 text-cocoa/60">
            La référence sera enregistrée avec la date du jour et restera
            modifiable ensuite.
          </p>
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
            class="border border-cocoa bg-cocoa px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-ivory"
          >
            Enregistrer
          </button>
        </div>
      </aside>
    </form>
  </div>
</template>
