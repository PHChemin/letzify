import axios, { type AxiosError } from 'axios'
import type { ApiError, ApiSuccess } from '../types'
export { getErrorMessage, getFieldErrors, sanitizeOptionalText } from '../utils/form-errors'

const TOKEN_KEY = 'letzify_access_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      setStoredToken(null)
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export async function unwrap<T>(promise: Promise<{ data: ApiSuccess<T> }>): Promise<T> {
  const response = await promise
  return response.data.data
}

export function getFileDownloadUrl(fileKey: string): string {
  const base = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
  const [projectId, fileName] = fileKey.split('/')
  return `${base}/files/${projectId}/${fileName}`
}
