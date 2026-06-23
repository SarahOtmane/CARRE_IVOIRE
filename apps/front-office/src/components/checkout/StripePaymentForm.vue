<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCheckout } from "@carre-ivoire/composables";

defineProps<{ total: number }>();
const emit = defineEmits<{ (e: "pay"): void }>();

const { processing, stripeError, mountCard } = useCheckout();
const cardContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  if (cardContainer.value) await mountCard(cardContainer.value);
});
</script>

<template>
  <form class="space-y-10" @submit.prevent="emit('pay')">
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
        Paiement sécurisé par Stripe. Vos données de carte ne transitent jamais
        par nos serveurs.
      </p>
    </div>

    <div>
      <label
        class="mb-3 block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
      >
        Carte bancaire
      </label>
      <div
        ref="cardContainer"
        class="border-b py-[14px]"
        style="border-color: var(--cacao-a24); min-height: 44px"
      />
      <p
        v-if="stripeError"
        class="mt-2 font-sans text-[12px]"
        style="color: #9b1c1c"
      >
        {{ stripeError }}
      </p>
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
            : `Payer ${total.toFixed(2).replace(".", ",")} €`
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
