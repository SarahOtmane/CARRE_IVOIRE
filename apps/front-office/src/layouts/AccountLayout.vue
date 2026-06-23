<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { label: 'Tableau de bord', path: '/compte' },
  { label: 'Mes commandes', path: '/compte/commandes' },
  { label: 'Favoris', path: '/compte/favoris' },
  { label: 'Informations', path: '/compte/informations' },
]

function isActive(path: string) {
  if (path === '/compte') return route.path === '/compte'
  return route.path.startsWith(path)
}

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-ivoire font-sans text-brun-cacao">
    <AppHeader />

    <main class="flex-1">
      <div
        style="padding: 120px clamp(20px, 6vw, 104px) clamp(80px, 10vw, 128px)"
      >
        <!-- En-tête compte -->
        <span class="ci-eyebrow">Espace client</span>
        <h1
          class="mb-12 mt-4 font-serif font-medium text-brun-cacao"
          style="font-size: clamp(36px, 5vw, 64px); line-height: 1"
        >
          Bonjour,
          <em class="text-brun-cacao-2">{{ authStore.user?.firstName ?? 'vous' }}.</em>
        </h1>

        <!-- Grille sidebar + contenu -->
        <div class="grid grid-cols-1 gap-16 lg:grid-cols-[220px_1fr]">

          <!-- Sidebar nav -->
          <nav class="flex flex-col">
            <a
              v-for="item in navItems"
              :key="item.path"
              class="cursor-pointer border-b py-3 font-sans text-[13px] tracking-[0.02em] transition-colors duration-180"
              style="border-color: var(--cacao-a08)"
              :class="isActive(item.path)
                ? 'font-medium text-brun-cacao'
                : 'text-brun-cacao-2 hover:text-brun-cacao'"
              @click="router.push(item.path)"
            >{{ item.label }}</a>

            <!-- Déconnexion — séparée visuellement -->
            <a
              class="mt-1 cursor-pointer border-b py-3 font-sans text-[13px] tracking-[0.02em] text-brun-cacao-3 transition-colors duration-180 hover:text-brun-cacao"
              style="border-color: var(--cacao-a08)"
              @click="logout"
            >Déconnexion</a>
          </nav>

          <!-- Contenu de la sous-page -->
          <div>
            <RouterView />
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
