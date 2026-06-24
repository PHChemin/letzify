<script setup lang="ts">
import { useConfirm } from '../composables/useConfirm'
import AppButton from './AppButton.vue'

const { open, title, message, confirmLabel, cancelLabel, resolveConfirm } = useConfirm()
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
        @click.self="resolveConfirm(false)"
      >
        <div
          class="bg-surface rounded border border-border-subtle shadow-card w-full max-w-md p-6"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-message"
        >
          <div class="flex items-start gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-error text-[22px]">delete</span>
            </div>
            <div class="min-w-0">
              <h3 id="confirm-dialog-title" class="font-bold text-lg text-text-main">{{ title }}</h3>
              <p id="confirm-dialog-message" class="text-sm text-text-muted mt-2 leading-relaxed">{{ message }}</p>
            </div>
          </div>
          <div class="flex gap-2 justify-end">
            <AppButton variant="secondary" @click="resolveConfirm(false)">{{ cancelLabel }}</AppButton>
            <button
              type="button"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded bg-error text-white hover:bg-error/90 transition-colors"
              @click="resolveConfirm(true)"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
