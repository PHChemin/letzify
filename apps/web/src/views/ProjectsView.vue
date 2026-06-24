<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { projectsApi } from '../api/services'
import type { BrandProject } from '../types'
import { getErrorMessage, sanitizeOptionalText } from '../api/client'
import { useToast } from '../composables/useToast'
import { useFormErrors } from '../composables/useFormErrors'
import FormField from '../components/FormField.vue'
import StatusBadge from '../components/StatusBadge.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AppButton from '../components/AppButton.vue'
import { useSubmitting } from '../composables/useSubmitting'
import { useConfirm } from '../composables/useConfirm'

const router = useRouter()
const { show } = useToast()
const { confirm } = useConfirm()
const { clearFieldErrors, applyFieldErrors, fieldError } = useFormErrors()
const { submitting: savingProject, run: runSaveProject } = useSubmitting()
const { submitting: deletingProject, run: runDeleteProject } = useSubmitting()

const projects = ref<BrandProject[]>([])
const meta = ref({ page: 1, limit: 10, total: 0, totalPages: 1 })
const filter = ref('')
const viewMode = ref<'list' | 'grid'>('list')
const loading = ref(true)
const showModal = ref(false)
const editing = ref<BrandProject | null>(null)
const form = ref({ name: '', description: '', status: 'ALIGNMENT' })

let filterTimeout: ReturnType<typeof setTimeout> | null = null

async function load(page = 1) {
  loading.value = true
  try {
    const result = await projectsApi.list({
      filter: filter.value || undefined,
      page,
      limit: meta.value.limit,
    })
    projects.value = result.items
    meta.value = result.meta
  } catch (err) {
    show(getErrorMessage(err), 'error')
  } finally {
    loading.value = false
  }
}

onMounted(() => load())

watch(filter, () => {
  if (filterTimeout) clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => load(1), 300)
})

function openCreate() {
  editing.value = null
  form.value = { name: '', description: '', status: 'ALIGNMENT' }
  clearFieldErrors()
  showModal.value = true
}

function openEdit(project: BrandProject, event: Event) {
  event.stopPropagation()
  editing.value = project
  form.value = {
    name: project.name,
    description: project.description ?? '',
    status: project.status,
  }
  clearFieldErrors()
  showModal.value = true
}

async function saveProject() {
  await runSaveProject(async () => {
    clearFieldErrors()
    const payload = {
      name: form.value.name.trim(),
      description: sanitizeOptionalText(form.value.description),
      status: form.value.status,
    }

    try {
      if (editing.value) {
        await projectsApi.update(editing.value.id, payload)
        show('Projeto atualizado')
      } else {
        await projectsApi.create(payload)
        show('Projeto criado')
      }
      showModal.value = false
      await load(meta.value.page)
    } catch (err) {
      applyFieldErrors(err)
      show(getErrorMessage(err), 'error')
      throw err
    }
  })
}

async function deleteProject(project: BrandProject, event: Event) {
  event.stopPropagation()
  const accepted = await confirm({
    title: 'Excluir projeto',
    message: `O projeto "${project.name}" e todos os dados associados (paletas, tipografias e assets) serão removidos permanentemente. Esta ação não pode ser desfeita.`,
    confirmLabel: 'Excluir',
    cancelLabel: 'Cancelar',
  })
  if (!accepted) return
  await runDeleteProject(async () => {
    try {
      await projectsApi.remove(project.id)
      show('Projeto excluído')
      await load(meta.value.page)
    } catch (err) {
      show(getErrorMessage(err), 'error')
      throw err
    }
  })
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

const hasPrev = computed(() => meta.value.page > 1)
const hasNext = computed(() => meta.value.page < meta.value.totalPages)
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <header class="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-6 lg:px-10 shrink-0">
      <h2 class="font-bold text-lg text-text-main">Projetos</h2>
      <button
        class="h-10 px-5 bg-primary text-white font-semibold text-sm rounded hover:bg-primary-hover transition-colors flex items-center gap-2"
        @click="openCreate"
      >
        <span class="material-symbols-outlined text-[18px]">add</span>
        Novo Projeto
      </button>
    </header>

    <main class="flex-1 overflow-y-auto p-6 lg:p-10">
      <div class="w-full">
        <div class="bg-surface border border-border-subtle rounded shadow-sm">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border-b border-border-subtle">
            <div class="relative w-full md:w-72">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">search</span>
              <input
                v-model="filter"
                type="text"
                placeholder="Buscar projetos..."
                class="w-full pl-10 pr-3 py-2 border border-border-subtle rounded text-sm focus:outline-none focus:border-primary focus:shadow-focus"
              />
            </div>
            <div class="flex items-center border border-border-subtle rounded overflow-hidden">
              <button
                class="p-2 flex items-center border-r border-border-subtle"
                :class="viewMode === 'list' ? 'bg-background-light text-primary' : 'text-text-muted'"
                @click="viewMode = 'list'"
              >
                <span class="material-symbols-outlined text-[20px]" :class="{ filled: viewMode === 'list' }">view_list</span>
              </button>
              <button
                class="p-2 flex items-center"
                :class="viewMode === 'grid' ? 'bg-background-light text-primary' : 'text-text-muted'"
                @click="viewMode = 'grid'"
              >
                <span class="material-symbols-outlined text-[20px]" :class="{ filled: viewMode === 'grid' }">grid_view</span>
              </button>
            </div>
          </div>

          <div v-if="loading" class="flex items-center justify-center gap-3 p-12 text-text-muted text-sm">
          <LoadingSpinner />
          Carregando projetos...
        </div>

          <div v-else-if="projects.length === 0" class="p-8 text-center text-text-muted text-sm">
            Nenhum projeto encontrado.
          </div>

          <!-- List view -->
          <div v-else-if="viewMode === 'list'" class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-border-subtle bg-background-light">
                  <th class="px-6 py-3 text-xs font-bold text-text-muted uppercase">Nome</th>
                  <th class="px-6 py-3 text-xs font-bold text-text-muted uppercase">Cor primária</th>
                  <th class="px-6 py-3 text-xs font-bold text-text-muted uppercase hidden sm:table-cell">Assets</th>
                  <th class="px-6 py-3 text-xs font-bold text-text-muted uppercase hidden md:table-cell">Atualizado</th>
                  <th class="px-6 py-3 text-xs font-bold text-text-muted uppercase">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border-subtle">
                <tr
                  v-for="project in projects"
                  :key="project.id"
                  class="hover:bg-background-light cursor-pointer"
                  @click="router.push(`/projects/${project.id}`)"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded border border-border-subtle flex items-center justify-center font-bold text-primary text-sm">
                        {{ project.name.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <p class="text-sm font-medium">{{ project.name }}</p>
                        <StatusBadge :status="project.status" class="mt-1" />
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="project.primaryColor" class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full border border-border-subtle" :style="{ backgroundColor: project.primaryColor }" />
                      <span class="text-sm font-mono">{{ project.primaryColor }}</span>
                    </div>
                    <span v-else class="text-sm text-text-muted">—</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-text-muted hidden sm:table-cell">{{ project.assetCount ?? 0 }}</td>
                  <td class="px-6 py-4 text-sm text-text-muted hidden md:table-cell">{{ formatDate(project.updatedAt) }}</td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <button class="text-text-muted hover:text-primary" @click="openEdit(project, $event)">
                        <span class="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button class="text-text-muted hover:text-error disabled:opacity-40" :disabled="deletingProject" @click="deleteProject(project, $event)">
                        <span class="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Grid view -->
          <div v-else class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              v-for="project in projects"
              :key="project.id"
              class="border border-border-subtle rounded p-5 text-left card-hover"
              @click="router.push(`/projects/${project.id}`)"
            >
              <div class="flex items-center justify-between mb-3">
                <div
                  class="w-10 h-10 rounded flex items-center justify-center font-bold text-primary border border-border-subtle"
                  :style="project.primaryColor ? { backgroundColor: project.primaryColor + '22' } : {}"
                >
                  {{ project.name.charAt(0).toUpperCase() }}
                </div>
                <span class="text-xs px-2 py-1 rounded"><StatusBadge :status="project.status" /></span>
              </div>
              <p class="font-semibold mb-1">{{ project.name }}</p>
              <p class="text-sm text-text-muted line-clamp-2">{{ project.description || 'Sem descrição' }}</p>
            </button>
          </div>

          <div v-if="meta.totalPages > 1" class="flex items-center justify-between p-4 border-t border-border-subtle">
            <p class="text-sm text-text-muted">
              Página {{ meta.page }} de {{ meta.totalPages }} ({{ meta.total }} projetos)
            </p>
            <div class="flex gap-2">
              <button
                class="px-3 py-1.5 text-sm border border-border-subtle rounded disabled:opacity-40"
                :disabled="!hasPrev"
                @click="load(meta.page - 1)"
              >Anterior</button>
              <button
                class="px-3 py-1.5 text-sm border border-border-subtle rounded disabled:opacity-40"
                :disabled="!hasNext"
                @click="load(meta.page + 1)"
              >Próxima</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="showModal = false">
      <div class="bg-surface rounded border border-border-subtle shadow-card w-full max-w-md p-6">
        <h3 class="font-bold text-lg mb-4">{{ editing ? 'Editar projeto' : 'Novo projeto' }}</h3>
        <form class="flex flex-col gap-4" @submit.prevent="saveProject">
          <FormField label="Nome" :error="fieldError('name')">
            <input
              v-model="form.name"
              required
              minlength="3"
              class="w-full h-10 px-3 border rounded text-sm focus:outline-none focus:border-primary focus:shadow-focus"
              :class="fieldError('name') ? 'border-error' : 'border-border-subtle'"
            />
          </FormField>
          <FormField label="Descrição" optional :error="fieldError('description')">
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:border-primary focus:shadow-focus"
              :class="fieldError('description') ? 'border-error' : 'border-border-subtle'"
            />
          </FormField>
          <FormField label="Status" :error="fieldError('status')">
            <select
              v-model="form.status"
              class="w-full h-10 px-3 border border-border-subtle rounded text-sm focus:outline-none focus:border-primary"
            >
              <option value="ALIGNMENT">Alinhamento</option>
              <option value="IN_PROGRESS">Em progresso</option>
              <option value="FINISHED">Finalizado</option>
            </select>
          </FormField>
          <div class="flex gap-2 justify-end pt-2">
            <button type="button" class="px-4 py-2 text-sm border border-border-subtle rounded" :disabled="savingProject" @click="showModal = false">Cancelar</button>
            <AppButton type="submit" :loading="savingProject">Salvar</AppButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
