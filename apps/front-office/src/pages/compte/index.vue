<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@carre-ivoire/stores'
import { useUserOrders, useFavorites, useAccountDashboard } from '@carre-ivoire/composables'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Mon compte — Carré Ivoire',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const router = useRouter()
const authStore = useAuthStore()

const { orders, fetchOrders } = useUserOrders()
const { favorites } = useFavorites()
const { userDetails } = useAccountDashboard()

onMounted(() => fetchOrders())

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  payment_pending: 'Paiement en cours',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  refunded: 'Remboursée',
}

const stats = computed(() => [
  { label: 'Commandes', value: orders.value.length > 0 ? String(orders.value.length) : '—' },
  { label: 'Favoris', value: favorites.value.length > 0 ? String(favorites.value.length) : '—' },
  {
    label: 'Adresses',
    value: userDetails.value?.addressStreet ? '1' : '—',
  },
  {
    label: 'Depuis',
    value: userDetails.value?.createdAt
      ? String(new Date(userDetails.value.createdAt).getFullYear())
      : '—',
  },
])

const recentOrders = computed(() => orders.value.slice(0, 2))

const addressLine = computed(() => {
  const u = userDetails.value
  if (!u?.addressStreet) return null
  const parts = [u.addressStreet, u.addressZip && u.addressCity ? `${u.addressZip} ${u.addressCity}` : (u.addressCity ?? '')].filter(Boolean)
  return parts
})

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2).replace('.', ',')} €`
}

const shortcuts = [
  { label: 'Mes commandes', path: '/compte/commandes' },
  { label: 'Mes favoris', path: '/compte/favoris' },
  { label: 'Mes informations', path: '/compte/informations' },
]
</script>

<template>
  <div>
    <section
      class="mb-14 border-b pb-10"
      style="border-color: var(--cacao-a12)"
    >
      <span class="ci-eyebrow">Espace client</span>
      <h2
        class="mt-4 font-serif text-cacao"
        style="font-size: clamp(36px, 5vw, 64px); line-height: 1; font-weight: 500"
      >
        Bonjour,
        <em class="text-cacao-2">{{ authStore.user?.firstName ?? 'vous' }}.</em>
      </h2>
      <p class="mt-5 max-w-[620px] font-sans text-[16px] leading-[1.7] text-cacao-2">
        Votre espace réunit vos commandes, vos favoris et vos informations. Tout
        est ici. Clair. Direct.
      </p>

      <div class="mt-8 flex flex-wrap gap-4">
        <button
          v-for="shortcut in shortcuts"
          :key="shortcut.path"
          class="border border-cacao px-5 py-3 font-sans text-[12px] tracking-[0.08em] text-cacao transition-all duration-180 hover:bg-cacao hover:text-ivoire active:translate-y-px"
          @click="router.push(shortcut.path)"
        >
          {{ shortcut.label }}
        </button>
      </div>
    </section>

    <!-- Stats réelles -->
    <div class="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="border-t pt-4"
        style="border-color: var(--cacao-a12)"
      >
        <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
          {{ stat.label }}
        </div>
        <div class="mt-2 font-serif text-[36px] font-medium leading-none text-cacao">
          {{ stat.value }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-[1.25fr_0.75fr]">
      <!-- Dernières commandes -->
      <div>
        <h3 class="mb-5 font-serif text-[28px] font-medium text-cacao">
          Dernières commandes
        </h3>

        <div v-if="recentOrders.length === 0" class="py-8 font-serif text-[18px] italic text-cacao-2">
          Aucune commande pour le moment.
        </div>

        <div
          v-for="order in recentOrders"
          :key="order.id"
          class="flex flex-wrap items-center justify-between gap-4 border-b py-5"
          style="border-color: var(--cacao-a08)"
        >
          <div>
            <div class="font-sans text-[11px] uppercase tracking-[0.18em] text-cacao-2">
              {{ order.orderNumber }}
            </div>
            <div class="mt-1 font-serif text-[18px] font-medium text-cacao">
              {{ formatDate(order.createdAt) }}
            </div>
          </div>
          <div class="flex items-center gap-6">
            <span class="font-sans text-[11px] uppercase tracking-[0.18em] text-dore">
              {{ STATUS_LABELS[order.status] ?? order.status }}
            </span>
            <span
              class="font-sans text-[13px] text-dore"
              style="font-variant-numeric: tabular-nums"
            >
              {{ formatPrice(order.totalAmount) }}
            </span>
            <a
              class="cursor-pointer border-b border-cacao pb-px font-sans text-[12px] text-cacao transition-opacity duration-180 hover:opacity-60"
              @click="router.push('/compte/commandes/' + order.id)"
            >
              Détail →
            </a>
          </div>
        </div>

        <div class="mt-8">
          <button
            class="border-b border-cacao pb-px font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
            @click="router.push('/compte/commandes')"
          >
            Voir toutes mes commandes →
          </button>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-8">
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Adresse par défaut
          </div>
          <div v-if="addressLine" class="mt-3 font-serif text-[22px] leading-[1.35] text-cacao">
            {{ addressLine[0] }}<br />
            <span class="italic">{{ addressLine[1] }}</span>
          </div>
          <div v-else class="mt-3 font-sans text-[14px] italic text-cacao-2">
            Aucune adresse enregistrée.
            <button
              class="ml-1 underline"
              @click="router.push('/compte/informations')"
            >
              Ajouter →
            </button>
          </div>
          <button
            v-if="addressLine"
            class="mt-3 border-b border-cacao pb-px font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
            @click="router.push('/compte/informations')"
          >
            Modifier l'adresse →
          </button>
        </div>

        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Raccourcis
          </div>
          <div class="mt-3 space-y-3">
            <button
              class="block w-full border-b border-cacao pb-px text-left font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
              @click="router.push('/compte/informations')"
            >
              Modifier mes informations →
            </button>
            <button
              class="block w-full border-b border-cacao pb-px text-left font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
              @click="router.push('/compte/favoris')"
            >
              Revoir mes favoris →
            </button>
            <button
              class="block w-full border-b border-cacao pb-px text-left font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
              @click="router.push('/compte/commandes')"
            >
              Suivre mes commandes →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
