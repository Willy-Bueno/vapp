<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'

  import * as z from 'zod'
  import { toast } from 'vue-sonner'

  import { useRouter } from 'vue-router'

  import { useParticipantToSurveyStore } from '@/stores/participantsToSurveys'
  import { useQuestionOptionsStore } from '@/stores/questionOptions'
  import { useQuestionStore } from '@/stores/questions'
  import { useResponseStore } from '@/stores/responses'
  import { useSurveyStore } from '@/stores/surveys'

  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
  import { Checkbox } from '@/components/ui/checkbox'
  import { Skeleton } from '@/components/ui/skeleton'
  import { Button } from '@/components/ui/button'
  import { Toggle } from '@/components/ui/toggle'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'

  import { Loader2 } from 'lucide-vue-next'

  import { Question, Option } from '@/models'

  interface QuestionRef extends Question {
    options?: Option[]
    response: {
      optionId?: string
      optionIds?: string[]
      value?: string
    }
  }

  interface Response {
    question: string
    participant: string
    option?: string
    value?: string
  }

  interface UserResponse {
    questionId: string
    optionId?: string
    optionIds?: string[]
    value?: string
  }

  const router = useRouter()

  const participantToSurveyStore = useParticipantToSurveyStore()
  const questionOptionsStore = useQuestionOptionsStore()
  const questionStore = useQuestionStore()
  const responseStore = useResponseStore()
  const surveyStore = useSurveyStore()

  const questions = computed(() => questionStore.questions)
  const options = computed(() => questionOptionsStore.options)

  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const userResponse = ref<UserResponse[]>([])
  const questionsRef = ref<QuestionRef[]>([])

  watch(questionsRef, (value) => {
    value.forEach(question => {
      const userResponseIndex = userResponse.value.findIndex(response => response.questionId === question.id)
      if (userResponseIndex === -1) return

      if (question.type.slug === 'text') {
        userResponse.value[userResponseIndex].value = question.response.value
      } else if (question.type.slug === 'multiple') {
        userResponse.value[userResponseIndex].optionIds = question.response.optionIds
      } else {
        userResponse.value[userResponseIndex].optionId = question.response.optionId
      }
    })
  }, {
    deep: true
  })

  function getOptionsByQuestionId(questionId: string) {
    return options.value.filter(option => {
      const question = option.question as unknown as { id: string }
      return question.id === questionId
    })
  }

  function getQuestionIndexInQuestionsComputed(questionId: string) {
    return questions.value.findIndex(question => question.id === questionId)
  }

  function populate () {
    questions.value.forEach(question => {
      if (question.type.slug === 'text') {
        userResponse.value.push({
          questionId: question.id,
          value: ''
        })
      } else if (question.type.slug === 'multiple') {
        userResponse.value.push({
          questionId: question.id,
          optionIds: []
        })
      } else {
        userResponse.value.push({
          questionId: question.id,
          optionId: ''
        })
      }
    })
  }

  const userResponsesSchema = z.array(z.object({
    questionId: z.string(),
    optionId: z.string().optional().nullable(),
    optionIds: z.array(z.string()).optional().nullable(),
    value: z.string().optional().nullable()
  }).refine(data => {
    const question = questions.value.find(question => question.id === data.questionId)
    if (!question) return false

    if (question.type.slug === 'text' && !question.skip && !data.value) {
      return false
    } else if (question.type.slug === 'multiple' && !question.skip  && !data.optionIds?.length) {
      return false
    } else if (question.type.slug === 'unique' && !question.skip  && !data.optionId) {
      return false
    } else if (question.type.slug === 'scale' && !question.skip  && !data.optionId) {
      return false
    } else {
      return true
    }
  }, {
    message: 'Essa resposta é obrigatória.'
  }))

  type UserResponsesValues = z.infer<typeof userResponsesSchema>
  const errors = ref<z.ZodFormattedError<UserResponsesValues> | null>(null)
  const participantId = router.currentRoute.value.params.participantId as string

  function serialize (): Response[] {
    let responses: Response[] = []

    userResponse.value.forEach(response => {
      const question = questions.value.find(question => question.id === response.questionId)
      if (!question) return

      if (question.type.slug === 'text') {
        responses.push({
          question: response.questionId,
          participant: participantId,
          value: response.value
        })
      } else if (question.type.slug === 'multiple') {
        response.optionIds!.forEach(optionId => {
          responses.push({
            question: response.questionId,
            participant: participantId,
            option: optionId
          })
        })
      } else {
        responses.push({
          question: response.questionId,
          participant: participantId,
          option: response.optionId
        })
      }
    })

    return responses
  }

  function handleSubmit() {
    const result = userResponsesSchema.safeParse(userResponse.value)
    if (!result.success) {
      errors.value = result.error.format()
      return
    }
    isSubmitting.value = true

    const responses = serialize()

    const promise = () => new Promise(resolve => resolve(responseStore.createResponses(responses).then(() => {
      const participantId = router.currentRoute.value.params.participantId as string

      participantToSurveyStore.updateParticipantToSurvey({
        participantId: participantId,
        status: 'completed'
      }).then(() => {
        const interview = router.currentRoute.value.query.interview as string
        if (interview !== 'on-site') {
          router.push({ name: 'thank-you', params: { participantId } })
          return
        } else {
          const surveyId = router.currentRoute.value.params.surveyId as string
          router.push({ name: 'survey-interview-finished', query: { survey: surveyId } })
          return
        }
      })
    })))

    toast.promise(promise, {
      loading: 'Enviando respostas...',
      success: () => 'Respostas enviadas com sucesso!',
      error: () => 'Erro ao enviar respostas.',
    })

    isSubmitting.value = false
  }

  onMounted(async () => {
    isLoading.value = true
    const surveyId = router.currentRoute.value.params.surveyId as string
    if (surveyId) await surveyStore.getSurveyById(surveyId)
    if (surveyId) await questionStore.getQuestionsBySurveyId(surveyId)
    const questionIds = questions.value.map(question => question.id)
    if (surveyId) await questionOptionsStore.getQuestionOptionsByQuestionIds(questionIds)

    questionsRef.value = questions.value.map(question => {
      const options = getOptionsByQuestionId(question.id)
      return {
        ...question,
        options,
        response: {
          optionId: null,
          optionIds: [],
          value: null
        }
      }
    }) as unknown as QuestionRef[]

    populate()
    isLoading.value = false
  })
</script>

<template>
  <div class="flex flex-1 flex-col items-center px-6 py-36 space-y-16 ml-96">
    <div v-if="isLoading" v-for="n in 5" :key="n" class="max-w-2xl w-full flex flex-col gap-2">
      <Skeleton class="w-full h-4" />
      <div class="space-y-2 mt-4">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
        <Skeleton class="h-4 w-[280px]" />
        <Skeleton class="h-4 w-[240px]" />
      </div>
    </div>
    <div v-else v-for="question in questionsRef" class="max-w-2xl w-full flex flex-col gap-2">
      <h1 class="font-medium">
        {{ question.title }}
        <span v-if="question.skip" class="text-muted-foreground text-sm ml-2">(Opcional)</span>
      </h1>
      <div v-if="question.type.slug === 'text'">
        <Input v-model="question.response.value" :placeholder="question.placeholder"
        />
        <div v-if="errors?.[getQuestionIndexInQuestionsComputed(question.id)]" class="text-destructive text-sm mt-2">
          <span v-for="error in errors?.[getQuestionIndexInQuestionsComputed(question.id)]._errors" :key="error">{{ error }}</span>
        </div>
      </div>

      <div v-else-if="question.type.slug === 'multiple'">
        <div class="flex flex-col gap-2">
          <div v-for="option in getOptionsByQuestionId(question.id)" :key="option.id" class="flex items-center justify-start space-x-2">
            <Checkbox :id="option.id" :value="option.id" :checked="question.response.optionIds?.includes(option.id)" @update:checked="((checked: boolean) => {
              return checked ? question.response.optionIds?.push(option.id) : question.response.optionIds?.splice(question.response.optionIds?.findIndex(id => id === option.id), 1)
            })" />
            <Label :for="option.id" class="cursor-pointer">{{ option.title }}</Label>
          </div>
          <div v-if="errors?.[getQuestionIndexInQuestionsComputed(question.id)]" class="text-destructive text-sm mt-2">
            <span v-for="error in errors?.[getQuestionIndexInQuestionsComputed(question.id)]._errors" :key="error">{{ error }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="question.type.slug === 'unique'">
        <RadioGroup
          v-for="option in question.options"
          :key="option.id"
          v-model="question.response.optionId"
          class="flex items-center justify-start space-y-2"
        >
            <RadioGroupItem :id="option.id" :value="option.id"  />
            <Label :for="option.id" class="cursor-pointer">{{ option.title }}</Label>
        </RadioGroup>
        <div v-if="errors?.[getQuestionIndexInQuestionsComputed(question.id)]" class="text-destructive text-sm mt-2">
          <span v-for="error in errors?.[getQuestionIndexInQuestionsComputed(question.id)]._errors" :key="error">{{ error }}</span>
        </div>
      </div>

      <div v-else-if="question.type.slug === 'scale'">
        <div class="flex items-center space-x-2">
            <div v-for="option in getOptionsByQuestionId(question.id)" class="flex gap-2" :key="option.id">
              <Toggle
                variant="outline"
                :value="option.title"
                @update:pressed="(pressed: boolean) => {
                  return pressed ? question.response.optionId = option.id : question.response.optionId = undefined
                }"
                :pressed="question.response.optionId === option.id"
              >
                  <span>{{ option.title }}</span>
              </Toggle>
            </div>
        </div>
        <div v-if="errors?.[getQuestionIndexInQuestionsComputed(question.id)]" class="text-destructive text-sm mt-2">
          <span v-for="error in errors?.[getQuestionIndexInQuestionsComputed(question.id)]._errors" :key="error">{{ error }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-start w-full max-w-2xl">
      <Button v-if="!isLoading" type="button" @click="handleSubmit" :disabled="isSubmitting">
        <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        Enviar
      </Button>
    </div>
  </div>
</template>
