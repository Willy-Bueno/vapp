<script setup lang="ts">
import { ref, onMounted } from "vue"

import * as z from "zod"
import validator from "validator"
import { toast } from "vue-sonner"

import { useCompanyStore } from "@/stores/company"

import { cn } from "@/lib/utils"

import { Skeleton } from "@/components/ui/skeleton"
import Loader from "@/components/icons/Loader.vue"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const companyStore = useCompanyStore()

const isSubmitting = ref(false)
const isLoading = ref(false)
const businessForm = ref({
  name: "",
  email: "",
  phone: "",
})

const businessFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "O nome deve ter pelo menos 2 caracteres.",
    })
    .max(30, {
      message: "O nome deve ter no máximo 30 caracteres.",
    }),

  email: z.string().email({
    message: "O email deve ser válido.",
  }),

  phone: z.string().refine(validator.isMobilePhone, {
    message: "O telefone deve ser válido.",
  }),
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

function handleSubmit() {
  isSubmitting.value = true

  const isValid = validate()

  if (!isValid) {
    isSubmitting.value = false
    return
  }

  const promise = () => new Promise((resolve) => resolve(companyStore.updateCompany(businessForm.value)))

  toast.promise(promise, {
    loading: "Aguardando...",
    success: () => {
      isSubmitting.value = false
      return "Dados salvos com sucesso!"
    },
    error: () => {
      isSubmitting.value = false
      return "Ocorreu um erro ao salvar os dados."
    },
  })
}

onMounted(async () => {
  isLoading.value = true
  await companyStore.getCompany()
  if (companyStore.company)
    businessForm.value = {
      name: companyStore.company.name,
      email: companyStore.company.email,
      phone: companyStore.company.phone,
    }
  isLoading.value = false
})
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">Atualize as configurações da sua empresa.</p>
  </div>
  <form v-if="!isLoading" class="space-y-8" @submit.prevent="handleSubmit">
    <div class="grid gap-2">
      <Label for="name" :class="cn('text-sm', errors?.name && 'text-destructive')"> Nome </Label>
      <Input name="name" v-model="businessForm.name" placeholder="Nome da empresa" class="md:max-w-md" />
      <span class="text-muted-foreground text-sm"> Este é o nome da sua empresa. </span>
      <div v-if="errors?.name" class="text-sm text-destructive">
        <span v-for="error in errors.name._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="email" :class="cn('text-sm', errors?.email && 'text-destructive')"> Email </Label>
      <Input name="email" v-model="businessForm.email" placeholder="Email" class="md:max-w-2xl" />
      <span class="text-muted-foreground text-sm"> Email comercial da empresa. Você receberá notificações e alertas neste email. </span>
      <div v-if="errors?.email" class="text-sm text-destructive">
        <span v-for="error in errors.email._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="phone" :class="cn('text-sm', errors?.phone && 'text-destructive')"> Telefone </Label>
      <Input name="phone" v-model="businessForm.phone" placeholder="Telefone" class="md:max-w-md" />
      <span class="text-muted-foreground text-sm"> Telefone comercial da empresa. </span>
      <div v-if="errors?.phone" class="text-sm text-destructive">
        <span v-for="error in errors.phone._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="flex justify-start">
      <Button type="submit">
        <Loader v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        Atualizar empresa
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
    <div class="grid gap-2">
      <Skeleton class="h-4 w-24" />
      <Skeleton class="h-9 w-full md:max-w-md" />
      <Skeleton class="h-4 w-full max-w-md" />
    </div>
    <div class="flex justify-start">
      <Skeleton class="h-9 w-32" />
    </div>
  </div>
</template>
