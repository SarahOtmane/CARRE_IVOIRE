<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");

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
      { label: "CGV", path: "/contact" },
      { label: "Mentions légales", path: "/contact" },
    ],
  },
];
</script>

<template>
  <footer class="bg-brun-cacao px-5 pb-12 pt-24 text-ivoire lg:px-[104px]">
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
          4 rue du Nil<br />
          75002 Paris
        </p>
      </div>

      <!-- Colonnes de liens -->
      <div v-for="col in cols" :key="col.title">
        <div class="ci-label mb-5 opacity-60">{{ col.title }}</div>
        <ul class="space-y-2.5">
          <li v-for="item in col.items" :key="item.label">
            <a
              class="cursor-pointer font-sans text-[13px] text-ivoire opacity-80 transition-opacity duration-180 hover:opacity-100"
              @click="router.push(item.path)"
              >{{ item.label }}</a
            >
          </li>
        </ul>
      </div>

      <!-- Newsletter -->
      <div>
        <div class="ci-label mb-5 opacity-60">Lettre</div>
        <p
          class="mb-3.5 font-sans text-[13px] leading-relaxed text-ivoire opacity-70"
        >
          Une fois par mois.<br />Rien de plus.
        </p>
        <div class="flex" style="border-bottom: 1px solid var(--ivoire-a40)">
          <input
            v-model="email"
            type="email"
            placeholder="vous@maison.fr"
            class="flex-1 bg-transparent py-2 font-sans text-[13px] text-ivoire placeholder-ivoire placeholder-opacity-40 outline-none"
          />
          <button
            class="flex shrink-0 cursor-pointer items-center py-2 text-ivoire opacity-70 transition-opacity duration-180 hover:opacity-100"
            aria-label="S'inscrire"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              stroke-width="1.25"
              stroke-linecap="square"
              stroke-linejoin="miter"
              viewBox="0 0 16 16"
            >
              <line x1="1" y1="8" x2="15" y2="8" />
              <polyline points="10,3 15,8 10,13" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div
      class="mt-16 flex items-center justify-between pt-6 font-sans text-[11px] uppercase tracking-[0.1em] text-ivoire opacity-50"
      style="border-top: 1px solid var(--ivoire-a15)"
    >
      <span>© 2026 Carré Ivoire</span>
      <span>Fait à Paris</span>
    </div>
  </footer>
</template>
