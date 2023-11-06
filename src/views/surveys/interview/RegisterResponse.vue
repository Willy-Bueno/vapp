<script setup lang="ts">
import { ref, onMounted } from "vue"

import { toast } from "vue-sonner"
import * as z from "zod"

import { useRouter } from "vue-router"

import { useSurveyStore } from "@/stores/survey"
import { useAnswerStore } from "@/stores/answer"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import Loader from "@/components/icons/Loader.vue"

import { AnswerData } from "@/lib/dtos"

import { Tables } from "@/types"

type Survey =
  | (Tables<"surveys"> & {
      questions: Array<Tables<"questions"> & { options?: Array<Tables<"options">> } & { question_types: Tables<"question_types"> }>
    })
  | null

type Response = {
  [key: string]: {
    question_id: string
    required: boolean
    type: string
    answer_text: string
    answer_unique_option: string
    answer_multiple_options: {
      [key: string]: boolean
    }
  }
}

const router = useRouter()

const surveyStore = useSurveyStore()
const answerStore = useAnswerStore()

const isLoading = ref(false)
const isSubmitting = ref(false)
const survey = ref<Survey>(null)
const response = ref<Response>({})

const responseSchema = z.record(
  z
    .object({
      question_id: z.string(),
      required: z.boolean(),
      type: z.string(),
      answer_text: z.string(),
      answer_unique_option: z.string().optional(),
      answer_multiple_options: z.record(z.boolean()).optional(),
    })
    .refine(
      (data) => {
        if (data.required) {
          if (data.type === "text" && data.answer_text === "") {
            return false
          } else if (data.type === "unique" && data.answer_unique_option === "") {
            return false
          } else if (data.type === "multiple" && data.answer_multiple_options) {
            return !!Object.keys(data.answer_multiple_options).find((key) => data.answer_multiple_options && data.answer_multiple_options[key] === true)
          } else {
            return true
          }
        } else {
          return true
        }
      },
      {
        message: "Este campo é obrigatório.",
      }
    )
)

type SurveyValues = z.infer<typeof responseSchema>
const errors = ref<z.ZodFormattedError<SurveyValues> | null>(null)

function validate(): boolean {
  const result = responseSchema.safeParse(response.value)
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

  const response_id = router.currentRoute.value.params.responseId as string

  console.log(new AnswerData(response.value, response_id).result)

  const promise = () =>
    new Promise((resolve) =>
      resolve(
        answerStore.createAnswer(new AnswerData(response.value, response_id).result).then(() => {
          if (router.currentRoute.value.query.interview === "on-site") {
            router.push({ name: "finished", params: { id: survey.value!.id } })
            return
          } else {
            router.push({ name: "congrats" })
            return
          }
        })
      )
    )

  toast.promise(promise, {
    loading: "Salvando as respostas...",
    success: () => {
      isSubmitting.value = false
      return "Respostas salvas com sucesso!"
    },
    error: () => {
      isSubmitting.value = false
      return "Ocorreu um erro ao salvar as respostas."
    },
  })
}

onMounted(async () => {
  isLoading.value = true
  const surveyId = router.currentRoute.value.params.id as string
  await surveyStore.getSurvey(surveyId)
  survey.value = surveyStore.survey as Survey
  survey.value?.questions.forEach((question) => {
    response.value[question.id] = {
      question_id: question.id,
      required: question.required,
      type: question.question_types.slug,
      answer_text: "",
      answer_unique_option: "",
      answer_multiple_options:
        (question.question_types.slug === "multiple" &&
          question.options &&
          question.options.reduce(
            (acc, option) => {
              acc[option.id] = false
              return acc
            },
            {} as { [key: string]: boolean }
          )) ||
        {},
    }
  })
  isLoading.value = false
})
</script>

<template>
  <div v-if="isLoading" class="max-w-2xl w-full flex flex-col gap-2">
    <div v-for="n in 5" :key="n">
      <Skeleton class="w-full h-4" />
      <div class="space-y-2 mt-4">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
        <Skeleton class="h-4 w-[280px]" />
        <Skeleton class="h-4 w-[240px]" />
      </div>
    </div>
  </div>
  <div v-else class="max-w-2xl w-full flex flex-col gap-2">
    <div v-for="question in survey?.questions" :key="question.id">
      <h1 class="font-medium">
        {{ `${question.order} - ${question.question_text}` }}
        <span v-if="!question.required" class="text-muted-foreground text-sm ml-2">(Opcional)</span>
      </h1>
      <div v-if="question.question_types.slug === 'text'">
        <Input v-model="response[question.id].answer_text" :placeholder="question.placeholder" />
        <div v-if="errors?.[question.id]" class="text-sm text-destructive">
          <span v-for="error in errors[question.id]?._errors" :key="error">{{ error }}</span>
        </div>
      </div>

      <div v-else-if="question.question_types.slug === 'multiple'">
        <div class="flex flex-col gap-2">
          <div v-for="option in question.options" :key="option.id" class="flex items-center justify-start space-x-2">
            <Checkbox
              type=""
              :id="option.id"
              :value="option.id"
              :checked="response[question.id]?.answer_multiple_options?.[option.id]"
              @update:checked="
                (checked: boolean) => {
                  return checked ? (response[question.id].answer_multiple_options[option.id] = true) : (response[question.id].answer_multiple_options[option.id] = false)
                }
              "
            />
            <Label :for="option.id" class="cursor-pointer">{{ option.option_text }}</Label>
          </div>
          <div v-if="errors?.[question.id]" class="text-sm text-destructive">
            <span v-for="error in errors[question.id]?._errors" :key="error">{{ error }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="question.question_types.slug === 'unique'">
        <RadioGroup v-for="option in question.options" :key="option.id" class="flex items-center justify-start space-y-2" v-model="response[question.id].answer_unique_option">
          <RadioGroupItem :id="option.id" :value="option.id" />
          <Label :for="option.id" class="cursor-pointer">{{ option.option_text }}</Label>
        </RadioGroup>
        <div v-if="errors?.[question.id]" class="text-sm text-destructive">
          <span v-for="error in errors[question.id]?._errors" :key="error">{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-start w-full max-w-2xl">
    <Button v-if="!isLoading" type="button" :disabled="isSubmitting" @click="handleSubmit">
      <Loader v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
      Enviar
    </Button>
  </div>
</template>
