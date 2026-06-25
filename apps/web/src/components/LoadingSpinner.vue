<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const sizeClass = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-10 border-[3px]',
}
</script>

<template>
  <span
    class="inline-block rounded-full border-primary/30 border-t-primary animate-spin"
    :class="sizeClass[size]"
    role="status"
    aria-label="Carregando"
  />
</template>
