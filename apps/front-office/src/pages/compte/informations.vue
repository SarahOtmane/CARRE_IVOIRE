<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@carre-ivoire/stores'
import { useApi } from '@carre-ivoire/composables'

const authStore = useAuthStore()
const api = useApi()

const form = ref({
  firstName: authStore.user?.firstName ?? '',
  lastName: authStore.user?.lastName ?? '',
  phone: '',
  addressStreet: '',
})

const saved = ref(false)
const saveError = ref<string | null>(null)
const isSaving = ref(false)
let savedTimeout: ReturnType<typeof setTimeout> | undefined

async function save() {
  if (isSaving.value) return
  isSaving.value = true
  saveError.value = null

  try {
    const res = await api.patch<{ success: boolean; data: { firstName: string; lastName: string; email: string; role: string } }>(
      '/users/me',
      {
        firstName: form.value.firstName.trim() || undefined,
        lastName: form.value.lastName.trim() || undefined,
        phone: form.value.phone.trim() || undefined,
        addressStreet: form.value.addressStreet.trim() || undefined,
      },
    )

    if (authStore.token && res.data.data) {
      authStore.setAuth(authStore.token, { ...authStore.user!, ...res.data.data })
    }

    saved.value = true
    if (savedTimeout) globalThis.clearTimeout(savedTimeout)
    savedTimeout = globalThis.setTimeout(() => {
      saved.value = false
    }, 2400)
  } catch {
    saveError.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div>
    <section class="mb-12 border-b pb-8" style="border-color: var(--cacao-a12)">
      <span class="ci-eyebrow">Mes informations</span>
      <h2
        class="mt-4 font-serif text-cacao"
        style="font-size: clamp(32px, 4vw, 56px); line-height: 1; font-weight: 500"
      >
        Coordonnées,
        <em class="text-cacao-2">sécurité et livraison.</em>
      </h2>
      <p class="mt-5 max-w-[560px] font-sans text-[15px] leading-[1.7] text-cacao-2">
        Gardez vos informations à jour pour recevoir vos commandes sans
        friction. Un seul endroit. Pas de détour.
      </p>
    </section>

    <div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
      <div class="max-w-[640px] space-y-7">
        <!-- Email (lecture seule) -->
        <div>
          <label
            for="account-email"
            class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
          >
            Email
          </label>
          <input
            id="account-email"
            :value="authStore.user?.email ?? ''"
            type="email"
            disabled
            class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao-3 outline-none"
            style="border-bottom: 1px solid var(--cacao-a24)"
          />
        </div>

        <!-- Prénom + Nom -->
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label
              for="account-first-name"
              class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
            >
              Prénom
            </label>
            <input
              id="account-first-name"
              v-model="form.firstName"
              type="text"
              class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none"
              style="border-bottom: 1px solid var(--brun-cacao)"
            />
          </div>
          <div>
            <label
              for="account-last-name"
              class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
            >
              Nom
            </label>
            <input
              id="account-last-name"
              v-model="form.lastName"
              type="text"
              class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none"
              style="border-bottom: 1px solid var(--brun-cacao)"
            />
          </div>
        </div>

        <!-- Téléphone -->
        <div>
          <label
            for="account-phone"
            class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
          >
            Téléphone
          </label>
          <input
            id="account-phone"
            v-model="form.phone"
            type="tel"
            placeholder="+33 6 00 00 00 00"
            class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none placeholder:text-cacao-3"
            style="border-bottom: 1px solid var(--brun-cacao)"
          />
        </div>

        <!-- Adresse de livraison -->
        <div>
          <label
            for="account-address"
            class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
          >
            Adresse de livraison
          </label>
          <input
            id="account-address"
            v-model="form.addressStreet"
            type="text"
            placeholder="4 rue du Nil, 75002 Paris"
            class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none placeholder:text-cacao-3"
            style="border-bottom: 1px solid var(--brun-cacao)"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-6 pt-2">
          <button
            class="border border-cacao bg-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSaving"
            @click="save"
          >
            {{ isSaving ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
          <span
            v-if="saved"
            class="font-sans text-[12px] uppercase tracking-[0.14em] text-dore transition-opacity duration-400"
          >
            Modifications enregistrées
          </span>
          <span
            v-if="saveError"
            class="font-sans text-[12px] leading-[1.6] text-cacao-2"
          >
            {{ saveError }}
          </span>
        </div>

        <!-- Mot de passe -->
        <div class="border-t pt-8" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3">
            Modifier le mot de passe
          </div>
          <p class="mt-4 font-sans text-[14px] leading-[1.7] text-cacao-2">
            Le changement de mot de passe est disponible depuis la page
            <RouterLink
              to="/mot-de-passe-oublie"
              class="border-b border-cacao-2 pb-px text-cacao transition-opacity duration-180 hover:opacity-60"
            >
              mot de passe oublié
            </RouterLink>.
          </p>
        </div>
      </div>

      <aside class="space-y-6">
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Sécurité
          </div>
          <p class="mt-3 font-sans text-[14px] leading-[1.7] text-cacao-2">
            Vos données sont transmises de façon sécurisée. L'email ne peut pas être modifié depuis cet espace.
          </p>
        </div>

        <div v-if="form.addressStreet" class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Livraison
          </div>
          <p class="mt-3 font-serif text-[18px] leading-[1.45] text-cacao">
            {{ form.addressStreet }}
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
