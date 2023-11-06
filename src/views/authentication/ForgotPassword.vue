<script setup lang="ts">
import { ref, computed } from "vue"

import { toast } from "vue-sonner"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"
import { useRouter } from "vue-router"

import Loader from "@/components/icons/Loader.vue"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import AuthWrapper from "@/views/authentication/AuthWrapper.vue"

import { useAuthStore } from "@/stores/auth"

const authStore = useAuthStore()
const router = useRouter()

const credentialsIsLoading = ref(false)
const googleIsLoading = ref(false)

const isDisabled = computed(() => googleIsLoading.value || credentialsIsLoading.value)

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string({
        required_error: "Campo obrigatório.",
      })
      .email({
        message: "O email deve ser válido.",
      }),
  })
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  credentialsIsLoading.value = true
  const promise = () => new Promise((resolve) => resolve(authStore.forgotPassword(values)))

  toast.promise(promise, {
    loading: "Aguardando...",
    success: (data) => {
      const email = data.email
      router.push({ name: "email-confirmation", query: { type: "recovery", email } })
      credentialsIsLoading.value = false
      return "Email enviado com sucesso!"
    },
    error: (data: Error) => {
      credentialsIsLoading.value = false
      const error = data.message
      return error ?? "Ocorreu um erro ao enviar o email."
    },
  })
})
</script>

<template>
  <AuthWrapper title="Esqueceu sua senha?" subtitle="Digite seu email para receber um link de acesso.">
    <div class="flex flex-col space-y-3 bg-gray-50 px-4 py-8 sm:px-16">
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
        <div class="w-full flex justify-between">
          <Button type="button" variant="link" class="text-sm px-0" @click="$router.push({ name: 'login' })"> Login </Button>
          <Button type="submit" :disabled="isDisabled">
            <Loader v-if="credentialsIsLoading" class="mr-2 h-4 w-4 animate-spin" />
            Enviar
          </Button>
        </div>
      </form>
    </div>
  </AuthWrapper>
</template>
