<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <div class="modal-overlay absolute inset-0" @click="$emit('close')" />
        <article class="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-papier p-8 modal-border">
          <slot />
        </article>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
}

defineProps<Props>()
defineEmits<{
  close: []
}>()
</script>

<style scoped>
.modal-overlay {
  background-color: rgba(58, 31, 20, 0.35);
}

.modal-border {
  border: 1px solid rgba(58, 31, 20, 0.12);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 400ms var(--ease-ui, cubic-bezier(0.2, 0.8, 0.2, 1));
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
