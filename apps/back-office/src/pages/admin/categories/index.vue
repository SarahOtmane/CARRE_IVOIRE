<script setup lang="ts">
import { computed, ref } from "vue";
import { useAdminCategories, useImageUpload } from "@carre-ivoire/composables";
import { Button } from "@carre-ivoire/ui";
import type { CategoryResponse } from "@carre-ivoire/types";

const { categories, isLoading, create, update, remove } = useAdminCategories();
const { upload, isUploading } = useImageUpload();

const draft = ref<Partial<CategoryResponse> & { name: string; slug: string } | null>(null);
const isCreating = ref(false);

const orderedCategories = computed(() =>
  [...categories.value].sort((a, b) => a.displayOrder - b.displayOrder),
);

function autoSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function open(cat: CategoryResponse) {
  draft.value = { ...cat };
  isCreating.value = false;
}

function createNew() {
  draft.value = {
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    displayOrder: categories.value.length + 1,
    isActive: true,
  };
  isCreating.value = true;
}

function close() {
  draft.value = null;
  isCreating.value = false;
}

function onNameBlur() {
  if (draft.value && isCreating.value && !draft.value.slug) {
    draft.value.slug = autoSlug(draft.value.name);
  }
}

async function onImageChange(e: Event) {
  if (!draft.value) return;
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = await upload(file);
  if (url) draft.value.imageUrl = url;
}

async function save() {
  if (!draft.value?.name.trim() || !draft.value?.slug.trim()) return;

  if (isCreating.value) {
    await create({
      name: draft.value.name,
      slug: draft.value.slug,
      description: draft.value.description || undefined,
      imageUrl: draft.value.imageUrl || undefined,
      displayOrder: draft.value.displayOrder,
      isActive: draft.value.isActive ?? true,
    });
  } else if (draft.value.id) {
    await update(draft.value.id, {
      name: draft.value.name,
      slug: draft.value.slug,
      description: draft.value.description || undefined,
      imageUrl: draft.value.imageUrl || undefined,
      displayOrder: draft.value.displayOrder,
      isActive: draft.value.isActive,
    });
  }
  close();
}

async function deleteCategory() {
  if (!draft.value?.id || !confirm("Supprimer cette catégorie ?")) return;
  await remove(draft.value.id);
  close();
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45">
            01 — Catégories
          </div>
          <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl">
            Familles de <span class="italic text-cocoa/55">la maison.</span>
          </h2>
        </div>
        <Button @click="createNew">
          Nouvelle catégorie
        </Button>
      </div>
    </section>

    <div v-if="isLoading && categories.length === 0" class="py-16 text-center font-body text-sm italic text-cocoa/45">
      Chargement…
    </div>

    <section v-else class="overflow-hidden border border-cocoa/12 bg-ivory">
      <div
        class="grid grid-cols-[48px_minmax(0,2fr)_minmax(0,2fr)_80px_120px_80px] border-b border-cocoa/12 px-6 py-4 font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
      >
        <span>Img</span>
        <span>Nom</span>
        <span>Description</span>
        <span class="text-right">Slug</span>
        <span>Statut</span>
        <span class="text-right">Action</span>
      </div>

      <div
        v-for="cat in orderedCategories"
        :key="cat.id"
        class="grid grid-cols-[48px_minmax(0,2fr)_minmax(0,2fr)_80px_120px_80px] items-center gap-4 border-b border-cocoa/8 px-6 py-5 last:border-b-0"
      >
        <div class="h-10 w-10 border border-cocoa/12 bg-beige/30">
          <img
            v-if="cat.imageUrl"
            :src="cat.imageUrl"
            :alt="cat.name"
            class="h-full w-full object-cover"
          />
        </div>
        <div class="font-display text-xl text-cocoa">{{ cat.name }}</div>
        <div class="font-body text-sm italic text-cocoa/60">{{ cat.description || "—" }}</div>
        <div class="text-right font-body text-[11px] text-cocoa/45">{{ cat.slug }}</div>
        <div class="border border-cocoa/12 px-3 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/70">
          {{ cat.isActive ? "Actif" : "Inactif" }}
        </div>
        <div class="text-right">
          <button
            type="button"
            class="font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/55 hover:underline"
            @click="open(cat)"
          >
            Éditer
          </button>
        </div>
      </div>

      <div v-if="categories.length === 0" class="px-6 py-12 text-center font-body text-sm italic text-cocoa/45">
        Aucune catégorie.
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
        <div class="flex items-start justify-between gap-6 border-b border-cocoa/12 pb-6">
          <div>
            <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">
              {{ isCreating ? "Création" : "Édition" }}
            </div>
            <h3 class="mt-3 font-display text-3xl text-cocoa">
              {{ isCreating ? "Nouvelle catégorie" : draft.name }}
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
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Nom</span>
            <input
              v-model="draft.name"
              type="text"
              required
              class="border border-cocoa/25 bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
              @blur="onNameBlur"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Slug</span>
            <input
              v-model="draft.slug"
              type="text"
              required
              class="border border-cocoa/25 bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Description</span>
            <input
              v-model="draft.description"
              type="text"
              class="border border-cocoa/25 bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
            />
          </label>

          <!-- Image de la catégorie -->
          <div class="grid gap-3">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Image</span>
            <div class="flex items-start gap-4">
              <div
                v-if="draft.imageUrl"
                class="h-20 w-20 flex-shrink-0 border border-cocoa/12 bg-beige/30"
              >
                <img :src="draft.imageUrl" alt="" class="h-full w-full object-cover" />
              </div>
              <div
                v-else
                class="flex h-20 w-20 flex-shrink-0 items-center justify-center border border-dashed border-cocoa/20 bg-beige/10"
              >
                <span class="font-body text-[9px] uppercase tracking-[0.14em] text-cocoa/35">Vide</span>
              </div>
              <div class="flex flex-col gap-2">
                <label class="cursor-pointer border border-cocoa/25 px-4 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-cocoa transition-colors hover:border-cocoa">
                  <span>{{ isUploading ? "Envoi…" : draft.imageUrl ? "Changer" : "Choisir" }}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="sr-only"
                    :disabled="isUploading"
                    @change="onImageChange"
                  />
                </label>
                <button
                  v-if="draft.imageUrl"
                  type="button"
                  class="font-body text-[10px] uppercase tracking-[0.14em] text-cocoa/40 hover:text-cocoa"
                  @click="draft.imageUrl = ''"
                >
                  Retirer
                </button>
              </div>
            </div>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <label class="grid gap-2">
              <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Ordre d'affichage</span>
              <input
                v-model.number="draft.displayOrder"
                type="number"
                min="1"
                class="border border-cocoa/25 bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
              />
            </label>

            <label class="grid gap-2">
              <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Statut</span>
              <select
                v-model="draft.isActive"
                class="border border-cocoa/25 bg-beige/20 px-3 py-2.5 font-body text-base text-cocoa outline-none focus:border-cocoa/60"
              >
                <option :value="true">Actif</option>
                <option :value="false">Inactif</option>
              </select>
            </label>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap justify-end gap-3">
          <button
            v-if="!isCreating"
            type="button"
            class="border border-red-700/50 px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-red-700"
            @click="deleteCategory"
          >
            Supprimer
          </button>
          <button
            type="button"
            class="border border-cocoa/40 px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cocoa"
            @click="close"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="isLoading || isUploading"
            class="border border-cocoa bg-cocoa px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-ivory disabled:opacity-50"
          >
            {{ isLoading ? "Enregistrement…" : "Enregistrer" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
