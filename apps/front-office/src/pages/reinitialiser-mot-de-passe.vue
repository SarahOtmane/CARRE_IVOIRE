<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@carre-ivoire/composables'

const route = useRoute()
const router = useRouter()
const api = useApi()

const token = ref('')
const newPassword = ref('')
const confirm = ref('')
const success = ref(false)
const error = ref('')
const loading = ref(false)

onMounted(() => {
  const t = route.query.token
  if (typeof t === 'string' && t.length > 0) {
    token.value = t
  } else {
    router.replace('/mot-de-passe-oublie')
  }
})

async function submit() {
  error.value = ''
  if (newPassword.value !== confirm.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  if (newPassword.value.length < 8) {
    error.value = 'Le mot de passe doit faire au moins 8 caractères.'
    return
  }

  loading.value = true
  try {
    await api.post('/auth/reset-password', { token: token.value, newPassword: newPassword.value })
    success.value = true
    setTimeout(() => router.push('/connexion'), 3000)
  } catch {
    error.value = 'Lien invalide ou expiré. Recommencez depuis la page mot de passe oublié.'
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
      <span class="ci-eyebrow">Votre compte</span>
      <h1
        class="mt-4 font-serif font-medium text-cacao"
        style="font-size: clamp(32px, 5vw, 52px); line-height: 1; letter-spacing: -0.01em"
      >
        Nouveau<br />
        <em class="text-cacao-2">mot de passe.</em>
      </h1>

      <div v-if="success" class="mt-10">
        <p class="font-sans text-[15px] leading-relaxed text-cacao-2">
          Votre mot de passe a été mis à jour. Vous allez être redirigé vers la page de connexion.
        </p>
      </div>

      <form v-else class="mt-10 space-y-6" @submit.prevent="submit">
        <label class="block space-y-2">
          <span class="font-sans text-[10px] uppercase tracking-[0.18em] text-cacao-2">
            Nouveau mot de passe
          </span>
          <input
            v-model="newPassword"
            type="password"
            required
            autocomplete="new-password"
            minlength="8"
            class="w-full border border-cacao/25 bg-papier px-4 py-3 font-sans text-[15px] text-cacao outline-none transition-colors focus:border-cacao/60"
          />
        </label>

        <label class="block space-y-2">
          <span class="font-sans text-[10px] uppercase tracking-[0.18em] text-cacao-2">
            Confirmer le mot de passe
          </span>
          <input
            v-model="confirm"
            type="password"
            required
            autocomplete="new-password"
            class="w-full border border-cacao/25 bg-papier px-4 py-3 font-sans text-[15px] text-cacao outline-none transition-colors focus:border-cacao/60"
          />
        </label>

        <p v-if="error" class="font-sans text-[13px] text-red-700">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full border border-cacao bg-cacao py-4 font-sans text-[12px] uppercase tracking-[0.12em] text-ivoire transition-opacity disabled:opacity-50"
        >
          {{ loading ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
      </form>
    </div>
  </div>
</template>
