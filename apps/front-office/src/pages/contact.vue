<script setup lang="ts">
import { ref } from "vue";

type ContactForm = {
  subject: string;
  address: string;
  message: string;
};

const form = ref<ContactForm>({
  subject: "",
  address: "",
  message: "",
});

const sent = ref(false);

function resetForm() {
  form.value = {
    subject: "",
    address: "",
    message: "",
  };
  sent.value = false;
}

function handleSubmit() {
  const body = `Adresse de réponse : ${form.value.address}\n\n${form.value.message}`;
  const href = `mailto:contact@carre-ivoire.fr?subject=${encodeURIComponent(form.value.subject)}&body=${encodeURIComponent(body)}`;
  globalThis.location.href = href;
  sent.value = true;
}
</script>

<template>
  <div class="pt-[72px]">
    <section
      style="
        padding: clamp(64px, 9vw, 128px) clamp(20px, 6vw, 104px)
          clamp(40px, 6vw, 72px);
        border-bottom: 1px solid var(--cacao-a12);
      "
    >
      <span class="ci-eyebrow">Maison — Nous écrire</span>
      <h1
        class="mt-6 font-serif text-brun-cacao"
        style="
          font-size: clamp(44px, 7vw, 104px);
          line-height: 0.95;
          letter-spacing: -0.02em;
          font-weight: 500;
        "
      >
        Une question,<br /><span
          class="text-brun-cacao-2"
          style="font-style: italic"
          >un mot, une commande.</span
        >
      </h1>
      <p
        class="mt-8 max-w-[560px] font-sans text-[16px] leading-[1.7] text-brun-cacao-2"
      >
        Notre atelier répond du mardi au samedi, sous 48 heures ouvrées. Pour
        les commandes professionnelles, mariages et événements, merci de
        l'indiquer dans votre message.
      </p>
    </section>

    <section
      class="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]"
      style="
        padding: clamp(64px, 9vw, 128px) clamp(20px, 6vw, 104px);
        gap: clamp(48px, 8vw, 128px);
      "
    >
      <aside>
        <span class="ci-eyebrow">I — Coordonnées</span>

        <div class="mt-8 flex flex-col gap-10">
          <div>
            <div
              class="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Atelier &amp; boutique
            </div>
            <div class="font-serif text-[22px] leading-[1.3] text-brun-cacao">
              4, rue du Nil<br />
              <span class="italic">75002 Paris</span>
            </div>
            <div
              class="mt-3 font-sans text-[13px] leading-[1.6] text-brun-cacao-2"
            >
              Mardi — samedi<br />
              10 h 30 — 19 h 30
            </div>
          </div>

          <div>
            <div
              class="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Par courriel
            </div>
            <a
              href="mailto:contact@carre-ivoire.fr"
              class="inline-block border-b border-brun-cacao pb-[2px] font-serif text-[22px] italic text-brun-cacao"
            >
              contact@carre-ivoire.fr
            </a>
            <div class="mt-4">
              <a
                href="mailto:contact@carre-ivoire.fr"
                class="inline-flex items-center gap-2 border-b pb-1 font-sans text-[12px] tracking-[0.06em] text-brun-cacao"
                style="border-color: var(--cacao-a24)"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.25"
                  stroke-linecap="square"
                  stroke-linejoin="miter"
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                >
                  <line x1="1" y1="7" x2="13" y2="7" />
                  <polyline points="8,2 13,7 8,12" />
                </svg>
                Nous envoyer un message depuis votre messagerie
              </a>
            </div>
          </div>

          <div>
            <div
              class="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Par téléphone
            </div>
            <div
              class="font-serif text-[22px] text-brun-cacao"
              style="font-variant-numeric: tabular-nums"
            >
              +33 1 42 33 84 12
            </div>
          </div>

          <div>
            <div
              class="mb-3 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
            >
              Presse &amp; professionnels
            </div>
            <a
              href="mailto:presse@carre-ivoire.fr"
              class="inline-block border-b pb-[2px] font-serif text-[18px] italic text-brun-cacao"
              style="border-color: var(--cacao-a24)"
            >
              presse@carre-ivoire.fr
            </a>
          </div>
        </div>
      </aside>

      <div>
        <div class="mb-12 flex items-end justify-between">
          <span class="ci-eyebrow">II — Formulaire</span>
          <span
            class="font-sans text-[10px] tracking-[0.22em] text-brun-cacao-2"
            >— II / II</span
          >
        </div>

        <div
          v-if="sent"
          class="border-t border-brun-cacao bg-beige-doux"
          style="padding: clamp(32px, 5vw, 64px)"
        >
          <span class="ci-eyebrow-accent">Message préparé</span>
          <h2
            class="mt-4 font-serif text-brun-cacao"
            style="
              font-size: clamp(28px, 3.4vw, 40px);
              font-weight: 500;
              line-height: 1.1;
            "
          >
            Votre messagerie <span class="italic">vient de s'ouvrir.</span>
          </h2>
          <p
            class="mb-6 mt-4 max-w-[460px] font-sans text-[15px] leading-[1.7] text-brun-cacao-2"
          >
            Nous vous répondons sous 48 heures ouvrées depuis l'adresse
            contact@carre-ivoire.fr.
          </p>
          <button
            class="border-b border-brun-cacao pb-[2px] font-sans text-[13px] text-brun-cacao"
            @click="resetForm"
          >
            Écrire un autre message →
          </button>
        </div>

        <form
          v-else
          class="flex flex-col gap-10"
          @submit.prevent="handleSubmit"
        >
          <div>
            <label
              for="contact-subject"
              class="mb-[10px] block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
              >Sujet</label
            >
            <input
              id="contact-subject"
              v-model="form.subject"
              required
              type="text"
              placeholder="Une commande, une question, un projet…"
              class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] tracking-[0.01em] text-brun-cacao outline-none focus:border-brun-cacao"
              style="border-color: var(--cacao-a24)"
            />
          </div>

          <div>
            <label
              for="contact-address"
              class="mb-[10px] block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
              >Adresse où vous contacter</label
            >
            <input
              id="contact-address"
              v-model="form.address"
              required
              type="email"
              placeholder="vous@maison.fr"
              class="w-full border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] tracking-[0.01em] text-brun-cacao outline-none focus:border-brun-cacao"
              style="border-color: var(--cacao-a24)"
            />
          </div>

          <div>
            <label
              for="contact-message"
              class="mb-[10px] block font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
              >Message</label
            >
            <textarea
              id="contact-message"
              v-model="form.message"
              required
              rows="6"
              placeholder="Dites-nous tout — sans formules inutiles."
              class="min-h-[160px] w-full resize-y border-0 border-b bg-transparent px-0 pb-[14px] pt-[10px] font-sans text-[15px] leading-[1.6] tracking-[0.01em] text-brun-cacao outline-none focus:border-brun-cacao"
              style="border-color: var(--cacao-a24)"
            />
          </div>

          <div class="flex flex-wrap items-center gap-6 pt-2">
            <button
              type="submit"
              class="border border-brun-cacao bg-brun-cacao px-7 py-4 font-sans text-[13px] tracking-[0.08em] text-ivoire transition-all duration-180 active:translate-y-px"
            >
              Envoyer
            </button>
            <span
              class="max-w-[320px] font-sans text-[11px] leading-[1.6] tracking-[0.04em] text-brun-cacao-2"
            >
              En envoyant, vous adressez un message à
              <span class="text-brun-cacao">contact@carre-ivoire.fr</span>.
            </span>
          </div>
        </form>
      </div>
    </section>

    <section
      style="
        padding: clamp(40px, 6vw, 80px) clamp(20px, 6vw, 104px)
          clamp(80px, 12vw, 160px);
      "
    >
      <div class="mb-8 flex items-end justify-between">
        <span class="ci-eyebrow">III — Nous trouver</span>
        <span class="font-sans text-[11px] tracking-[0.22em] text-brun-cacao-2"
          >Paris II<sup>e</sup></span
        >
      </div>

      <div
        class="relative overflow-hidden"
        style="
          aspect-ratio: 21 / 9;
          background: var(--beige-doux);
          border-top: 1px solid var(--cacao-a24);
          border-bottom: 1px solid var(--cacao-a24);
        "
      >
        <svg
          viewBox="0 0 420 180"
          preserveAspectRatio="xMidYMid slice"
          class="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="var(--cacao-a08)"
                stroke-width="0.5"
              />
            </pattern>
          </defs>
          <rect width="420" height="180" fill="url(#grid)" />
          <path
            d="M40 40 L380 40 L380 50 L260 50 L260 140 L40 140 Z"
            fill="none"
            stroke="var(--cacao-a24)"
            stroke-width="0.75"
          />
          <path
            d="M120 40 L120 140"
            stroke="var(--cacao-a24)"
            stroke-width="0.5"
          />
          <path
            d="M200 50 L200 140"
            stroke="var(--cacao-a24)"
            stroke-width="0.5"
          />
          <path
            d="M40 90 L260 90"
            stroke="var(--cacao-a24)"
            stroke-width="0.5"
          />
          <g transform="translate(180,82)">
            <rect
              x="-6"
              y="-6"
              width="12"
              height="12"
              fill="var(--brun-cacao)"
            />
            <text
              y="28"
              text-anchor="middle"
              font-family="Cormorant Garamond, serif"
              font-style="italic"
              font-size="11"
              fill="var(--brun-cacao)"
            >
              Carré Ivoire
            </text>
          </g>
        </svg>

        <div
          class="absolute bottom-6 right-6 max-w-[240px] border-l-2 border-brun-cacao bg-ivoire px-5 py-4"
        >
          <div
            class="mb-1.5 font-sans text-[10px] uppercase tracking-[0.22em] text-brun-cacao-2"
          >
            Adresse
          </div>
          <div class="font-serif text-[16px] leading-[1.3] text-brun-cacao">
            4 rue du Nil<br /><span class="italic">75002 Paris</span>
          </div>
          <a
            href="https://maps.google.com/?q=4+rue+du+Nil+75002+Paris"
            target="_blank"
            rel="noopener"
            class="mt-3 inline-block border-b pb-[2px] font-sans text-[11px] tracking-[0.06em] text-brun-cacao"
            style="border-color: var(--cacao-a24)"
          >
            Itinéraire →
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
