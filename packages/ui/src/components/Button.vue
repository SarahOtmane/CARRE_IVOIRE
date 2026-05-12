<template>
  <button
    :class="[
      'font-body font-medium transition-colors',
      variantClasses,
      sizeClasses,
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-brun-cacao text-papier border border-brun-cacao hover:bg-brun-cacao-2'
    case 'secondary':
      return 'bg-rose-poudre text-brun-cacao border border-rose-poudre hover:bg-rose-poudre-2'
    case 'outline':
      return 'bg-transparent text-brun-cacao border border-brun-cacao hover:bg-ivoire'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs px-3 py-1'
    case 'lg':
      return 'text-base px-6 py-3'
    default:
      return 'text-sm px-4 py-2'
  }
})
</script>
