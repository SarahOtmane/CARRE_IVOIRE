<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin.store";
import { adminOrderStatuses, formatCurrency, formatDate } from "@/data/admin";

const router = useRouter();
const adminStore = useAdminStore();
const search = ref("");
const statusFilter = ref<"all" | (typeof adminOrderStatuses)[number]>("all");

const filteredOrders = computed(() => {
  const query = search.value.trim().toLowerCase();

  return [...adminStore.state.orders]
    .filter((order) => {
      if (statusFilter.value !== "all" && order.status !== statusFilter.value) {
        return false;
      }

      if (
        query &&
        !`${order.customer} ${order.ref} ${order.city}`
          .toLowerCase()
          .includes(query)
      ) {
        return false;
      }

      return true;
    })
    .sort((left, right) => right.date.localeCompare(left.date));
});

function openOrder(orderId: string) {
  router.push({ name: "admin-commandes-detail", params: { id: orderId } });
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div
            class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45"
          >
            03 — Commandes
          </div>
          <h2
            class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl"
          >
            Le carnet <span class="italic text-cocoa/55">de l’atelier.</span>
          </h2>
        </div>

        <div
          class="font-body text-[11px] uppercase tracking-[0.16em] text-cocoa/55"
        >
          {{ filteredOrders.length }} commande<span
            v-if="filteredOrders.length > 1"
            >s</span
          >
        </div>
      </div>
    </section>

    <section
      class="flex flex-wrap items-center gap-4 border border-cocoa/12 bg-ivory px-6 py-5"
    >
      <label
        class="flex min-w-[240px] flex-1 items-center gap-3 border-b border-cocoa/20 pb-3"
      >
        <span
          class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >Recherche</span
        >
        <input
          v-model="search"
          type="search"
          placeholder="Client, référence, ville…"
          class="min-w-0 flex-1 bg-transparent font-body text-sm text-cocoa outline-none"
        />
      </label>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="status in ['all', ...adminOrderStatuses]"
          :key="status"
          type="button"
          class="border px-4 py-2 font-body text-[10px] uppercase tracking-[0.18em] transition-colors duration-200"
          :class="
            statusFilter === status
              ? 'border-cocoa bg-cocoa text-ivory'
              : 'border-cocoa/20 text-cocoa hover:bg-beige/50'
          "
          @click="statusFilter = status as any"
        >
          {{ status === "all" ? "Toutes" : status }}
        </button>
      </div>
    </section>

    <section class="overflow-hidden border border-cocoa/12 bg-ivory">
      <div
        class="grid grid-cols-[92px_92px_minmax(0,2fr)_minmax(0,1fr)_84px_110px_132px_84px] border-b border-cocoa/12 px-6 py-4 font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
      >
        <span>Réf.</span>
        <span>Date</span>
        <span>Client</span>
        <span>Ville</span>
        <span class="text-right">Articles</span>
        <span class="text-right">Total</span>
        <span>Statut</span>
        <span class="text-right">Action</span>
      </div>

      <button
        v-for="order in filteredOrders"
        :key="order.id"
        type="button"
        class="grid w-full grid-cols-[92px_92px_minmax(0,2fr)_minmax(0,1fr)_84px_110px_132px_84px] items-center gap-4 border-b border-cocoa/8 px-6 py-5 text-left transition-colors duration-200 hover:bg-beige/50 last:border-b-0"
        @click="openOrder(order.id)"
      >
        <span class="font-body text-[11px] text-cocoa/55 tabular-nums">{{
          order.ref
        }}</span>
        <span class="font-body text-[12px] text-cocoa tabular-nums">{{
          formatDate(order.date)
        }}</span>
        <span class="min-w-0 font-display text-xl text-cocoa">{{
          order.customer
        }}</span>
        <span class="font-body text-sm italic text-cocoa/60">{{
          order.city
        }}</span>
        <span class="text-right font-body text-sm tabular-nums text-cocoa">{{
          order.items.length
        }}</span>
        <span class="text-right font-body text-sm tabular-nums text-gold">{{
          formatCurrency(order.total)
        }}</span>
        <span
          class="border border-cocoa/12 px-3 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/70"
          >{{ order.status }}</span
        >
        <span
          class="text-right font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/55"
          >Ouvrir</span
        >
      </button>
    </section>
  </div>
</template>
