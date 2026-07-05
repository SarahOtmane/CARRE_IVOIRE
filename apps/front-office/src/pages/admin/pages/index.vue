<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useAdminHistoire, useImageUpload } from "@carre-ivoire/composables";

const { sections, isLoading, update } = useAdminHistoire();
const { upload, isUploading } = useImageUpload();

interface SectionDraft {
  image: string;
  imageAlt: string;
  paragraphs: string[];
}

const drafts = reactive<Record<number, SectionDraft>>({});

watch(
  sections,
  (list) => {
    for (const s of list) {
      if (!(s.id in drafts)) {
        drafts[s.id] = { image: s.image, imageAlt: s.imageAlt, paragraphs: [...s.paragraphs] };
      }
    }
  },
  { immediate: true },
);

const orderedSections = computed(() => [...sections.value].sort((a, b) => a.displayOrder - b.displayOrder));

const sectionLabels: Record<string, string> = {
  enfance: "L'enfance",
  parcours: "Le parcours",
  naissance: "La naissance",
  hommage: "L'hommage",
};

function sectionLabel(key: string) {
  return sectionLabels[key] ?? key;
}

async function onImageChange(sectionId: number, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = await upload(file);
  if (url) drafts[sectionId].image = url;
}

function addParagraph(sectionId: number) {
  drafts[sectionId].paragraphs.push("");
}

function removeParagraph(sectionId: number, index: number) {
  drafts[sectionId].paragraphs.splice(index, 1);
}

async function save(sectionId: number) {
  const draft = drafts[sectionId];
  const paragraphs = draft.paragraphs.map((p) => p.trim()).filter(Boolean);
  if (!paragraphs.length || !draft.image.trim()) return;
  await update(sectionId, {
    image: draft.image,
    imageAlt: draft.imageAlt,
    paragraphs,
  });
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cacao pb-8">
      <div>
        <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cacao/45">
          05 — Pages
        </div>
        <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cacao sm:text-6xl">
          Mon histoire, <span class="italic text-cacao/55">racontée à votre façon.</span>
        </h2>
      </div>
    </section>

    <div v-if="isLoading && sections.length === 0" class="py-16 text-center font-body text-sm italic text-cacao/45">
      Chargement…
    </div>

    <div v-else class="grid gap-8">
      <div
        v-for="section in orderedSections"
        :key="section.id"
        class="grid gap-8 border border-cacao bg-ivoire p-8 lg:grid-cols-[minmax(320px,0.75fr)_minmax(0,1.25fr)]"
      >
        <!-- Image -->
        <div class="space-y-3">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/45">
            {{ sectionLabel(section.key) }} — image
          </div>
          <div
            v-if="drafts[section.id]?.image"
            class="relative aspect-[4/3] w-full border border-cacao bg-beige-doux/30"
          >
            <img :src="drafts[section.id].image" alt="" class="h-full w-full object-cover" />
          </div>
          <div
            v-else
            class="flex aspect-[4/3] w-full items-center justify-center border border-dashed border-cacao bg-beige-doux/10"
          >
            <span class="font-body text-[10px] uppercase tracking-[0.18em] text-cacao/35">Aucune image</span>
          </div>
          <div class="flex items-center gap-3">
            <label class="cursor-pointer border border-cacao px-4 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-cacao transition-colors hover:border-cacao">
              <span>{{ isUploading ? "Envoi…" : "Changer" }}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="sr-only"
                :disabled="isUploading"
                @change="onImageChange(section.id, $event)"
              />
            </label>
          </div>

          <label class="grid gap-2 pt-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Texte alternatif</span>
            <input
              v-model="drafts[section.id].imageAlt"
              type="text"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            />
          </label>
        </div>

        <!-- Paragraphes -->
        <div class="grid gap-4">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/45">
            {{ sectionLabel(section.key) }} — paragraphes
          </div>

          <div
            v-for="(_paragraphe, pIndex) in drafts[section.id]?.paragraphs"
            :key="pIndex"
            class="flex items-start gap-3"
          >
            <textarea
              v-model="drafts[section.id].paragraphs[pIndex]"
              rows="3"
              class="flex-1 border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base leading-7 text-cacao outline-none focus:border-cacao/60"
            />
            <button
              type="button"
              class="shrink-0 font-body text-[11px] uppercase tracking-[0.14em] text-red-700"
              @click="removeParagraph(section.id, pIndex)"
            >
              Supprimer
            </button>
          </div>

          <div class="flex items-center justify-between gap-4 border-t border-cacao pt-4">
            <button
              type="button"
              class="border border-cacao px-3 py-2 font-body text-[11px] uppercase tracking-[0.14em] text-cacao"
              @click="addParagraph(section.id)"
            >
              Ajouter un paragraphe
            </button>
            <button
              type="button"
              :disabled="isLoading || isUploading"
              class="border border-cacao bg-cacao px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-ivoire disabled:opacity-50"
              @click="save(section.id)"
            >
              {{ isLoading ? "Enregistrement…" : "Enregistrer" }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="sections.length === 0" class="border border-cacao bg-ivoire px-8 py-16 text-center">
        <div class="font-display text-3xl text-cacao">Aucune section trouvée.</div>
      </div>
    </div>
  </div>
</template>
