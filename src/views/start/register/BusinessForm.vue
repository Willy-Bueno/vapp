<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import * as z from 'zod'
import validator from 'validator'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'

import { cn } from '@/lib/utils'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useBusinessStore } from '@/stores/business'
import { useUsersToBusinessStore } from '@/stores/usersToBusiness'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { Loader2 } from 'lucide-vue-next'

const router = useRouter()

const authStore = useAuthStore()
const profileStore = useProfileStore()
const businessStore = useBusinessStore()
const usersToBusinessStore = useUsersToBusinessStore()

const isLoading = ref(false)
const businessForm = ref({
  name: '',
  email: '',
  phone: '',
})

const isDisabled = computed(() =>  !businessForm.value.name || !businessForm.value.email || !businessForm.value.phone)

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

async function handleSubmit() {
  isLoading.value = true

  const result = businessFormSchema.safeParse(businessForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    return
  }


  const promise = () => new Promise((resolve) => resolve(businessStore.createBusiness(businessForm.value)
  .then((data) => {
    profileStore.updateProfile({
      id: authStore.session?.user.id as string,
      business: data.id,
    })

    usersToBusinessStore.addUserToBusiness({
      user_id: authStore.session!.user.id,
      business_id: data.id,
    })
  })));

  toast.promise(promise, {
    loading: 'Aguardando...',
    success: () => 'Dados salvos com sucesso!',
    error: () => 'Ocorreu um erro ao salvar os dados.'
  })

  setTimeout(() => router.push({ name: 'dashboard' }), 2000)
  isLoading.value = false
}

onMounted(async () => {
  await usersToBusinessStore.getBusinessByUserId(authStore.session!.user.id)
  if (usersToBusinessStore.business) router.push({ name: 'dashboard' })
})
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
      <Button type="submit" :disabled="isDisabled" class="disabled:hover:cursor-not-allowed">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Continuar
      </Button>
    </div>
  </form>
</template>
