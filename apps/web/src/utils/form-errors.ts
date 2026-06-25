import axios from 'axios'
import type { ApiError } from '../types'

type ValidationItem = {
  property?: string
  constraints?: Record<string, string>
  children?: ValidationItem[]
}

function collectConstraintMessages(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value]
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectConstraintMessages)
  }

  if (value && typeof value === 'object') {
    const item = value as ValidationItem

    if (item.constraints) {
      return Object.values(item.constraints)
    }

    if (item.children?.length) {
      return item.children.flatMap(collectConstraintMessages)
    }
  }

  return []
}

export function getFieldErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {}

  if (!axios.isAxiosError<ApiError>(error)) {
    return fieldErrors
  }

  const message = error.response?.data?.message
  if (!Array.isArray(message)) {
    return fieldErrors
  }

  for (const item of message) {
    if (!item || typeof item !== 'object') continue

    const validationItem = item as ValidationItem
    if (!validationItem.property || !validationItem.constraints) continue

    const [firstMessage] = Object.values(validationItem.constraints)
    if (firstMessage) {
      fieldErrors[validationItem.property] = firstMessage
    }
  }

  return fieldErrors
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    if (!error.response) {
      return (
        'Não foi possível conectar à API. Verifique se o backend está rodando em ' +
        (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api')
      )
    }

    const messages = collectConstraintMessages(error.response.data?.message)
    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  return 'Ocorreu um erro inesperado. Verifique os campos e tente novamente.'
}

export function sanitizeOptionalText(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}
