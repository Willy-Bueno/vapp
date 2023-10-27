<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { toast } from 'vue-sonner'
import * as z from 'zod'

import { useUserStore } from '@/stores/user'

import { cn } from '@/lib/utils'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import Loader from '@/components/icons/Loader.vue'

const isSubmitting = ref(false)
const isLoading = ref(false)
const accountForm = ref({
  id: '',
  name: '',
  email: '',
})

const userStore = useUserStore()

const accountFormSchema = z.object({
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
    })
})

type AccountFormValues = z.infer<typeof accountFormSchema>
const errors = ref<z.ZodFormattedError<AccountFormValues> | null>(null)

function validate (): boolean {
  const result = accountFormSchema.safeParse(accountForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    return false
  }
  return true
}

function handleSubmit() {
  isSubmitting.value = true
  const isValid = validate()
  if (!isValid) {
    isSubmitting.value = false
    return
  }
  const promise = () => new Promise(resolve => resolve(userStore.updateUser(accountForm.value)))
  isValid &&
    toast.promise(promise, {
      loading: 'Atualizando conta...',
      success: () => {
        isSubmitting.value = false
        return 'Conta atualizada com sucesso!'
      },
      error: () => {
        isSubmitting.value = false
        return 'Ocorreu um erro ao atualizar a conta.'
      },
    })
}

onMounted(async () => {
  isLoading.value = true
  await userStore.getUser()
  if (userStore.user) {
    accountForm.value = {
      id: userStore.user.id,
      name: userStore.user.name,
      email: userStore.user.email,
    }
  }
  isLoading.value = false
})
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Atualize as configurações da sua conta.
    </p>
  </div>
  <form v-if="!isLoading" class="space-y-8" @submit.prevent="handleSubmit">
    <div class="grid gap-2">
      <Label for="name" :class="cn('text-sm', errors?.name && 'text-destructive')">
        Nome
      </Label>
      <Input name="name" v-model="accountForm.name" placeholder="Nome completo" class="md:max-w-md" :disabled="isSubmitting" />
      <span class="text-muted-foreground text-sm">
        Este é o nome que será exibido no seu perfil.
      </span>
      <div v-if="errors?.name" class="text-sm text-destructive">
        <span v-for="error in errors.name._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="email" :class="cn('text-sm', errors?.email && 'text-destructive')">
        Email
      </Label>
      <Input name="email" v-model="accountForm.email" placeholder="Email" class="md:max-w-2xl" disabled />
      <span class="text-muted-foreground text-sm">
        Ainda não é possível alterar o email.
      </span>
      <div v-if="errors?.email" class="text-sm text-destructive">
        <span v-for="error in errors.email._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="flex justify-start">
      <Button type="submit" :disabled="isSubmitting">
        <Loader v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        Atualizar conta
      </Button>
    </div>
  </form>
  <div v-else class="space-y-8">
    <div class="grid gap-2">
      <Skeleton class="h-4 w-24" />
      <Skeleton class="h-9 w-full md:max-w-md" />
      <Skeleton class="h-4 w-full max-w-md" />
    </div>
    <div class="grid gap-2">
      <Skeleton class="h-4 w-24" />
      <Skeleton class="h-9 w-full md:max-w-2xl" />
      <Skeleton class="h-4 w-full max-w-lg" />
    </div>
    <div class="flex justify-start">
      <Skeleton class="h-9 w-32" />
    </div>
  </div>
</template>
