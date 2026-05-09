<script setup lang="ts">
import { computed, ref } from "vue";
import { useAdminStore } from "@/stores/admin.store";
import { formatCurrency, formatDate } from "@/data/admin";

const adminStore = useAdminStore();
const search = ref("");
const segmentFilter = ref("all");
const selectedCustomer = ref<string | null>(null);

const filteredCustomers = computed(() => {
  const query = search.value.trim().toLowerCase();

  return adminStore.state.customers.filter((customer) => {
    if (
      segmentFilter.value !== "all" &&
      customer.segment !== segmentFilter.value
    ) {
      return false;
    }

    if (
      query &&
      !`${customer.first} ${customer.last} ${customer.email} ${customer.city}`
        .toLowerCase()
        .includes(query)
    ) {
      return false;
    }

    return true;
  });
});

const currentCustomer = computed(
  () =>
    adminStore.state.customers.find(
      (customer) => customer.id === selectedCustomer.value,
    ) || null,
);

function toggleFavorite(customerId: string) {
  adminStore.setState({
    ...adminStore.state,
    customers: adminStore.state.customers.map((customer) =>
      customer.id === customerId
        ? { ...customer, favorite: !customer.favorite }
        : customer,
    ),
  });
}

function customerOrders(customerId: string) {
  return [...adminStore.state.orders]
    .filter((order) => order.customerId === customerId)
    .sort((left, right) => right.date.localeCompare(left.date));
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
            06 — Clients
          </div>
          <h2
            class="mt-4 font-display text-5xl leading-[0.92] text-cocoa sm:text-6xl"
          >
            Notre carnet <span class="italic text-cocoa/55">d’adresses.</span>
          </h2>
        </div>

        <div
          class="font-body text-[11px] uppercase tracking-[0.16em] text-cocoa/55"
        >
          {{ filteredCustomers.length }} client<span
            v-if="filteredCustomers.length > 1"
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
          placeholder="Nom, email, ville…"
          class="min-w-0 flex-1 bg-transparent font-body text-sm text-cocoa outline-none"
        />
      </label>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="segment in [
            'all',
            'Nouveau',
            'Fidèle',
            'VIP',
            'Professionnel',
          ]"
          :key="segment"
          type="button"
          class="border px-4 py-2 font-body text-[10px] uppercase tracking-[0.18em] transition-colors duration-200"
          :class="
            segmentFilter === segment
              ? 'border-cocoa bg-cocoa text-ivory'
              : 'border-cocoa/20 text-cocoa hover:bg-beige/50'
          "
          @click="segmentFilter = segment"
        >
          {{ segment === "all" ? "Tous" : segment }}
        </button>
      </div>
    </section>

    <section class="overflow-hidden border border-cocoa/12 bg-ivory">
      <div
        class="grid grid-cols-[40px_minmax(0,2fr)_minmax(0,2fr)_110px_84px_110px_126px_84px] border-b border-cocoa/12 px-6 py-4 font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
      >
        <span></span>
        <span>Nom</span>
        <span>Email</span>
        <span>Ville</span>
        <span class="text-right">Cmd.</span>
        <span class="text-right">Total</span>
        <span>Segment</span>
        <span class="text-right">Action</span>
      </div>

      <button
        v-for="customer in filteredCustomers"
        :key="customer.id"
        type="button"
        class="grid w-full grid-cols-[40px_minmax(0,2fr)_minmax(0,2fr)_110px_84px_110px_126px_84px] items-center gap-4 border-b border-cocoa/8 px-6 py-5 text-left transition-colors duration-200 hover:bg-beige/50 last:border-b-0"
        @click="selectedCustomer = customer.id"
      >
        <button
          type="button"
          class="text-lg leading-none text-gold"
          @click.stop="toggleFavorite(customer.id)"
        >
          {{ customer.favorite ? "★" : "☆" }}
        </button>
        <span>
          <span class="block font-display text-xl text-cocoa"
            >{{ customer.first }} {{ customer.last }}</span
          >
          <span class="font-body text-[11px] text-cocoa/55">{{
            customer.ref
          }}</span>
        </span>
        <span class="font-body text-sm text-cocoa">{{ customer.email }}</span>
        <span class="font-body text-sm italic text-cocoa/60">{{
          customer.city
        }}</span>
        <span class="text-right font-body text-sm tabular-nums text-cocoa">{{
          customer.orders
        }}</span>
        <span class="text-right font-body text-sm tabular-nums text-gold">{{
          formatCurrency(customer.total)
        }}</span>
        <span
          class="border border-cocoa/12 px-3 py-1 font-body text-[10px] uppercase tracking-[0.18em] text-cocoa/70"
          >{{ customer.segment }}</span
        >
        <span
          class="text-right font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/55"
          >Voir</span
        >
      </button>
    </section>

    <div
      v-if="currentCustomer"
      class="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/35 p-4"
    >
      <article
        class="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-cocoa/12 bg-ivory p-8"
      >
        <div
          class="flex items-start justify-between gap-6 border-b border-cocoa/12 pb-6"
        >
          <div>
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              {{ currentCustomer.ref }}
            </div>
            <h3 class="mt-3 font-display text-4xl text-cocoa">
              {{ currentCustomer.first }} {{ currentCustomer.last }}
            </h3>
            <div class="mt-2 font-body text-sm italic text-cocoa/60">
              {{ currentCustomer.city }}
            </div>
          </div>
          <button
            type="button"
            class="font-body text-[11px] uppercase tracking-[0.18em] text-cocoa/55"
            @click="selectedCustomer = null"
          >
            Fermer
          </button>
        </div>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          <div class="border border-cocoa/12 p-5">
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              Email
            </div>
            <a
              :href="`mailto:${currentCustomer.email}`"
              class="mt-2 block font-display text-xl text-cocoa"
              >{{ currentCustomer.email }}</a
            >
          </div>
          <div class="border border-cocoa/12 p-5">
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              Client depuis
            </div>
            <div class="mt-2 font-display text-xl text-cocoa">
              {{ formatDate(currentCustomer.since) }}
            </div>
          </div>
          <div class="border border-cocoa/12 p-5">
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              Segment
            </div>
            <div class="mt-2 font-display text-xl text-cocoa">
              {{ currentCustomer.segment }}
            </div>
          </div>
          <div class="border border-cocoa/12 p-5">
            <div
              class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
            >
              Dépensé
            </div>
            <div class="mt-2 font-display text-xl text-gold">
              {{ formatCurrency(currentCustomer.total) }}
            </div>
          </div>
        </div>

        <div class="mt-8">
          <div
            class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >
            Historique
          </div>
          <div
            class="mt-4 divide-y divide-cocoa/8 border border-cocoa/12 bg-beige/30 px-4"
          >
            <div
              v-for="order in customerOrders(currentCustomer.id).slice(0, 6)"
              :key="order.id"
              class="flex items-center justify-between py-4"
            >
              <div>
                <div class="font-display text-lg text-cocoa">
                  {{ order.ref }}
                </div>
                <div class="font-body text-[11px] text-cocoa/55">
                  {{ formatDate(order.date) }} ·
                  {{ order.items.length }} article<span
                    v-if="order.items.length > 1"
                    >s</span
                  >
                </div>
              </div>
              <div class="font-body text-sm tabular-nums text-gold">
                {{ formatCurrency(order.total) }}
              </div>
            </div>
            <div
              v-if="customerOrders(currentCustomer.id).length === 0"
              class="py-4 font-body text-sm italic text-cocoa/55"
            >
              Pas encore de commande.
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
