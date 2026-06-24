<script setup lang="ts">
import { getStatusLabel, getStatusStyle } from '../utils/status'

defineProps<{
  status: string
}>()
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded border"
    :class="getStatusStyle(status)"
  >
    {{ getStatusLabel(status) }}
  </span>
</template>
