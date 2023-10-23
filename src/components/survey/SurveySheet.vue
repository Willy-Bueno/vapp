<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { toast } from 'vue-sonner'

import * as z from 'zod'
import { cn } from '@/lib/utils'
import { useRouter } from 'vue-router'

import { useSurveyStore } from '@/stores/survey'
import { useCompanyStore } from '@/stores/company'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Loader from '@/components/icons/Loader.vue'

const router = useRouter()

const surveyStore = useSurveyStore()
const companyStore = useCompanyStore()

const isSubmitting = ref(false)
const surveyForm = ref({
  title: '',
  description: '',
  company_id: '',
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

function validate () {
  const result = surveySchema.safeParse(surveyForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    return false
  }
  return true
}

function handleSubmit() {
  isSubmitting.value = true

  if (!validate()) {
    isSubmitting.value = false
    return
  }

  const promise = () => new Promise((resolve) => resolve(surveyStore.createSurvey(surveyForm.value)))

  toast.promise(promise, {
    loading: 'Criando questionário...',
    success: () => {
      isSubmitting.value = false
      surveyStore.survey && router.push({ name: 'survey', params: { id: surveyStore.survey.id } })
      return 'Questionário criado com sucesso!'
    },
    error: () => {
      isSubmitting.value = false
      return 'Erro ao criar questionário.'
    },
  })
}

onMounted(async () => {
  await companyStore.getCompany()
  surveyForm.value.company_id = companyStore.company?.id as string
})
</script>

<template>
  <Sheet >
    <SheetTrigger as-child>
      <Button variant="default">
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
          <Label for="title" :class="cn('text-sm', errors?.title && 'text-destructive')">
            Título
          </Label>
          <Input name="title" v-model="surveyForm.title" placeholder="Título do seu questionário" class="max-w-md" />
          <span class="text-muted-foreground text-sm">
            Este é o título que será exibido no seu questionário.
          </span>
          <div v-if="errors?.title" class="text-sm text-destructive">
            <span v-for="error in errors.title._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="description" :class="cn('text-sm', errors?.description && 'text-destructive')">
            Descrição
          </Label>
          <Textarea name="description" v-model="surveyForm.description" placeholder="Descrição do seu questionário..." class="max-w-md" />
          <span class="text-muted-foreground text-sm">
            Este é a descrição que será exibido no seu questionário.
          </span>
          <div v-if="errors?.description" class="text-sm text-destructive">
            <span v-for="error in errors.description?._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit" :disabled="isSubmitting">
            <Loader v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            Criar questionário
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
