<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { Loader2 } from 'lucide-vue-next'
import GoogleLogo from '@/components/icons/GoogleLogo.vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const googleIsLoading = ref(false)
const emailIsLoading = ref(false)

const isDisabled = computed(() => googleIsLoading.value || emailIsLoading.value)

const handleGoogleLogin = async () => {
  googleIsLoading.value = true
  await authStore.loginWithGoogle()
  authStore.session && router.push({ name: 'dashboard' })
  googleIsLoading.value = false
}

const handleEmailLogin = async (event: Event) => {
  emailIsLoading.value = true

  const target = event.target as HTMLFormElement

  const promise = () => new Promise((resolve) => resolve(authStore.loginWithMagicLink(target.email.value)))

  toast.promise(promise, {
    loading: 'Aguardando...',
    success: () => 'Foi enviado um link de acesso para o seu email!',
    error: () => 'Ocorreu um erro ao realizar o login.',
  })

  emailIsLoading.value = false
}
</script>

<template>
  <div class="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
    <Button type="button" :disabled="isDisabled" @click="handleGoogleLogin">
      <Loader2 v-if="googleIsLoading" class="mr-2 h-4 w-4 animate-spin" />
      <GoogleLogo v-else class="mr-2 h-4 w-4" name="Google Logo" />
      Entrar com Google
    </Button>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-gray-50 px-2 text-muted-foreground">
          Ou continue com
        </span>
      </div>
    </div>
    <form @submit.prevent="handleEmailLogin">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label class="sr-only" for="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="nome@example.com"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            :disabled="isDisabled"
          />
        </div>
        <Button variant="outline" :disabled="isDisabled">
          <Loader2 v-if="emailIsLoading" class="mr-2 h-4 w-4 animate-spin" />
          Continue com Email
        </Button>
      </div>
    </form>
    <p class="text-center text-sm text-gray-500">
      Ainda não tem uma conta?
      <a
        href="/auth/register"
        class="font-semibold text-gray-500 transition-colors hover:text-black"
      >
        Cadastre-se
    </a>
      .
    </p>
  </div>
</template>
