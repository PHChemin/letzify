import { ref } from 'vue'

export function useSubmitting() {
  const submitting = ref(false)

  async function run<T>(action: () => Promise<T>): Promise<T | undefined> {
    if (submitting.value) return undefined
    submitting.value = true
    try {
      return await action()
    } finally {
      submitting.value = false
    }
  }

  return { submitting, run }
}
