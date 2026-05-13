<template>
  <button
    :class="[
      'font-body inline-flex items-center justify-center transition-all duration-[180ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] active:translate-y-px',
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
      return 'bg-cacao text-ivoire border border-cacao hover:bg-cacao/85'
    case 'secondary':
      return 'bg-transparent text-cacao border border-cacao hover:bg-cacao hover:text-ivoire'
    case 'outline':
      return 'bg-transparent text-cacao border border-cacao/25 hover:border-cacao'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-[10px] tracking-[0.18em] uppercase px-4 py-2'
    case 'lg':
      return 'text-[11px] tracking-[0.18em] uppercase px-8 py-5'
    default:
      return 'text-[11px] tracking-[0.18em] uppercase px-5 py-3'
  }
})
</script>
