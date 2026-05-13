<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAdminProducts, useAdminOrders } from "@carre-ivoire/composables";
import { OrderStatus } from "@carre-ivoire/types";

const router = useRouter();

const { products, fetchAll: fetchProducts } = useAdminProducts();
const { orders, fetchAll: fetchOrders } = useAdminOrders();

onMounted(() => Promise.all([fetchProducts(), fetchOrders()]));

function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2).replace(".", ",")} €`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const today = new Date().toLocaleDateString("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const revenue = computed(() =>
  orders.value
    .filter((o) => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.REFUNDED)
    .reduce((sum, o) => sum + o.totalAmount, 0),
);

const pendingCount = computed(
  () =>
    orders.value.filter(
      (o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.PAYMENT_PENDING,
    ).length,
);

const processingCount = computed(
  () => orders.value.filter((o) => o.status === OrderStatus.PROCESSING).length,
);

const lowStockProducts = computed(() =>
  products.value.filter((p) => p.stock < 10).slice(0, 5),
);

const recentOrders = computed(() =>
  [...orders.value]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6),
);

const kpis = computed(() => [
  {
    label: "Chiffre d'affaires",
    value: formatPrice(revenue.value),
    hint: `${orders.value.length} commandes`,
  },
  { label: "Nouvelles commandes", value: pendingCount.value, hint: "à traiter" },
  { label: "En préparation", value: processingCount.value, hint: "au laboratoire" },
  { label: "Produits actifs", value: products.value.filter((p) => p.isActive).length, hint: `${lowStockProducts.value.length} en stock bas` },
]);

function statusLabel(status: OrderStatus) {
  const labels: Record<string, string> = {
    pending: "Nouvelle",
    payment_pending: "Paiement en attente",
    confirmed: "Confirmée",
    processing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
    refunded: "Remboursée",
  };
  return labels[status] ?? status;
}

function goTo(name: string, params?: Record<string, string>) {
  router.push({ name, params });
}
</script>

<template>
  <div class="space-y-10 pb-10">
    <section class="border-b border-cocoa/12 pb-10">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div
            class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45"
          >
            00 — Tableau de bord
          </div>
          <h2
            class="mt-4 max-w-3xl font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl"
          >
            Bonjour.
            <span class="italic text-cocoa/55"> aujourd'hui à l'atelier.</span>
          </h2>
        </div>
        <div class="font-body text-sm text-cocoa/55">{{ today }}</div>
      </div>
    </section>

    <section class="grid gap-0 border border-cocoa/12 bg-ivory lg:grid-cols-4">
      <article
        v-for="(item, index) in kpis"
        :key="item.label"
        class="border-b border-cocoa/12 px-6 py-7 lg:border-b-0 lg:border-r lg:last:border-r-0"
      >
        <div
          class="font-body text-[10px] uppercase tracking-[0.24em] text-cocoa/45"
        >
          0{{ index + 1 }}
        </div>
        <div class="mt-5 font-display text-4xl text-cocoa">
          {{ item.value }}
        </div>
        <div class="mt-3 font-body text-sm text-cocoa">{{ item.label }}</div>
        <div class="mt-1 font-body text-[11px] italic text-cocoa/55">
          {{ item.hint }}
        </div>
      </article>
    </section>

    <section
      class="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]"
    >
      <article class="border border-cocoa/12 bg-ivory">
        <div
          class="flex items-center justify-between border-b border-cocoa/12 px-6 py-5"
        >
          <h3 class="font-display text-2xl text-cocoa">Activité récente.</h3>
          <button
            type="button"
            class="font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/60 underline-offset-4 hover:underline"
            @click="goTo('admin-commandes')"
          >
            Toutes les commandes
          </button>
        </div>

        <div class="divide-y divide-cocoa/8 px-6">
          <button
            v-for="order in recentOrders"
            :key="order.id"
            type="button"
            class="grid w-full grid-cols-[72px_minmax(0,1fr)_84px_120px_110px] items-center gap-4 py-4 text-left transition-colors duration-200 hover:bg-beige/50"
            @click="goTo('admin-commandes-detail', { id: String(order.id) })"
          >
            <span class="font-body text-[11px] text-cocoa/55 tabular-nums">{{
              formatDate(order.createdAt)
            }}</span>
            <span class="min-w-0">
              <span class="block truncate font-display text-lg text-cocoa">
                Commande #{{ order.id }}
              </span>
              <span class="font-body text-[11px] text-cocoa/55">
                {{ order.shippingAddress?.city ?? "—" }}
              </span>
            </span>
            <span class="font-body text-sm text-cocoa/65"
              >{{ order.items.length }} art.</span
            >
            <span class="text-right font-body text-sm tabular-nums text-gold">{{
              formatPrice(order.totalAmount)
            }}</span>
            <span
              class="justify-self-end border border-cocoa/12 px-3 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/70"
              >{{ statusLabel(order.status) }}</span
            >
          </button>

          <div
            v-if="recentOrders.length === 0"
            class="py-8 text-center font-body text-sm italic text-cocoa/45"
          >
            Aucune commande pour le moment.
          </div>
        </div>
      </article>

      <aside class="space-y-8">
        <article class="border border-cocoa/12 bg-ivory">
          <div class="border-b border-cocoa/12 px-6 py-5">
            <h3 class="font-display text-2xl text-cocoa">À faire.</h3>
          </div>
          <div class="divide-y divide-cocoa/8 px-6">
            <button
              type="button"
              class="block w-full py-4 text-left"
              @click="goTo('admin-commandes')"
            >
              <div class="font-display text-lg text-cocoa">
                Confirmer
                <span class="italic">{{ pendingCount }} nouvelle<span v-if="pendingCount > 1">s</span></span>
              </div>
              <div class="mt-1 font-body text-[11px] text-cocoa/55">
                commandes en attente
              </div>
            </button>

            <button
              type="button"
              class="block w-full py-4 text-left"
              @click="goTo('admin-stocks')"
            >
              <div class="font-display text-lg text-cocoa">
                Stock faible
                <span class="italic text-cocoa/55"
                  >— {{ lowStockProducts.length }} produits</span
                >
              </div>
              <div class="mt-1 line-clamp-2 font-body text-[11px] text-cocoa/55">
                {{ lowStockProducts.map((p) => p.name).join(" · ") }}
              </div>
            </button>
          </div>
        </article>
      </aside>
    </section>
  </div>
</template>
