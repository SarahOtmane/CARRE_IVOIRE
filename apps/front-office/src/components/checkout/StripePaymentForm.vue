<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useCheckout } from "@carre-ivoire/composables";

const props = defineProps<{ total: number; paymentError?: string | null }>();
const emit = defineEmits<{ (e: "pay"): void }>();

const { processing, stripeError, mountCard } = useCheckout();

const displayError = computed(() => props.paymentError || stripeError.value);
const cardContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (cardContainer.value) await mountCard(cardContainer.value);
});
</script>

<template>
  <form class="space-y-10" @submit.prevent="emit('pay')">
    <div>
      <div
        class="mb-4 font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-3"
      >
        Paiement
      </div>
      <h3 class="font-serif text-[28px] font-medium text-cacao">
        Régler la commande.
      </h3>
      <p
        class="mt-4 max-w-[460px] font-sans text-[15px] leading-[1.7] text-cacao-2"
      >
        Paiement sécurisé par Stripe. Vos données de carte ne transitent jamais
        par nos serveurs.
      </p>
    </div>

    <div>
      <label
        class="mb-3 block font-sans text-[10px] uppercase tracking-[0.22em] text-cacao-2"
      >
        Carte bancaire
      </label>
      <div
        ref="cardContainer"
        class="border-b py-[14px]"
        style="border-color: var(--cacao-a24); min-height: 44px"
      />
      <div
        v-if="displayError"
        class="mt-4 flex items-center gap-3 border p-4"
        style="border-color: rgba(155,28,28,0.25); background: rgba(155,28,28,0.05)"
      >
        <span
          class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
          style="background: #9b1c1c"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 3V7" stroke="white" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"/>
            <circle cx="6" cy="9.5" r="0.75" fill="white"/>
          </svg>
        </span>
        <p class="font-sans text-[13px] leading-[1.5]" style="color: #9b1c1c">
          {{ displayError }}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <button
        type="submit"
        class="border border-cacao bg-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="processing"
      >
        {{
          processing
            ? "Paiement…"
            : `Payer ${total.toFixed(2).replace(".", ",")} €`
        }}
      </button>
      <span
        class="font-sans text-[11px] leading-[1.6] tracking-[0.04em] text-cacao-2"
      >
        Paiement sécurisé. Aucune donnée n'est conservée.
      </span>
    </div>
  </form>
</template>
