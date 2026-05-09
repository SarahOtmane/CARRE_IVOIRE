<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin.store";
import { formatCurrency, formatDate } from "@/data/admin";

const router = useRouter();
const adminStore = useAdminStore();

const today = new Date().toLocaleDateString("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const revenue = computed(() =>
  adminStore.state.orders
    .filter((order) => order.status !== "Annulée")
    .reduce((sum, order) => sum + order.total, 0),
);

const recentOrders = computed(() =>
  [...adminStore.state.orders]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6),
);
const lowStockProducts = computed(() =>
  adminStore.state.products.filter((product) => product.stock < 10).slice(0, 5),
);

const topProducts = computed(() => {
  const tally: Record<string, number> = {};

  adminStore.state.orders.forEach((order) => {
    order.items.forEach((item) => {
      tally[item.pid] = (tally[item.pid] || 0) + item.qty;
    });
  });

  return Object.entries(tally)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([productId, quantity]) => ({
      quantity,
      product: adminStore.state.products.find(
        (entry) => entry.id === productId,
      ),
    }))
    .filter(
      (
        entry,
      ): entry is {
        quantity: number;
        product: (typeof adminStore.state.products)[number];
      } => !!entry.product,
    );
});

const kpis = computed(() => [
  {
    label: "Chiffre d’affaires",
    value: formatCurrency(revenue.value),
    hint: `${adminStore.state.orders.length} commandes`,
  },
  {
    label: "Nouvelles commandes",
    value: adminStore.counts.newOrders,
    hint: "à traiter",
  },
  {
    label: "En préparation",
    value: adminStore.state.orders.filter(
      (order) => order.status === "En préparation",
    ).length,
    hint: "au laboratoire",
  },
  {
    label: "Clients actifs",
    value: adminStore.counts.customers,
    hint: `${adminStore.state.customers.filter((customer) => customer.segment === "VIP").length} VIP`,
  },
]);

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
            Bonjour Marie.
            <span class="italic text-cocoa/55"> aujourd’hui à l’atelier.</span>
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
            class="grid w-full grid-cols-[72px_minmax(0,1fr)_112px_120px_110px] items-center gap-4 py-4 text-left transition-colors duration-200 hover:bg-beige/50"
            @click="goTo('admin-commandes-detail', { id: order.id })"
          >
            <span class="font-body text-[11px] text-cocoa/55 tabular-nums">{{
              formatDate(order.date)
            }}</span>
            <span class="min-w-0">
              <span class="block truncate font-display text-lg text-cocoa">{{
                order.customer
              }}</span>
              <span class="font-body text-[11px] text-cocoa/55"
                >{{ order.ref }} · {{ order.city }}</span
              >
            </span>
            <span class="font-body text-sm text-cocoa/65"
              >{{ order.items.length }} article<span
                v-if="order.items.length > 1"
                >s</span
              ></span
            >
            <span class="text-right font-body text-sm tabular-nums text-gold">{{
              formatCurrency(order.total)
            }}</span>
            <span
              class="justify-self-end border border-cocoa/12 px-3 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/70"
              >{{ order.status }}</span
            >
          </button>
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
                <span class="italic"
                  >{{ adminStore.counts.newOrders }} nouvelle<span
                    v-if="adminStore.counts.newOrders > 1"
                    >s</span
                  ></span
                >
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
              <div
                class="mt-1 line-clamp-2 font-body text-[11px] text-cocoa/55"
              >
                {{
                  lowStockProducts.map((product) => product.name).join(" · ")
                }}
              </div>
            </button>

            <button
              type="button"
              class="block w-full py-4 text-left"
              @click="goTo('admin-categories')"
            >
              <div class="font-display text-lg text-cocoa">
                Réviser les <span class="italic">brouillons</span>
              </div>
              <div class="mt-1 font-body text-[11px] text-cocoa/55">
                {{
                  adminStore.state.categories.filter(
                    (category) => category.status === "draft",
                  ).length
                }}
                catégorie<span
                  v-if="
                    adminStore.state.categories.filter(
                      (category) => category.status === 'draft',
                    ).length > 1
                  "
                  >s</span
                >
                non publiée<span
                  v-if="
                    adminStore.state.categories.filter(
                      (category) => category.status === 'draft',
                    ).length > 1
                  "
                  >s</span
                >
              </div>
            </button>
          </div>
        </article>

        <article class="border border-cocoa/12 bg-ivory">
          <div class="border-b border-cocoa/12 px-6 py-5">
            <h3 class="font-display text-2xl text-cocoa">Plus vendus.</h3>
          </div>

          <div class="divide-y divide-cocoa/8 px-6">
            <div
              v-for="(entry, index) in topProducts"
              :key="entry.product.id"
              class="flex items-center justify-between py-4"
            >
              <div class="min-w-0">
                <div
                  class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
                >
                  {{ String(index + 1).padStart(2, "0") }}
                </div>
                <div class="truncate font-display text-lg text-cocoa">
                  {{ entry.product.name }}
                </div>
              </div>
              <div class="font-body text-sm tabular-nums text-gold">
                × {{ entry.quantity }}
              </div>
            </div>
          </div>
        </article>
      </aside>
    </section>
  </div>
</template>
