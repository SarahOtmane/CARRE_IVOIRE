<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@carre-ivoire/stores'
import { useUserInfo } from '@carre-ivoire/composables'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Mes informations — Carré Ivoire',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const router = useRouter()
const authStore = useAuthStore()
const {
  form,
  passwordForm,
  saved,
  saveError,
  isSaving,
  passwordSaved,
  passwordError,
  isSavingPassword,
  isDeleting,
  deleteError,
  save,
  changePassword,
  deleteAccount,
} = useUserInfo()

const errors = ref<Record<string, string>>({})
const showDeleteConfirm = ref(false)

async function confirmDelete() {
  await deleteAccount()
  if (!deleteError.value) router.push('/')
}

function validateAndSave() {
  errors.value = {}
  if (!form.value.firstName.trim())
    errors.value.firstName = 'Veuillez remplir ce champs'
  if (!form.value.lastName.trim())
    errors.value.lastName = 'Veuillez remplir ce champs'
  if (form.value.phone?.trim() && !/^\+?[\d\s.\-()]{7,20}$/.test(form.value.phone.trim()))
    errors.value.phone = "Le format de votre téléphone n'est pas bon"
  if (form.value.addressZip?.trim() && !/^\d{4,10}$/.test(form.value.addressZip.trim()))
    errors.value.addressZip = "Le format de votre code postal n'est pas bon"
  if (Object.keys(errors.value).length > 0) return
  save()
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
      <div class="max-w-[640px] space-y-10">

        <!-- Informations personnelles -->
        <div class="space-y-7">
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
                :style="{ borderBottom: `1px solid ${errors.firstName ? '#9B1C1C' : 'var(--brun-cacao)'}` }"
              />
              <p v-if="errors.firstName" class="mt-1 font-sans text-[11px]" style="color: #9B1C1C">{{ errors.firstName }}</p>
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
                :style="{ borderBottom: `1px solid ${errors.lastName ? '#9B1C1C' : 'var(--brun-cacao)'}` }"
              />
              <p v-if="errors.lastName" class="mt-1 font-sans text-[11px]" style="color: #9B1C1C">{{ errors.lastName }}</p>
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
              :style="{ borderBottom: `1px solid ${errors.phone ? '#9B1C1C' : 'var(--brun-cacao)'}` }"
            />
            <p v-if="errors.phone" class="mt-1 font-sans text-[11px]" style="color: #9B1C1C">{{ errors.phone }}</p>
          </div>

          <!-- Adresse -->
          <div>
            <label
              for="account-address"
              class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
            >
              Rue
            </label>
            <input
              id="account-address"
              v-model="form.addressStreet"
              type="text"
              autocomplete="address-line1"
              placeholder="29 rue de Vauparfonds"
              class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none placeholder:text-cacao-3"
              style="border-bottom: 1px solid var(--brun-cacao)"
            />
          </div>

          <!-- Ville + Code postal -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label
                for="account-city"
                class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
              >
                Ville
              </label>
              <input
                id="account-city"
                v-model="form.addressCity"
                type="text"
                autocomplete="address-level2"
                placeholder="LUISANT"
                class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none placeholder:text-cacao-3"
                style="border-bottom: 1px solid var(--brun-cacao)"
              />
            </div>
            <div>
              <label
                for="account-zip"
                class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
              >
                Code postal
              </label>
              <input
                id="account-zip"
                v-model="form.addressZip"
                type="text"
                autocomplete="postal-code"
                placeholder="28600"
                class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none placeholder:text-cacao-3"
                :style="{ borderBottom: `1px solid ${errors.addressZip ? '#9B1C1C' : 'var(--brun-cacao)'}` }"
              />
              <p v-if="errors.addressZip" class="mt-1 font-sans text-[11px]" style="color: #9B1C1C">{{ errors.addressZip }}</p>
            </div>
          </div>

          <!-- Pays -->
          <div>
            <label
              for="account-country"
              class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
            >
              Pays
            </label>
            <input
              id="account-country"
              v-model="form.addressCountry"
              type="text"
              autocomplete="country-name"
              class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none placeholder:text-cacao-3"
              style="border-bottom: 1px solid var(--brun-cacao)"
            />
          </div>

          <!-- Actions profil -->
          <div class="flex items-center gap-6 pt-2">
            <button
              class="border border-cacao bg-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isSaving"
              @click="validateAndSave"
            >
              {{ isSaving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
            <span
              v-if="saved"
              class="font-sans text-[12px] uppercase tracking-[0.14em] text-dore"
            >
              Modifications enregistrées
            </span>
            <span v-if="saveError" class="font-sans text-[12px] text-cacao-2">
              {{ saveError }}
            </span>
          </div>
        </div>

        <!-- Changer le mot de passe -->
        <div class="border-t pt-8 space-y-7" style="border-color: var(--cacao-a12)">

          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3">
            Modifier le mot de passe
          </div>

          <div>
            <label
              for="account-current-password"
              class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
            >
              Mot de passe actuel
            </label>
            <input
              id="account-current-password"
              v-model="passwordForm.currentPassword"
              type="password"
              autocomplete="current-password"
              class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none"
              style="border-bottom: 1px solid var(--brun-cacao)"
            />
          </div>
          <div>
            <label
              for="account-new-password"
              class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
            >
              Nouveau mot de passe
            </label>
            <input
              id="account-new-password"
              v-model="passwordForm.newPassword"
              type="password"
              autocomplete="new-password"
              placeholder="8 caractères minimum"
              class="w-full bg-transparent py-2.5 font-sans text-[15px] text-cacao outline-none placeholder:text-cacao-3"
              style="border-bottom: 1px solid var(--brun-cacao)"
            />
          </div>

          <div class="flex items-center gap-6">
            <button
              class="border border-cacao bg-transparent px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-cacao transition-all duration-180 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isSavingPassword"
              @click="changePassword"
            >
              {{ isSavingPassword ? 'Mise à jour…' : 'Changer le mot de passe' }}
            </button>
            <span
              v-if="passwordSaved"
              class="font-sans text-[12px] uppercase tracking-[0.14em] text-dore"
            >
              Mot de passe mis à jour
            </span>
            <span v-if="passwordError" class="font-sans text-[12px] text-cacao-2">
              {{ passwordError }}
            </span>
          </div>
        </div>
        <!-- Supprimer le compte -->
        <div class="border-t pt-8 space-y-5" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3">
            Supprimer le compte
          </div>
          <p class="max-w-[480px] font-sans text-[14px] leading-[1.7] text-cacao-2">
            Cette action est irréversible. Toutes vos données personnelles, commandes et favoris associés à ce compte seront définitivement supprimés.
          </p>
          <div class="flex items-center gap-6">
            <button
              type="button"
              class="border border-red-700/50 px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-red-700 transition-all duration-180 hover:border-red-700 hover:bg-red-700/5 active:translate-y-px"
              @click="showDeleteConfirm = true"
            >
              Supprimer mon compte
            </button>
            <span v-if="deleteError" class="font-sans text-[12px] text-red-700">{{ deleteError }}</span>
          </div>
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
            {{ form.addressStreet }}<span v-if="form.addressCity">, {{ form.addressZip }} {{ form.addressCity }}</span>
          </p>
        </div>
      </aside>
    </div>
  </div>

  <!-- Modal confirmation suppression -->
  <Teleport to="body">
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-cacao/40 p-5"
      @click.self="showDeleteConfirm = false"
    >
      <div class="w-full max-w-[440px] border border-cacao bg-ivoire p-10">
        <p class="font-sans text-[11px] uppercase tracking-[0.22em] text-cacao-3">Suppression définitive</p>
        <h3
          class="mt-4 font-serif text-cacao"
          style="font-size: clamp(22px, 3vw, 30px); line-height: 1.1; font-weight: 500"
        >
          Êtes-vous sûr de vouloir supprimer votre compte définitivement ?
        </h3>
        <p class="mt-4 font-sans text-[13px] leading-[1.7] text-cacao-2">
          Cette action ne peut pas être annulée. Toutes vos données seront effacées.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            class="border border-red-700 bg-red-700 px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-px"
            :disabled="isDeleting"
            @click="confirmDelete"
          >
            {{ isDeleting ? 'Suppression…' : 'Oui, supprimer' }}
          </button>
          <button
            type="button"
            class="border border-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-cacao transition-all duration-180 active:translate-y-px"
            :disabled="isDeleting"
            @click="showDeleteConfirm = false"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
