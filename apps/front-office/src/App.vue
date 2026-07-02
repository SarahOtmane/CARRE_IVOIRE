<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NotificationToast } from '@carre-ivoire/ui'
import CookieBanner from '@/components/layout/CookieBanner.vue'
</script>

<template>
  <RouterView />
  <NotificationToast />
  <CookieBanner />
</template>
