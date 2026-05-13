<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart.store";
import ProductCard from "@/components/product/ProductCard.vue";
import type { ProductResponse } from "@carre-ivoire/types";

type FormatOption = {
  id: string;
  label: string;
  detail: string;
  extraPrice: number;
};

type ProductSheet = {
  eyebrow: string;
  intro: string;
  storyTitle: string;
  story: string;
  composition: string[];
  tasting: string;
  conservation: string;
  formats: FormatOption[];
};

const props = defineProps<{
  product: ProductResponse;
  relatedProducts: ProductResponse[];
  sheet: ProductSheet;
}>();

const router = useRouter();
const cartStore = useCartStore();

const activeFormat = ref(props.sheet.formats[0]?.id ?? "standard");
const quantity = ref(1);
const tab = ref<"composition" | "degustation" | "conservation">("composition");
const added = ref(false);

const selectedFormat = computed(
  () =>
    props.sheet.formats.find((format) => format.id === activeFormat.value) ??
    props.sheet.formats[0],
);

const basePrice = computed(() => props.product.price / 100);
const unitPrice = computed(
  () => basePrice.value + (selectedFormat.value?.extraPrice ?? 0),
);
const total = computed(() => unitPrice.value * quantity.value);

function addToCart() {
  cartStore.addItem({
    productId: props.product.id,
    name: props.product.name,
    price: unitPrice.value,
    quantity: quantity.value,
    imageUrl: props.product.imageUrl ?? '',
    format: selectedFormat.value?.label,
  });
  added.value = true;
}

function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}
</script>

<template>
  <div>
    <nav
      class="px-5 pt-14 font-sans text-[11px] uppercase tracking-[0.18em] text-brun-cacao-2 lg:px-[104px] lg:pt-16"
    >
      <button
        class="transition-opacity duration-180 hover:opacity-60"
        type="button"
        @click="router.push('/')"
      >
        accueil
      </button>
      <span class="mx-3">·</span>
      <button
        class="transition-opacity duration-180 hover:opacity-60"
        type="button"
        @click="router.push('/boutique')"
      >
        boutique
      </button>
      <span class="mx-3">·</span>
      <span class="text-brun-cacao">{{ product.name }}</span>
    </nav>

    <section
      class="grid grid-cols-1 gap-14 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 lg:px-[104px] lg:py-14"
    >
      <div class="lg:sticky lg:top-[96px] lg:self-start">
        <div class="overflow-hidden bg-papier" style="aspect-ratio: 1 / 1">
          <img
            :src="product.imageUrl ?? '/assets/placeholder.svg'"
            :alt="product.name"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="mt-4 grid grid-cols-4 gap-3">
          <div
            v-for="index in 4"
            :key="index"
            class="overflow-hidden border border-[var(--cacao-a12)] bg-papier"
            style="aspect-ratio: 1 / 1"
          >
            <img
              :src="product.imageUrl ?? '/assets/placeholder.svg'"
              :alt="product.name"
              class="h-full w-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>

      <div>
        <div v-if="product.badge" class="mb-5">
          <span
            class="inline-block border px-3 py-1 font-sans text-[9px] uppercase tracking-[0.22em]"
            :class="
              product.badge === 'Nouveau'
                ? 'border-[var(--cacao-a24)] bg-papier text-brun-cacao'
                : product.badge === 'Signature'
                  ? 'border-dore text-dore'
                  : 'border-brun-cacao bg-brun-cacao text-ivoire'
            "
          >
            {{ product.badge }}
          </span>
        </div>

        <span class="ci-eyebrow">{{ sheet.eyebrow }}</span>
        <h1
          class="mt-4 font-serif text-brun-cacao"
          style="
            font-size: clamp(44px, 6vw, 80px);
            line-height: 0.95;
            font-weight: 500;
            letter-spacing: -0.02em;
          "
        >
          {{ product.name }}
        </h1>
        <p
          class="mt-5 max-w-[520px] font-sans text-[18px] leading-[1.7] text-brun-cacao-2"
        >
          {{ sheet.intro }}
        </p>

        <div class="mt-8 border-t pt-6" style="border-color: var(--cacao-a12)">
          <div class="mb-3 flex items-baseline justify-between gap-4">
            <span
              class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
              >Format</span
            >
            <span class="font-sans text-[12px] text-brun-cacao-2"
              >{{ selectedFormat?.label }} · {{ selectedFormat?.detail }}</span
            >
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              v-for="format in sheet.formats"
              :key="format.id"
              type="button"
              class="border px-4 py-4 text-left transition-all duration-180"
              :class="
                activeFormat === format.id
                  ? 'border-brun-cacao bg-brun-cacao text-ivoire'
                  : 'border-[var(--cacao-a12)] bg-transparent text-brun-cacao hover:border-brun-cacao'
              "
              @click="activeFormat = format.id"
            >
              <span class="block font-serif text-[18px] font-medium">{{
                format.label
              }}</span>
              <span
                class="mt-2 block font-sans text-[10px] uppercase tracking-[0.18em]"
                :class="
                  activeFormat === format.id
                    ? 'text-ivoire'
                    : 'text-brun-cacao-2'
                "
              >
                {{ format.detail }}
              </span>
              <span
                class="mt-2 block font-sans text-[11px]"
                :class="
                  activeFormat === format.id ? 'text-ivoire' : 'text-dore'
                "
              >
                {{
                  format.extraPrice > 0
                    ? `+ ${format.extraPrice.toFixed(2).replace(".", ",")} €`
                    : "Inclus"
                }}
              </span>
            </button>
          </div>
        </div>

        <div class="mt-8 flex items-center gap-5">
          <span
            class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >Quantité</span
          >
          <div class="flex items-center border border-brun-cacao">
            <button
              type="button"
              class="flex h-11 w-11 items-center justify-center text-brun-cacao"
              @click="quantity = Math.max(1, quantity - 1)"
            >
              −
            </button>
            <span
              class="min-w-10 px-2 text-center font-sans text-[13px] tabular-nums text-brun-cacao"
              >{{ quantity }}</span
            >
            <button
              type="button"
              class="flex h-11 w-11 items-center justify-center text-brun-cacao"
              @click="quantity += 1"
            >
              +
            </button>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            class="border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
            @click="addToCart"
          >
            Ajouter au panier — {{ formatPrice(total) }}
          </button>
          <button
            type="button"
            class="border border-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-brun-cacao transition-all duration-180 hover:bg-brun-cacao hover:text-ivoire active:translate-y-px"
            @click="router.push('/panier')"
          >
            Voir le panier
          </button>
          <span
            v-if="added"
            class="font-sans text-[12px] uppercase tracking-[0.14em] text-dore"
          >
            Produit ajouté
          </span>
        </div>

        <div class="mt-10 border-t pt-6" style="border-color: var(--cacao-a12)">
          <div
            class="flex flex-wrap gap-6 border-b pb-4"
            style="border-color: var(--cacao-a12)"
          >
            <button
              type="button"
              class="border-b pb-1 font-sans text-[11px] uppercase tracking-[0.22em]"
              :class="
                tab === 'composition'
                  ? 'border-brun-cacao text-brun-cacao'
                  : 'border-transparent text-brun-cacao-3'
              "
              @click="tab = 'composition'"
            >
              Composition
            </button>
            <button
              type="button"
              class="border-b pb-1 font-sans text-[11px] uppercase tracking-[0.22em]"
              :class="
                tab === 'degustation'
                  ? 'border-brun-cacao text-brun-cacao'
                  : 'border-transparent text-brun-cacao-3'
              "
              @click="tab = 'degustation'"
            >
              Dégustation
            </button>
            <button
              type="button"
              class="border-b pb-1 font-sans text-[11px] uppercase tracking-[0.22em]"
              :class="
                tab === 'conservation'
                  ? 'border-brun-cacao text-brun-cacao'
                  : 'border-transparent text-brun-cacao-3'
              "
              @click="tab = 'conservation'"
            >
              Conservation
            </button>
          </div>

          <div class="pt-5">
            <ul v-if="tab === 'composition'" class="space-y-0">
              <li
                v-for="(item, index) in sheet.composition"
                :key="item"
                class="flex items-baseline justify-between border-b py-3 font-sans text-[14px] text-brun-cacao"
                style="border-color: var(--cacao-a08)"
              >
                <span>{{ item }}</span>
                <span class="text-brun-cacao-3">0{{ index + 1 }}</span>
              </li>
            </ul>

            <p
              v-else-if="tab === 'degustation'"
              class="max-w-[540px] font-sans text-[15px] leading-[1.8] text-brun-cacao-2"
            >
              {{ sheet.tasting }}
            </p>

            <p
              v-else
              class="max-w-[540px] font-sans text-[15px] leading-[1.8] text-brun-cacao-2"
            >
              {{ sheet.conservation }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-rose-poudre px-5 py-16 lg:px-[104px] lg:py-24">
      <div class="mx-auto max-w-[760px] text-center">
        <span class="ci-eyebrow">L'histoire</span>
        <h2
          class="mt-5 font-serif text-brun-cacao"
          style="
            font-size: clamp(32px, 4vw, 56px);
            line-height: 1.05;
            font-style: italic;
            font-weight: 500;
          "
        >
          « {{ sheet.storyTitle }} »
        </h2>
        <p class="mt-6 font-sans text-[17px] leading-[1.8] text-brun-cacao-2">
          {{ sheet.story }}
        </p>
      </div>
    </section>

    <section class="px-5 py-16 lg:px-[104px] lg:py-24">
      <div class="mb-8">
        <span class="ci-eyebrow">Aussi dans la maison</span>
        <h2
          class="mt-4 font-serif text-brun-cacao"
          style="
            font-size: clamp(28px, 4vw, 48px);
            line-height: 1;
            font-weight: 500;
          "
        >
          D'autres carrés.
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          v-for="related in relatedProducts"
          :key="related.id"
          :product="related"
        />
      </div>
    </section>
  </div>
</template>
