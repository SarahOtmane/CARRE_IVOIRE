<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart.store";
import CheckoutForm from "@/components/checkout/CheckoutForm.vue";
import StripePaymentForm from "@/components/checkout/StripePaymentForm.vue";

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

const router = useRouter();
const cartStore = useCartStore();

const step = ref<"livraison" | "paiement">("livraison");
const shipping = ref<ShippingPayload | null>(null);
const processing = ref(false);

const shippingFee = computed(() => shipping.value?.deliveryPrice ?? 0);
const grandTotal = computed(() => cartStore.total + shippingFee.value);

const orderNumber = computed(() => {
  const year = new Date().getFullYear();
  const sequence = Math.floor(1000 + Math.random() * 9000);
  return `CI-${year}-${sequence}`;
});

function handleShippingSubmit(payload: ShippingPayload) {
  shipping.value = payload;
  step.value = "paiement";
}

function handlePaymentSubmit() {
  if (!shipping.value || cartStore.items.length === 0) return;

  processing.value = true;

  globalThis.setTimeout(() => {
    globalThis.sessionStorage.setItem(
      "ci:last-checkout",
      JSON.stringify({
        orderNumber: orderNumber.value,
        total: grandTotal.value,
        shipping: shipping.value,
        items: cartStore.items,
      }),
    );
    cartStore.clearCart();
    processing.value = false;
    router.replace({
      name: "checkout-confirmation",
      query: {
        order: orderNumber.value,
        total: grandTotal.value.toFixed(2),
      },
    });
  }, 900);
}
</script>

<template>
  <div class="pt-[120px] pb-[128px]">
    <section class="px-5 lg:px-[104px]">
      <span class="ci-eyebrow">Tunnel de commande</span>
      <h1
        class="mt-4 font-serif text-brun-cacao"
        style="
          font-size: clamp(44px, 7vw, 96px);
          line-height: 0.95;
          font-weight: 500;
        "
      >
        Votre commande.
      </h1>
      <p
        class="mt-6 max-w-[640px] font-sans text-[16px] leading-[1.7] text-brun-cacao-2"
      >
        Livraison, paiement, confirmation. Le trajet reste court.
      </p>
    </section>

    <section
      class="mt-12 grid grid-cols-1 gap-16 px-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-[104px]"
    >
      <div>
        <div
          class="mb-10 flex flex-wrap gap-8 border-b pb-5"
          style="border-color: var(--cacao-a12)"
        >
          <div
            class="flex items-center gap-3"
            :class="step === 'livraison' ? 'opacity-100' : 'opacity-50'"
          >
            <div
              class="flex h-8 w-8 items-center justify-center border border-brun-cacao font-serif text-[14px]"
              :class="
                step === 'livraison'
                  ? 'bg-brun-cacao text-ivoire'
                  : 'bg-transparent text-brun-cacao'
              "
            >
              1
            </div>
            <span
              class="font-sans text-[11px] uppercase tracking-[0.22em] text-brun-cacao"
              >Livraison</span
            >
          </div>
          <div
            class="flex items-center gap-3"
            :class="step === 'paiement' ? 'opacity-100' : 'opacity-50'"
          >
            <div
              class="flex h-8 w-8 items-center justify-center border border-brun-cacao font-serif text-[14px]"
              :class="
                step === 'paiement'
                  ? 'bg-brun-cacao text-ivoire'
                  : 'bg-transparent text-brun-cacao'
              "
            >
              2
            </div>
            <span
              class="font-sans text-[11px] uppercase tracking-[0.22em] text-brun-cacao"
              >Paiement</span
            >
          </div>
        </div>

        <div
          v-if="cartStore.items.length === 0"
          class="border-t pt-8"
          style="border-color: var(--cacao-a12)"
        >
          <p class="font-serif text-[22px] italic text-brun-cacao-2">
            Votre coffret est vide.
          </p>
          <button
            class="mt-6 border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire"
            @click="router.push('/boutique')"
          >
            Retour à la boutique
          </button>
        </div>

        <CheckoutForm
          v-else-if="step === 'livraison'"
          @submit="handleShippingSubmit"
        />

        <StripePaymentForm
          v-else
          :total="grandTotal"
          :processing="processing"
          @pay="handlePaymentSubmit"
        />
      </div>

      <aside
        class="self-start bg-rose-poudre p-6 lg:p-8"
        style="border: 1px solid var(--cacao-a12)"
      >
        <span class="ci-eyebrow">Récapitulatif</span>

        <div
          class="mt-5 space-y-3 border-b pb-5"
          style="border-color: var(--cacao-a12)"
        >
          <div
            v-for="item in cartStore.items"
            :key="`${item.productId}-${item.format ?? 'default'}`"
            class="flex justify-between gap-4 font-sans text-[13px]"
          >
            <span class="text-brun-cacao-2">
              {{ item.name }}
              <span class="text-brun-cacao-3">× {{ item.quantity }}</span>
            </span>
            <span
              class="text-brun-cacao"
              style="font-variant-numeric: tabular-nums"
            >
              {{ (item.price * item.quantity).toFixed(2).replace(".", ",") }} €
            </span>
          </div>
        </div>

        <div class="space-y-3 pt-5">
          <div class="flex justify-between font-sans text-[13px]">
            <span class="text-brun-cacao-2">Sous-total</span>
            <span
              class="text-brun-cacao"
              style="font-variant-numeric: tabular-nums"
              >{{ cartStore.total.toFixed(2).replace(".", ",") }} €</span
            >
          </div>
          <div class="flex justify-between font-sans text-[13px]">
            <span class="text-brun-cacao-2">Livraison</span>
            <span
              class="text-brun-cacao"
              style="font-variant-numeric: tabular-nums"
            >
              {{
                shippingFee === 0
                  ? "Offerte"
                  : `${shippingFee.toFixed(2).replace(".", ",")} €`
              }}
            </span>
          </div>
          <div
            class="flex justify-between border-t pt-3 font-serif text-[22px] font-medium text-brun-cacao"
            style="border-color: var(--cacao-a12)"
          >
            <span>Total</span>
            <span style="font-variant-numeric: tabular-nums"
              >{{ grandTotal.toFixed(2).replace(".", ",") }} €</span
            >
          </div>
        </div>

        <div class="mt-6 border-t pt-5" style="border-color: var(--cacao-a12)">
          <div
            class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Paiement sécurisé
          </div>
          <p class="mt-3 font-sans text-[13px] leading-[1.7] text-brun-cacao-2">
            Le tunnel se termine sur une confirmation de commande et un
            récapitulatif complet.
          </p>
        </div>
      </aside>
    </section>
  </div>
</template>
