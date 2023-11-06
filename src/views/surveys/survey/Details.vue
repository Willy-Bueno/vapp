<script setup lang="ts">
import { ref, computed, onMounted } from "vue"

import { useRouter } from "vue-router"
import { toast } from "vue-sonner"
import { cn } from "@/lib/utils"
import * as z from "zod"

import { useSurveyStatusStore } from "@/stores/status"
import { useSurveyStore } from "@/stores/survey"

import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import Loader from "@/components/icons/Loader.vue"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Tables } from "@/types"

type Survey = (Tables<"surveys"> & { questions: Tables<"questions">[] & { options: Tables<"options">[] | null } }) | (null & { survey_status: Tables<"survey_status"> }) | null

const router = useRouter()

const surveyStatusStore = useSurveyStatusStore()
const surveyStore = useSurveyStore()

const isSubmitting = ref(false)
const isLoading = ref(false)
const survey = ref({
  id: "",
  title: "",
  description: "",
  survey_status_id: "",
})

const statusOptions = computed(
  () =>
    surveyStatusStore.surveyStatus?.map((status) => ({
      value: status.id,
      label: status.title,
    })) || []
)

const srv = computed(() => surveyStore.survey as Survey | null)

const surveySchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "O nome deve ter pelo menos 2 caracteres.",
    })
    .max(50, {
      message: "O nome deve ter no máximo 50 caracteres.",
    }),

  description: z
    .string()
    .min(2, {
      message: "A descrição deve ter pelo menos 2 caracteres.",
    })
    .max(300, {
      message: "A descrição deve ter no máximo 300 caracteres.",
    }),

  survey_status_id: z.string().refine(
    (value) => {
      return !!statusOptions.value.find((option) => option.value === value)
    },
    {
      message: "Selecione uma opção.",
    }
  ),
})

type SurveyFormValues = z.infer<typeof surveySchema>
const errors = ref<z.ZodFormattedError<SurveyFormValues> | null>(null)

function validate() {
  const result = surveySchema.safeParse(survey.value)
  if (!result.success) {
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

  const promise = () => new Promise((resolve) => resolve(surveyStore.updateSurvey(survey.value)))

  toast.promise(promise, {
    loading: "Atualizando questionário...",
    success: () => {
      isSubmitting.value = false
      return "Questionário atualizado com sucesso!"
    },
    error: () => {
      isSubmitting.value = false
      return "Ocorreu um erro ao atualizar o questionário."
    },
  })
}

onMounted(async () => {
  isLoading.value = true
  const surveyId = router.currentRoute.value.params.id as string
  await surveyStatusStore.getSurveyStatus()
  await surveyStore.getSurvey(surveyId)
  if (surveyStore.survey) {
    survey.value = {
      id: surveyStore.survey.id,
      title: surveyStore.survey.title,
      description: surveyStore.survey.description,
      survey_status_id: surveyStore.survey.survey_status_id,
    }
  }
  isLoading.value = false
})
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">Aqui você pode atualizar informações basicas do seu questionário antes de habilita-lo.</p>
  </div>
  <form v-if="!isLoading" class="space-y-8">
    <div class="grid gap-2">
      <Label for="title" :class="cn('text-sm', errors?.title && 'text-destructive')"> Título </Label>
      <Input id="title" v-model="survey.title" placeholder="Título do seu questionário" class="md:max-w-md" />
      <span class="text-muted-foreground text-sm"> Este é o nome que será exibido no seu questionário. </span>
      <div v-if="errors?.title" class="text-sm text-destructive">
        <span v-for="error in errors.title._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="description" :class="cn('text-sm', errors?.description && 'text-destructive')"> Descrição </Label>
      <Textarea id="description" v-model="survey.description" placeholder="Descrição do seu questionário..." class="md:max-w-md" />
      <span class="text-muted-foreground text-sm"> Este é a descrição que será exibido no seu questionário. </span>
      <div v-if="errors?.description" class="text-sm text-destructive">
        <span v-for="error in errors.description?._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="status" :class="cn('text-sm', errors?.survey_status_id && 'text-destructive')"> Status </Label>
      <Select id="status" :default-value="survey.survey_status_id" v-model="survey.survey_status_id">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Opções</SelectLabel>
            <SelectItem :disabled="srv?.questions?.length === 0" v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <span class="text-muted-foreground text-sm"> Esse é o status do seu questionário. </span>
      <span class="text-muted-foreground text-sm"> Obs: Não é possivel publicar um questionário que não tenha nenhuma questão. </span>
      <div v-if="errors?.survey_status_id" class="text-sm text-destructive">
        <span v-for="error in errors.survey_status_id?._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <Button type="submit" @click.prevent="handleSubmit" :disabled="isSubmitting">
      <Loader v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
      Atualizar questionário
    </Button>
  </form>
  <div v-else class="space-y-8">
    <div class="grid gap-2">
      <Skeleton class="h-4 w-24" />
      <Skeleton class="h-9 w-full md:max-w-md" />
      <Skeleton class="h-4 w-full max-w-xs" />
    </div>
    <div class="grid gap-2">
      <Skeleton class="h-4 w-24" />
      <Skeleton class="h-16 w-full md:max-w-md" />
      <Skeleton class="h-4 w-full max-w-sm" />
    </div>
    <div class="flex justify-start">
      <Skeleton class="h-9 w-48" />
    </div>
  </div>
</template>
