<script setup lang="ts">
import { computed } from "vue";
import { useCartStore } from "@carre-ivoire/stores";
import Button from "@carre-ivoire/ui/Button.vue";
import type { CartItem } from "@carre-ivoire/types";

interface Props {
  open: boolean;
}

interface Emits {
  close: [];
  checkout: [];
}

defineProps<Props>();
const emit = defineEmits<Emits>();
const cartStore = useCartStore();

const total = computed(() =>
  cartStore.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
);

const itemCount = computed(() => cartStore.items.length);

function handleRemove(item: CartItem) {
  cartStore.removeItem(item.productId, item.format);
}

function handleCheckout() {
  emit("close");
  emit("checkout");
}
</script>

<template>
  <!-- Scrim overlay -->
  <div
    v-if="open"
    class="fixed inset-0 z-80 bg-black/8 transition-opacity duration-400"
    @click="emit('close')"
  />

  <!-- Drawer panel -->
  <aside
    :class="[
      'fixed top-0 right-0 bottom-0 z-90 w-full sm:w-[480px] bg-ivoire',
      'flex flex-col transition-transform duration-400',
      open ? 'translate-x-0' : 'translate-x-full',
    ]"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between border-b border-cacao/12 px-8 py-7"
    >
      <div>
        <p class="text-label text-cacao/60">Votre coffret</p>
        <p class="mt-1 font-display text-2xl font-medium text-cacao">
          {{ itemCount }} article<span v-if="itemCount !== 1">s</span>
        </p>
      </div>
      <button
        @click="emit('close')"
        class="bg-transparent p-0 text-cacao transition-opacity hover:opacity-60"
        aria-label="Fermer le panier"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="square"
            stroke-linejoin="miter"
            stroke-width="1.25"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Items list -->
    <div class="flex-1 overflow-auto px-8 py-8">
      <div v-if="itemCount === 0" class="pt-20 text-center">
        <p class="mb-6 font-display text-2xl italic text-cacao/40">
          Votre coffret est vide.
        </p>
        <button
          @click="emit('close')"
          class="border-b border-cacao pb-0.5 font-body text-xs text-cacao transition-opacity hover:opacity-60"
        >
          Retour à la boutique →
        </button>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="item in cartStore.items"
          :key="`${item.productId}-${item.format}`"
          class="flex gap-5 border-b border-cacao/8 pb-6"
        >
          <!-- Product image -->
          <div class="h-22 w-22 flex-shrink-0 bg-papier">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.productName"
              class="h-full w-full object-cover"
            />
          </div>

          <!-- Product details -->
          <div class="flex-1">
            <h3 class="font-display text-lg font-medium text-cacao">
              {{ item.productName }}
            </h3>
            <p class="mt-1 text-label text-cacao/60">
              Format {{ item.format }} · qté {{ item.quantity }}
            </p>

            <!-- Price & Remove -->
            <div class="mt-3 flex items-center justify-between">
              <p class="font-body text-sm font-medium text-dore">
                {{
                  (item.price * item.quantity).toFixed(2).replace(".", ",")
                }}
                €
              </p>
              <button
                @click="handleRemove(item)"
                class="border-b border-cacao/40 text-label text-cacao/60 transition-opacity hover:opacity-80"
              >
                retirer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer with total -->
    <div v-if="itemCount > 0" class="border-t border-cacao/12 px-8 py-8">
      <div class="mb-1 flex justify-between font-body text-xs text-cacao/60">
        <span>Sous-total</span>
        <span class="font-mono"
          >{{ total.toFixed(2).replace(".", ",") }} €</span
        >
      </div>
      <div class="mb-5 flex justify-between font-body text-xs text-cacao/60">
        <span>Livraison</span>
        <span>Calculée à l'étape suivante</span>
      </div>
      <Button @click="handleCheckout" block>
        Passer commande — {{ total.toFixed(2).replace(".", ",") }} €
      </Button>
    </div>
  </aside>
</template>
