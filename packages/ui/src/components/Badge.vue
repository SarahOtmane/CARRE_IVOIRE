<template>
  <span
    :class="[
      'inline-flex items-center border px-3 py-1 text-xs uppercase tracking-widest font-label',
      badgeClasses,
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const badgeClasses = computed(() => {
  switch (props.variant) {
    case 'accent':
      return 'border-dore text-dore bg-ivoire'
    case 'success':
      return 'border-green-600 text-green-600 bg-green-50'
    case 'warning':
      return 'border-yellow-600 text-yellow-600 bg-yellow-50'
    case 'error':
      return 'border-red-600 text-red-600 bg-red-50'
    default:
      return 'border-brun-cacao-2 text-brun-cacao-2 bg-beige-doux'
  }
})
</script>
