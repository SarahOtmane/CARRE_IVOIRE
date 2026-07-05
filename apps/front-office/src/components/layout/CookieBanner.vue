<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)

onMounted(() => {
  if (!localStorage.getItem('cookie-consent')) visible.value = true
})

function accept() {
  localStorage.setItem('cookie-consent', 'accepted')
  visible.value = false
}

function decline() {
  localStorage.setItem('cookie-consent', 'declined')
  visible.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="visible"
        class="fixed bottom-0 left-0 right-0 z-50 border-t border-cacao bg-ivoire px-5 py-6 lg:px-[104px]"
        role="dialog"
        aria-label="Gestion des cookies"
      >
        <div class="flex flex-wrap items-center justify-between gap-6">
          <div class="max-w-[680px]">
            <p class="font-sans text-[13px] leading-[1.7] text-cacao-2">
              Ce site utilise des cookies strictement nécessaires à son fonctionnement, ainsi que des cookies analytiques anonymisés pour mesurer l'audience. Aucun cookie publicitaire n'est déposé sans votre consentement.
              <button
                type="button"
                class="ml-1 border-b border-cacao-2 font-sans text-[13px] text-cacao-2 transition-opacity duration-180 hover:opacity-60"
                @click="router.push('/politique-de-confidentialite')"
              >En savoir plus</button>
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="border border-cacao/30 px-5 py-3 font-sans text-[12px] uppercase tracking-[0.14em] text-cacao-2 transition-all duration-180 hover:border-cacao hover:text-cacao"
              @click="decline"
            >
              Refuser
            </button>
            <button
              type="button"
              class="border border-cacao bg-cacao px-5 py-3 font-sans text-[12px] uppercase tracking-[0.14em] text-ivoire transition-all duration-180 hover:bg-cacao-2"
              @click="accept"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
