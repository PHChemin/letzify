<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '../composables/useToast'
import AppSidebar from '../components/AppSidebar.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const { message, type } = useToast()
const mobileNavOpen = ref(false)
</script>

<template>
  <div class="h-screen overflow-hidden flex bg-background-light">
    <AppSidebar :mobile-open="mobileNavOpen" @close="mobileNavOpen = false" />

    <div class="flex-1 flex flex-col h-full overflow-hidden min-w-0">
      <header class="md:hidden h-14 bg-surface border-b border-border-subtle flex items-center gap-3 px-4 shrink-0">
        <button
          type="button"
          class="p-2 text-text-muted hover:text-text-main rounded"
          aria-label="Abrir menu"
          @click="mobileNavOpen = true"
        >
          <span class="material-symbols-outlined">menu</span>
        </button>
        <span class="font-bold text-text-main">Letzify</span>
      </header>

      <RouterView />
    </div>

    <Transition name="fade">
      <div
        v-if="message"
        class="fixed bottom-6 right-6 z-[60] px-4 py-3 rounded shadow-card text-sm font-medium text-white max-w-sm"
        :class="type === 'success' ? 'bg-primary' : 'bg-error'"
      >
        {{ message }}
      </div>
    </Transition>

    <ConfirmDialog />
  </div>
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
