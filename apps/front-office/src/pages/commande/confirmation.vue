<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const checkoutSnapshot = computed(() => {
  const raw = globalThis.sessionStorage.getItem("ci:last-checkout");
  return raw
    ? (JSON.parse(raw) as {
        orderNumber?: string;
        total?: number;
        shipping?: {
          firstName?: string;
          lastName?: string;
          email?: string;
          address?: string;
          postalCode?: string;
          city?: string;
          deliveryLabel?: string;
        };
        items?: Array<{ name: string; quantity: number }>;
      })
    : null;
});

const orderNumber = computed(() =>
  typeof route.query.order === "string"
    ? route.query.order
    : (checkoutSnapshot.value?.orderNumber ?? "CI-2026-0000"),
);
const total = computed(() =>
  Number(route.query.total ?? checkoutSnapshot.value?.total ?? 0),
);
const itemCount = computed(
  () =>
    checkoutSnapshot.value?.items?.reduce(
      (acc, item) => acc + item.quantity,
      0,
    ) ?? 0,
);

function formatPrice(value: number) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}
</script>

<template>
  <div class="pt-[120px] pb-[128px]">
    <section class="px-5 lg:px-[104px]">
      <span class="ci-eyebrow">Commande validée</span>
      <h1
        class="mt-4 font-serif text-brun-cacao"
        style="
          font-size: clamp(44px, 7vw, 96px);
          line-height: 0.95;
          font-weight: 500;
        "
      >
        Votre paiement a été reçu.
      </h1>
      <p
        class="mt-6 max-w-[640px] font-sans text-[16px] leading-[1.7] text-brun-cacao-2"
      >
        Merci. Votre commande {{ orderNumber }} est en préparation. Un reçu a
        été envoyé à {{ authStore.user?.email ?? "votre adresse" }}.
      </p>
    </section>

    <section
      class="mt-12 grid grid-cols-1 gap-12 px-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-[104px]"
    >
      <div>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
            <div
              class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Commande
            </div>
            <div
              class="mt-2 font-serif text-[22px] font-medium text-brun-cacao"
            >
              {{ orderNumber }}
            </div>
          </div>
          <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
            <div
              class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Articles
            </div>
            <div
              class="mt-2 font-serif text-[22px] font-medium text-brun-cacao"
            >
              {{ itemCount }}
            </div>
          </div>
          <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
            <div
              class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Total
            </div>
            <div
              class="mt-2 font-serif text-[22px] font-medium text-brun-cacao"
            >
              {{ formatPrice(total) }}
            </div>
          </div>
          <div class="border-t pt-4" style="border-color: var(--cacao-a12)">
            <div
              class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Statut
            </div>
            <div class="mt-2 font-serif text-[22px] font-medium text-dore">
              Préparation
            </div>
          </div>
        </div>

        <div class="mt-12 border-t pt-6" style="border-color: var(--cacao-a12)">
          <span class="ci-eyebrow">Votre colis</span>
          <h2 class="mt-4 font-serif text-[28px] font-medium text-brun-cacao">
            Le coffret part en atelier.
          </h2>
          <p
            class="mt-4 max-w-[620px] font-sans text-[15px] leading-[1.7] text-brun-cacao-2"
          >
            Vous pouvez suivre la commande dans votre espace client. Le colis
            est préparé à la main, puis remis au transporteur choisi.
          </p>
        </div>

        <div class="mt-10 flex flex-wrap gap-4">
          <button
            class="border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
            @click="router.push('/compte/commandes')"
          >
            Voir mes commandes
          </button>
          <button
            class="border border-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-brun-cacao transition-all duration-180 hover:bg-brun-cacao hover:text-ivoire active:translate-y-px"
            @click="router.push('/boutique')"
          >
            Retour à la boutique
          </button>
        </div>
      </div>

      <aside
        class="self-start bg-beige-doux p-6 lg:p-8"
        style="border: 1px solid var(--cacao-a12)"
      >
        <span class="ci-eyebrow">Récapitulatif</span>
        <div class="mt-5 space-y-4">
          <div class="border-b pb-4" style="border-color: var(--cacao-a12)">
            <div
              class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Livraison
            </div>
            <p
              class="mt-2 font-serif text-[18px] leading-[1.45] text-brun-cacao"
            >
              {{
                checkoutSnapshot?.shipping?.deliveryLabel ??
                "Expédition choisie"
              }}
            </p>
            <p
              class="mt-3 font-sans text-[13px] leading-[1.7] text-brun-cacao-2"
            >
              {{ checkoutSnapshot?.shipping?.address ?? "Adresse enregistrée"
              }}<br />
              {{ checkoutSnapshot?.shipping?.postalCode ?? "75002" }}
              {{ checkoutSnapshot?.shipping?.city ?? "Paris" }}
            </p>
          </div>

          <div class="border-b pb-4" style="border-color: var(--cacao-a12)">
            <div
              class="font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Client
            </div>
            <p
              class="mt-2 font-sans text-[14px] leading-[1.7] text-brun-cacao-2"
            >
              {{
                checkoutSnapshot?.shipping?.firstName ??
                authStore.user?.firstName ??
                "Constance"
              }}
              {{
                checkoutSnapshot?.shipping?.lastName ??
                authStore.user?.lastName ??
                "Roze"
              }}<br />
              {{
                checkoutSnapshot?.shipping?.email ??
                authStore.user?.email ??
                "—"
              }}
            </p>
          </div>

          <div
            class="flex justify-between pt-1 font-serif text-[22px] font-medium text-brun-cacao"
          >
            <span>Total</span>
            <span style="font-variant-numeric: tabular-nums">{{
              formatPrice(total)
            }}</span>
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>
