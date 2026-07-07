<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAdminUsers } from '@carre-ivoire/composables'

const { users, isLoading, total, page, totalPages, fetchUsers } = useAdminUsers()

const search = ref('')
let searchTimeout: ReturnType<typeof setTimeout> | undefined

watch(search, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => fetchUsers({ search: search.value || undefined, page: 1 }), 350)
})

function goToPage(p: number) {
  fetchUsers({ search: search.value || undefined, page: p })
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
}

onMounted(() => fetchUsers())
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b pb-8" style="border-color: var(--cacao-a12)">
      <span class="ci-eyebrow">06 — Clients</span>
      <h2
        class="mt-4 font-serif font-medium text-cacao"
        style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
      >
        Notre carnet
        <em class="text-cacao-2">d'adresses.</em>
      </h2>
    </section>

    <!-- Barre de recherche + compteur -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div
        class="flex items-center gap-3 border-b"
        style="border-color: var(--cacao-a24); min-width: 280px; max-width: 420px; width: 100%"
      >
        <svg
          width="14" height="14" fill="none" stroke="currentColor"
          stroke-width="1.25" stroke-linecap="square" viewBox="0 0 16 16"
          class="shrink-0 text-cacao-2"
        >
          <circle cx="6.5" cy="6.5" r="5" />
          <line x1="10.5" y1="10.5" x2="15" y2="15" />
        </svg>
        <input
          v-model="search"
          type="search"
          placeholder="Rechercher par nom ou email…"
          class="flex-1 bg-transparent py-2 font-sans text-[13px] text-cacao outline-none placeholder:text-cacao-2 placeholder:opacity-50"
        />
      </div>
      <span class="font-sans text-[12px] text-cacao-2">
        {{ total }} client{{ total !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loader -->
    <div v-if="isLoading" class="py-16 text-center">
      <span class="ci-eyebrow">Chargement</span>
    </div>

    <!-- Tableau -->
    <div v-else-if="users.length > 0">
      <table class="w-full border-collapse font-sans text-[13px]">
        <thead>
          <tr style="border-bottom: 1px solid var(--cacao-a12)">
            <th class="py-3 pr-6 text-left font-sans text-[10px] uppercase tracking-[0.18em] text-cacao-2">
              Client
            </th>
            <th class="py-3 pr-6 text-left font-sans text-[10px] uppercase tracking-[0.18em] text-cacao-2">
              Email
            </th>
            <th class="py-3 pr-6 text-left font-sans text-[10px] uppercase tracking-[0.18em] text-cacao-2">
              N° client
            </th>
            <th class="py-3 pr-6 text-left font-sans text-[10px] uppercase tracking-[0.18em] text-cacao-2">
              Rôle
            </th>
            <th class="py-3 text-left font-sans text-[10px] uppercase tracking-[0.18em] text-cacao-2">
              Inscrit le
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="transition-colors duration-180 hover:bg-rose-poudre"
            style="border-bottom: 1px solid var(--cacao-a08)"
          >
            <td class="py-4 pr-6 text-cacao">
              {{ user.firstName }} {{ user.lastName }}
            </td>
            <td class="py-4 pr-6 text-cacao-2">
              {{ user.email }}
            </td>
            <td class="py-4 pr-6 font-mono text-[12px] text-cacao-2">
              {{ user.customerNumber }}
            </td>
            <td class="py-4 pr-6">
              <span
                class="font-sans text-[10px] uppercase tracking-[0.12em]"
                :class="user.role === 'admin' ? 'text-dore' : 'text-cacao-2'"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="py-4 text-cacao-2">
              {{ formatDate(user.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="mt-8 flex items-center justify-between"
      >
        <button
          class="font-sans text-[12px] text-cacao-2 transition-opacity hover:text-cacao disabled:opacity-30"
          :disabled="page <= 1"
          @click="goToPage(page - 1)"
        >
          Précédent
        </button>
        <span class="font-sans text-[12px] text-cacao-2">
          Page {{ page }} / {{ totalPages }}
        </span>
        <button
          class="font-sans text-[12px] text-cacao-2 transition-opacity hover:text-cacao disabled:opacity-30"
          :disabled="page >= totalPages"
          @click="goToPage(page + 1)"
        >
          Suivant
        </button>
      </div>
    </div>

    <!-- État vide -->
    <div
      v-else
      class="py-16 text-center"
      style="border-top: 1px solid var(--cacao-a08)"
    >
      <span class="ci-eyebrow">Vide</span>
      <p class="mt-3 font-sans text-[14px] text-cacao-2">
        {{ search ? 'Aucun client ne correspond à cette recherche.' : 'Aucun client enregistré.' }}
      </p>
    </div>
  </div>
</template>
