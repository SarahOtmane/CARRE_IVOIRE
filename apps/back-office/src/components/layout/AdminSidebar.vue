<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useAdminProducts, useAdminOrders, useAdminCategories } from "@carre-ivoire/composables";
import { OrderStatus } from "@carre-ivoire/types";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const { products, fetchAll: fetchProducts } = useAdminProducts();
const { orders, fetchAll: fetchOrders } = useAdminOrders();
const { categories } = useAdminCategories();

onMounted(() => Promise.all([fetchProducts(), fetchOrders()]));

const lowStockCount = computed(() => products.value.filter((p) => p.stock < 10).length);
const pendingOrdersCount = computed(() =>
  orders.value.filter(
    (o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.PAYMENT_PENDING,
  ).length,
);

const navItems = computed(() => [
  { name: "dashboard", label: "Tableau de bord", badge: undefined, code: "00" },
  { name: "admin-categories", label: "Catégories", badge: categories.value.length || undefined, code: "01" },
  { name: "admin-produits", label: "Produits", badge: products.value.length || undefined, code: "02" },
  { name: "admin-commandes", label: "Commandes", badge: orders.value.length || undefined, code: "03" },
  { name: "admin-stocks", label: "Stocks", badge: lowStockCount.value || undefined, code: "04" },
  { name: "admin-pages", label: "Pages", badge: undefined, code: "05" },
  { name: "admin-clients", label: "Clients", badge: undefined, code: "06" },
  { name: "admin-parametres", label: "Paramètres", badge: undefined, code: "07" },
]);

function isActive(name: string) {
  return route.name === name;
}

function logout() {
  authStore.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <aside class="flex h-full w-72 flex-col border-r border-cocoa/12 bg-ivory">
    <div class="border-b border-cocoa/12 px-6 py-6">
      <div class="flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center border border-cocoa font-display text-xl text-cocoa"
        >
          CI
        </div>
        <div class="min-w-0">
          <div class="truncate font-display text-xl text-cocoa">
            Carré Ivoire
          </div>
          <div
            class="font-body text-[10px] uppercase tracking-[0.28em] text-cocoa/45"
          >
            Atelier admin
          </div>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-3 py-4">
      <RouterLink
        v-for="item in navItems"
        :key="item.name"
        :to="{ name: item.name }"
        class="group flex items-center gap-3 border-l-2 px-3 py-3 transition-colors duration-200"
        :class="
          isActive(item.name)
            ? 'border-cocoa bg-beige text-cocoa'
            : 'border-transparent text-cocoa/80 hover:border-cocoa/25 hover:bg-beige/60'
        "
      >
        <span
          class="w-8 font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
          >{{ item.code }}</span
        >
        <span class="flex-1 font-display text-[18px] leading-none">{{
          item.label
        }}</span>
        <span
          v-if="item.badge !== undefined"
          class="min-w-6 text-right font-body text-[11px] tabular-nums text-cocoa/55"
        >
          {{ item.badge }}
        </span>
      </RouterLink>
    </nav>

    <div class="border-t border-cocoa/12 px-6 py-5">
      <div
        class="font-body text-[10px] uppercase tracking-[0.22em] text-cocoa/45"
      >
        Connecté
      </div>
      <div class="mt-2 font-display text-lg text-cocoa">
        {{ authStore.fullName || "Équipe admin" }}
      </div>
      <div class="mt-1 font-body text-sm italic text-cocoa/55">
        {{ pendingOrdersCount }} commandes à traiter
      </div>
      <button
        type="button"
        class="mt-4 border border-cocoa px-3 py-2 font-body text-[11px] uppercase tracking-[0.16em] text-cocoa transition-colors duration-200 hover:bg-cocoa hover:text-ivory"
        @click="logout"
      >
        Quitter
      </button>
    </div>
  </aside>
</template>
