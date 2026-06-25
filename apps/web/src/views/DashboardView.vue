<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { dashboardApi } from '../api/services'
import { useAuthStore } from '../stores/auth'
import type { BrandProject, DashboardStats } from '../types'
import { getErrorMessage } from '../api/client'
import { useToast } from '../composables/useToast'
import StatusBadge from '../components/StatusBadge.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const auth = useAuthStore()
const router = useRouter()
const { show } = useToast()
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    stats.value = await dashboardApi.stats()
  } catch (err) {
    show(getErrorMessage(err), 'error')
  } finally {
    loading.value = false
  }
})

function openProject(project: BrandProject) {
  router.push(`/projects/${project.id}`)
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <header class="h-16 bg-surface border-b border-border-subtle flex items-center px-6 lg:px-10 shrink-0">
      <h2 class="font-bold text-lg text-text-main">Overview</h2>
    </header>

    <main class="flex-1 overflow-y-auto p-6 lg:p-10">
      <div class="w-full flex flex-col gap-8">
        <div>
          <h3 class="font-bold text-2xl text-text-main mb-1">Bem-vindo, {{ auth.displayName }}</h3>
          <p class="text-text-muted text-sm">Resumo das suas identidades visuais.</p>
        </div>

        <div v-if="loading" class="flex items-center gap-3 text-text-muted text-sm py-8">
          <LoadingSpinner />
          Carregando dashboard...
        </div>

        <template v-else-if="stats">
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="bg-surface p-5 rounded border border-border-subtle shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-medium text-text-muted uppercase tracking-wider">Projetos</span>
                <span class="material-symbols-outlined text-text-muted">folder_open</span>
              </div>
              <span class="font-bold text-3xl">{{ stats.totalProjects }}</span>
            </div>
            <div class="bg-surface p-5 rounded border border-border-subtle shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-medium text-text-muted uppercase tracking-wider">Paletas</span>
                <span class="material-symbols-outlined text-text-muted">palette</span>
              </div>
              <span class="font-bold text-3xl">{{ stats.totalPalettes }}</span>
            </div>
            <div class="bg-surface p-5 rounded border border-border-subtle shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-medium text-text-muted uppercase tracking-wider">Assets</span>
                <span class="material-symbols-outlined text-text-muted">image</span>
              </div>
              <span class="font-bold text-3xl">{{ stats.totalAssets }}</span>
            </div>
            <div class="bg-surface p-5 rounded border border-border-subtle shadow-sm">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-medium text-text-muted uppercase tracking-wider">Tipografias</span>
                <span class="material-symbols-outlined text-text-muted">text_fields</span>
              </div>
              <span class="font-bold text-3xl">{{ stats.totalTypographies }}</span>
            </div>
          </div>

          <section>
            <h4 class="font-bold text-lg mb-4">Projetos recentes</h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <button
                v-for="project in stats.recentProjects"
                :key="project.id"
                class="bg-surface border border-border-subtle rounded p-5 text-left card-hover"
                @click="openProject(project)"
              >
                <div class="flex items-center gap-3 mb-3">
                  <div
                    class="w-10 h-10 rounded border border-border-subtle flex items-center justify-center font-bold text-primary shrink-0"
                    :style="project.primaryColor ? { backgroundColor: project.primaryColor + '22' } : {}"
                  >
                    {{ project.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-text-main truncate">{{ project.name }}</p>
                    <StatusBadge :status="project.status" class="mt-1" />
                  </div>
                </div>
                <p class="text-sm text-text-muted line-clamp-2">{{ project.description || 'Sem descrição' }}</p>
              </button>

              <RouterLink
                to="/projects"
                class="bg-surface border border-dashed border-border-subtle rounded p-5 flex flex-col items-center justify-center gap-2 text-center card-hover min-h-[140px]"
              >
                <span class="material-symbols-outlined text-3xl text-primary">grid_view</span>
                <span class="font-semibold text-text-main">Ver todos</span>
                <span class="text-xs text-text-muted">Explore todos os projetos</span>
              </RouterLink>
            </div>

            <p
              v-if="stats.recentProjects.length === 0"
              class="mt-4 bg-surface border border-border-subtle rounded p-6 text-center text-text-muted text-sm"
            >
              Nenhum projeto ainda. Acesse Projetos para criar o primeiro.
            </p>
          </section>
        </template>
      </div>
    </main>
  </div>
</template>
