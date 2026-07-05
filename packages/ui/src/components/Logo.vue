<template>
  <div
    class="flex shrink-0 items-center justify-center overflow-hidden text-cacao"
    :class="
      size === 'lg'
        ? 'h-16 w-24 font-display text-2xl'
        : 'h-12 w-20 font-serif text-lg font-medium'
    "
  >
    <img
      :src="resolvedLogoUrl"
      alt="Carré Ivoire"
      class="h-full w-full object-contain"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import defaultLogoUrl from "../assets/logo.webp";

interface Props {
  logoUrl?: string | null;
  size?: "sm" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  logoUrl: null,
  size: "sm",
});

const resolvedLogoUrl = computed(() => props.logoUrl || defaultLogoUrl);
</script>
