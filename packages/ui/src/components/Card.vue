<template>
  <article :class="['border p-6', transparent ? 'bg-transparent' : 'bg-papier', 'card-border']">
    <slot />
  </article>
</template>

<script setup lang="ts">
interface Props {
  transparent?: boolean
}

withDefaults(defineProps<Props>(), {
  transparent: false,
})
</script>

<style scoped>
.card-border {
  border-color: var(--cacao-a12);
}
</style>
