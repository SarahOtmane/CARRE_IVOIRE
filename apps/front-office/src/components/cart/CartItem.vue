<script setup lang="ts">
type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  origin?: string;
  format?: string;
};

defineProps<{
  item: CartItem;
}>();

const emit = defineEmits<{
  (e: "increment"): void;
  (e: "decrement"): void;
  (e: "remove"): void;
}>();

function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}
</script>

<template>
  <article
    class="flex gap-5 border-b py-5"
    style="border-color: var(--cacao-a08)"
  >
    <div class="h-[88px] w-[88px] shrink-0 bg-papier">
      <img
        :src="item.image"
        :alt="item.name"
        class="h-full w-full object-cover"
      />
    </div>

    <div class="flex flex-1 flex-col justify-between gap-4">
      <div>
        <div class="font-serif text-[18px] font-medium text-brun-cacao">
          {{ item.name }}
        </div>
        <div
          class="mt-1 font-sans text-[11px] uppercase tracking-[0.18em] text-brun-cacao-2"
        >
          <span v-if="item.origin">{{ item.origin }} · </span>
          <span v-if="item.format">Format {{ item.format }}</span>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button
            class="flex h-8 w-8 items-center justify-center border border-brun-cacao font-sans text-[13px] text-brun-cacao"
            type="button"
            aria-label="Diminuer la quantité"
            @click="emit('decrement')"
          >
            −
          </button>
          <span
            class="min-w-8 text-center font-sans text-[13px] tabular-nums text-brun-cacao"
          >
            {{ item.quantity }}
          </span>
          <button
            class="flex h-8 w-8 items-center justify-center border border-brun-cacao font-sans text-[13px] text-brun-cacao"
            type="button"
            aria-label="Augmenter la quantité"
            @click="emit('increment')"
          >
            +
          </button>
        </div>

        <div class="flex items-center gap-5">
          <span
            class="font-sans text-[13px] text-dore"
            style="font-variant-numeric: tabular-nums"
          >
            {{ formatPrice(item.price * item.quantity) }}
          </span>
          <button
            class="border-b border-brun-cacao pb-px font-sans text-[11px] uppercase tracking-[0.12em] text-brun-cacao-2"
            type="button"
            @click="emit('remove')"
          >
            Retirer
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
