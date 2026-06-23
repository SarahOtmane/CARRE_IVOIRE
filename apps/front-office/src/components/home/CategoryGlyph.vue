<script setup lang="ts">
defineProps<{ slug: string }>()
</script>

<template>
  <!-- La couleur est héritée via CSS `color: currentColor` du parent -->

  <svg v-if="slug === 'carres-signature'" viewBox="0 0 60 60" width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
    <rect x="8" y="8" width="20" height="20" />
    <rect x="32" y="8" width="20" height="20" />
    <rect x="8" y="32" width="20" height="20" />
    <rect x="32" y="32" width="20" height="20" fill="currentColor" />
  </svg>

  <svg v-else-if="slug === 'mini-carres'" viewBox="0 0 60 60" width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
    <rect x="8" y="8" width="12" height="12" /><rect x="24" y="8" width="12" height="12" /><rect x="40" y="8" width="12" height="12" />
    <rect x="8" y="24" width="12" height="12" /><rect x="24" y="24" width="12" height="12" /><rect x="40" y="24" width="12" height="12" />
    <rect x="8" y="40" width="12" height="12" /><rect x="24" y="40" width="12" height="12" /><rect x="40" y="40" width="12" height="12" />
  </svg>

  <svg v-else-if="slug === 'tablettes'" viewBox="0 0 60 60" width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
    <rect x="6" y="12" width="48" height="36" />
    <line x1="22" y1="12" x2="22" y2="48" />
    <line x1="38" y1="12" x2="38" y2="48" />
    <line x1="6" y1="30" x2="54" y2="30" />
  </svg>

  <svg v-else-if="slug === 'gourmandises'" viewBox="0 0 60 60" width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
    <circle cx="30" cy="30" r="20" />
    <circle cx="30" cy="30" r="12" />
    <circle cx="30" cy="30" r="4" fill="currentColor" />
  </svg>

  <svg v-else-if="slug === 'sables'" viewBox="0 0 60 60" width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
    <rect x="10" y="18" width="40" height="24" />
    <circle cx="20" cy="26" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="30" cy="32" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="40" cy="24" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="26" cy="36" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="42" cy="36" r="1.5" fill="currentColor" stroke="none" />
  </svg>

  <svg v-else-if="slug === 'mendiants'" viewBox="0 0 60 60" width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
    <circle cx="30" cy="30" r="18" />
    <circle cx="24" cy="25" r="2" fill="currentColor" stroke="none" />
    <circle cx="36" cy="26" r="2" fill="currentColor" stroke="none" />
    <circle cx="28" cy="35" r="2" fill="currentColor" stroke="none" />
    <circle cx="36" cy="36" r="2" fill="currentColor" stroke="none" />
    <rect x="20" y="22" width="3" height="3" fill="currentColor" stroke="none" />
  </svg>

  <svg v-else-if="slug === 'oursons'" viewBox="0 0 60 60" width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
    <circle cx="30" cy="34" r="16" />
    <circle cx="22" cy="18" r="6" />
    <circle cx="38" cy="18" r="6" />
    <circle cx="26" cy="32" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="34" cy="32" r="1.5" fill="currentColor" stroke="none" />
  </svg>

  <svg v-else-if="slug === 'chocobombs'" viewBox="0 0 60 60" width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
    <circle cx="30" cy="32" r="18" />
    <line x1="30" y1="14" x2="30" y2="8" />
    <line x1="30" y1="8" x2="26" y2="4" />
    <line x1="30" y1="8" x2="34" y2="4" />
    <circle cx="30" cy="32" r="6" fill="currentColor" />
  </svg>

  <svg v-else-if="slug === 'pates-a-tartiner'" viewBox="0 0 60 60" width="100%" height="100%" stroke="currentColor" fill="none" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
    <rect x="18" y="14" width="24" height="36" />
    <rect x="20" y="8" width="20" height="6" />
    <line x1="18" y1="24" x2="42" y2="24" />
    <text x="30" y="38" font-family="Cormorant Garamond, serif" font-size="10" fill="currentColor" stroke="none" text-anchor="middle" font-style="italic">CI</text>
  </svg>
</template>
