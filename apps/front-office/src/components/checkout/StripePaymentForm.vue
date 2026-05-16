<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  total: number;
  processing?: boolean;
}>();

const emit = defineEmits<{
  (
    e: "pay",
    payload: {
      cardName: string;
      cardNumber: string;
      expiry: string;
      cvc: string;
    },
  ): void;
}>();

const form = ref({
  cardName: "Constance Roze",
  cardNumber: "4242 4242 4242 4242",
  expiry: "12 / 28",
  cvc: "123",
});

function submit() {
  emit("pay", { ...form.value });
}
</script>

<template>
  <form class="space-y-10" @submit.prevent="submit">
    <div>
      <div
        class="mb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-3"
      >
        Paiement
      </div>
      <h3 class="font-serif text-[28px] font-medium text-brun-cacao">
        Régler la commande.
      </h3>
      <p
        class="mt-4 max-w-[460px] font-sans text-[15px] leading-[1.7] text-brun-cacao-2"
      >
        Paiement simulé pour cette maquette. Aucune carte n'est stockée.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <div>
        <label
          for="payment-name"
          class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Nom sur la carte
        </label>
        <input
          id="payment-name"
          v-model="form.cardName"
          type="text"
          autocomplete="cc-name"
          class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
          style="border-color: var(--cacao-a24)"
        />
      </div>
      <div>
        <label
          for="payment-number"
          class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
        >
          Numéro de carte
        </label>
        <input
          id="payment-number"
          v-model="form.cardNumber"
          type="text"
          inputmode="numeric"
          autocomplete="cc-number"
          class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
          style="border-color: var(--cacao-a24)"
        />
      </div>
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label
            for="payment-expiry"
            class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Expiration
          </label>
          <input
            id="payment-expiry"
            v-model="form.expiry"
            type="text"
            autocomplete="cc-exp"
            class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
            style="border-color: var(--cacao-a24)"
          />
        </div>
        <div>
          <label
            for="payment-cvc"
            class="mb-1.5 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            CVC
          </label>
          <input
            id="payment-cvc"
            v-model="form.cvc"
            type="text"
            inputmode="numeric"
            autocomplete="cc-csc"
            class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] text-brun-cacao outline-none"
            style="border-color: var(--cacao-a24)"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        class="border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="processing"
      >
        {{
          processing
            ? "Paiement…"
            : `Payer ${props.total.toFixed(2).replace(".", ",")} €`
        }}
      </button>
      <span
        class="font-sans text-[11px] leading-[1.6] tracking-[0.04em] text-brun-cacao-2"
      >
        Paiement sécurisé. Aucune donnée n'est conservée.
      </span>
    </div>
  </form>
</template>
