<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

import { useApi } from "@carre-ivoire/composables";

const api = useApi();

const form = ref({
  email: authStore.user?.email ?? "",
  password: "",
});

const error = ref("");
const loading = ref(false);

const redirectPath = computed(() => {
  const value = route.query.redirect;
  return typeof value === "string" && value.startsWith("/") ? value : "/compte";
});

async function login() {
  error.value = "";

  if (!form.value.email.trim() || !form.value.password.trim()) {
    error.value = "Veuillez renseigner votre email et votre mot de passe.";
    return;
  }

  loading.value = true;
  try {
    const res = await api.post("/auth/login", {
      email: form.value.email.trim(),
      password: form.value.password,
    });
    authStore.setAuth(res.data.data.token, res.data.data.user);
    router.replace(redirectPath.value);
  } catch {
    error.value = "Email ou mot de passe incorrect.";
  } finally {
    loading.value = false;
  }
}

function goToAccount() {
  router.push("/compte");
}
</script>

<template>
  <div
    class="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]"
  >
    <section
      class="flex flex-col justify-between bg-rose-poudre px-5 py-10 lg:px-[104px] lg:py-12"
    >
      <div>
        <span class="ci-eyebrow">Espace client</span>
        <h1
          class="mt-6 max-w-[10ch] font-serif text-brun-cacao"
          style="
            font-size: clamp(48px, 8vw, 104px);
            line-height: 0.94;
            letter-spacing: -0.02em;
            font-weight: 500;
          "
        >
          Le compte,
          <em class="text-brun-cacao-2">en calme.</em>
        </h1>
        <p
          class="mt-8 max-w-[520px] font-sans text-[16px] leading-[1.7] text-brun-cacao-2"
        >
          Retrouvez vos commandes, vos favoris et vos informations. Un accès
          direct. Sans détour.
        </p>
      </div>

      <div class="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div
            class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Commandes
          </div>
          <div
            class="mt-2 font-serif text-[32px] font-medium leading-none text-brun-cacao"
          >
            12
          </div>
        </div>
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div
            class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Favoris
          </div>
          <div
            class="mt-2 font-serif text-[32px] font-medium leading-none text-brun-cacao"
          >
            4
          </div>
        </div>
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div
            class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Retour
          </div>
          <div
            class="mt-2 font-serif text-[32px] font-medium leading-none text-brun-cacao"
          >
            Rapide
          </div>
        </div>
      </div>
    </section>

    <section class="flex items-center bg-ivoire px-5 py-12 lg:px-[104px]">
      <div class="w-full max-w-[520px]">
        <span class="ci-eyebrow">Connexion</span>

        <div
          v-if="authStore.isAuthenticated"
          class="mt-6 border-t pt-6"
          style="border-color: var(--cacao-a12)"
        >
          <h2
            class="font-serif text-[32px] font-medium leading-[1.1] text-brun-cacao"
          >
            Vous êtes déjà connecté.
          </h2>
          <p class="mt-4 font-sans text-[15px] leading-[1.7] text-brun-cacao-2">
            Accédez directement à votre espace client.
          </p>
          <button
            class="mt-8 border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
            @click="goToAccount"
          >
            Ouvrir mon compte
          </button>
        </div>

        <form
          v-else
          class="mt-6 border-t pt-6"
          style="border-color: var(--cacao-a12)"
          @submit.prevent="login"
        >
          <h2
            class="font-serif text-[32px] font-medium leading-[1.1] text-brun-cacao"
          >
            Retrouvez votre espace.
          </h2>

          <p
            class="mt-4 max-w-[430px] font-sans text-[15px] leading-[1.7] text-brun-cacao-2"
          >
            Connectez-vous pour suivre vos commandes et retrouver vos favoris.
          </p>

          <div class="mt-8 space-y-7">
            <div>
              <label
                for="login-email"
                class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
              >
                Email
              </label>
              <input
                id="login-email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                class="w-full bg-transparent py-2.5 font-sans text-[15px] text-brun-cacao outline-none"
                style="border-bottom: 1px solid var(--brun-cacao)"
              />
            </div>

            <div>
              <label
                for="login-password"
                class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
              >
                Mot de passe
              </label>
              <input
                id="login-password"
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                class="w-full bg-transparent py-2.5 font-sans text-[15px] text-brun-cacao outline-none"
                style="border-bottom: 1px solid var(--brun-cacao)"
              />
            </div>

            <p
              v-if="error"
              class="font-sans text-[13px] leading-[1.6] text-brun-cacao-2"
            >
              {{ error }}
            </p>

            <div class="flex flex-wrap items-center gap-6 pt-2">
              <button
                type="submit"
                class="border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="loading"
              >
                {{ loading ? "Connexion…" : "Se connecter" }}
              </button>
              <button
                type="button"
                class="border-b border-brun-cacao pb-px font-sans text-[13px] text-brun-cacao transition-opacity duration-180 hover:opacity-60"
                @click="router.push('/contact')"
              >
                Besoin d'aide ?
              </button>
            </div>

            <p
              class="max-w-[420px] font-sans text-[11px] leading-[1.6] tracking-[0.04em] text-brun-cacao-2"
            >
              En vous connectant, vous serez redirigé vers la page demandée ou
              vers votre compte.
            </p>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>
