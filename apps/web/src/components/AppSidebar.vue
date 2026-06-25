<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const props = defineProps<{
  mobileOpen?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const navItems = computed(() => {
  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/projects', label: 'Projetos', icon: 'folder' },
  ]
  if (auth.isAdmin) {
    items.push({ to: '/admin', label: 'Admin', icon: 'admin_panel_settings' })
  }
  return items
})

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function logout() {
  auth.logout()
  router.push('/login')
  emit('close')
}

function navigate() {
  emit('close')
}

watch(
  () => route.path,
  () => emit('close'),
)
</script>

<template>
  <div
    v-if="mobileOpen"
    class="fixed inset-0 bg-black/40 z-40 md:hidden"
    @click="emit('close')"
  />

  <aside
    class="flex flex-col w-60 bg-surface border-r border-border-subtle h-full shrink-0 z-50
      fixed inset-y-0 left-0 transform transition-transform duration-200 ease-out
      md:relative md:translate-x-0"
    :class="mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <div class="p-6 flex items-center gap-3">
      <div class="size-8 bg-primary rounded flex items-center justify-center text-white font-bold text-sm">
        L
      </div>
      <h1 class="font-bold text-xl text-text-main tracking-tight">Letzify</h1>
    </div>

    <nav class="flex flex-col gap-1 px-4 mt-2 flex-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2 rounded-r text-sm font-medium transition-colors border-l-[3px]"
        :class="isActive(item.to)
          ? 'bg-background-light border-primary text-text-main'
          : 'border-transparent text-text-muted hover:text-text-main hover:bg-background-light'"
        @click="navigate"
      >
        <span
          class="material-symbols-outlined text-[20px]"
          :class="{ filled: isActive(item.to), 'text-primary': isActive(item.to) }"
        >{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="p-4 mt-auto border-t border-border-subtle">
      <div class="flex items-center gap-3 px-3 py-2">
        <div class="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
          {{ auth.displayName.charAt(0).toUpperCase() }}
        </div>
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-medium text-text-main truncate">{{ auth.displayName }}</span>
          <span class="text-xs text-text-muted truncate">{{ auth.user?.email }}</span>
        </div>
      </div>
      <button
        class="mt-2 w-full flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text-main hover:bg-background-light rounded transition-colors"
        @click="logout"
      >
        <span class="material-symbols-outlined text-[18px]">logout</span>
        Sair
      </button>
    </div>
  </aside>
</template>
