<script setup lang="ts">
import { ref, computed } from 'vue'

import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useRouter } from 'vue-router'

import EyeClosed from '@/components/icons/EyeClosedIcon.vue'
import GoogleLogo from '@/components/icons/GoogleLogo.vue'
import EyeOpen from '@/components/icons/EyeOpenIcon.vue'
import Loader from '@/components/icons/Loader.vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import AuthWrapper from '@/views/authentication/AuthWrapper.vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const credentialsIsLoading = ref(false)
const pwdInputType = ref('password')
const googleIsLoading = ref(false)

const isDisabled = computed(() => googleIsLoading.value || credentialsIsLoading.value)

const formSchema = toTypedSchema(z.object({
  email: z
    .string({
      required_error: 'Campo obrigatório.'
    })
    .email({
      message: 'O email deve ser válido.'
    }),
  password: z
    .string({
      required_error: 'Campo obrigatório.'
    })
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  credentialsIsLoading.value = true
  const promise = () => new Promise(resolve => resolve(authStore.signInWithCredentials(values)))

  toast.promise(promise, {
    loading: 'Aguardando...',
    success: () => {
      credentialsIsLoading.value = false
      router.push({ name: 'dashboard' })
      return 'Login realizado com sucesso!'
    },
    error: (data: Error) => {
      credentialsIsLoading.value = false
      const error = data.message
      return error ?? 'Ocorreu um erro ao realizar o login.'
    },
  })
})

const handleGoogleLogin = async () => {
  googleIsLoading.value = true
  await authStore.loginWithGoogle()
  router.push({ name: 'dashboard' })
  googleIsLoading.value = false
}
</script>

<template>
  <AuthWrapper title="Entre na sua conta" subtitle="Comece a gerir suas vendas com facilidade.">
    <div class="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
      <Button type="button" :disabled="isDisabled" @click="handleGoogleLogin">
        <Loader v-if="googleIsLoading" class="mr-2 h-4 w-4 animate-spin" />
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
      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="text" placeholder="name@example.com" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <div class="relative">
                <Input :type="pwdInputType" v-bind="componentField" />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center px-2"
                  @click="pwdInputType = pwdInputType === 'password' ? 'text' : 'password'"
                >
                  <EyeOpen v-if="pwdInputType === 'text'" class="h-4 w-4" />
                  <EyeClosed v-else class="h-4 w-4" />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="w-full flex justify-between">
          <Button type="button" variant="link" class="text-sm px-0" @click="$router.push({ name: 'forgot-password' })">
            Esqueceu sua senha?
          </Button>
          <Button type="submit" :disabled="credentialsIsLoading">
            <Loader v-if="credentialsIsLoading" class="mr-2 h-4 w-4 animate-spin" />
            Entrar
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
  </AuthWrapper>
</template>
