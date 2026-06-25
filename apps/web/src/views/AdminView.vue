<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminApi } from '../api/services'
import { useAuthStore } from '../stores/auth'
import { getErrorMessage } from '../api/client'
import { useToast } from '../composables/useToast'

const auth = useAuthStore()
const { show } = useToast()
const message = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await adminApi.welcome()
    message.value = response.message
  } catch (err) {
    show(getErrorMessage(err), 'error')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <header class="h-16 bg-surface border-b border-border-subtle flex items-center px-6 lg:px-10 shrink-0">
      <h2 class="font-bold text-lg text-text-main">Administração</h2>
    </header>

    <main class="flex-1 overflow-y-auto p-6 lg:p-10">
      <div class="w-full">
        <div class="bg-surface border border-border-subtle rounded p-8 text-center">
          <div class="size-16 mx-auto mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>

          <h3 class="font-bold text-xl mb-2">Área restrita — Admin</h3>
          <p class="text-text-muted text-sm mb-6">
            Você está autenticado como administrador da plataforma Letzify.
          </p>

          <div v-if="loading" class="text-text-muted text-sm">Verificando permissões...</div>
          <div v-else class="bg-background-light border border-border-subtle rounded p-4">
            <p class="text-lg font-semibold text-primary">{{ message }}</p>
            <p class="text-sm text-text-muted mt-2">{{ auth.user?.email }}</p>
            <p class="text-xs text-text-muted mt-1">Roles: {{ auth.user?.roles.join(', ') }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
