<script setup lang="ts">
import { computed, ref } from "vue";
import { useAdminStore } from "@/stores/admin.store";
import {
  createPageDraft,
  formatDate,
  slugify,
  type AdminPageEntry,
} from "@/data/admin";

const adminStore = useAdminStore();
const search = ref("");
const draft = ref<AdminPageEntry | null>(null);
const isCreating = ref(false);

const filteredPages = computed(() => {
  const query = search.value.trim().toLowerCase();

  return adminStore.state.pages.filter((page) => {
    if (!query) {
      return true;
    }

    return `${page.title} ${page.slug} ${page.template} ${page.path}`
      .toLowerCase()
      .includes(query);
  });
});

function openPage(page: AdminPageEntry) {
  draft.value = { ...page };
  isCreating.value = false;
}

function createPage() {
  draft.value = createPageDraft(adminStore.state);
  isCreating.value = true;
}

function close() {
  draft.value = null;
  isCreating.value = false;
}

function save() {
  if (!draft.value?.title.trim()) {
    return;
  }

  const nextPage = {
    ...draft.value,
    id: isCreating.value ? `page-${Date.now()}` : draft.value.id,
    slug: isCreating.value ? slugify(draft.value.title) : draft.value.slug,
    path: draft.value.path || `/${draft.value.slug}`,
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  adminStore.setState({
    ...adminStore.state,
    pages: isCreating.value
      ? [...adminStore.state.pages, nextPage]
      : adminStore.state.pages.map((page) =>
          page.id === nextPage.id ? nextPage : page,
        ),
  });
  close();
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
            05 — Pages éditoriales
          </div>
          <h2
            class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl"
          >
            Les pages, <span class="italic text-cocoa/55">en coulisses.</span>
          </h2>
        </div>

        <button
          type="button"
          class="border border-cocoa bg-cocoa px-5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-ivory"
          @click="createPage"
        >
          Nouvelle page
        </button>
      </div>
    </section>

    <section class="border border-cocoa/12 bg-ivory px-6 py-5">
      <label class="flex items-center gap-3 border-b border-cocoa/20 pb-3">
        <span
          class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >Recherche</span
        >
        <input
          v-model="search"
          type="search"
          placeholder="Titre, slug, template…"
          class="min-w-0 flex-1 bg-transparent font-body text-sm text-cocoa outline-none"
        />
      </label>
    </section>

    <section class="overflow-hidden border border-cocoa/12 bg-ivory">
      <div
        class="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_124px_160px_110px_84px] border-b border-cocoa/12 px-6 py-4 font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
      >
        <span>Titre</span>
        <span>Template</span>
        <span>Statut</span>
        <span>Chemin</span>
        <span>Maj</span>
        <span class="text-right">Action</span>
      </div>

      <button
        v-for="page in filteredPages"
        :key="page.id"
        type="button"
        class="grid w-full grid-cols-[minmax(0,2fr)_minmax(0,1fr)_124px_160px_110px_84px] items-center gap-4 border-b border-cocoa/8 px-6 py-5 text-left transition-colors duration-200 hover:bg-beige/50 last:border-b-0"
        @click="openPage(page)"
      >
        <span>
          <span class="block font-display text-xl text-cocoa">{{
            page.title
          }}</span>
          <span class="font-body text-[11px] text-cocoa/55">{{
            page.slug
          }}</span>
        </span>
        <span class="font-body text-sm text-cocoa">{{ page.template }}</span>
        <span
          class="border border-cocoa/12 px-3 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/70"
          >{{ page.status }}</span
        >
        <span class="font-body text-sm italic text-cocoa/60">{{
          page.path
        }}</span>
        <span class="font-body text-sm text-cocoa/55">{{
          formatDate(page.updatedAt)
        }}</span>
        <span
          class="text-right font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/55"
          >Ouvrir</span
        >
      </button>
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
              {{ draft.title || "Nouvelle page" }}
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
              >Titre</span
            >
            <input
              v-model="draft.title"
              type="text"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Slug</span
            >
            <input
              v-model="draft.slug"
              type="text"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Template</span
            >
            <input
              v-model="draft.template"
              type="text"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Chemin</span
            >
            <input
              v-model="draft.path"
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
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
          </label>
        </div>

        <div class="mt-8 flex flex-wrap justify-end gap-3">
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
