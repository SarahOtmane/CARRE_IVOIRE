<script setup lang="ts">
import { ref } from 'vue'
import { useForgotPasswordForm } from '@carre-ivoire/composables'

const { email, sent, error, loading, submit } = useForgotPasswordForm()

const emailError = ref('')

function handleSubmit() {
  emailError.value = ''
  if (!email.value.trim()) {
    emailError.value = 'Veuillez remplir ce champs'
    return
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.value.trim())) {
    emailError.value = "Le format de votre email n'est pas bon"
    return
  }
  submit()
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
        class="mb-10 inline-block font-sans text-[11px] uppercase tracking-[0.18em] text-cacao-2 transition-opacity hover:opacity-70"
      >
        ← Connexion
      </RouterLink>

      <span class="ci-eyebrow">Votre compte</span>
      <h1
        class="mt-4 font-serif font-medium text-cacao"
        style="font-size: clamp(32px, 5vw, 52px); line-height: 1; letter-spacing: -0.01em"
      >
        Mot de passe<br />
        <em class="text-cacao-2">oublié.</em>
      </h1>

      <div v-if="sent" class="mt-10">
        <p class="font-sans text-[15px] leading-relaxed text-cacao-2">
          Si un compte existe avec cette adresse, vous recevrez un email dans quelques minutes.
        </p>
        <p class="mt-4 font-sans text-[13px] text-cacao-2">
          Vérifiez aussi vos courriers indésirables.
        </p>
      </div>

      <form v-else class="mt-10 space-y-6" novalidate @submit.prevent="handleSubmit">
        <div class="block space-y-2">
          <span class="font-sans text-[10px] uppercase tracking-[0.18em] text-cacao-2">
            Adresse email
          </span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="votre@email.fr"
            class="w-full border bg-papier px-4 py-3 font-sans text-[15px] text-cacao outline-none transition-colors focus:border-cacao/60"
            :style="{ borderColor: emailError ? '#9B1C1C' : 'rgba(58,31,20,0.25)' }"
          />
          <p v-if="emailError" class="font-sans text-[11px]" style="color: #9B1C1C">{{ emailError }}</p>
        </div>

        <p v-if="error" class="font-sans text-[13px] text-red-700">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full border border-cacao bg-cacao py-4 font-sans text-[12px] uppercase tracking-[0.12em] text-ivoire transition-opacity disabled:opacity-50"
        >
          {{ loading ? 'Envoi en cours…' : 'Recevoir le lien' }}
        </button>
      </form>
    </div>
  </div>
</template>
