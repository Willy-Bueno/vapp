<script setup lang="ts">
import { ref, computed } from 'vue'

import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import EyeClosed from '@/components/icons/EyeClosedIcon.vue'
import EyeOpen from '@/components/icons/EyeOpenIcon.vue'
import Loader from '@/components/icons/Loader.vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const credentialsIsLoading = ref(false)
const pwdInputType = ref('password')

const isDisabled = computed(() => credentialsIsLoading.value)

const formSchema = toTypedSchema(z.object({
  password: z
    .string({
      required_error: 'Campo obrigatório.'
    })
    .min(8, {
      message: 'A senha deve conter pelo menos 8 carácteres.'
    })
    .max(30, {
      message: 'A senha deve conter no máximo 30 carácteres.'
    })
    .refine((data) => {
      const lowerCaseLetters = new RegExp('[a-z]')
      return lowerCaseLetters.test(data)
    }, {
      message: 'A senha deve conter pelo menos uma letra minúscula.'
    })
    .refine((data) => {
      const upperCaseLetters = new RegExp('[A-Z]')
      return upperCaseLetters.test(data)
    }, {
      message: 'A senha deve conter pelo menos uma letra maiúscula.'
    })
    .refine((data) => {
      const numbers = new RegExp('[0-9]')
      return numbers.test(data)
    }, {
      message: 'A senha deve conter pelo menos um número.'
    })
    .refine((data) => {
      const specialCharacters = new RegExp('[!@#$%^&*(),.?":{}|<>]')
      return specialCharacters.test(data)
    }, {
      message: 'A senha deve conter pelo menos um caractere especial.'
    }),

  passwordConfirmation: z
    .string({
      required_error: 'Campo obrigatório.'
    })
    .min(8, {
      message: 'A senha deve conter pelo menos 8 carácteres.'
    })
    .max(30, {
      message: 'A senha deve conter no máximo 30 carácteres.'
    })
    .refine((data) => {
      const lowerCaseLetters = new RegExp('[a-z]')
      return lowerCaseLetters.test(data)
    }, {
      message: 'A senha deve conter pelo menos uma letra minúscula.'
    })
    .refine((data) => {
      const upperCaseLetters = new RegExp('[A-Z]')
      return upperCaseLetters.test(data)
    }, {
      message: 'A senha deve conter pelo menos uma letra maiúscula.'
    })
    .refine((data) => {
      const numbers = new RegExp('[0-9]')
      return numbers.test(data)
    }, {
      message: 'A senha deve conter pelo menos um número.'
    })
    .refine((data) => {
      const specialCharacters = new RegExp('[!@#$%^&*(),.?":{}|<>]')
      return specialCharacters.test(data)
    }, {
      message: 'A senha deve conter pelo menos um caractere especial.'
    })
})
.superRefine(({ password, passwordConfirmation }) => {
  if (password !== passwordConfirmation) {
    return {
      message: 'As senhas devem ser iguais.'
    }
  }
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  credentialsIsLoading.value = true

  const promise = () => new Promise(resolve => resolve(authStore.updatePassword(values)))

  toast.promise(promise, {
    loading: 'Aguardando...',
    success: () => {
      credentialsIsLoading.value = false
      return 'Senha atualizada com sucesso!'
    },
    error: (data: Error) => {
      credentialsIsLoading.value = false
      const error = data.message
      return error ?? 'Ocorreu um erro ao atualizar a senha.'
    },
  })
})
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Atualize as sua senha.
    </p>
  </div>
  <form class="mt-8 space-y-8 max-w-sm" @submit="onSubmit">
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
    <FormField v-slot="{ componentField }" name="passwordConfirmation">
      <FormItem>
        <FormLabel>Confirme sua senha</FormLabel>
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
    <Button type="submit">
      <Loader v-if="credentialsIsLoading" class="mr-2 h-4 w-4 animate-spin" :disabled="isDisabled" />
      Atualizar senha
    </Button>
    <Button type="reset" variant="secondary" class="ml-2">
      Resetar
    </Button>
  </form>
</template>
