import { ref } from 'vue'

export type ConfirmOptions = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

const open = ref(false)
const title = ref('')
const message = ref('')
const confirmLabel = ref('Confirmar')
const cancelLabel = ref('Cancelar')

let pendingResolve: ((value: boolean) => void) | null = null

export function useConfirm() {
  function confirm(options: ConfirmOptions): Promise<boolean> {
    if (pendingResolve) {
      pendingResolve(false)
    }

    title.value = options.title
    message.value = options.message
    confirmLabel.value = options.confirmLabel ?? 'Confirmar'
    cancelLabel.value = options.cancelLabel ?? 'Cancelar'
    open.value = true

    return new Promise<boolean>((resolve) => {
      pendingResolve = resolve
    })
  }

  function resolveConfirm(value: boolean) {
    open.value = false
    pendingResolve?.(value)
    pendingResolve = null
  }

  return {
    open,
    title,
    message,
    confirmLabel,
    cancelLabel,
    confirm,
    resolveConfirm,
  }
}
