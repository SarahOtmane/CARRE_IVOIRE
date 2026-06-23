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
  border-color: rgba(58, 31, 20, 0.12);
}
</style>
