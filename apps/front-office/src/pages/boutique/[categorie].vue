<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const categorie = route.params.categorie as string

// TODO: fetch products by categorie slug
void categorie
</script>

<template>
  <div />
</template>
