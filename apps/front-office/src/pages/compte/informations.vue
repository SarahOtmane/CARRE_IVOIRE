<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();

const form = ref({
  email: authStore.user?.email ?? "",
  firstName: authStore.user?.firstName ?? "",
  lastName: authStore.user?.lastName ?? "",
  phone: "",
  company: "",
  address: "4 rue du Nil, 75002 Paris",
  currentPassword: "",
  newPassword: "",
});

const saved = ref(false);
let savedTimeout: number | undefined;

function save() {
  // Intégration API à brancher ici
  saved.value = true;
  if (savedTimeout) globalThis.clearTimeout(savedTimeout);
  savedTimeout = globalThis.setTimeout(() => {
    saved.value = false;
  }, 2400);
}
</script>

<template>
  <div>
    <section class="mb-12 border-b pb-8" style="border-color: var(--cacao-a12)">
      <span class="ci-eyebrow">Mes informations</span>
      <h2
        class="mt-4 font-serif text-brun-cacao"
        style="
          font-size: clamp(32px, 4vw, 56px);
          line-height: 1;
          font-weight: 500;
        "
      >
        Coordonnées,
        <em class="text-brun-cacao-2">sécurité et livraison.</em>
      </h2>
      <p
        class="mt-5 max-w-[560px] font-sans text-[15px] leading-[1.7] text-brun-cacao-2"
      >
        Gardez vos informations à jour pour recevoir vos commandes sans
        friction. Un seul endroit. Pas de détour.
      </p>
    </section>

    <div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
      <!-- Formulaire infos perso -->
      <div class="max-w-[640px] space-y-7">
        <!-- Email -->
        <div>
          <label
            for="account-email"
            class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Email
          </label>
          <input
            id="account-email"
            v-model="form.email"
            type="email"
            class="w-full bg-transparent py-2.5 font-sans text-[15px] text-brun-cacao outline-none"
            style="border-bottom: 1px solid var(--brun-cacao)"
          />
        </div>

        <!-- Prénom + Nom -->
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label
              for="account-first-name"
              class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Prénom
            </label>
            <input
              id="account-first-name"
              v-model="form.firstName"
              type="text"
              class="w-full bg-transparent py-2.5 font-sans text-[15px] text-brun-cacao outline-none"
              style="border-bottom: 1px solid var(--brun-cacao)"
            />
          </div>
          <div>
            <label
              for="account-last-name"
              class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Nom
            </label>
            <input
              id="account-last-name"
              v-model="form.lastName"
              type="text"
              class="w-full bg-transparent py-2.5 font-sans text-[15px] text-brun-cacao outline-none"
              style="border-bottom: 1px solid var(--brun-cacao)"
            />
          </div>
        </div>

        <!-- Téléphone -->
        <div>
          <label
            for="account-phone"
            class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Téléphone
          </label>
          <input
            id="account-phone"
            v-model="form.phone"
            type="tel"
            placeholder="+33 6 00 00 00 00"
            class="w-full bg-transparent py-2.5 font-sans text-[15px] text-brun-cacao outline-none placeholder:text-brun-cacao-3"
            style="border-bottom: 1px solid var(--brun-cacao)"
          />
        </div>

        <div>
          <label
            for="account-address"
            class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Adresse de livraison
          </label>
          <input
            id="account-address"
            v-model="form.address"
            type="text"
            class="w-full bg-transparent py-2.5 font-sans text-[15px] text-brun-cacao outline-none"
            style="border-bottom: 1px solid var(--brun-cacao)"
          />
        </div>

        <div>
          <label
            for="account-company"
            class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Société
          </label>
          <input
            id="account-company"
            v-model="form.company"
            type="text"
            placeholder="Facultatif"
            class="w-full bg-transparent py-2.5 font-sans text-[15px] text-brun-cacao outline-none placeholder:text-brun-cacao-3"
            style="border-bottom: 1px solid var(--brun-cacao)"
          />
        </div>

        <!-- Séparateur mot de passe -->
        <div class="pt-4">
          <div
            class="mb-6 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-3"
          >
            Modifier le mot de passe
          </div>

          <div class="space-y-7">
            <div>
              <label
                for="account-current-password"
                class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
              >
                Mot de passe actuel
              </label>
              <input
                id="account-current-password"
                v-model="form.currentPassword"
                type="password"
                class="w-full bg-transparent py-2.5 font-sans text-[15px] text-brun-cacao outline-none"
                style="border-bottom: 1px solid var(--brun-cacao)"
              />
            </div>
            <div>
              <label
                for="account-new-password"
                class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
              >
                Nouveau mot de passe
              </label>
              <input
                id="account-new-password"
                v-model="form.newPassword"
                type="password"
                class="w-full bg-transparent py-2.5 font-sans text-[15px] text-brun-cacao outline-none"
                style="border-bottom: 1px solid var(--brun-cacao)"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-6 pt-2">
          <button
            class="border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
            @click="save"
          >
            Enregistrer
          </button>
          <span
            v-if="saved"
            class="font-sans text-[12px] uppercase tracking-[0.14em] text-dore transition-opacity duration-400"
          >
            Modifications enregistrées
          </span>
        </div>
      </div>

      <aside class="space-y-6">
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div
            class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Sécurité
          </div>
          <p class="mt-3 font-sans text-[14px] leading-[1.7] text-brun-cacao-2">
            Vos données sont enregistrées localement dans cette maquette. En
            production, elles seront reliées à l'API compte.
          </p>
        </div>

        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div
            class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Livraison
          </div>
          <p class="mt-3 font-serif text-[18px] leading-[1.45] text-brun-cacao">
            {{ form.address }}
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
