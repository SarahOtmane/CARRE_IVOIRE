<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import CartItem from "@/components/cart/CartItem.vue";

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const shippingFee = computed(() => (cartStore.total >= 70 ? 0 : 8));
const grandTotal = computed(() => cartStore.total + shippingFee.value);

function goToCheckout() {
  router.push("/commande");
}
</script>

<template>
  <div class="pt-[120px]">
    <section class="px-5 pb-12 lg:px-[104px]">
      <span class="ci-eyebrow">Votre panier</span>
      <h1
        class="mt-4 font-serif text-brun-cacao"
        style="
          font-size: clamp(44px, 7vw, 96px);
          line-height: 0.95;
          font-weight: 500;
        "
      >
        Le coffret,
        <em class="text-brun-cacao-2">avant le paiement.</em>
      </h1>
      <p
        class="mt-6 max-w-[620px] font-sans text-[16px] leading-[1.7] text-brun-cacao-2"
      >
        Vérifiez vos pièces, ajustez les quantités, puis passez au tunnel de
        commande. Le parcours est bref. Direct.
      </p>
    </section>

    <section
      class="grid grid-cols-1 gap-16 px-5 pb-[128px] lg:grid-cols-[minmax(0,1fr)_380px] lg:px-[104px]"
    >
      <div>
        <div
          v-if="cartStore.items.length === 0"
          class="border-t pt-8"
          style="border-color: var(--cacao-a12)"
        >
          <p class="font-serif text-[22px] italic text-brun-cacao-2">
            Votre coffret est vide.
          </p>
          <p
            class="mt-3 max-w-[420px] font-sans text-[14px] leading-[1.7] text-brun-cacao-2"
          >
            Revenez à la boutique pour composer votre sélection.
          </p>
          <button
            class="mt-6 border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
            @click="router.push('/boutique')"
          >
            Découvrir la boutique
          </button>
        </div>

        <div
          v-else
          class="border-t pt-8"
          style="border-color: var(--cacao-a12)"
        >
          <div class="mb-4 flex items-end justify-between">
            <div
              class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              {{ cartStore.count }} article<span v-if="cartStore.count > 1"
                >s</span
              >
            </div>
            <button
              class="border-b border-brun-cacao pb-px font-sans text-[12px] text-brun-cacao"
              type="button"
              @click="router.push('/boutique')"
            >
              Continuer mes achats →
            </button>
          </div>

          <div class="border-t" style="border-color: var(--cacao-a12)">
            <CartItem
              v-for="item in cartStore.items"
              :key="`${item.productId}-${item.format ?? 'default'}`"
              :item="item"
              @increment="
                cartStore.updateQuantity(
                  item.productId,
                  item.quantity + 1,
                  item.format,
                )
              "
              @decrement="
                item.quantity > 1
                  ? cartStore.updateQuantity(
                      item.productId,
                      item.quantity - 1,
                      item.format,
                    )
                  : cartStore.removeItem(item.productId, item.format)
              "
              @remove="cartStore.removeItem(item.productId, item.format)"
            />
          </div>
        </div>
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
        </div>

        <div
          class="flex justify-between py-5 font-serif text-[22px] font-medium text-brun-cacao"
        >
          <span>Total</span>
          <span style="font-variant-numeric: tabular-nums"
            >{{ grandTotal.toFixed(2).replace(".", ",") }} €</span
          >
        </div>

        <p class="font-sans text-[13px] leading-[1.7] text-brun-cacao-2">
          Livraison offerte dès 70 €. Si vous êtes connecté, vous passerez
          directement au tunnel de commande.
        </p>

        <button
          class="mt-8 w-full border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="cartStore.items.length === 0"
          @click="goToCheckout"
        >
          {{
            authStore.isAuthenticated
              ? "Passer au paiement"
              : "Se connecter pour payer"
          }}
        </button>

        <button
          v-if="cartStore.items.length > 0"
          class="mt-4 w-full border-b border-brun-cacao pb-px font-sans text-[13px] text-brun-cacao"
          type="button"
          @click="router.push('/contact')"
        >
          Besoin d'aide ?
        </button>
      </aside>
    </section>
  </div>
</template>
