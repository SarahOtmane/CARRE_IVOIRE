<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: 'Politique de confidentialité — Carré Ivoire',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const sections = [
  {
    num: '01',
    titre: 'Responsable du traitement',
    contenu: [
      'Carré Ivoire, SAS au capital de 10 000 €, immatriculée au RCS de LUISANT sous le numéro 123 456 789, dont le siège social est situé 29 rue de Vauparfonds, 28600 LUISANT, est responsable du traitement de vos données personnelles.',
      'Contact délégué à la protection des données : dpo@carreivoire.fr',
    ],
  },
  {
    num: '02',
    titre: 'Données collectées',
    contenu: [
      'Lors de la création de votre compte et de vos commandes, nous collectons : nom, prénom, adresse email, adresse postale, numéro de téléphone (facultatif).',
      'Lors du paiement, les données bancaires sont traitées exclusivement par notre prestataire Stripe et ne transitent pas par nos serveurs.',
      'Lors de la navigation, nous collectons des données techniques (adresse IP, type de navigateur, pages visitées) à des fins statistiques anonymisées.',
    ],
  },
  {
    num: '03',
    titre: 'Finalités et bases légales',
    contenu: [
      'Gestion des commandes et de la relation client — base légale : exécution du contrat.',
      'Envoi de la newsletter (avec votre consentement) — base légale : consentement.',
      'Amélioration du site et statistiques de navigation — base légale : intérêt légitime.',
      'Respect de nos obligations légales (conservation des factures) — base légale : obligation légale.',
    ],
  },
  {
    num: '04',
    titre: 'Durée de conservation',
    contenu: [
      'Données de compte : conservées jusqu\'à la suppression de votre compte, puis 3 ans à compter du dernier achat à des fins de relation commerciale.',
      'Données de commande et factures : 10 ans conformément aux obligations comptables légales.',
      'Données de newsletter : jusqu\'au retrait de votre consentement.',
      'Cookies analytiques : 13 mois maximum.',
    ],
  },
  {
    num: '05',
    titre: 'Destinataires des données',
    contenu: [
      'Vos données sont transmises uniquement aux prestataires nécessaires à l\'exécution de nos services : transporteurs (pour la livraison), Stripe (pour le paiement), hébergeur OVHcloud.',
      'Ces prestataires agissent en qualité de sous-traitants et sont soumis à des obligations contractuelles de confidentialité.',
      'Carré Ivoire ne vend et ne loue aucune donnée personnelle à des tiers.',
    ],
  },
  {
    num: '06',
    titre: 'Vos droits',
    contenu: [
      'Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants : accès, rectification, effacement, limitation du traitement, portabilité et opposition.',
      'Pour exercer ces droits, adressez votre demande à dpo@carreivoire.fr ou par courrier à : Carré Ivoire — DPO, 29 rue de Vauparfonds, 28600 LUISANT. Nous vous répondrons dans un délai d\'un mois.',
      'Vous disposez également du droit de déposer une réclamation auprès de la CNIL (www.cnil.fr) si vous estimez que le traitement de vos données personnelles ne respecte pas la réglementation en vigueur.',
    ],
  },
  {
    num: '07',
    titre: 'Cookies',
    contenu: [
      'Le site utilise des cookies strictement nécessaires à son fonctionnement (session, panier, authentification) et des cookies analytiques anonymisés pour mesurer l\'audience.',
      'Aucun cookie publicitaire ou de tracking tiers n\'est déposé sans votre consentement.',
      'Vous pouvez paramétrer ou désactiver les cookies depuis les préférences de votre navigateur.',
    ],
  },
  {
    num: '08',
    titre: 'Modification de la politique',
    contenu: [
      'Carré Ivoire se réserve le droit de modifier la présente politique à tout moment, notamment pour se conformer à toute évolution légale, réglementaire ou technique.',
      'En cas de modification substantielle, vous en serez informé par email ou par une notification visible sur le site.',
      'Date de dernière mise à jour : juillet 2026.',
    ],
  },
]
</script>

<template>
  <div>
    <!-- En-tête -->
    <section class="px-5 pb-16 pt-20 lg:px-[104px] lg:pb-24 lg:pt-28">
      <span class="ci-eyebrow">Données personnelles</span>
      <h1
        class="mt-5 font-serif text-cacao"
        style="font-size: clamp(40px, 6vw, 80px); line-height: 0.95; font-weight: 500; letter-spacing: -0.02em"
      >
        Confidentialité.
      </h1>
      <p class="mt-6 max-w-[520px] font-sans text-[15px] leading-[1.8] text-cacao-2">
        Comment nous collectons, utilisons et protégeons vos données personnelles, conformément au RGPD.
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
