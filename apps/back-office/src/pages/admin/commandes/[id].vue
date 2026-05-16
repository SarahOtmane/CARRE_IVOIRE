<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAdminOrders } from "@carre-ivoire/composables";
import { OrderStatus } from "@carre-ivoire/types";

const route = useRoute();
const router = useRouter();
const { current, fetchOne, updateStatus, isLoading } = useAdminOrders();

const orderId = computed(() => Number(route.params.id));

onMounted(() => fetchOne(orderId.value));

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: OrderStatus.PENDING, label: "Nouvelle" },
  { value: OrderStatus.PAYMENT_PENDING, label: "Paiement en attente" },
  { value: OrderStatus.CONFIRMED, label: "Confirmée" },
  { value: OrderStatus.PROCESSING, label: "En préparation" },
  { value: OrderStatus.SHIPPED, label: "Expédiée" },
  { value: OrderStatus.DELIVERED, label: "Livrée" },
  { value: OrderStatus.CANCELLED, label: "Annulée" },
  { value: OrderStatus.REFUNDED, label: "Remboursée" },
];

function statusLabel(status: OrderStatus) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
}

function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2).replace(".", ",")} €`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

async function changeStatus(event: Event) {
  const status = (event.target as HTMLSelectElement).value as OrderStatus;
  await updateStatus(orderId.value, status);
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div>
        <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45">
          03 — Commandes
        </div>
        <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl">
          Détail de commande <span class="italic text-cocoa/55">et suivi.</span>
        </h2>
      </div>
    </section>

    <div v-if="isLoading && !current" class="py-16 text-center font-body text-sm italic text-cocoa/45">
      Chargement…
    </div>

    <div
      v-else-if="current"
      class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]"
    >
      <article class="border border-cocoa/12 bg-ivory p-8">
        <div class="flex flex-wrap items-start justify-between gap-4 border-b border-cocoa/12 pb-6">
          <div>
            <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">
              Commande #{{ current.id }}
            </div>
            <h3 class="mt-3 font-display text-4xl text-cocoa">
              {{ current.shippingAddress ? `${current.shippingAddress.firstName} ${current.shippingAddress.lastName}` : `Client #${current.userId}` }}
            </h3>
            <div class="mt-2 font-body text-sm italic text-cocoa/60">
              {{ current.shippingAddress?.city ?? "—" }}
            </div>
          </div>
          <div class="text-right">
            <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Total</div>
            <div class="mt-3 font-display text-4xl text-gold">
              {{ formatPrice(current.totalAmount) }}
            </div>
          </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <div class="border border-cocoa/12 p-4">
            <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Date</div>
            <div class="mt-2 font-display text-2xl text-cocoa">{{ formatDate(current.createdAt) }}</div>
          </div>
          <div class="border border-cocoa/12 p-4">
            <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Paiement</div>
            <div class="mt-2 font-display text-2xl text-cocoa">
              {{ current.stripePaymentIntentId ? "Stripe" : "—" }}
            </div>
          </div>
          <div class="border border-cocoa/12 p-4">
            <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Statut</div>
            <div class="mt-2 font-display text-2xl text-cocoa">{{ statusLabel(current.status) }}</div>
          </div>
        </div>

        <div v-if="current.shippingAddress" class="mt-6 border border-cocoa/12 p-4">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Adresse de livraison</div>
          <div class="mt-2 font-body text-sm leading-relaxed text-cocoa">
            {{ current.shippingAddress.line1 }}<span v-if="current.shippingAddress.line2">, {{ current.shippingAddress.line2 }}</span><br/>
            {{ current.shippingAddress.postalCode }} {{ current.shippingAddress.city }}, {{ current.shippingAddress.country }}
          </div>
        </div>

        <div class="mt-8 border-t border-cocoa/12 pt-6">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Articles</div>
          <div class="mt-4 divide-y divide-cocoa/8 border border-cocoa/12 bg-beige/30 px-4">
            <div
              v-for="item in current.items"
              :key="item.id"
              class="flex items-center justify-between py-4"
            >
              <div>
                <div class="font-display text-lg text-cocoa">
                  Produit #{{ item.productId }}
                </div>
                <div class="font-body text-[11px] text-cocoa/55">
                  × {{ item.quantity }}{{ item.format ? ` · ${item.format}` : "" }}
                </div>
              </div>
              <div class="font-body text-sm tabular-nums text-gold">
                {{ formatPrice(item.unitPrice * item.quantity) }}
              </div>
            </div>
          </div>

          <div class="mt-6 space-y-2 font-body text-sm text-cocoa">
            <div class="flex justify-between border-t border-cocoa/12 pt-3 font-display text-2xl">
              <span>Total</span>
              <span class="text-gold">{{ formatPrice(current.totalAmount) }}</span>
            </div>
          </div>
        </div>
      </article>

      <aside class="space-y-6">
        <article class="border border-cocoa/12 bg-ivory p-6">
          <div class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Statut</div>
          <select
            :value="current.status"
            class="mt-4 w-full border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            @change="changeStatus"
          >
            <option v-for="opt in STATUS_OPTIONS" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </article>

        <button
          type="button"
          class="w-full border border-cocoa bg-cocoa px-5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-ivory"
          @click="router.push({ name: 'admin-commandes' })"
        >
          Retour aux commandes
        </button>
      </aside>
    </div>

    <div v-else class="border border-cocoa/12 bg-ivory px-8 py-12 text-center">
      <div class="font-display text-3xl text-cocoa">Commande introuvable.</div>
      <button
        type="button"
        class="mt-6 border border-cocoa bg-cocoa px-5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-ivory"
        @click="router.push({ name: 'admin-commandes' })"
      >
        Retour aux commandes
      </button>
    </div>
  </div>
</template>
