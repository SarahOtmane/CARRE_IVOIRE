<template>
  <div
    class="flex shrink-0 items-center justify-center overflow-hidden border border-cacao text-cacao"
    :class="size === 'lg' ? 'h-12 w-12 font-display text-xl' : 'h-8 w-8 font-serif text-[15px] font-medium'"
  >
    <img v-if="logoUrl" :src="logoUrl" alt="Carré Ivoire" class="h-full w-full object-cover" />
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
