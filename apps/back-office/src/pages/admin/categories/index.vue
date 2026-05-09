<script setup lang="ts">
import { computed, ref } from "vue";
import { useAdminStore } from "@/stores/admin.store";
import { createCategoryDraft, slugify, type AdminCategory } from "@/data/admin";

const adminStore = useAdminStore();
const draft = ref<AdminCategory | null>(null);
const isCreating = ref(false);

const orderedCategories = computed(() =>
  [...adminStore.state.categories].sort(
    (left, right) => left.order - right.order,
  ),
);

function open(category: AdminCategory) {
  draft.value = { ...category };
  isCreating.value = false;
}

function create() {
  draft.value = createCategoryDraft(adminStore.state);
  isCreating.value = true;
}

function close() {
  draft.value = null;
  isCreating.value = false;
}

function save() {
  if (!draft.value?.label.trim()) {
    return;
  }

  const nextCategory = {
    ...draft.value,
    id: isCreating.value ? slugify(draft.value.label) : draft.value.id,
  };

  const nextCategories = isCreating.value
    ? [...adminStore.state.categories, nextCategory]
    : adminStore.state.categories.map((category) =>
        category.id === nextCategory.id ? nextCategory : category,
      );

  adminStore.setState({
    ...adminStore.state,
    categories: nextCategories,
  });
  close();
}

function remove() {
  if (
    !draft.value ||
    !globalThis.window.confirm("Supprimer cette catégorie ?")
  ) {
    return;
  }

  adminStore.setState({
    ...adminStore.state,
    categories: adminStore.state.categories.filter(
      (category) => category.id !== draft.value?.id,
    ),
  });
  close();
}

function move(index: number, direction: number) {
  const nextCategories = [...orderedCategories.value];
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= nextCategories.length) {
    return;
  }

  const current = nextCategories[index];
  nextCategories[index] = nextCategories[targetIndex];
  nextCategories[targetIndex] = current;

  adminStore.setState({
    ...adminStore.state,
    categories: nextCategories.map((category, orderIndex) => ({
      ...category,
      order: orderIndex + 1,
    })),
  });
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div
            class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45"
          >
            01 — Catégories
          </div>
          <h2
            class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl"
          >
            Familles de <span class="italic text-cocoa/55">la maison.</span>
          </h2>
        </div>

        <button
          type="button"
          class="border border-cocoa bg-cocoa px-5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-ivory"
          @click="create"
        >
          Nouvelle catégorie
        </button>
      </div>
    </section>

    <section class="overflow-hidden border border-cocoa/12 bg-ivory">
      <div
        class="grid grid-cols-[70px_minmax(0,2fr)_minmax(0,2fr)_96px_120px_96px] border-b border-cocoa/12 px-6 py-4 font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
      >
        <span>Ordre</span>
        <span>Nom</span>
        <span>Description</span>
        <span class="text-right">Produits</span>
        <span>Statut</span>
        <span class="text-right">Action</span>
      </div>

      <div
        v-for="(category, index) in orderedCategories"
        :key="category.id"
        class="grid grid-cols-[70px_minmax(0,2fr)_minmax(0,2fr)_96px_120px_96px] items-center gap-4 border-b border-cocoa/8 px-6 py-5 last:border-b-0"
      >
        <div class="flex items-center gap-2 font-body text-sm text-cocoa/55">
          <span class="tabular-nums">{{
            String(category.order).padStart(2, "0")
          }}</span>
          <button
            type="button"
            class="text-xs text-cocoa/35 transition-colors hover:text-cocoa"
            :disabled="index === 0"
            @click="move(index, -1)"
          >
            ▲
          </button>
          <button
            type="button"
            class="text-xs text-cocoa/35 transition-colors hover:text-cocoa"
            :disabled="index === orderedCategories.length - 1"
            @click="move(index, 1)"
          >
            ▼
          </button>
        </div>
        <div class="font-display text-xl text-cocoa">{{ category.label }}</div>
        <div class="font-body text-sm italic text-cocoa/60">
          {{ category.tagline || "—" }}
        </div>
        <div class="text-right font-body text-sm tabular-nums text-cocoa">
          {{ category.count }}
        </div>
        <div
          class="border border-cocoa/12 px-3 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/70"
        >
          {{ category.status }}
        </div>
        <div class="text-right">
          <button
            type="button"
            class="font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/55 hover:underline"
            @click="open(category)"
          >
            Éditer
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="draft"
      class="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/35 p-4"
    >
      <form
        class="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-cocoa/12 bg-ivory p-8"
        @submit.prevent="save"
      >
        <div
          class="flex items-start justify-between gap-6 border-b border-cocoa/12 pb-6"
        >
          <div>
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              {{ isCreating ? "Création" : "Édition" }}
            </div>
            <h3 class="mt-3 font-display text-3xl text-cocoa">
              {{ isCreating ? "Nouvelle catégorie" : draft.label }}
            </h3>
          </div>
          <button
            type="button"
            class="font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/55"
            @click="close"
          >
            Fermer
          </button>
        </div>

        <div class="mt-8 grid gap-6">
          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Nom</span
            >
            <input
              v-model="draft.label"
              type="text"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Description</span
            >
            <input
              v-model="draft.tagline"
              type="text"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
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
          </label>

          <label v-if="!isCreating" class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Identifiant</span
            >
            <input
              v-model="draft.id"
              type="text"
              disabled
              class="border-b border-cocoa/10 bg-transparent py-3 font-body text-base text-cocoa/45 outline-none"
            />
          </label>
        </div>

        <div class="mt-8 flex flex-wrap justify-end gap-3">
          <button
            v-if="!isCreating"
            type="button"
            class="border border-cocoa/25 px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cocoa"
            @click="remove"
          >
            Supprimer
          </button>
          <button
            type="button"
            class="border border-cocoa/25 px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cocoa"
            @click="close"
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
      </form>
    </div>
  </div>
</template>
