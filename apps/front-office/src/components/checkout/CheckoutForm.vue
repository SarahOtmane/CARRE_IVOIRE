<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";

type ShippingPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  deliveryId: string;
  deliveryLabel: string;
  deliveryPrice: number;
};

const emit = defineEmits<{
  (e: "submit", payload: ShippingPayload): void;
}>();

const authStore = useAuthStore();

const deliveryOptions = [
  {
    id: "courier",
    name: "Coursier Paris",
    detail: "24h — Paris intra-muros",
    price: 8,
  },
  {
    id: "chrono",
    name: "ChronoFresh",
    detail: "24–48h — France métropolitaine",
    price: 14,
  },
  {
    id: "pickup",
    name: "Retrait boutique",
    detail: "4 rue du Nil, Paris 2",
    price: 0,
  },
] as const;

const form = ref({
  firstName: authStore.user?.firstName ?? "",
  lastName: authStore.user?.lastName ?? "",
  email: authStore.user?.email ?? "",
  phone: "",
  address: "4 rue du Nil",
  postalCode: "75002",
  city: "Paris",
  country: "France",
  deliveryId: "courier",
});

const selectedDelivery = computed(
  () =>
    deliveryOptions.find((option) => option.id === form.value.deliveryId) ??
    deliveryOptions[0],
);

function submit() {
  emit("submit", {
    ...form.value,
    deliveryLabel: selectedDelivery.value.name,
    deliveryPrice: selectedDelivery.value.price,
  });
}
</script>

<template>
  <form class="space-y-10" @submit.prevent="submit">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label
          for="checkout-first-name"
          class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Prénom
        </label>
        <input
          id="checkout-first-name"
          v-model="form.firstName"
          type="text"
          autocomplete="given-name"
          class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
          style="border-color: var(--cacao-a24)"
        />
      </div>
      <div>
        <label
          for="checkout-last-name"
          class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Nom
        </label>
        <input
          id="checkout-last-name"
          v-model="form.lastName"
          type="text"
          autocomplete="family-name"
          class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
          style="border-color: var(--cacao-a24)"
        />
      </div>
      <div>
        <label
          for="checkout-email"
          class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Email
        </label>
        <input
          id="checkout-email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
          style="border-color: var(--cacao-a24)"
        />
      </div>
      <div>
        <label
          for="checkout-phone"
          class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Téléphone
        </label>
        <input
          id="checkout-phone"
          v-model="form.phone"
          type="tel"
          autocomplete="tel"
          class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
          style="border-color: var(--cacao-a24)"
        />
      </div>
      <div class="sm:col-span-2">
        <label
          for="checkout-address"
          class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Adresse
        </label>
        <input
          id="checkout-address"
          v-model="form.address"
          type="text"
          autocomplete="address-line1"
          class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
          style="border-color: var(--cacao-a24)"
        />
      </div>
      <div>
        <label
          for="checkout-postal-code"
          class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Code postal
        </label>
        <input
          id="checkout-postal-code"
          v-model="form.postalCode"
          type="text"
          autocomplete="postal-code"
          class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
          style="border-color: var(--cacao-a24)"
        />
      </div>
      <div>
        <label
          for="checkout-city"
          class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Ville
        </label>
        <input
          id="checkout-city"
          v-model="form.city"
          type="text"
          autocomplete="address-level2"
          class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
          style="border-color: var(--cacao-a24)"
        />
      </div>
    </div>

    <div>
      <div
        class="mb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-3"
      >
        Mode de livraison
      </div>
      <label
        v-for="option in deliveryOptions"
        :key="option.id"
        class="mb-3 flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors duration-180"
        :style="{
          borderColor:
            form.deliveryId === option.id
              ? 'var(--brun-cacao)'
              : 'var(--cacao-a12)',
          background:
            form.deliveryId === option.id
              ? 'var(--rose-poudre)'
              : 'transparent',
        }"
      >
        <input
          v-model="form.deliveryId"
          type="radio"
          :value="option.id"
          class="sr-only"
        />
        <span
          class="flex h-4 w-4 items-center justify-center border border-brun-cacao"
        >
          <span
            v-if="form.deliveryId === option.id"
            class="h-2 w-2 bg-brun-cacao"
          />
        </span>
        <span class="flex-1">
          <span
            class="block font-serif text-[18px] font-medium text-brun-cacao"
            >{{ option.name }}</span
          >
          <span class="mt-1 block font-sans text-[12px] text-brun-cacao-2">{{
            option.detail
          }}</span>
        </span>
        <span
          class="font-sans text-[13px] text-dore"
          style="font-variant-numeric: tabular-nums"
        >
          {{
            option.price === 0
              ? "Gratuit"
              : `${option.price.toFixed(2).replace(".", ",")} €`
          }}
        </span>
      </label>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        class="border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
      >
        Continuer vers le paiement
      </button>
      <p
        class="max-w-[360px] font-sans text-[11px] leading-[1.6] tracking-[0.04em] text-brun-cacao-2"
      >
        Vos informations servent uniquement à préparer la livraison et le reçu.
      </p>
    </div>
  </form>
</template>
