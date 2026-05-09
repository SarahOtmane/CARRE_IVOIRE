<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useAdminStore } from "@/stores/admin.store";
import { resetAdminState, type AdminSettings } from "@/data/admin";

const adminStore = useAdminStore();
const draft = ref<AdminSettings>({ ...adminStore.state.settings });

watch(
  () => adminStore.state.settings,
  (settings) => {
    draft.value = { ...settings };
  },
  { immediate: true, deep: true },
);

const summary = computed(() => [
  { label: "Devise", value: draft.value.currency },
  { label: "TVA", value: `${draft.value.taxRate}%` },
  { label: "Livraison", value: `${draft.value.shippingFlat.toFixed(2)} €` },
  {
    label: "Gratuite dès",
    value: `${draft.value.shippingFreeFrom.toFixed(2)} €`,
  },
]);

function save() {
  adminStore.setState({
    ...adminStore.state,
    settings: { ...draft.value },
  });
}

function reset() {
  if (
    !globalThis.window.confirm("Réinitialiser les données de démonstration ?")
  ) {
    return;
  }

  const nextState = resetAdminState();
  adminStore.setState(nextState);
  draft.value = { ...nextState.settings };
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div>
        <div
          class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45"
        >
          07 — Paramètres
        </div>
        <h2
          class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl"
        >
          Réglages de <span class="italic text-cocoa/55">la maison.</span>
        </h2>
      </div>
    </section>

    <div class="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
      <form class="border border-cocoa/12 bg-ivory p-8" @submit.prevent="save">
        <div class="grid gap-6 sm:grid-cols-2">
          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Devise</span
            >
            <select
              v-model="draft.currency"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="CHF">CHF</option>
            </select>
          </label>

          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >TVA (%)</span
            >
            <input
              v-model.number="draft.taxRate"
              type="number"
              step="0.1"
              min="0"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Tarif livraison</span
            >
            <input
              v-model.number="draft.shippingFlat"
              type="number"
              step="0.5"
              min="0"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Gratuit dès</span
            >
            <input
              v-model.number="draft.shippingFreeFrom"
              type="number"
              step="0.5"
              min="0"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2 sm:col-span-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Adresse</span
            >
            <input
              v-model="draft.address"
              type="text"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2 sm:col-span-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Email copie BCC</span
            >
            <input
              v-model="draft.bccEmail"
              type="email"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2 sm:col-span-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Mention atelier</span
            >
            <input
              v-model="draft.maker"
              type="text"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            />
          </label>

          <label class="grid gap-2 sm:col-span-2">
            <span
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
              >Conservation</span
            >
            <textarea
              v-model="draft.conditioning"
              rows="5"
              class="border-b border-cocoa/20 bg-transparent py-3 font-body text-base leading-7 text-cocoa outline-none"
            />
          </label>
        </div>

        <div class="mt-8 flex flex-wrap justify-end gap-3">
          <button
            type="submit"
            class="border border-cocoa bg-cocoa px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-ivory"
          >
            Enregistrer
          </button>
        </div>
      </form>

      <aside class="space-y-6">
        <article class="border border-cocoa/12 bg-beige/50 p-6">
          <div
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >
            Résumé
          </div>
          <div class="mt-5 grid gap-4">
            <div
              v-for="item in summary"
              :key="item.label"
              class="flex items-baseline justify-between gap-4 border-b border-cocoa/12 pb-3 last:border-b-0 last:pb-0"
            >
              <span
                class="font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/45"
                >{{ item.label }}</span
              >
              <span class="font-display text-xl text-cocoa">{{
                item.value
              }}</span>
            </div>
          </div>
        </article>

        <article class="border border-cocoa/12 bg-ivory p-6">
          <div
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >
            Démo
          </div>
          <h3 class="mt-3 font-display text-3xl text-cocoa">
            Réinitialiser les données.
          </h3>
          <p class="mt-4 font-body text-sm leading-7 text-cocoa/60">
            Restaure les catégories, produits, commandes, clients, pages et
            réglages de départ.
          </p>
          <button
            type="button"
            class="mt-6 border border-cocoa px-4 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-cocoa"
            @click="reset"
          >
            Tout réinitialiser
          </button>
        </article>
      </aside>
    </div>
  </div>
</template>
