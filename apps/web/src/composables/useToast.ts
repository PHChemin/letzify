import { ref } from 'vue'
import { getErrorMessage } from '../utils/form-errors'

const message = ref<string | null>(null)
const type = ref<'success' | 'error'>('success')
let timeoutId: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  function show(text: unknown, toastType: 'success' | 'error' = 'success') {
    const resolved =
      typeof text === 'string'
        ? text
        : toastType === 'error'
          ? getErrorMessage(text)
          : 'Operação concluída.'

    message.value = resolved
    type.value = toastType
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      message.value = null
    }, 3500)
  }

  function clear() {
    message.value = null
  }

  return { message, type, show, clear }
}
