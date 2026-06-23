<script setup lang="ts">
import { ref } from "vue";
import { useAdminTaxRates } from "@carre-ivoire/composables";

const settings = ref({
  currency: "EUR",
  shippingFlat: 8,
  shippingFreeFrom: 70,
  bccEmail: "admin@carreivoire.fr",
  address: "4 rue du Nil, 75002 Paris",
  maker: "Carré Ivoire",
});

const saved = ref(false);
let saveTimeout: ReturnType<typeof setTimeout> | undefined;

function save() {
  saved.value = true;
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => { saved.value = false; }, 2400);
}

// TVA
const { taxRates, isLoading: tvaLoading, create: createTva, update: updateTva, remove: removeTva } = useAdminTaxRates();

const showTvaForm = ref(false);
const tvaForm = ref({ label: "", rate: "" });
const editingTvaId = ref<number | null>(null);

function openCreateTva() {
  editingTvaId.value = null;
  tvaForm.value = { label: "", rate: "" };
  showTvaForm.value = true;
}

function openEditTva(tva: { id: number; label: string; rate: number }) {
  editingTvaId.value = tva.id;
  tvaForm.value = { label: tva.label, rate: String(tva.rate) };
  showTvaForm.value = true;
}

function cancelTvaForm() {
  showTvaForm.value = false;
  tvaForm.value = { label: "", rate: "" };
  editingTvaId.value = null;
}

async function saveTva() {
  const label = tvaForm.value.label.trim();
  const rate = parseFloat(tvaForm.value.rate);
  if (!label || isNaN(rate) || rate < 0 || rate > 100) return;

  if (editingTvaId.value !== null) {
    await updateTva(editingTvaId.value, { label, rate });
  } else {
    await createTva({ label, rate });
  }
  cancelTvaForm();
}

async function deleteTva(id: number, label: string) {
  if (!confirm(`Supprimer la TVA "${label}" ?`)) return;
  await removeTva(id);
}
</script>

<template>
  <div class="space-y-10 pb-10">
    <section class="border-b border-cacao pb-8">
      <div>
        <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cacao/45">
          06 — Paramètres
        </div>
        <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cacao sm:text-6xl">
          Configuration <span class="italic text-cacao/55">de l'atelier.</span>
        </h2>
      </div>
    </section>

    <!-- Paramètres généraux -->
    <form
      class="grid gap-8 border border-cacao bg-ivoire p-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.6fr)]"
      @submit.prevent="save"
    >
      <div class="grid gap-6">
        <div class="grid gap-6 sm:grid-cols-2">
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Livraison (€)</span>
            <input
              v-model.number="settings.shippingFlat"
              type="number"
              min="0"
              step="0.01"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Livraison offerte dès (€)</span>
            <input
              v-model.number="settings.shippingFreeFrom"
              type="number"
              min="0"
              step="1"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Email BCC commandes</span>
            <input
              v-model="settings.bccEmail"
              type="email"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            />
          </label>
        </div>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Adresse atelier</span>
          <input
            v-model="settings.address"
            type="text"
            class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
          />
        </label>

        <div class="flex items-center gap-6 pt-2">
          <button
            type="submit"
            class="border border-cacao bg-cacao px-7 py-4 font-body text-[11px] uppercase tracking-[0.16em] text-ivoire"
          >
            Enregistrer
          </button>
          <span
            v-if="saved"
            class="font-body text-[11px] uppercase tracking-[0.14em] text-dore"
          >
            Paramètres enregistrés
          </span>
        </div>
      </div>

      <aside class="space-y-4">
        <div class="border border-cacao p-5">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/45">Résumé</div>
          <div class="mt-4 space-y-3 font-body text-sm text-cacao">
            <div class="flex justify-between">
              <span class="text-cacao/55">Livraison</span>
              <span>{{ settings.shippingFlat.toFixed(2) }} €</span>
            </div>
            <div class="flex justify-between">
              <span class="text-cacao/55">Gratuite dès</span>
              <span>{{ settings.shippingFreeFrom }} €</span>
            </div>
          </div>
        </div>
        <p class="font-body text-[11px] italic text-cacao/45">
          Ces paramètres seront reliés à l'API dans une prochaine version.
        </p>
      </aside>
    </form>

    <!-- Section TVA -->
    <section class="space-y-6">
      <div class="flex items-end justify-between border-b border-cacao pb-6">
        <div>
          <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cacao/45">Fiscalité</div>
          <h3 class="mt-3 font-display text-3xl text-cacao">
            Taux de TVA
          </h3>
          <p class="mt-2 font-body text-sm text-cacao/55">
            Définissez les taux applicables à vos produits.
          </p>
        </div>
        <button
          type="button"
          class="border border-cacao bg-cacao px-5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-ivoire transition-colors duration-200 hover:bg-ivoire hover:text-cacao"
          @click="openCreateTva"
        >
          Ajouter un taux
        </button>
      </div>

      <!-- Formulaire création / édition inline -->
      <div v-if="showTvaForm" class="border border-cacao bg-ivoire p-6">
        <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/45 mb-5">
          {{ editingTvaId !== null ? "Modifier le taux" : "Nouveau taux de TVA" }}
        </div>
        <div class="grid gap-5 sm:grid-cols-[minmax(0,1fr)_180px]">
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Libellé</span>
            <input
              v-model="tvaForm.label"
              type="text"
              placeholder="Ex. TVA Alimentaire réduite"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            />
          </label>
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/55">Taux (%)</span>
            <input
              v-model="tvaForm.rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="5.5"
              class="border border-cacao bg-beige-doux/20 px-3 py-2.5 font-body text-base text-cacao outline-none focus:border-cacao/60"
            />
          </label>
        </div>
        <div class="mt-5 flex gap-3">
          <button
            type="button"
            :disabled="tvaLoading"
            class="border border-cacao bg-cacao px-5 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-ivoire disabled:opacity-50"
            @click="saveTva"
          >
            {{ tvaLoading ? "Enregistrement…" : "Enregistrer" }}
          </button>
          <button
            type="button"
            class="border border-cacao px-5 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cacao"
            @click="cancelTvaForm"
          >
            Annuler
          </button>
        </div>
      </div>

      <!-- Liste des TVA -->
      <div v-if="tvaLoading && taxRates.length === 0" class="py-10 text-center font-body text-sm italic text-cacao/45">
        Chargement…
      </div>

      <div v-else-if="taxRates.length === 0 && !showTvaForm" class="border border-cacao bg-ivoire px-8 py-10 text-center">
        <p class="font-body text-sm italic text-cacao/45">Aucun taux de TVA configuré.</p>
        <button
          type="button"
          class="mt-4 border border-cacao px-5 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cacao"
          @click="openCreateTva"
        >
          Ajouter le premier taux
        </button>
      </div>

      <div v-else-if="taxRates.length > 0" class="overflow-hidden border border-cacao bg-ivoire">
        <div class="grid grid-cols-[minmax(0,1fr)_120px_80px] border-b border-cacao px-6 py-4 font-body text-[10px] uppercase tracking-[0.22em] text-cacao/45">
          <span>Libellé</span>
          <span class="text-right">Taux</span>
          <span class="text-right">Actions</span>
        </div>

        <div
          v-for="tva in taxRates"
          :key="tva.id"
          class="grid grid-cols-[minmax(0,1fr)_120px_80px] items-center gap-4 border-b border-cacao px-6 py-5 last:border-b-0"
        >
          <span class="font-display text-xl text-cacao">{{ tva.label }}</span>
          <span class="text-right font-body text-sm tabular-nums text-dore">{{ tva.rate }} %</span>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="font-body text-[11px] uppercase tracking-[0.18em] text-cacao/55 hover:text-cacao hover:underline"
              @click="openEditTva(tva)"
            >
              Éditer
            </button>
            <button
              type="button"
              class="font-body text-[11px] uppercase tracking-[0.18em] text-red-700/60 hover:text-red-700 hover:underline"
              @click="deleteTva(tva.id, tva.label)"
            >
              Sup.
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
