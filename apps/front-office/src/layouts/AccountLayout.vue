<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-ivory font-body text-cocoa">
    <AppHeader />
    <main class="flex-1 py-12">
      <div class="mx-auto max-w-5xl px-4">
        <RouterView />
      </div>
    </main>
    <AppFooter />
  </div>
</template>
