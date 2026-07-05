<template>
  <div
    class="flex shrink-0 items-center justify-center overflow-hidden border border-cacao text-cacao"
    :class="size === 'lg' ? 'h-16 w-16 font-display text-2xl' : 'h-11 w-11 font-serif text-lg font-medium'"
  >
    <img v-if="logoUrl" :src="logoUrl" alt="Carré Ivoire" class="h-full w-full object-contain" />
    <span v-else>CI</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  logoUrl?: string | null
  size?: 'sm' | 'lg'
}

withDefaults(defineProps<Props>(), {
  logoUrl: null,
  size: 'sm',
})
</script>
