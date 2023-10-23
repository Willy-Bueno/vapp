<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'

import { useAuthStore } from '@/stores/auth'

import GoogleLogo from '@/components/icons/GoogleLogo.vue'
import Loader from '@/components/icons/Loader.vue'
import { Button } from '@/components/ui/button'

import AuthWrapper from '@/views/authentication/AuthWrapper.vue'

const authStore = useAuthStore()

const googleIsLoading = ref(false)

const isDisabled = computed(() => googleIsLoading.value)

const handleGoogleLogin = () => {
  googleIsLoading.value = true

  const promise = () => new Promise(resolve => resolve(authStore.loginWithGoogle()))

  toast.promise(promise, {
    loading: 'Aguardando...',
    success: () => 'Cadastro realizado com sucesso!',
    error: () => 'Ocorreu um erro ao realizar o cadastro.',
  })

  googleIsLoading.value = false
}
</script>

<template>
  <AuthWrapper title="Crie sua conta agora" subtitle="Começe de graça. Não é necessário cc.">
    <div class="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
      <Button
        variant="default"
        @click="handleGoogleLogin"
        :disabled="isDisabled"
      >
        <Loader v-if="googleIsLoading" class="mr-2 h-4 w-4 animate-spin" />
        <GoogleLogo v-else class="mr-2 h-4 w-4" name="Google Logo"  />
        <span>Entrar com Google</span>
      </Button>

      <Button
        class="text-gray-500 border-gray-300 hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-500 disabled:hover:cursor-not-allowed"
        variant="outline"
        disabled
      >
        Continue com SAML SSO
      </Button>
      <p class="text-center text-sm text-gray-500">
        Já tem uma conta?
        <a
          href="/auth/login"
          class="font-semibold text-gray-500 transition-colors hover:text-black"
        >
          Login
      </a>
        .
      </p>
    </div>
  </AuthWrapper>
</template>
