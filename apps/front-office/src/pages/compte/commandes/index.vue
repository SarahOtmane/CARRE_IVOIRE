<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserOrders } from '@carre-ivoire/composables'

const router = useRouter()
const { orders, isLoading, error, totalSpent, fetchOrders } = useUserOrders()

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
</script>

<template>
  <div>
    <section class="mb-12 border-b pb-8" style="border-color: var(--cacao-a12)">
      <span class="ci-eyebrow">Mes commandes</span>
      <h2
        class="mt-4 font-serif text-cacao"
        style="font-size: clamp(32px, 4vw, 56px); line-height: 1; font-weight: 500"
      >
        Le fil des colis.
      </h2>
      <p class="mt-5 max-w-[560px] font-sans text-[15px] leading-[1.7] text-cacao-2">
        Un historique simple, lisible, sans bruit. Statut, date, montant. Chaque
        commande reste à portée.
      </p>
    </section>

    <!-- Loader -->
    <div v-if="isLoading" class="py-16 text-center">
      <span class="ci-eyebrow">Chargement</span>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="py-16 text-center">
      <p class="font-sans text-[15px] text-cacao-2">{{ error }}</p>
      <button
        class="mt-6 border-b border-cacao pb-px font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
        @click="fetchOrders"
      >
        Réessayer
      </button>
    </div>

    <template v-else>
      <!-- Statistiques -->
      <div v-if="orders.length > 0" class="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Commandes
          </div>
          <div class="mt-2 font-serif text-[36px] font-medium leading-none text-cacao">
            {{ orders.length }}
          </div>
        </div>
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Montant total
          </div>
          <div class="mt-2 font-serif text-[36px] font-medium leading-none text-cacao">
            {{ formatPrice(totalSpent) }}
          </div>
        </div>
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Dernière
          </div>
          <div class="mt-2 font-serif text-[22px] font-medium leading-none text-cacao">
            {{ formatDate(orders[0].createdAt) }}
          </div>
        </div>
        <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
          <div class="font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2">
            Statut
          </div>
          <div class="mt-2 font-serif text-[22px] font-medium leading-none text-dore">
            {{ STATUS_LABELS[orders[0].status] ?? orders[0].status }}
          </div>
        </div>
      </div>

      <!-- En-tête colonnes -->
      <div
        v-if="orders.length > 0"
        class="mb-1 grid grid-cols-[1fr_auto] gap-4 border-b pb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3"
        style="border-color: var(--cacao-a12)"
      >
        <span>Commande</span>
        <span>Montant</span>
      </div>

      <!-- Liste des commandes -->
      <div
        v-for="order in orders"
        :key="order.id"
        class="flex flex-wrap items-center justify-between gap-4 border-b py-5"
        style="border-color: var(--cacao-a08)"
      >
        <div>
          <div class="font-sans text-[11px] uppercase tracking-[0.18em] text-cacao-2">
            #{{ String(order.id).padStart(6, '0') }}
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

      <!-- État vide -->
      <div v-if="orders.length === 0" class="py-16 text-center">
        <p class="font-serif text-[22px] italic text-cacao-2">
          Aucune commande pour le moment.
        </p>
        <button
          class="mt-6 border-b border-cacao pb-px font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
          @click="router.push('/boutique')"
        >
          Découvrir la boutique →
        </button>
      </div>
    </template>

    <div class="mt-10 border-t pt-5" style="border-color: var(--cacao-a12)">
      <button
        class="border-b border-cacao pb-px font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
        @click="router.push('/boutique')"
      >
        Revenir à la boutique →
      </button>
    </div>
  </div>
</template>
