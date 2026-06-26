<script setup lang="ts">
import { ref } from 'vue'
import { useNewsletter } from '@carre-ivoire/composables'

const props = withDefaults(
  defineProps<{
    theme?: 'dark' | 'light'
    label?: string
    description?: string
    placeholder?: string
  }>(),
  {
    theme: 'dark',
    label: 'Lettre',
    description: 'Une fois par mois. Rien de plus.',
    placeholder: 'vous@maison.fr',
  },
)

const { isLoading, subscribe } = useNewsletter()
const email = ref('')
const submitted = ref(false)

const textColor = props.theme === 'dark' ? 'text-ivoire' : 'text-cacao'
const borderStyle = props.theme === 'dark' ? 'var(--ivoire-a40)' : 'var(--cacao-a24)'
const placeholderClass = props.theme === 'dark' ? 'placeholder-ivoire placeholder-opacity-40' : 'placeholder-cacao placeholder-opacity-40'
const opacityLabel = props.theme === 'dark' ? 'opacity-60' : 'opacity-50'
const opacityBody = props.theme === 'dark' ? 'opacity-70' : 'opacity-70'

async function handleSubmit() {
  if (!email.value.trim()) return
  await subscribe(email.value.trim())
  submitted.value = true
  email.value = ''
}
</script>

<template>
  <div>
    <div :class="['ci-label mb-5', textColor, opacityLabel]">{{ label }}</div>
    <p :class="['mb-3.5 font-sans text-[13px] leading-relaxed', textColor, opacityBody]">
      {{ description }}
    </p>
    <Transition name="fade" mode="out-in">
      <p
        v-if="submitted"
        :class="['font-sans text-[13px] leading-relaxed', textColor]"
      >
        Merci. À bientôt.
      </p>
      <form
        v-else
        class="flex"
        :style="{ borderBottom: `1px solid ${borderStyle}` }"
        @submit.prevent="handleSubmit"
      >
        <input
          v-model="email"
          type="email"
          required
          :placeholder="placeholder"
          :class="[
            'flex-1 bg-transparent py-2 font-sans text-[13px] outline-none',
            textColor,
            placeholderClass,
          ]"
        />
        <button
          type="submit"
          :class="[
            'flex shrink-0 cursor-pointer items-center py-2 transition-opacity duration-180',
            'hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40',
            textColor,
            'opacity-70',
          ]"
          aria-label="S'inscrire"
          :disabled="isLoading"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="square"
            stroke-linejoin="miter"
            viewBox="0 0 16 16"
          >
            <line x1="1" y1="8" x2="15" y2="8" />
            <polyline points="10,3 15,8 10,13" />
          </svg>
        </button>
      </form>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
