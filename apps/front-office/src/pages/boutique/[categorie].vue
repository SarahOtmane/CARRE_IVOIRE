<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const cat = route.params.categorie as string
router.replace({ name: 'boutique', query: cat ? { cat } : {} })
</script>

<template>
  <div class="min-h-screen bg-ivoire" />
</template>
