<script setup lang="ts">
import { ref } from "vue";

const settings = ref({
  currency: "EUR",
  taxRate: 20,
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
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div>
        <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45">
          07 — Paramètres
        </div>
        <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl">
          Configuration <span class="italic text-cocoa/55">de l'atelier.</span>
        </h2>
      </div>
    </section>

    <form
      class="grid gap-8 border border-cocoa/12 bg-ivory p-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.6fr)]"
      @submit.prevent="save"
    >
      <div class="grid gap-6">
        <div class="grid gap-6 sm:grid-cols-2">
          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">TVA (%)</span>
            <input
              v-model.number="settings.taxRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Livraison (€)</span>
            <input
              v-model.number="settings.shippingFlat"
              type="number"
              min="0"
              step="0.01"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Livraison offerte dès (€)</span>
            <input
              v-model.number="settings.shippingFreeFrom"
              type="number"
              min="0"
              step="1"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Email BCC commandes</span>
            <input
              v-model="settings.bccEmail"
              type="email"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>
        </div>

        <label class="grid gap-2">
          <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55">Adresse atelier</span>
          <input
            v-model="settings.address"
            type="text"
            class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
          />
        </label>

        <div class="flex items-center gap-6 pt-2">
          <button
            type="submit"
            class="border border-cocoa bg-cocoa px-7 py-4 font-body text-[11px] uppercase tracking-[0.16em] text-ivory"
          >
            Enregistrer
          </button>
          <span
            v-if="saved"
            class="font-body text-[11px] uppercase tracking-[0.14em] text-gold"
          >
            Paramètres enregistrés
          </span>
        </div>
      </div>

      <aside class="space-y-4">
        <div class="border border-cocoa/12 p-5">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Résumé</div>
          <div class="mt-4 space-y-3 font-body text-sm text-cocoa">
            <div class="flex justify-between">
              <span class="text-cocoa/55">TVA</span>
              <span>{{ settings.taxRate }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-cocoa/55">Livraison</span>
              <span>{{ settings.shippingFlat.toFixed(2) }} €</span>
            </div>
            <div class="flex justify-between">
              <span class="text-cocoa/55">Gratuite dès</span>
              <span>{{ settings.shippingFreeFrom }} €</span>
            </div>
          </div>
        </div>
        <p class="font-body text-[11px] italic text-cocoa/45">
          Ces paramètres sont locaux et seront reliés à l'API dans une prochaine version.
        </p>
      </aside>
    </form>
  </div>
</template>
