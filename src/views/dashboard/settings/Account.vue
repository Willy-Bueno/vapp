<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { Loader2 } from 'lucide-vue-next'

import * as z from 'zod'
import { cn } from '@/lib/utils'
import { toast } from 'vue-sonner'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'


const authStore = useAuthStore()
const profileStore = useProfileStore()

const isLoading = ref(false)
const accountForm = ref({
  id: '',
  full_name: '',
  email: '',
})

const accountFormSchema = z.object({
  full_name: z
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

function handleSubmit() {
  isLoading.value = true
  const result = accountFormSchema.safeParse(accountForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    return
  }

  const promise = () => new Promise((resolve) => resolve(profileStore.updateProfile(accountForm.value)))

  toast.promise(promise, {
    loading: 'Aguardando...',
    success: () => 'Dados salvos com sucesso!',
    error: () => 'Ocorreu um erro ao salvar os dados.'
  })
  isLoading.value = false
}

onMounted(async () => {
  if (!profileStore.profile) await profileStore.getProfileById(authStore.session?.user.id as string)

  accountForm.value = {
    id: profileStore.profile?.id as string,
    full_name: profileStore.profile?.full_name as string,
    email: profileStore.profile?.email as string,
  }
})
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Atualize as configurações da sua conta.
    </p>
  </div>
  <form class="space-y-8" @submit.prevent="handleSubmit">
    <div class="grid gap-2">
      <Label for="name" :class="cn('text-sm', errors?.full_name && 'text-destructive')">
        Nome
      </Label>
      <Input id="name" v-model="accountForm.full_name" placeholder="Nome completo" class="max-w-md" />
      <span class="text-muted-foreground text-sm">
        Este é o nome que será exibido no seu perfil.
      </span>
      <div v-if="errors?.full_name" class="text-sm text-destructive">
        <span v-for="error in errors.full_name._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="email" :class="cn('text-sm', errors?.email && 'text-destructive')">
        Email
      </Label>
      <Input id="email" v-model="accountForm.email" placeholder="Email" disabled />
      <span class="text-muted-foreground text-sm">
        Ainda não é possível alterar o email.
      </span>
      <div v-if="errors?.email" class="text-sm text-destructive">
        <span v-for="error in errors.email._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="flex justify-start">
      <Button type="submit">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Atualizar conta
      </Button>
    </div>
  </form>
</template>
