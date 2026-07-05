<script setup lang="ts">
import { computed, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@carre-ivoire/stores";
import {
  useAdminProducts,
  useAdminOrders,
  useAdminCategories,
  usePublicSettings,
} from "@carre-ivoire/composables";
import { OrderStatus } from "@carre-ivoire/types";
import { Logo } from "@carre-ivoire/ui";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const { products, fetchAll: fetchProducts } = useAdminProducts();
const { orders, fetchAll: fetchOrders } = useAdminOrders();
const { categories } = useAdminCategories();
const { settings: publicSettings } = usePublicSettings();

onMounted(() => Promise.all([fetchProducts(), fetchOrders()]));

const pendingOrdersCount = computed(
  () =>
    orders.value.filter(
      (o) =>
        o.status === OrderStatus.PENDING ||
        o.status === OrderStatus.PAYMENT_PENDING,
    ).length,
);

const navItems = computed(() => [
  {
    name: "admin-dashboard",
    label: "Tableau de bord",
    badge: undefined,
    code: "00",
  },
  {
    name: "admin-categories",
    label: "Catégories",
    badge: categories.value.length || undefined,
    code: "01",
  },
  {
    name: "admin-produits",
    label: "Produits",
    badge: products.value.length || undefined,
    code: "02",
  },
  {
    name: "admin-commandes",
    label: "Commandes",
    badge: orders.value.length || undefined,
    code: "03",
  },
  { name: "admin-stocks", label: "Stocks", badge: undefined, code: "04" },
  { name: "admin-pages", label: "Pages", badge: undefined, code: "05" },
  { name: "admin-clients", label: "Clients", badge: undefined, code: "06" },
  {
    name: "admin-parametres",
    label: "Paramètres",
    badge: undefined,
    code: "07",
  },
]);

function isActive(name: string) {
  return route.name === name;
}

function logout() {
  authStore.logout();
  router.push({ name: "connexion" });
}
</script>

<template>
  <aside class="flex h-full w-72 flex-col border-r border-cacao/40 bg-ivoire">
    <div class="border-b border-cacao/40 px-6 py-6">
      <div class="flex items-center gap-4">
        <Logo :logo-url="publicSettings?.logoUrl" size="lg" />
        <div class="min-w-0">
          <div
            class="font-body text-[10px] uppercase tracking-[0.28em] text-cacao/45"
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
            ? 'border-cacao bg-beige-doux text-cacao'
            : 'border-transparent text-cacao/80 hover:border-cacao/25 hover:bg-beige-doux/60'
        "
      >
        <span
          class="w-8 font-body text-[10px] uppercase tracking-[0.22em] text-cacao/45"
          >{{ item.code }}</span
        >
        <span class="flex-1 font-display text-[18px] leading-none">{{
          item.label
        }}</span>
        <span
          v-if="item.badge !== undefined"
          class="min-w-6 text-right font-body text-[11px] tabular-nums text-cacao/55"
        >
          {{ item.badge }}
        </span>
      </RouterLink>
    </nav>

    <div class="border-t border-cacao/40 px-6 py-5">
      <div
        class="font-body text-[10px] uppercase tracking-[0.22em] text-cacao/45"
      >
        Connecté
      </div>
      <div class="mt-2 font-display text-lg text-cacao">
        {{ authStore.fullName || "Équipe admin" }}
      </div>
      <div class="mt-1 font-body text-sm italic text-cacao/55">
        {{ pendingOrdersCount }} commandes à traiter
      </div>
      <button
        type="button"
        class="mt-4 border border-cacao px-3 py-2 font-body text-[11px] uppercase tracking-[0.16em] text-cacao transition-colors duration-200 hover:bg-cacao hover:text-ivoire"
        @click="logout"
      >
        Quitter
      </button>
    </div>
  </aside>
</template>
