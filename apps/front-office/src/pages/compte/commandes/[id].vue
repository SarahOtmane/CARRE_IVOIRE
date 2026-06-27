<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderDetail } from '@carre-ivoire/composables'

const route = useRoute()
const router = useRouter()

const { order, isLoading, error, fetchOrder } = useOrderDetail()

onMounted(() => fetchOrder(route.params.id as string))

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

const shippingLine = computed(() => {
  const addr = order.value?.shippingAddress as Record<string, string> | undefined
  if (!addr) return null
  const parts = [addr.line1, addr.line2, `${addr.postalCode} ${addr.city}`, addr.country].filter(Boolean)
  return parts.join(', ')
})
</script>

<template>
  <!-- Chargement -->
  <div v-if="isLoading" class="py-16 text-center">
    <span class="ci-eyebrow">Chargement</span>
  </div>

  <!-- Erreur -->
  <div v-else-if="error" class="py-16 text-center">
    <p class="font-sans text-[15px] text-cacao-2">{{ error }}</p>
    <button
      class="mt-6 border-b border-cacao pb-px font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
      @click="router.push('/compte/commandes')"
    >
      ← Retour aux commandes
    </button>
  </div>

  <div v-else-if="order">
    <section class="mb-10 border-b pb-8" style="border-color: var(--cacao-a12)">
      <span class="ci-eyebrow">Détail commande</span>
      <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div class="font-sans text-[11px] uppercase tracking-[0.18em] text-cacao-2">
            {{ order.orderNumber }}
          </div>
          <h2
            class="mt-2 font-serif text-cacao"
            style="font-size: clamp(32px, 4vw, 56px); line-height: 1; font-weight: 500"
          >
            {{ formatDate(order.createdAt!) }}
          </h2>
        </div>
        <span class="font-sans text-[11px] uppercase tracking-[0.18em] text-dore">
          {{ STATUS_LABELS[order.status] ?? order.status }}
        </span>
      </div>
      <p class="mt-5 max-w-[560px] font-sans text-[15px] leading-[1.7] text-cacao-2">
        Articles, adresse et récapitulatif de votre commande.
      </p>
    </section>

    <!-- Articles -->
    <div class="mb-8">
      <div
        v-for="item in order.items"
        :key="item.id"
        class="flex gap-5 border-b py-5"
        style="border-color: var(--cacao-a08)"
      >
        <div class="h-[88px] w-[88px] shrink-0 bg-papier" />
        <div class="flex flex-1 flex-col justify-between">
          <div>
            <div class="font-serif text-[18px] font-medium text-cacao">
              {{ item.productName ?? `Produit #${item.productId}` }}
            </div>
            <div class="mt-1 font-sans text-[11px] uppercase tracking-[0.18em] text-cacao-2">
              <template v-if="item.format">Format {{ item.format }} · </template>Qté {{ item.quantity }}
            </div>
          </div>
          <div class="font-sans text-[13px] text-dore" style="font-variant-numeric: tabular-nums">
            {{ formatPrice(item.unitPrice * item.quantity) }}
          </div>
        </div>
      </div>
    </div>

    <div class="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Récapitulatif -->
      <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
        <div class="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3">
          Récapitulatif
        </div>
        <div class="flex justify-between py-2 font-sans text-[13px]">
          <span class="text-cacao-2">Sous-total</span>
          <span class="text-cacao" style="font-variant-numeric: tabular-nums">
            {{ formatPrice(order.items.reduce((a, i) => a + i.unitPrice * i.quantity, 0)) }}
          </span>
        </div>
        <div
          class="flex justify-between border-t py-2 font-serif text-[18px] font-medium"
          style="border-color: var(--cacao-a12)"
        >
          <span class="text-cacao">Total</span>
          <span class="text-dore" style="font-variant-numeric: tabular-nums">
            {{ formatPrice(order.totalAmount) }}
          </span>
        </div>
      </div>

      <!-- Adresse -->
      <div v-if="shippingLine" class="border-t pt-4" style="border-color: var(--cacao-a12)">
        <div class="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3">
          Adresse de livraison
        </div>
        <p class="font-serif text-[18px] leading-[1.45] text-cacao">{{ shippingLine }}</p>
      </div>
    </div>

    <button
      class="border-b border-cacao pb-px font-sans text-[13px] text-cacao transition-opacity duration-180 hover:opacity-60"
      @click="router.push('/compte/commandes')"
    >
      ← Retour aux commandes
    </button>
  </div>

  <!-- Commande introuvable -->
  <div v-else class="py-16 text-center">
    <span class="ci-eyebrow">Introuvable</span>
    <h2 class="mt-3 font-serif text-[28px] font-medium text-cacao">
      Cette commande n'existe pas.
    </h2>
    <button
      class="mt-6 border-b border-cacao pb-px font-sans text-[13px] text-cacao"
      @click="router.push('/compte/commandes')"
    >
      ← Retour aux commandes
    </button>
  </div>
</template>
