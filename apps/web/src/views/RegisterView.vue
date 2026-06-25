<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { getErrorMessage } from '../api/client'
import { useFormErrors } from '../composables/useFormErrors'
import FormField from '../components/FormField.vue'
import AppButton from '../components/AppButton.vue'
import { useToast } from '../composables/useToast'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()
const { show } = useToast()
const { clearFieldErrors, applyFieldErrors, fieldError } = useFormErrors()
const generalError = ref('')

async function submit() {
  clearFieldErrors()
  generalError.value = ''
  try {
    await auth.register({
      name: name.value.trim() || undefined,
      email: email.value.trim(),
      password: password.value,
    })
    show('Conta criada! Faça login para continuar.')
    router.push('/login')
  } catch (err) {
    applyFieldErrors(err)
    generalError.value = getErrorMessage(err)
  }
}
</script>

<template>
  <div class="min-h-screen bg-background-light flex items-center justify-center p-4">
    <main class="w-full max-w-md bg-surface border border-border-subtle shadow-card rounded p-8">
      <div class="flex justify-center items-center gap-2 mb-8">
        <div class="h-8 w-8 bg-primary text-white rounded flex items-center justify-center font-bold">L</div>
        <span class="text-2xl font-bold tracking-tight text-text-main">Letzify</span>
      </div>

      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-text-main mb-2">Criar conta</h1>
        <p class="text-sm text-text-muted">Comece a organizar suas identidades visuais.</p>
      </div>

      <form class="flex flex-col gap-5" @submit.prevent="submit">
        <FormField label="Nome" optional :error="fieldError('name')">
          <input
            v-model="name"
            type="text"
            placeholder="Seu nome"
            class="w-full h-10 px-3 bg-surface border rounded text-sm focus:outline-none focus:border-primary focus:shadow-focus"
            :class="fieldError('name') ? 'border-error' : 'border-border-subtle'"
          />
        </FormField>

        <FormField label="E-mail" :error="fieldError('email')">
          <input
            v-model="email"
            type="email"
            required
            placeholder="nome@empresa.com"
            class="w-full h-10 px-3 bg-surface border rounded text-sm focus:outline-none focus:border-primary focus:shadow-focus"
            :class="fieldError('email') ? 'border-error' : 'border-border-subtle'"
          />
        </FormField>

        <FormField label="Senha" :error="fieldError('password')">
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            placeholder="Mínimo 6 caracteres"
            class="w-full h-10 px-3 bg-surface border rounded text-sm focus:outline-none focus:border-primary focus:shadow-focus"
            :class="fieldError('password') ? 'border-error' : 'border-border-subtle'"
          />
        </FormField>

        <p v-if="generalError" class="text-sm text-error">{{ generalError }}</p>

        <AppButton type="submit" :loading="auth.loading" class="w-full h-10">
          {{ auth.loading ? 'Criando...' : 'Criar conta' }}
        </AppButton>
      </form>

      <div class="mt-8 text-center border-t border-border-subtle pt-6">
        <p class="text-xs text-text-muted">
          Já tem conta?
          <RouterLink to="/login" class="text-primary font-medium hover:text-primary-hover">Entrar</RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>
