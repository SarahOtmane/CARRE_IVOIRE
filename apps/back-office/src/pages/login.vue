<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const email = ref("admin@carre-ivoire.fr");
const password = ref("demo-admin");
const isSubmitting = ref(false);
const redirectTo = computed(() => {
  const value = route.query.redirect;
  return typeof value === "string" && value.length > 0 ? value : "/admin";
});

function submit() {
  isSubmitting.value = true;
  authStore.setAuth("demo-admin-token", {
    id: 1,
    email: email.value,
    firstName: "Marie",
    lastName: "Lefèvre",
    role: "admin",
  });
  router.replace(redirectTo.value);
}

onMounted(() => {
  if (authStore.isAuthenticated && authStore.isAdmin) {
    router.replace(redirectTo.value);
  }
});
</script>

<template>
  <section
    class="grid w-full max-w-6xl gap-0 overflow-hidden border border-cocoa/12 bg-ivory shadow-[0_24px_60px_rgba(74,46,42,0.08)] lg:grid-cols-[1.05fr_0.95fr]"
  >
    <div
      class="flex flex-col justify-between bg-cocoa px-8 py-10 text-ivory sm:px-12 sm:py-14"
    >
      <div>
        <div
          class="font-body text-[10px] uppercase tracking-[0.28em] text-ivory/60"
        >
          Back-office
        </div>
        <h1
          class="mt-6 max-w-lg font-display text-5xl leading-[0.92] sm:text-6xl"
        >
          Gérez la maison.
        </h1>
        <p
          class="mt-6 max-w-xl font-body text-sm leading-7 text-ivory/80 sm:text-base"
        >
          Accédez au catalogue, aux commandes, aux clients et aux réglages de la
          boutique.
        </p>
      </div>

      <div
        class="mt-12 grid grid-cols-3 gap-3 border-t border-ivory/15 pt-6 text-sm text-ivory/72"
      >
        <div>
          <div
            class="font-body text-[10px] uppercase tracking-[0.2em] text-ivory/45"
          >
            Commandes
          </div>
          <div class="mt-1 font-display text-2xl">24</div>
        </div>
        <div>
          <div
            class="font-body text-[10px] uppercase tracking-[0.2em] text-ivory/45"
          >
            Produits
          </div>
          <div class="mt-1 font-display text-2xl">37</div>
        </div>
        <div>
          <div
            class="font-body text-[10px] uppercase tracking-[0.2em] text-ivory/45"
          >
            Clients
          </div>
          <div class="mt-1 font-display text-2xl">20</div>
        </div>
      </div>
    </div>

    <form
      class="flex flex-col justify-center px-8 py-10 sm:px-12 sm:py-14"
      @submit.prevent="submit"
    >
      <div class="max-w-md">
        <div
          class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45"
        >
          Connexion
        </div>
        <h2 class="mt-4 font-display text-4xl text-cocoa">
          Entrer dans l’atelier.
        </h2>
        <p class="mt-4 font-body text-sm leading-7 text-cocoa/70">
          Utilisez le compte de démonstration pour ouvrir l’administration.
        </p>
      </div>

      <div class="mt-10 grid gap-6 max-w-md">
        <label class="grid gap-2">
          <span
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
            >Email</span
          >
          <input
            v-model="email"
            type="email"
            class="border-b border-cocoa/25 bg-transparent py-3 font-body text-base text-cocoa outline-none transition-colors duration-200 focus:border-cocoa"
            autocomplete="email"
          />
        </label>

        <label class="grid gap-2">
          <span
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/55"
            >Mot de passe</span
          >
          <input
            v-model="password"
            type="password"
            class="border-b border-cocoa/25 bg-transparent py-3 font-body text-base text-cocoa outline-none transition-colors duration-200 focus:border-cocoa"
            autocomplete="current-password"
          />
        </label>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
          <p class="font-body text-sm italic text-cocoa/60">
            Compte de test. Pur.
          </p>
          <button
            type="submit"
            class="border border-cocoa bg-cocoa px-5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-ivory transition-colors duration-200 hover:bg-ivory hover:text-cocoa"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Ouverture…" : "Se connecter" }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>
