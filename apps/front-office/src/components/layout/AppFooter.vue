<script setup lang="ts">
import { useRouter } from "vue-router";
import { NewsletterForm } from "@carre-ivoire/ui";

const router = useRouter();

const cols = [
  {
    title: "Boutique",
    items: [
      { label: "Carrés Signature", path: "/boutique/carres-signature" },
      { label: "Mini Carrés", path: "/boutique/mini-carres" },
      { label: "Tablettes", path: "/boutique/tablettes" },
      { label: "Gourmandises", path: "/boutique/gourmandises" },
      { label: "Sablés", path: "/boutique/sables" },
      { label: "Mendiants", path: "/boutique/mendiants" },
      { label: "Oursons", path: "/boutique/oursons" },
      { label: "Chocobombs", path: "/boutique/chocobombs" },
      { label: "Pâtes à tartiner", path: "/boutique/pates-a-tartiner" },
    ],
  },
  {
    title: "Maison",
    items: [
      { label: "Notre histoire", path: "/histoire" },
      { label: "Nos engagements", path: "/engagements" },
      { label: "Nos événements", path: "/evenements" },
    ],
  },
  {
    title: "Service",
    items: [
      { label: "Nous contacter", path: "/contact" },
      { label: "Livraison", path: "/contact" },
      { label: "CGV", path: "/cgv" },
      { label: "Mentions légales", path: "/mentions-legales" },
      { label: "Politique de confidentialité", path: "/politique-de-confidentialite" },
    ],
  },
];
</script>

<template>
  <footer class="bg-cacao px-5 pb-12 pt-24 text-ivoire lg:px-[104px]">
    <div
      class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))_minmax(0,1.5fr)]"
    >
      <!-- Identité -->
      <div>
        <div
          class="mb-6 font-serif text-[32px] italic leading-none text-ivoire"
        >
          Carré<br />Ivoire
        </div>
        <p class="font-sans text-[13px] leading-relaxed text-ivoire opacity-70">
          Manufacture de chocolat<br />
          29 rue de Vauparfonds<br />
          28600 LUISANT
        </p>
      </div>

      <!-- Colonnes de liens -->
      <div v-for="col in cols" :key="col.title">
        <div class="ci-label mb-5 opacity-60" style="color: var(--ivoire)">{{ col.title }}</div>
        <ul class="space-y-2.5">
          <li v-for="item in col.items" :key="item.label">
            <a
              class="cursor-pointer font-sans text-[13px] opacity-80 transition-opacity duration-180 hover:opacity-100"
              style="color: var(--ivoire)"
              @click="router.push(item.path)"
              >{{ item.label }}</a
            >
          </li>
        </ul>
      </div>

      <!-- Newsletter -->
      <NewsletterForm theme="dark" />
    </div>

    <!-- Copyright -->
    <div
      class="mt-16 flex items-center justify-between pt-6 font-sans text-[11px] uppercase tracking-[0.1em] text-ivoire opacity-50"
      style="border-top: 1px solid var(--ivoire-a15)"
    >
      <span>© 2026 Carré Ivoire</span>
      <span>Fait à LUISANT</span>
    </div>
  </footer>
</template>
