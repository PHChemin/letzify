import { ref } from 'vue'
import { getFieldErrors } from '../utils/form-errors'

export function useFormErrors() {
  const fieldErrors = ref<Record<string, string>>({})

  function clearFieldErrors() {
    fieldErrors.value = {}
  }

  function applyFieldErrors(error: unknown) {
    fieldErrors.value = getFieldErrors(error)
  }

  function fieldError(name: string) {
    return fieldErrors.value[name]
  }

  return {
    fieldErrors,
    clearFieldErrors,
    applyFieldErrors,
    fieldError,
  }
}
