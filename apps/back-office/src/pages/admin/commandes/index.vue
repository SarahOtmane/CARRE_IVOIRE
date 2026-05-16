<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAdminOrders } from "@carre-ivoire/composables";
import { OrderStatus } from "@carre-ivoire/types";

const router = useRouter();
const { orders, isLoading, fetchAll } = useAdminOrders();

const search = ref("");
const statusFilter = ref<"all" | OrderStatus>("all");

onMounted(() => fetchAll());

const STATUS_OPTIONS: Array<{ value: "all" | OrderStatus; label: string }> = [
  { value: "all", label: "Toutes" },
  { value: OrderStatus.PENDING, label: "Nouvelle" },
  { value: OrderStatus.PAYMENT_PENDING, label: "Paiement en attente" },
  { value: OrderStatus.CONFIRMED, label: "Confirmée" },
  { value: OrderStatus.PROCESSING, label: "En préparation" },
  { value: OrderStatus.SHIPPED, label: "Expédiée" },
  { value: OrderStatus.DELIVERED, label: "Livrée" },
  { value: OrderStatus.CANCELLED, label: "Annulée" },
];

const filteredOrders = computed(() => {
  const query = search.value.trim().toLowerCase();
  return [...orders.value]
    .filter((order) => {
      if (statusFilter.value !== "all" && order.status !== statusFilter.value) return false;
      if (query && !String(order.id).includes(query) && !(order.shippingAddress?.city ?? "").toLowerCase().includes(query)) return false;
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
});

function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2).replace(".", ",")} €`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function statusLabel(status: OrderStatus) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45">
            03 — Commandes
          </div>
          <h2 class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl">
            Le carnet <span class="italic text-cocoa/55">de l'atelier.</span>
          </h2>
        </div>
        <div class="font-body text-[11px] uppercase tracking-[0.16em] text-cocoa/55">
          {{ filteredOrders.length }} commande<span v-if="filteredOrders.length > 1">s</span>
        </div>
      </div>
    </section>

    <section class="flex flex-wrap items-center gap-4 border border-cocoa/12 bg-ivory px-6 py-5">
      <label class="flex min-w-[240px] flex-1 items-center gap-3 border-b border-cocoa/20 pb-3">
        <span class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45">Recherche</span>
        <input
          v-model="search"
          type="search"
          placeholder="Numéro, ville…"
          class="min-w-0 flex-1 bg-transparent font-body text-sm text-cocoa outline-none"
        />
      </label>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="opt in STATUS_OPTIONS.slice(0, 5)"
          :key="opt.value"
          type="button"
          class="border px-3 py-2 font-body text-[10px] uppercase tracking-[0.18em] transition-colors duration-200"
          :class="statusFilter === opt.value ? 'border-cocoa bg-cocoa text-ivory' : 'border-cocoa/20 text-cocoa hover:bg-beige/50'"
          @click="statusFilter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </section>

    <div v-if="isLoading" class="py-16 text-center font-body text-sm italic text-cocoa/45">
      Chargement…
    </div>

    <section v-else class="overflow-hidden border border-cocoa/12 bg-ivory">
      <div
        class="grid grid-cols-[72px_72px_minmax(0,1.5fr)_minmax(0,1fr)_72px_120px_140px_72px] border-b border-cocoa/12 px-6 py-4 font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
      >
        <span>N°</span>
        <span>Date</span>
        <span>Adresse</span>
        <span>Ville</span>
        <span class="text-right">Art.</span>
        <span class="text-right">Total</span>
        <span>Statut</span>
        <span class="text-right">Action</span>
      </div>

      <button
        v-for="order in filteredOrders"
        :key="order.id"
        type="button"
        class="grid w-full grid-cols-[72px_72px_minmax(0,1.5fr)_minmax(0,1fr)_72px_120px_140px_72px] items-center gap-4 border-b border-cocoa/8 px-6 py-5 text-left transition-colors duration-200 hover:bg-beige/50 last:border-b-0"
        @click="router.push({ name: 'admin-commandes-detail', params: { id: String(order.id) } })"
      >
        <span class="font-body text-[11px] text-cocoa/55 tabular-nums">#{{ order.id }}</span>
        <span class="font-body text-[12px] text-cocoa tabular-nums">{{ formatDate(order.createdAt) }}</span>
        <span class="min-w-0 truncate font-body text-sm text-cocoa">
          {{ order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : `Client #${order.userId}` }}
        </span>
        <span class="font-body text-sm italic text-cocoa/60">{{ order.shippingAddress?.city ?? "—" }}</span>
        <span class="text-right font-body text-sm tabular-nums text-cocoa">{{ order.items.length }}</span>
        <span class="text-right font-body text-sm tabular-nums text-gold">{{ formatPrice(order.totalAmount) }}</span>
        <span class="border border-cocoa/12 px-3 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/70">
          {{ statusLabel(order.status) }}
        </span>
        <span class="text-right font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/55">Ouvrir</span>
      </button>

      <div v-if="filteredOrders.length === 0 && !isLoading" class="px-6 py-12 text-center font-body text-sm italic text-cocoa/45">
        Aucune commande trouvée.
      </div>
    </section>
  </div>
</template>
