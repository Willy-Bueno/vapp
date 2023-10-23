<script setup lang="ts">
import { ref } from 'vue'

import * as z from 'zod'
import validator from 'validator'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'

import { cn } from '@/lib/utils'

import { useCompanyStore } from '@/stores/company'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import Loader from '@/components/icons/Loader.vue'

const router = useRouter()

const companyStore = useCompanyStore()

const isLoading = ref(false)
const businessForm = ref({
  name: '',
  email: '',
  phone: '',
})

const businessFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres.',
    })
    .max(30, {
      message: 'O nome deve ter no máximo 30 caracteres.',
    }),

  email: z
    .string()
    .email({
      message: 'O email deve ser válido.',
    }),

  phone: z
    .string()
    .refine(validator.isMobilePhone, {
      message: 'O telefone deve ser válido.',
    })
})

type AccountFormValues = z.infer<typeof businessFormSchema>
const errors = ref<z.ZodFormattedError<AccountFormValues> | null>(null)

function validate(): boolean {
  const result = businessFormSchema.safeParse(businessForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    return false
  }
  return true
}

async function handleSubmit() {
  isLoading.value = true

  const isValid = validate()

  if (!isValid) {
    isLoading.value = false
    return
  }

  const promise = () => new Promise((resolve) => resolve(companyStore.createCompany(businessForm.value)))

  toast.promise(promise, {
    loading: 'Aguardando...',
    success: () => {
      isLoading.value = false
      router.push({ name: 'settings' })
      return 'Dados salvos com sucesso!'
    },
    error: () => {
      isLoading.value = false
      return 'Ocorreu um erro ao salvar os dados.'
    }
  })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="grid gap-2">
      <Label for="name" :class="cn('text-sm', errors?.name && 'text-destructive')">
        Nome
      </Label>
      <Input id="name" v-model="businessForm.name" placeholder="Nome da empresa" />
      <div v-if="errors?.name" class="text-sm text-destructive">
        <span v-for="error in errors.name._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="email" :class="cn('text-sm', errors?.email && 'text-destructive')">
        Email
      </Label>
      <Input id="email" v-model="businessForm.email" placeholder="Email" />
      <div v-if="errors?.email" class="text-sm text-destructive">
        <span v-for="error in errors.email._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="phone" :class="cn('text-sm', errors?.phone && 'text-destructive')">
        Telefone
      </Label>
      <Input id="phone" v-model="businessForm.phone" placeholder="Telefone" />
      <div v-if="errors?.phone" class="text-sm text-destructive">
        <span v-for="error in errors.phone._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="flex justify-end">
      <Button type="submit" class="disabled:hover:cursor-not-allowed" :disabled="isLoading">
        <Loader v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Continuar
      </Button>
    </div>
  </form>
</template>
