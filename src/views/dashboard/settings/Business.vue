<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { Loader2 } from 'lucide-vue-next'

import * as z from 'zod'
import validator from 'validator'
import { toast } from 'vue-sonner'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useBusinessStore } from '@/stores/business'

import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const businessStore = useBusinessStore()

const isLoading = ref(false)
const businessForm = ref({
  id: '',
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

function handleSubmit() {
  isLoading.value = true
  const result = businessFormSchema.safeParse(businessForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    return
  }

  const promise = () => new Promise((resolve) => resolve(businessStore.updateBusiness(businessForm.value)))

  toast.promise(promise, {
    loading: 'Aguardando...',
    success: () => 'Dados salvos com sucesso!',
    error: () => 'Ocorreu um erro ao salvar os dados.'
  })

  isLoading.value = false
}

onMounted(async () => {
  if (!businessStore.business) {
    if (!authStore.session) await authStore.fetchSession()
    if (!profileStore.profile && authStore.session) await profileStore.getProfileById(authStore.session.user.id)
    if (profileStore.profile && profileStore.profile.business && profileStore.profile.business.id) await businessStore.getBusinessById(profileStore.profile.business.id)
  }

  if (businessStore.business) {
    businessForm.value = {
      id: businessStore.business.id,
      name: businessStore.business.name,
      email: businessStore.business.email,
      phone: businessStore.business.phone,
    }
  }
})
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Atualize as configurações da sua empresa.
    </p>
  </div>
  <form class="space-y-8" @submit.prevent="handleSubmit">
    <div class="grid gap-2">
      <Label for="name" :class="cn('text-sm', errors?.name && 'text-destructive')">
        Nome
      </Label>
      <Input id="name" v-model="businessForm.name" placeholder="Nome da empresa" class="max-w-md" />
      <span class="text-muted-foreground text-sm">
        Este é o nome da sua empresa.
      </span>
      <div v-if="errors?.name" class="text-sm text-destructive">
        <span v-for="error in errors.name._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="email" :class="cn('text-sm', errors?.email && 'text-destructive')">
        Email
      </Label>
      <Input id="email" v-model="businessForm.email" placeholder="Email" />
      <span class="text-muted-foreground text-sm">
        Email comercial da empresa. Você receberá notificações e alertas neste email.
      </span>
      <div v-if="errors?.email" class="text-sm text-destructive">
        <span v-for="error in errors.email._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="phone" :class="cn('text-sm', errors?.phone && 'text-destructive')">
        Telefone
      </Label>
      <Input id="phone" v-model="businessForm.phone" placeholder="Telefone" class="max-w-xs" />
      <span class="text-muted-foreground text-sm">
        Telefone comercial da empresa.
      </span>
      <div v-if="errors?.phone" class="text-sm text-destructive">
        <span v-for="error in errors.phone._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="flex justify-start">
      <Button type="submit">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Atualizar empresa
      </Button>
    </div>
  </form>
</template>
