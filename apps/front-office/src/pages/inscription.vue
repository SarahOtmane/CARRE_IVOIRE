<script setup lang="ts">
import { useRegisterForm } from '@carre-ivoire/composables'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Créer un compte — Carré Ivoire',
  meta: [{ name: 'description', content: 'Rejoignez Carré Ivoire pour commander, suivre vos envois et sauvegarder vos favoris.' }, { name: 'robots', content: 'noindex' }],
})

const { form, error, loading, register } = useRegisterForm()
</script>

<template>
  <div class="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
    <section
      class="flex flex-col justify-between bg-rose-poudre px-5 py-10 lg:px-[104px] lg:py-12"
    >
      <div>
        <span class="ci-eyebrow">Espace client</span>
        <h1
          class="mt-6 max-w-[10ch] font-serif text-cacao"
          style="
            font-size: clamp(48px, 8vw, 104px);
            line-height: 0.94;
            letter-spacing: -0.02em;
            font-weight: 500;
          "
        >
          Rejoindre
          <em class="text-cacao-2">la maison.</em>
        </h1>
        <p class="mt-8 max-w-[520px] font-sans text-[16px] leading-[1.7] text-cacao-2">
          Créez votre compte pour suivre vos commandes, conserver vos favoris
          et vivre une expérience sans friction.
        </p>
      </div>

      <div class="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Commandes
          </div>
          <div class="mt-2 font-serif text-[32px] font-medium leading-none text-cacao">
            Suivies
          </div>
        </div>
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Favoris
          </div>
          <div class="mt-2 font-serif text-[32px] font-medium leading-none text-cacao">
            Sauvegardés
          </div>
        </div>
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Accès
          </div>
          <div class="mt-2 font-serif text-[32px] font-medium leading-none text-cacao">
            Rapide
          </div>
        </div>
      </div>
    </section>

    <section class="flex items-center bg-ivoire px-5 py-12 lg:px-[104px]">
      <div class="w-full max-w-[520px]">
        <span class="ci-eyebrow">Inscription</span>

        <form
          class="mt-6 border-t pt-6"
          style="border-color: var(--cacao-a12)"
          @submit.prevent="register"
        >
          <h2 class="font-serif text-[32px] font-medium leading-[1.1] text-cacao">
            Créez votre espace.
          </h2>

          <div class="mt-8 space-y-7">
            <!-- Prénom + Nom -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label
                  for="register-first-name"
                  class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
                >
                  Prénom
                </label>
                <input
                  id="register-first-name"
                  v-model="form.firstName"
                  type="text"
                  autocomplete="given-name"
                  class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none"
                  style="border-bottom: 1px solid var(--brun-cacao)"
                />
              </div>
              <div>
                <label
                  for="register-last-name"
                  class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
                >
                  Nom
                </label>
                <input
                  id="register-last-name"
                  v-model="form.lastName"
                  type="text"
                  autocomplete="family-name"
                  class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none"
                  style="border-bottom: 1px solid var(--brun-cacao)"
                />
              </div>
            </div>

            <div>
              <label
                for="register-email"
                class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
              >
                Email
              </label>
              <input
                id="register-email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none"
                style="border-bottom: 1px solid var(--brun-cacao)"
              />
            </div>

            <div>
              <label
                for="register-password"
                class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
              >
                Mot de passe
              </label>
              <input
                id="register-password"
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                placeholder="8 caractères minimum"
                class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none placeholder:text-cacao-3"
                style="border-bottom: 1px solid var(--brun-cacao)"
              />
            </div>

            <p
              v-if="error"
              class="font-sans text-[13px] leading-[1.6] text-cacao-2"
            >
              {{ error }}
            </p>

            <div class="flex flex-wrap items-center gap-6 pt-2">
              <button
                type="submit"
                class="border border-cacao bg-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="loading"
              >
                {{ loading ? 'Création…' : 'Créer mon compte' }}
              </button>
              <RouterLink
                to="/connexion"
                class="border-b border-cacao pb-px font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
              >
                Déjà un compte ?
              </RouterLink>
            </div>

            <p class="max-w-[420px] font-sans text-[11px] leading-[1.6] tracking-[0.04em] text-cacao-2">
              En créant votre compte, vous acceptez nos conditions générales de vente.
            </p>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>
