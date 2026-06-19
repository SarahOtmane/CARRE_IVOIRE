<script setup lang="ts">
import { useNotificationStore } from '@carre-ivoire/stores'

const store = useNotificationStore()

const borderColor = {
  success: '#3a7c3a',
  error:   '#8b2020',
  warning: '#8b6a00',
  info:    'var(--dore, #B08A4F)',
}

const label = {
  success: 'Succès',
  error:   'Erreur',
  warning: 'Attention',
  info:    'Information',
}
</script>

<template>
  <Teleport to="body">
    <div
      aria-live="polite"
      aria-atomic="false"
      style="
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      "
    >
      <TransitionGroup name="toast">
        <div
          v-for="n in store.notifications"
          :key="n.id"
          role="alert"
          style="
            pointer-events: auto;
            background: var(--papier, #FFFBF7);
            min-width: 280px;
            max-width: 400px;
            padding: 14px 18px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            box-shadow: 0 4px 24px rgba(58,31,20,0.10);
          "
          :style="{ borderLeft: `3px solid ${borderColor[n.type]}` }"
        >
          <div style="flex: 1; min-width: 0">
            <div
              style="
                font-family: 'Inter', sans-serif;
                font-size: 10px;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                margin-bottom: 2px;
                opacity: 0.55;
                color: var(--brun-cacao, #3A1F14);
              "
            >{{ label[n.type] }}</div>
            <div
              style="
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                line-height: 1.5;
                color: var(--brun-cacao, #3A1F14);
              "
            >{{ n.message }}</div>
          </div>
          <button
            type="button"
            style="
              background: none;
              border: none;
              cursor: pointer;
              padding: 0;
              line-height: 1;
              font-size: 16px;
              color: var(--brun-cacao, #3A1F14);
              opacity: 0.35;
              flex-shrink: 0;
              margin-top: 1px;
            "
            aria-label="Fermer"
            @click="store.removeNotification(n.id)"
          >&#x2715;</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.toast-leave-active {
  transition: all 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
