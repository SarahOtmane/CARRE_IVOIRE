<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin.store";
import {
  adminOrderStatuses,
  formatCurrency,
  formatDate,
  type AdminOrder,
} from "@/data/admin";

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const selectedOrder = ref<AdminOrder | null>(null);

const orderId = computed(() => String(route.params.id || ""));

watch(
  orderId,
  (value) => {
    selectedOrder.value =
      adminStore.state.orders.find((order) => order.id === value) || null;
  },
  { immediate: true },
);

function updateStatus(status: AdminOrder["status"]) {
  if (!selectedOrder.value) {
    return;
  }

  adminStore.setState({
    ...adminStore.state,
    orders: adminStore.state.orders.map((order) =>
      order.id === selectedOrder.value?.id ? { ...order, status } : order,
    ),
  });
  selectedOrder.value = { ...selectedOrder.value, status };
}

function backToOrders() {
  router.push({ name: "admin-commandes" });
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="border-b border-cocoa/12 pb-8">
      <div>
        <div
          class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45"
        >
          03 — Commandes
        </div>
        <h2
          class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl"
        >
          Détail de commande <span class="italic text-cocoa/55">et suivi.</span>
        </h2>
      </div>
    </section>

    <div
      v-if="selectedOrder"
      class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]"
    >
      <article class="border border-cocoa/12 bg-ivory p-8">
        <div
          class="flex flex-wrap items-start justify-between gap-4 border-b border-cocoa/12 pb-6"
        >
          <div>
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              {{ selectedOrder.ref }}
            </div>
            <h3 class="mt-3 font-display text-4xl text-cocoa">
              {{ selectedOrder.customer }}
            </h3>
            <div class="mt-2 font-body text-sm italic text-cocoa/60">
              {{ selectedOrder.city }}
            </div>
          </div>

          <div class="text-right">
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              Total
            </div>
            <div class="mt-3 font-display text-4xl text-gold">
              {{ formatCurrency(selectedOrder.total) }}
            </div>
          </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <div class="border border-cocoa/12 p-4">
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              Date
            </div>
            <div class="mt-2 font-display text-2xl text-cocoa">
              {{ formatDate(selectedOrder.date) }}
            </div>
          </div>
          <div class="border border-cocoa/12 p-4">
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              Paiement
            </div>
            <div class="mt-2 font-display text-2xl text-cocoa">
              {{ selectedOrder.payment }}
            </div>
          </div>
          <div class="border border-cocoa/12 p-4">
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              Statut
            </div>
            <div class="mt-2 font-display text-2xl text-cocoa">
              {{ selectedOrder.status }}
            </div>
          </div>
        </div>

        <div class="mt-8 border-t border-cocoa/12 pt-6">
          <div
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >
            Articles
          </div>
          <div
            class="mt-4 divide-y divide-cocoa/8 border border-cocoa/12 bg-beige/30 px-4"
          >
            <div
              v-for="item in selectedOrder.items"
              :key="`${item.pid}-${item.name}`"
              class="flex items-center justify-between py-4"
            >
              <div>
                <div class="font-display text-lg text-cocoa">
                  {{ item.name }}
                </div>
                <div class="font-body text-[11px] text-cocoa/55">
                  × {{ item.qty }}
                </div>
              </div>
              <div class="font-body text-sm tabular-nums text-gold">
                {{ formatCurrency(item.qty * item.price) }}
              </div>
            </div>
          </div>

          <div class="mt-6 space-y-2 font-body text-sm text-cocoa">
            <div class="flex justify-between">
              <span class="text-cocoa/55">Sous-total</span
              ><span>{{ formatCurrency(selectedOrder.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-cocoa/55">Livraison</span
              ><span>{{
                selectedOrder.shipping === 0
                  ? "Offerte"
                  : formatCurrency(selectedOrder.shipping)
              }}</span>
            </div>
            <div
              class="flex justify-between border-t border-cocoa/12 pt-3 font-display text-2xl"
            >
              <span>Total</span
              ><span class="text-gold">{{
                formatCurrency(selectedOrder.total)
              }}</span>
            </div>
          </div>

          <div
            v-if="selectedOrder.notes"
            class="mt-8 border border-cocoa/12 bg-beige/50 p-5"
          >
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              Note client
            </div>
            <p class="mt-3 font-display text-xl italic text-cocoa">
              {{ selectedOrder.notes }}
            </p>
          </div>
        </div>
      </article>

      <aside class="space-y-6">
        <article class="border border-cocoa/12 bg-ivory p-6">
          <div
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >
            Statut
          </div>
          <select
            :value="selectedOrder.status"
            class="mt-4 w-full border-b border-cocoa/20 bg-transparent py-3 font-body text-base text-cocoa outline-none"
            @change="
              updateStatus(($event.target as HTMLSelectElement).value as any)
            "
          >
            <option
              v-for="status in adminOrderStatuses"
              :key="status"
              :value="status"
            >
              {{ status }}
            </option>
          </select>
        </article>

        <article class="border border-cocoa/12 bg-ivory p-6">
          <div
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >
            Suivi
          </div>
          <div class="mt-5 space-y-4">
            <div class="border-l-2 border-cocoa/20 pl-4">
              <div class="font-display text-lg text-cocoa">Commande reçue</div>
              <div class="font-body text-[11px] text-cocoa/55">
                {{ formatDate(selectedOrder.date) }}
              </div>
            </div>
            <div class="border-l-2 border-cocoa/20 pl-4">
              <div class="font-display text-lg text-cocoa">
                Préparation atelier
              </div>
              <div class="font-body text-[11px] text-cocoa/55">
                En file de production
              </div>
            </div>
            <div class="border-l-2 border-cocoa/20 pl-4">
              <div class="font-display text-lg text-cocoa">Expédition</div>
              <div class="font-body text-[11px] text-cocoa/55">
                Transporteur à confirmer
              </div>
            </div>
          </div>
        </article>

        <button
          type="button"
          class="w-full border border-cocoa bg-cocoa px-5 py-3 font-body text-[11px] uppercase tracking-[0.18em] text-ivory"
          @click="backToOrders"
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
        @click="backToOrders"
      >
        Retour aux commandes
      </button>
    </div>
  </div>
</template>
