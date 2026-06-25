import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi, usersApi } from '../api/services'
import { getStoredToken, setStoredToken } from '../api/client'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getStoredToken())
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.roles.includes('ADMIN') ?? false)
  const displayName = computed(() => user.value?.name || user.value?.email || 'Usuário')

  async function login(email: string, password: string) {
    loading.value = true
    try {
      const response = await authApi.login(email, password)
      token.value = response.accessToken
      user.value = response.user
      setStoredToken(response.accessToken)
    } finally {
      loading.value = false
    }
  }

  async function register(payload: { email: string; password: string; name?: string }) {
    loading.value = true
    try {
      await authApi.register(payload)
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return
    user.value = await usersApi.me()
  }

  async function bootstrap() {
    if (!token.value) return
    try {
      await fetchMe()
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    setStoredToken(null)
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    isAdmin,
    displayName,
    login,
    register,
    fetchMe,
    bootstrap,
    logout,
  }
})
