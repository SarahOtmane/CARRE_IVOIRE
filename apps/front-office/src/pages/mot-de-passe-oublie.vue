<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '@carre-ivoire/composables'

const api = useApi()

const email = ref('')
const sent = ref(false)
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/auth/forgot-password', { email: email.value })
    sent.value = true
  } catch {
    error.value = 'Une erreur est survenue. Réessayez dans quelques instants.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-ivoire"
    style="padding: clamp(40px, 8vw, 96px) clamp(20px, 6vw, 104px)"
  >
    <div style="width: 100%; max-width: 440px">
      <RouterLink
        to="/connexion"
        class="mb-10 inline-block font-sans text-[11px] uppercase tracking-[0.18em] text-brun-cacao-2 transition-opacity hover:opacity-70"
      >
        ← Connexion
      </RouterLink>

      <span class="ci-eyebrow">Votre compte</span>
      <h1
        class="mt-4 font-serif font-medium text-brun-cacao"
        style="font-size: clamp(32px, 5vw, 52px); line-height: 1; letter-spacing: -0.01em"
      >
        Mot de passe<br />
        <em class="text-brun-cacao-2">oublié.</em>
      </h1>

      <div v-if="sent" class="mt-10">
        <p class="font-sans text-[15px] leading-relaxed text-brun-cacao-2">
          Si un compte existe avec cette adresse, vous recevrez un email dans quelques minutes.
        </p>
        <p class="mt-4 font-sans text-[13px] text-brun-cacao-2">
          Vérifiez aussi vos courriers indésirables.
        </p>
      </div>

      <form v-else class="mt-10 space-y-6" @submit.prevent="submit">
        <label class="block space-y-2">
          <span class="font-sans text-[10px] uppercase tracking-[0.18em] text-brun-cacao-2">
            Adresse email
          </span>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="votre@email.fr"
            class="w-full border border-brun-cacao/25 bg-papier px-4 py-3 font-sans text-[15px] text-brun-cacao outline-none transition-colors focus:border-brun-cacao/60"
          />
        </label>

        <p v-if="error" class="font-sans text-[13px] text-red-700">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full border border-brun-cacao bg-brun-cacao py-4 font-sans text-[12px] uppercase tracking-[0.12em] text-ivoire transition-opacity disabled:opacity-50"
        >
          {{ loading ? 'Envoi en cours…' : 'Recevoir le lien' }}
        </button>
      </form>
    </div>
  </div>
</template>
