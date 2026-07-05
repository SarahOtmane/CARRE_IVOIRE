<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: 'Conditions Générales de Vente — Carré Ivoire',
  meta: [{ name: 'robots', content: 'noindex' }],
})

const sections = [
  {
    num: '01',
    titre: 'Objet et champ d\'application',
    contenu: [
      'Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la société Carré Ivoire, SAS au capital de 10 000 €, immatriculée au RCS de Paris sous le numéro 123 456 789, dont le siège social est situé 4 rue du Nil, 75002 Paris (ci-après « Carré Ivoire »), et toute personne physique ou morale (ci-après « le Client ») souhaitant effectuer un achat via le site carreivoire.fr.',
      'Toute commande passée sur le site implique l\'acceptation sans réserve des présentes CGV. Carré Ivoire se réserve le droit de les modifier à tout moment.',
    ],
  },
  {
    num: '02',
    titre: 'Produits',
    contenu: [
      'Les produits proposés à la vente sont ceux figurant sur le site au moment de la consultation par le Client, dans la limite des stocks disponibles.',
      'Les photographies et descriptions des produits sont fournies à titre indicatif. Carré Ivoire s\'efforce de présenter ses produits avec la plus grande exactitude possible. Les chocolats étant des produits artisanaux, de légères variations visuelles entre les lots peuvent exister.',
      'Les prix sont indiqués en euros toutes taxes comprises (TTC). Carré Ivoire se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable à la commande est celui en vigueur au moment de la validation.',
    ],
  },
  {
    num: '03',
    titre: 'Commandes',
    contenu: [
      'Le Client sélectionne les produits qu\'il souhaite commander et les ajoute à son panier. La commande est validée après saisie des informations de livraison et confirmation du paiement.',
      'Carré Ivoire se réserve le droit de refuser ou d\'annuler toute commande pour tout motif légitime, notamment en cas d\'épuisement du stock, de litige antérieur ou de suspicion de fraude.',
      'Un email de confirmation est adressé au Client dès validation de la commande.',
    ],
  },
  {
    num: '04',
    titre: 'Paiement',
    contenu: [
      'Le paiement s\'effectue en ligne par carte bancaire (Visa, Mastercard, American Express) via la plateforme sécurisée Stripe. Les données de paiement sont cryptées et ne transitent pas par les serveurs de Carré Ivoire.',
      'La commande est validée après confirmation du paiement. En cas de refus d\'autorisation bancaire, la commande est automatiquement annulée.',
    ],
  },
  {
    num: '05',
    titre: 'Livraison',
    contenu: [
      'Les commandes sont expédiées en France métropolitaine, en Belgique et en Suisse. Les délais de livraison sont indiqués à titre indicatif au moment de la commande.',
      'Carré Ivoire ne peut être tenu responsable des retards imputables au transporteur ou à des circonstances indépendantes de sa volonté.',
      'Les risques de la livraison sont transférés au Client dès la remise du colis au transporteur. En cas de perte ou d\'avarie, le Client doit formuler ses réserves auprès du transporteur dans les délais légaux.',
    ],
  },
  {
    num: '06',
    titre: 'Droit de rétractation',
    contenu: [
      'Conformément à l\'article L.221-18 du Code de la consommation, le Client dispose d\'un délai de 14 jours à compter de la réception de sa commande pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.',
      'Toutefois, en application de l\'article L.221-28 du Code de la consommation, ce droit ne s\'applique pas aux produits susceptibles de se détériorer rapidement, notamment les denrées alimentaires.',
      'Pour tout produit éligible, le retour s\'effectue à frais du Client, dans son emballage d\'origine et en parfait état.',
    ],
  },
  {
    num: '07',
    titre: 'Garanties et réclamations',
    contenu: [
      'Carré Ivoire garantit la conformité de ses produits à la description figurant sur le site au moment de la commande.',
      'Toute réclamation doit être adressée à contact@carreivoire.fr dans un délai de 48 heures suivant la réception. Carré Ivoire s\'engage à traiter les réclamations dans les meilleurs délais.',
    ],
  },
  {
    num: '08',
    titre: 'Droit applicable et litiges',
    contenu: [
      'Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité.',
      'À défaut, le Client peut recourir à la médiation de la consommation via la plateforme européenne de règlement en ligne des litiges : https://ec.europa.eu/consumers/odr/',
      'En l\'absence de résolution amiable, les tribunaux français seront seuls compétents.',
    ],
  },
]
</script>

<template>
  <div>
    <!-- En-tête -->
    <section class="px-5 pb-16 pt-20 lg:px-[104px] lg:pb-24 lg:pt-28">
      <span class="ci-eyebrow">Conditions de vente</span>
      <h1
        class="mt-5 font-serif text-cacao"
        style="font-size: clamp(40px, 6vw, 80px); line-height: 0.95; font-weight: 500; letter-spacing: -0.02em"
      >
        CGV.
      </h1>
      <p class="mt-6 max-w-[520px] font-sans text-[15px] leading-[1.8] text-cacao-2">
        Conditions Générales de Vente applicables à toute commande passée sur carreivoire.fr.
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
