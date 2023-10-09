<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { toast } from 'vue-sonner'

import * as z from 'zod'
import { cn } from '@/lib/utils'

import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useSurveyStore } from '@/stores/surveys'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
Sheet,
SheetContent,
SheetDescription,
SheetFooter,
SheetHeader,
SheetTitle,
SheetTrigger,
} from '@/components/ui/sheet'

import { Loader2 } from 'lucide-vue-next'

const router = useRouter()

const authStore = useAuthStore()
const profileStore = useProfileStore()
const surveyStore = useSurveyStore()

const isLoading = ref(false)
const surveyForm = ref({
  title: '',
  description: '',
  status: 'unpublished',
  business: ''
})

const surveySchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres.',
    })
    .max(60, {
      message: 'O nome deve ter no máximo 60 caracteres.',
    }),

  description: z
    .string()
    .min(2, {
      message: 'A descrição deve ter pelo menos 2 caracteres.',
    })
    .max(300, {
      message: 'A descrição deve ter no máximo 300 caracteres.',
    }),
})

type SurveyFormValues = z.infer<typeof surveySchema>
const errors = ref<z.ZodFormattedError<SurveyFormValues> | null>(null)

function handleSubmit() {
  isLoading.value = true
  const result = surveySchema.safeParse(surveyForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    isLoading.value = false
    return
  }

  const promise = () => new Promise((resolve) => resolve(surveyStore.createSurvey(surveyForm.value).then((data) =>
    router.push({ name: 'survey', params: { id: data.id } })
  )))

  toast.promise(promise, {
    loading: 'Criando questionário...',
    success: () => 'Questionário criado com sucesso!',
    error: () => 'Erro ao criar questionário.',
  })

  isLoading.value = false
}

onMounted(async () => {
  if (!authStore.session) await authStore.fetchSession()
  if (authStore.session && authStore.session.user) {
    if (!profileStore.profile) await profileStore.getProfileById(authStore.session.user.id)
    if (profileStore.profile && profileStore.profile.business) surveyForm.value.business = profileStore.profile.business.id
  }
})
</script>

<template>
  <Sheet >
    <SheetTrigger as-child>
      <Button variant="default" class="mt-4 w-full">
        Criar questionário
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Criar novo questionário</SheetTitle>
        <SheetDescription>
          Crie um novo questionário para coletar dados com facilidade.
        </SheetDescription>
      </SheetHeader>
      <form class="grid gap-4 py-4" @submit.prevent="handleSubmit">
        <div class="grid gap-2">
          <Label for="name" :class="cn('text-sm', errors?.title && 'text-destructive')">
            Nome
          </Label>
          <Input id="name" v-model="surveyForm.title" placeholder="Nome do seu questionário" class="max-w-md" />
          <span class="text-muted-foreground text-sm">
            Este é o nome que será exibido no seu questionário.
          </span>
          <div v-if="errors?.title" class="text-sm text-destructive">
            <span v-for="error in errors.title._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="name" :class="cn('text-sm', errors?.description && 'text-destructive')">
            Descrição
          </Label>
          <Textarea id="name" v-model="surveyForm.description" placeholder="Descrição do seu questionário..." class="max-w-md" />
          <span class="text-muted-foreground text-sm">
            Este é a descrição que será exibido no seu questionário.
          </span>
          <div v-if="errors?.description" class="text-sm text-destructive">
            <span v-for="error in errors.description?._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Criar questionário
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
