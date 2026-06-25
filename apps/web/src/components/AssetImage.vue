<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { api } from '../api/client'

const props = defineProps<{
  fileKey: string
  alt: string
  mimeType?: string | null
}>()

const blobUrl = ref<string | null>(null)

async function load() {
  if (!props.mimeType?.startsWith('image/')) return
  const [projectId, fileName] = props.fileKey.split('/')
  try {
    const response = await api.get(`/files/${projectId}/${fileName}`, {
      responseType: 'blob',
    })
    if (blobUrl.value) URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = URL.createObjectURL(response.data)
  } catch {
    blobUrl.value = null
  }
}

onMounted(load)
watch(() => props.fileKey, load)
onBeforeUnmount(() => {
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value)
})
</script>

<template>
  <img v-if="blobUrl" :src="blobUrl" :alt="alt" class="max-h-full max-w-full object-contain" />
  <span v-else class="material-symbols-outlined text-4xl text-text-muted">description</span>
</template>
