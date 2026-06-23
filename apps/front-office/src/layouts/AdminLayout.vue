<script setup lang="ts">
import { RouterView } from 'vue-router'
import AdminSidebar from '@/components/layout/AdminSidebar.vue'
import AdminHeader from '@/components/layout/AdminHeader.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-beige font-body text-cocoa">
    <AdminSidebar />
    <div class="flex flex-1 flex-col overflow-hidden">
      <AdminHeader />
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
