<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

const router = useRouter()

useHead({
  title: 'Nos événements — Carré Ivoire',
  meta: [{ name: 'description', content: 'Marchés, ateliers de dégustation et collaborations : retrouvez Carré Ivoire lors de nos prochains événements.' }],
})

interface Evenement {
  id: string
  date: string
  mois: string
  annee: string
  titre: string
  type: string
  lieu: string
  description1: string
  description2: string
  description3: string
  commentaire: string
  complet: boolean
  tag: string | null
}

const evenements: Evenement[] = [
  {
    id: 'journee-porte-ouverte',
    date: 'A venir',
    mois: '',
    annee: '',
    titre: 'Journée porte ouverte',
    type: 'Visite',
    lieu: 'Atelier — 29 rue de Vauparfonds, LUISANT',
    description1: 'Carré Ivoire ouvrira prochainement les portes de son laboratoire au public.',
    description2: 'Cette journée sera l\'occasion de découvrir notre univers, notre histoire et les différentes étapes de transformation de la fève de cacao en chocolat.',
    description3: 'Vous pourrez également découvrir les créations de la maison, échanger avec Koko et participer à une dégustation de chocolats artisanaux.',
    commentaire: 'La date de notre prochaine journée portes ouvertes sera annoncée prochainement.',
    complet: false,
    tag: '',
  },
  {
    id: 'atelier-adulte',
    date: 'A venir',
    mois: '',
    annee: '',
    titre: 'Atelier adulte : De la fève à la tablette',
    type: 'Atelier',
    lieu: 'Atelier — 29 rue de Vauparfonds, LUISANT',
    description1: 'Découvrez le parcours du cacao, ses origines et les principales étapes de fabrication du chocolat Bean-to-Bar.',
    description2: 'Après une dégustation de différents chocolats, chaque participant pourra mouler et personnaliser sa propre tablette Carré Ivoire.',
    description3: '',
    commentaire: 'Dates, tarifs et modalités d’inscription prochainement disponibles',
    complet: false,
    tag: '',
  },
  {
    id: 'atelier-enfant',
    date: 'A venir',
    mois: '',
    annee: '',
    titre: 'Atelier enfant : Ma première tablette Carré Ivoire',
    type: 'Atelier',
    lieu: 'Atelier — 29 rue de Vauparfonds, LUISANT',
    description1: 'Un atelier ludique et gourmand pour permettre aux enfants de découvrir le monde du cacao.',
    description2: 'Ils pourront observer, sentir et goûter différents ingrédients, puis mouler et décorer leur propre tablette de chocolat.',
    description3: 'Chaque enfant repartira avec sa création soigneusement emballée.',
    commentaire: 'Atelier destiné aux enfants de 7 à 12 ans. Dates, tarifs et modalités d\'inscription prochainement disponibles.',
    complet: false,
    tag: '',
  },
  {
    id: 'telethon-de-luisant',
    date: '31',
    mois: 'Octobre',
    annee: '2026',
    titre: 'Téléthon de Luisant',
    type: 'Salon',
    lieu: 'Salle André Malraux — Cour Charles Brune, LUISANT',
    description1: 'Retrouvez Carré Ivoire à l\'occasion du Téléthon de Luisant.',
    description2: 'Venez découvrir et déguster nos créations chocolatées tout en participant à une journée placée sous le signe de la solidarité.',
    description3: '',
    commentaire: '',
    complet: false,
    tag: 'A venir',
  },{
    id: 'festival-du-legendaire',
    date: '18',
    mois: 'November',
    annee: '2026',
    titre: 'Festival du légendaire',
    type: 'Salon',
    lieu: 'LUISANT',
    description1: 'Dans une ambience de mistère et de légende, venez nous encontrer pour un moment magique.',
    description2: 'Durant ces 3 journées, vous pourrez découvrir et déguster nos créations chocolatées dans une atmosphère à la Tim Burton, ça va être TOP !',
    description3: '',
    commentaire: '',
    complet: false,
    tag: 'A venir',
  },
  {
    id: 'salon-zen-chateaudun',
    date: '29',
    mois: 'Novembre',
    annee: '2026',
    titre: 'Salon Zen de Chateaudun',
    type: 'Salon',
    lieu: 'CHATEAUDUN',
    description1: 'Carré Ivoire sera présent au Salon Zen de Châteaudun pour une journée consacrée au bien-être, à la découverte et aux savoir-faire artisanaux.',
    description2: '',
    description3: '',
    commentaire: 'Venez rencontrer Koko et découvrir autrement l\'univers du cacao et du chocolat artisanal',
    complet: false,
    tag: 'A venir',
  },
  {
    id: 'marcher-de-noel',
    date: '12-13',
    mois: 'Décembre',
    annee: '2026',
    titre: 'Marché de Noël de Luisant',
    type: 'Marché',
    lieu: 'LUISANT',
    description1: 'Retrouvez Carré Ivoire à l’occasion du marché de Noël.',
    description2: 'Tablettes, gourmandises chocolatées, créations de saison et idées cadeaux seront au rendez-vous pour préparer les fêtes.',
    description3: '',
    commentaire: 'Le lieu exact sera communiqué prochainement.',
    complet: false,
    tag: 'A venir',
  },
]

const types = ['Tous', 'Visite', 'Atelier', 'Salon', 'Marché']

const selectedType = ref('Tous')

const filteredEvenements = computed(() =>
  selectedType.value === 'Tous'
    ? evenements
    : evenements.filter((evt) => evt.type === selectedType.value),
)
</script>

<template>
  <div>

    <!-- ── Intro ───────────────────────────────────────────── -->
    <section
      class="bg-ivoire"
      style="padding: 120px clamp(20px, 6vw, 104px) clamp(80px, 12vw, 192px)"
    >
      <div class="max-w-[880px]">
        <span class="ci-eyebrow">Nos Événements</span>
        <h1
          class="mt-4 font-serif font-medium text-cacao"
          style="font-size: clamp(48px, 7vw, 96px); line-height: 0.95; letter-spacing: -0.02em"
        >
          Nos rendez-vous<br/>
          <em class="text-cacao-2"></em>
        </h1>
        <p
          class="mt-12 max-w-[560px] font-sans text-cacao-2"
          style="font-size: 18px; line-height: 1.7"
        >
          Découvrez les prochains rendez-vous de Carré Ivoire : ateliers autour du chocolat, rencontres au laboratoire, salons et marchés artisanaux
        </p>
      </div>
    </section>

    <!-- ── Liste des événements ───────────────────────────── -->
    <section
      class="bg-ivoire"
      style="padding: 0 clamp(20px, 6vw, 104px) clamp(80px, 12vw, 192px)"
    >

      <!-- En-tête de liste -->
      <div
        class="mb-12 flex items-end justify-between border-b pb-6"
        style="border-color: var(--cacao-a12)"
      >
        <span class="ci-eyebrow">{{ evenements.length }} événements et rendrez-vous à venir</span>
        <div class="hidden gap-6 sm:flex">
          <a
            v-for="type in types"
            :key="type"
            class="cursor-pointer border-b pb-0.5 font-sans text-[12px] tracking-[0.04em] transition-[border-color,color] duration-180"
            :class="selectedType === type
              ? 'border-cacao text-cacao'
              : 'border-transparent text-cacao-2 hover:border-cacao hover:text-cacao'"
            @click="selectedType = type"
          >{{ type }}</a>
        </div>
      </div>

      <!-- Événements -->
      <div class="space-y-0">
        <article
          v-for="evt in filteredEvenements"
          :key="evt.id"
          class="group grid grid-cols-1 items-start gap-8 border-t py-12 lg:grid-cols-[140px_1fr_200px]"
          :class="evt.complet ? 'opacity-50' : 'cursor-pointer'"
          style="border-color: var(--cacao-a12)"
        >
          <!-- Date -->
          <div class="flex items-baseline gap-2 lg:flex-col lg:gap-0">
            <div
              class="font-serif font-medium leading-none text-dore"
              style="font-size: clamp(40px, 5vw, 56px)"
            >{{ evt.date }}</div>
            <div class="font-sans text-[13px] uppercase tracking-[0.1em] text-cacao-3">
              {{ evt.mois }} {{ evt.annee }}
            </div>
          </div>

          <!-- Corps -->
          <div>
            <div class="mb-3 flex flex-wrap items-center gap-3">
              <span class="ci-eyebrow">{{ evt.type }}</span>
              <span
                v-if="evt.tag"
                class="font-sans text-[9px] uppercase tracking-[0.22em]"
                :class="evt.tag === 'Édition limitée' ? 'bg-cacao text-ivoire' : 'border border-[var(--cacao-a24)] text-cacao'"
                style="padding: 4px 8px"
              >{{ evt.tag }}</span>
              <span
                v-if="evt.complet"
                class="font-sans text-[9px] uppercase tracking-[0.22em] text-cacao-3"
                style="padding: 4px 8px; border: 1px solid var(--cacao-a24)"
              >Complet</span>
            </div>

            <h2
              class="font-serif font-medium text-cacao"
              style="font-size: clamp(22px, 2.5vw, 30px); line-height: 1.1"
            >{{ evt.titre }}</h2>

            <p class="mt-3 font-sans text-[14px] leading-relaxed text-cacao-2" style="max-width: 520px">
              {{ evt.description1 }}
            </p>
            <p v-if="evt.description2 !== ''" class="mt-3 font-sans text-[14px] leading-relaxed text-cacao-2" style="max-width: 520px">
              {{ evt.description2 }}
            </p>
            <p v-if="evt.description3 !== ''" class="mt-3 font-sans text-[14px] leading-relaxed text-cacao-2" style="max-width: 520px">
              {{ evt.description3 }}
            </p>
            <p v-if="evt.commentaire !== ''" class="mt-3 font-sans text-[14px] leading-relaxed text-cacao-2" style="max-width: 520px"><b>
              {{ evt.commentaire }}
            </b></p>

            <div class="mt-4 flex items-center gap-2">
              <svg
                width="12" height="12" fill="none" stroke="currentColor"
                stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter"
                viewBox="0 0 12 12" class="text-cacao-3"
              >
                <circle cx="6" cy="5" r="2.5" />
                <path d="M6 12C6 12 1.5 7.5 1.5 5a4.5 4.5 0 019 0C10.5 7.5 6 12 6 12z" />
              </svg>
              <span class="font-sans text-[12px] text-cacao-3">{{ evt.lieu }}</span>
            </div>
          </div>

          <!-- CTA 
          <div class="flex items-start lg:justify-end">
            <button
              v-if="!evt.complet"
              class="border border-cacao px-6 py-3 font-sans text-[12px] tracking-[0.08em] text-cacao transition-all duration-180 hover:bg-cacao hover:text-ivoire active:translate-y-px"
            >
              Réserver
            </button>
            <span
              v-else
              class="font-sans text-[12px] tracking-[0.04em] text-cacao-3"
            >
              Liste d'attente →
            </span>
          </div> -->
        </article>

        <div class="border-t" style="border-color: var(--cacao-a12)" />
      </div>
    </section>

    <!-- ── Lettre ──────────────────────────────────────────── -->
    <section
      class="bg-beige-doux"
      style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)"
    >
      <div class="grid grid-cols-1 items-end gap-16 lg:grid-cols-2">
        <div>
          <span class="ci-eyebrow">Ne manquez pas nos prochaines dates</span>
          <h2
            class="mt-4 font-serif font-medium text-cacao"
            style="font-size: clamp(32px, 4vw, 52px); line-height: 1"
          >
            <br/>
            <em class="text-cacao-2"></em>
          </h2>
          <p class="mt-6 font-sans text-[15px] leading-relaxed text-cacao-2" style="max-width: 440px">
            Les dates des ateliers et de la journée portes ouvertes seront annoncées prochainement sur notre site internet et nos réseaux sociaux.
          </p>
        </div>

        <div>
          <div
            class="flex"
            style="border-bottom: 1px solid var(--cacao-a24)"
          >
            <input
              type="email"
              placeholder="vous@domaine.fr"
              class="flex-1 bg-transparent py-3 font-sans text-[14px] text-cacao placeholder-cacao-3 outline-none"
            />
            <button
              class="flex shrink-0 cursor-pointer items-center py-3 text-cacao transition-opacity duration-180 hover:opacity-60"
              aria-label="S'inscrire"
            >
              <svg
                width="16" height="16" fill="none" stroke="currentColor"
                stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter"
                viewBox="0 0 16 16"
              >
                <line x1="1" y1="8" x2="15" y2="8" />
                <polyline points="10,3 15,8 10,13" />
              </svg>
            </button>
          </div>
          <p class="mt-3 font-sans text-[11px] uppercase tracking-[0.14em] text-cacao-3">
            Désabonnement en un clic — toujours.
          </p>
        </div>
      </div>
    </section>

    <!-- ── CTA ────────────────────────────────────────────── -->
    <section
      class="bg-ivoire"
      style="padding: clamp(80px, 12vw, 192px) clamp(20px, 6vw, 104px)"
    >
      <div class="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-[560px]">
          <span class="ci-eyebrow">En attendant</span>
          <h2
            class="mt-4 font-serif font-medium text-cacao"
            style="font-size: clamp(32px, 4vw, 56px); line-height: 1"
          >
            La boutique,<br/>
            <em class="text-cacao-2">Accessible tous les jours.</em>
          </h2>
        </div>
        <div class="flex flex-col gap-4 sm:flex-row">
          <button
            class="border border-cacao bg-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
            @click="router.push('/boutique')"
          >
            Découvrir la boutique
          </button>
          <button
            class="border border-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-cacao transition-all duration-180 hover:bg-cacao hover:text-ivoire active:translate-y-px"
            @click="router.push('/engagements')"
          >
            Nos engagements →
          </button>
        </div>
      </div>
    </section>

  </div>
</template>
