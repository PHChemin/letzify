<script setup lang="ts">
defineProps<{
  label: string
  error?: string
  optional?: boolean
}>()
</script>

<template>
  <div>
    <label class="text-xs font-medium text-text-muted uppercase tracking-wider">
      {{ label }}
      <span v-if="optional" class="normal-case font-normal text-text-muted/80">(opcional)</span>
    </label>
    <div class="mt-1">
      <slot />
    </div>
    <p v-if="error" class="mt-1 text-xs text-error">{{ error }}</p>
  </div>
</template>
