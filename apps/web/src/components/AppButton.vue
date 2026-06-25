<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit'
  }>(),
  {
    loading: false,
    disabled: false,
    variant: 'primary',
    type: 'button',
  },
)

const variantClass = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-surface text-text-main border border-border-subtle hover:bg-background-light',
  ghost: 'bg-transparent text-text-muted hover:text-text-main hover:bg-background-light',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    :class="variantClass[variant]"
  >
    <LoadingSpinner v-if="loading" size="sm" />
    <slot />
  </button>
</template>
