<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ProductDetail from "@/components/product/ProductDetail.vue";
import { ALL_PRODUCTS } from "@/data/products";

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

const route = useRoute();
const router = useRouter();

const product = computed(
  () => ALL_PRODUCTS.find((item) => item.id === route.params.slug) ?? null,
);

const SHEETS: Record<string, ProductSheet> = {
  "noir-pur-72": {
    eyebrow: "Tablette — 72 % cacao",
    intro:
      "Une tablette nette, ample, posée sur une amertume fine. La cassure est sèche. La finale tient longtemps.",
    storyTitle: "Le noir qui reste",
    story:
      "Nous cherchons le cacao sans détour. Porcelana pour la longueur, torréfaction lente pour la netteté, sucre discret pour laisser parler la fève.",
    composition: ["Fèves de cacao", "Sucre de canne blond", "72 % cacao"],
    tasting:
      "Attaque vive. Notes de fruits secs, de bois chaud et de cacao grillé. La texture se dépose ensuite, lisse, presque satinée.",
    conservation:
      "À conserver dans un endroit sec, entre 16 et 18 °C, à l’abri de la lumière et des odeurs. À consommer dans les six semaines après ouverture.",
    formats: [
      { id: "70g", label: "70 g", detail: "Format signature", extraPrice: 0 },
      { id: "100g", label: "100 g", detail: "Partage généreux", extraPrice: 4 },
      {
        id: "3x70g",
        label: "3 x 70 g",
        detail: "Coffret découverte",
        extraPrice: 22,
      },
    ],
  },
  "praline-noisette": {
    eyebrow: "Tablette — praliné",
    intro:
      "Le praliné se fond dans la tablette puis revient, plus net, plus dense. Les noisettes prennent la lumière.",
    storyTitle: "Le praliné, sans lourdeur",
    story:
      "Les noisettes du Piémont sont torréfiées à sec puis broyées longuement. La pâte gagne en grain, en relief, en longueur.",
    composition: [
      "Fèves de cacao",
      "Noisettes du Piémont",
      "Sucre de canne",
      "60 % cacao",
    ],
    tasting:
      "Notes de noisette toastée, de beurre noisette et de biscuit chaud. Le chocolat cadre la douceur, il ne la masque pas.",
    conservation:
      "À conserver au sec, au frais, hors soleil direct. Nous conseillons une dégustation dans le mois pour préserver le croquant du praliné.",
    formats: [
      { id: "70g", label: "70 g", detail: "Tablette", extraPrice: 0 },
      { id: "100g", label: "100 g", detail: "Format cadeau", extraPrice: 4 },
      { id: "duo", label: "Duo", detail: "Deux tablettes", extraPrice: 16 },
    ],
  },
  "lait-madagascar": {
    eyebrow: "Tablette — lait",
    intro:
      "Le lait apporte une rondeur nette. Madagascar conserve le relief. Le carré fond, puis laisse une acidité fruitée.",
    storyTitle: "Une douceur tendue",
    story:
      "Le Sambirano offre une matière souple, presque florale. Nous la travaillons pour garder la fraîcheur et la ligne.",
    composition: [
      "Fèves de cacao",
      "Lait entier",
      "Sucre de canne",
      "38 % cacao",
    ],
    tasting:
      "La bouche commence sur le caramel et le pain grillé. Le cacao revient ensuite, plus frais, avec une finale lactée et propre.",
    conservation:
      "À conserver entre 16 et 18 °C, au sec. Éviter le réfrigérateur pour préserver la texture et la brillance.",
    formats: [
      { id: "70g", label: "70 g", detail: "Classique", extraPrice: 0 },
      { id: "100g", label: "100 g", detail: "Grand format", extraPrice: 4 },
      {
        id: "mini-box",
        label: "Mini box",
        detail: "4 tablettes",
        extraPrice: 18,
      },
    ],
  },
  "coffret-decouverte": {
    eyebrow: "Coffret — découverte",
    intro:
      "Neuf carrés, trois origines, une lecture simple de la maison. Le coffret avance par contrastes, sans bruit.",
    storyTitle: "Le coffret qui ouvre la porte",
    story:
      "Nous avons pensé ce coffret comme une visite. Chaque carré introduit une origine, une texture, une manière de fondre.",
    composition: ["Neuf carrés assortis", "Trois origines", "Sélection maison"],
    tasting:
      "Un parcours en trois temps: net, rond, puis plus ample. À partager avec un café, ou seul, en fin de repas.",
    conservation:
      "Conserver à l’abri de la chaleur et de l’humidité. Le coffret se déguste idéalement dans les quinze jours après ouverture.",
    formats: [
      {
        id: "9-carres",
        label: "9 carrés",
        detail: "Découverte",
        extraPrice: 0,
      },
      {
        id: "16-carres",
        label: "16 carrés",
        detail: "Signature",
        extraPrice: 16,
      },
      {
        id: "24-carres",
        label: "24 carrés",
        detail: "Partage",
        extraPrice: 28,
      },
    ],
  },
  "coffret-signature-16": {
    eyebrow: "Coffret — signature",
    intro:
      "Le coffret le plus posé de la maison. Plus ample, plus dense, pensé pour laisser les origines parler à tour de rôle.",
    storyTitle: "La maison en volume",
    story:
      "Chaque carré raconte une couleur du cacao. Le coffret assemble les reliefs et garde une ligne très sobre.",
    composition: [
      "Seize carrés assortis",
      "Cinq origines",
      "Sélection signature",
    ],
    tasting:
      "La dégustation alterne entre fruit, torréfaction et longueur crémeuse. Le rythme est lent. Le relief reste précis.",
    conservation:
      "À conserver dans son écrin, à température stable. Idéal pour une ouverture sur plusieurs jours.",
    formats: [
      {
        id: "16-carres",
        label: "16 carrés",
        detail: "Signature",
        extraPrice: 0,
      },
      {
        id: "24-carres",
        label: "24 carrés",
        detail: "Coffret généreux",
        extraPrice: 20,
      },
      {
        id: "36-carres",
        label: "36 carrés",
        detail: "Réception",
        extraPrice: 42,
      },
    ],
  },
  "truffes-noires": {
    eyebrow: "Gourmandise — truffes",
    intro:
      "Une coque fine. Un cœur dense. La poudre de cacao se dépose, puis la ganache prend le relais.",
    storyTitle: "La truffe, sans apprêt",
    story:
      "Nous privilégions une ganache peu sucrée et une poudre de cacao sèche, presque mate, pour garder le contraste.",
    composition: ["Ganache noire", "Cacao poudre", "Sucre de canne"],
    tasting:
      "Le chocolat arrive d’abord, puis une texture très fondante. Finale courte, nette, presque saline.",
    conservation:
      "À conserver au frais, entre 12 et 16 °C. Sortir dix minutes avant dégustation pour laisser la ganache s’ouvrir.",
    formats: [
      {
        id: "boite-6",
        label: "6 pièces",
        detail: "Petit format",
        extraPrice: 0,
      },
      {
        id: "boite-12",
        label: "12 pièces",
        detail: "Boîte classique",
        extraPrice: 10,
      },
      { id: "boite-24", label: "24 pièces", detail: "Partage", extraPrice: 24 },
    ],
  },
  "truffes-praline": {
    eyebrow: "Gourmandise — praliné",
    intro:
      "Plus ronde, plus douce. Le praliné donne un pas de côté, puis la truffe retombe dans le cacao.",
    storyTitle: "Une douceur tenue",
    story:
      "Le praliné est travaillé pour rester lisible. Le sucre ne masque pas la torréfaction. Il la souligne.",
    composition: ["Ganache pralinée", "Cacao poudre", "Noisettes torréfiées"],
    tasting:
      "Noisette grillée, beurre, cacao. La texture est souple, la finale plus gourmande que la version noire.",
    conservation:
      "Conserver au frais et à l’ombre. Déguster dans les dix jours pour garder le grain du praliné.",
    formats: [
      {
        id: "boite-6",
        label: "6 pièces",
        detail: "Petit format",
        extraPrice: 0,
      },
      {
        id: "boite-12",
        label: "12 pièces",
        detail: "Boîte classique",
        extraPrice: 12,
      },
      { id: "boite-24", label: "24 pièces", detail: "Partage", extraPrice: 28 },
    ],
  },
  "mini-carres-assortiment": {
    eyebrow: "Mini carrés — assortiment",
    intro:
      "Le format dégustation. Petit, précis, multiple. Les origines se succèdent dans un rythme rapide.",
    storyTitle: "Le format qui va droit au goût",
    story:
      "Pensé comme une suite de notes courtes, ce coffret permet de comparer les origines sans saturer le palais.",
    composition: ["Douze mini carrés", "Quatre origines", "Sélection maison"],
    tasting:
      "Chaque carré frappe court puis s’éteint proprement. Un format idéal pour l’après-midi ou les cadeaux de table.",
    conservation:
      "À garder dans une boîte hermétique, à température stable. Les mini carrés se dégustent dans les trois semaines.",
    formats: [
      {
        id: "12-pieces",
        label: "12 pièces",
        detail: "Découverte",
        extraPrice: 0,
      },
      { id: "24-pieces", label: "24 pièces", detail: "Cadeau", extraPrice: 10 },
      {
        id: "36-pieces",
        label: "36 pièces",
        detail: "Réception",
        extraPrice: 24,
      },
    ],
  },
};

const relatedProducts = computed(() => {
  if (!product.value) return [];
  const sameCategory = ALL_PRODUCTS.filter(
    (item) =>
      item.category === product.value?.category && item.id !== product.value.id,
  );
  const fallback = ALL_PRODUCTS.filter(
    (item) =>
      item.id !== product.value?.id && item.category !== product.value.category,
  );
  return [...sameCategory, ...fallback].slice(0, 3);
});

const sheet = computed(() => {
  if (!product.value) return null;
  return SHEETS[product.value.id] ?? null;
});
</script>

<template>
  <div v-if="product && sheet">
    <ProductDetail
      :product="product"
      :related-products="relatedProducts"
      :sheet="sheet"
    />
  </div>

  <div v-else class="px-5 py-[120px] lg:px-[104px]">
    <span class="ci-eyebrow">Introuvable</span>
    <h1
      class="mt-4 font-serif text-brun-cacao"
      style="
        font-size: clamp(36px, 6vw, 72px);
        line-height: 1;
        font-weight: 500;
      "
    >
      Cette fiche produit n'existe pas.
    </h1>
    <button
      class="mt-8 border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire"
      @click="router.push('/boutique')"
    >
      Retour à la boutique
    </button>
  </div>
</template>
