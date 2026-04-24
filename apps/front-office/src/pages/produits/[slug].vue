<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug as string

// TODO: fetch product by slug, ProductDetail component
void slug
</script>

<template>
  <div />
</template>
