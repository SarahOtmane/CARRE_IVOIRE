<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: 'Mentions légales — Carré Ivoire',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const sections = [
  {
    num: '01',
    titre: 'Éditeur du site',
    contenu: [
      'Le site carreivoire.fr est édité par la société Carré Ivoire, SAS au capital de 10 000 €, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.',
      'Siège social : 4 rue du Nil, 75002 Paris, France.',
      'Directeur de la publication : le représentant légal de la société.',
      'Contact : contact@carreivoire.fr',
    ],
  },
  {
    num: '02',
    titre: 'Hébergement',
    contenu: [
      'Le site est hébergé par OVHcloud, SAS au capital de 10 174 560 €, immatriculée au RCS de Roubaix-Tourcoing sous le numéro 424 761 419.',
      'Siège social : 2 rue Kellermann, 59100 Roubaix, France.',
      'Téléphone : +33 9 72 10 10 07',
    ],
  },
  {
    num: '03',
    titre: 'Propriété intellectuelle',
    contenu: [
      'L\'ensemble des éléments figurant sur ce site — textes, photographies, illustrations, logotypes, icônes, vidéos, sons — est la propriété exclusive de Carré Ivoire ou de ses partenaires.',
      'Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite sans l\'autorisation écrite préalable de Carré Ivoire.',
      'Toute exploitation non autorisée du site ou de l\'un quelconque des éléments qu\'il contient est considérée comme constitutive d\'une contrefaçon et poursuivie conformément aux dispositions de l\'article L.335-2 et suivants du Code de la Propriété Intellectuelle.',
    ],
  },
  {
    num: '04',
    titre: 'Limitation de responsabilité',
    contenu: [
      'Carré Ivoire s\'efforce d\'assurer au mieux de ses possibilités l\'exactitude et la mise à jour des informations diffusées sur son site. Toutefois, Carré Ivoire ne peut garantir l\'exactitude, la précision ou l\'exhaustivité des informations mises à disposition sur ce site.',
      'En conséquence, Carré Ivoire décline toute responsabilité pour tout dommage direct ou indirect pouvant résulter de l\'accès au site ou de l\'utilisation des informations qu\'il contient.',
      'Des liens hypertextes peuvent renvoyer vers d\'autres sites. Carré Ivoire n\'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.',
    ],
  },
  {
    num: '05',
    titre: 'Droit applicable',
    contenu: [
      'Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.',
    ],
  },
]
</script>

<template>
  <div>
    <!-- En-tête -->
    <section class="px-5 pb-16 pt-20 lg:px-[104px] lg:pb-24 lg:pt-28">
      <span class="ci-eyebrow">Informations légales</span>
      <h1
        class="mt-5 font-serif text-cacao"
        style="font-size: clamp(40px, 6vw, 80px); line-height: 0.95; font-weight: 500; letter-spacing: -0.02em"
      >
        Mentions légales.
      </h1>
      <p class="mt-6 max-w-[520px] font-sans text-[15px] leading-[1.8] text-cacao-2">
        Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.
      </p>
    </section>

    <!-- Contenu -->
    <section class="px-5 pb-24 lg:px-[104px]">
      <div class="max-w-[760px] space-y-0">
        <div
          v-for="section in sections"
          :key="section.num"
          class="border-t py-10"
          style="border-color: var(--cacao-a12)"
        >
          <div class="grid gap-6 lg:grid-cols-[96px_1fr]">
            <span class="font-sans text-[11px] uppercase tracking-[0.18em] text-dore">{{ section.num }}</span>
            <div>
              <h2 class="font-serif text-[22px] font-medium leading-tight text-cacao">
                {{ section.titre }}
              </h2>
              <div class="mt-5 space-y-3">
                <p
                  v-for="(para, i) in section.contenu"
                  :key="i"
                  class="font-sans text-[15px] leading-[1.8] text-cacao-2"
                >
                  {{ para }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
