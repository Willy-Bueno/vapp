<script setup lang="ts">
import { ref, computed } from "vue"

import { toast } from "vue-sonner"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"
import { useRouter } from "vue-router"

import { useAuthStore } from "@/stores/auth"

import EyeClosed from "@/components/icons/EyeClosedIcon.vue"
import GoogleLogo from "@/components/icons/GoogleLogo.vue"
import EyeOpen from "@/components/icons/EyeOpenIcon.vue"
import Loader from "@/components/icons/Loader.vue"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import AuthWrapper from "@/views/authentication/AuthWrapper.vue"

const authStore = useAuthStore()
const router = useRouter()

const credentialsIsLoading = ref(false)
const googleIsLoading = ref(false)
const pwdInputType = ref("password")

const isDisabled = computed(() => googleIsLoading.value)

const formSchema = toTypedSchema(
  z.object({
    first_name: z
      .string({
        required_error: "Campo obrigatório.",
      })
      .min(3, {
        message: "O nome deve conter pelo menos 3 carácteres.",
      })
      .max(20, {
        message: "O nome deve conter no máximo 20 carácteres",
      }),
    last_name: z
      .string({
        required_error: "Campo obrigatório.",
      })
      .min(3, {
        message: "O nome deve conter pelo menos 3 carácteres.",
      })
      .max(20, {
        message: "O nome deve conter no máximo 20 carácteres",
      }),
    email: z
      .string({
        required_error: "Campo obrigatório.",
      })
      .email({
        message: "O email deve ser válido.",
      })
      .min(3, {
        message: "O email deve conter pelo menos 3 carácteres.",
      })
      .max(255, {
        message: "O email deve conter no máximo 255 carácteres.",
      }),
    password: z
      .string({
        required_error: "Campo obrigatório.",
      })
      .min(8, {
        message: "A senha deve conter pelo menos 8 carácteres.",
      })
      .max(30, {
        message: "A senha deve conter no máximo 30 carácteres.",
      })
      .refine(
        (data) => {
          const lowerCaseLetters = new RegExp("[a-z]")
          return lowerCaseLetters.test(data)
        },
        {
          message: "A senha deve conter pelo menos uma letra minúscula.",
        }
      )
      .refine(
        (data) => {
          const upperCaseLetters = new RegExp("[A-Z]")
          return upperCaseLetters.test(data)
        },
        {
          message: "A senha deve conter pelo menos uma letra maiúscula.",
        }
      )
      .refine(
        (data) => {
          const numbers = new RegExp("[0-9]")
          return numbers.test(data)
        },
        {
          message: "A senha deve conter pelo menos um número.",
        }
      )
      .refine(
        (data) => {
          const specialCharacters = new RegExp('[!@#$%^&*(),.?":{}|<>]')
          return specialCharacters.test(data)
        },
        {
          message: "A senha deve conter pelo menos um caractere especial.",
        }
      ),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  credentialsIsLoading.value = true
  const promise = () => new Promise((resolve) => resolve(authStore.signUpWithCredentials(values)))

  toast.promise(promise, {
    loading: "Aguardando...",
    success: (data) => {
      credentialsIsLoading.value = false
      router.push({ name: "email-confirmation", query: { type: "register", email: data.user.email } })
      return "Cadastro realizado com sucesso!"
    },
    error: (data: Error) => {
      credentialsIsLoading.value = false
      const error = data.message
      return error ?? "Ocorreu um erro ao realizar o cadastro."
    },
  })
})

const handleGoogleLogin = async () => {
  googleIsLoading.value = true

  await authStore.loginWithGoogle()

  googleIsLoading.value = false
}
</script>

<template>
  <AuthWrapper title="Crie sua conta agora" subtitle="Comece a gerir suas vendas com facilidade.">
    <div class="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
      <Button variant="default" @click="handleGoogleLogin" :disabled="isDisabled">
        <Loader v-if="googleIsLoading" class="mr-2 h-4 w-4 animate-spin" />
        <GoogleLogo v-else class="mr-2 h-4 w-4" name="Google Logo" />
        <span>Entrar com Google</span>
      </Button>
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-gray-50 px-2 text-muted-foreground"> Ou cadastre-se com </span>
        </div>
      </div>
      <form @submit="onSubmit" class="space-y-4">
        <div class="flex max-sm:flex-col gap-4">
          <FormField class="flex-grow" v-slot="{ componentField }" name="first_name">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Jhon" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField class="flex-grow" v-slot="{ componentField }" name="last_name">
            <FormItem>
              <FormLabel>Sobrenome</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Jhoe" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
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
                <button type="button" class="absolute inset-y-0 right-0 flex items-center px-2" @click="pwdInputType = pwdInputType === 'password' ? 'text' : 'password'">
                  <EyeOpen v-if="pwdInputType === 'text'" class="h-4 w-4" />
                  <EyeClosed v-else class="h-4 w-4" />
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="w-full flex justify-end">
          <Button type="submit" :disabled="credentialsIsLoading">
            <Loader v-if="credentialsIsLoading" class="mr-2 h-4 w-4 animate-spin" />
            Cadastrar
          </Button>
        </div>
      </form>
      <p class="text-center text-sm text-gray-500">
        Já tem uma conta?
        <a href="/auth/login" class="font-semibold text-gray-500 transition-colors hover:text-black"> Login </a>
        .
      </p>
    </div>
  </AuthWrapper>
</template>
