<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  import { useQuestionOptionsStore } from '@/stores/questionOptions'
  import { useQuestionStore } from '@/stores/questions'
  import { useResponseStore } from '@/stores/responses'

  import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
  } from '@/components/ui/sheet'
  import {
    Card,
    CardContent
  } from '@/components/ui/card'
  import { Skeleton } from '@/components/ui/skeleton'
  import { Input } from '@/components/ui/input'
  import { Checkbox } from '@/components/ui/checkbox'
  import { Label } from '@/components/ui/label'
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
  import { Toggle } from '@/components/ui/toggle'
  import { Button } from '@/components/ui/button'

  import ThemeSwitcher from '@/components/application/ThemeSwitcher.vue'

  import HomeIcon from '@/components/icons/HomeIcon.vue'
  import VappLogo from '@/components/icons/VappLogo.vue'


  import { ParticipantsToSurveys } from '@/models'

  type Question = {
    id: string
    title: string
    type: string
    value?: string
    options?: Array<{
      id: string
      title: string
      selected: boolean
      value?: string
    }> | undefined
  }

  interface Survey {
    title: string
    description: string
    participant: string
    businessName: string
    questions?: Array<{
      title: string
      type: string
      value?: string | undefined
      options?: Array<{
        id: string
        title: string
        value?: string
        selected: boolean
      }> | undefined
    }> | undefined
  }

  const props = defineProps<{participantToSurvey: ParticipantsToSurveys }>()

  const questionOptionsStore = useQuestionOptionsStore()
  const questionStore = useQuestionStore()
  const responseStore = useResponseStore()

  const surveyId = ref('')
  const participantId = ref('')
  const isLoading = ref(true)
  const surveyResponse = ref<Survey>({
    title: '',
    participant: '',
    description: '',
    businessName: '',
    questions: []
  })

  onMounted(async () => {
    surveyId.value = props.participantToSurvey.survey.id
    participantId.value = props.participantToSurvey.participant.id

    await questionStore.getQuestionsBySurveyId(surveyId.value)
    const questions = questionStore.questions

    await responseStore.getResponsesBySurveyId(surveyId.value)

    if (responseStore.responses) await questionOptionsStore.getQuestionOptionsByQuestionIds(responseStore.responses.map(response => response.question.id))

    const userResponses = responseStore.responses.filter(response => response.participant.id === participantId.value)

    const groupOptionsByQuestion: Question[] = []

    questions.forEach(question => {
      if (!groupOptionsByQuestion.some(q => q.id === question.id)) {

        if (question.type.slug === 'text') {
          groupOptionsByQuestion.push({
            id: question.id,
            title: question.title,
            type: question.type.slug,
            value: ''
          })

          userResponses.forEach(response => {
            if (response.question.id === question.id) {
              const questionIndex = groupOptionsByQuestion.findIndex(q => q.id === question.id)
              groupOptionsByQuestion[questionIndex].value = response.value || 'Nenhuma resposta'
            }
          })
        } else {
          groupOptionsByQuestion.push({
            id: question.id,
            title: question.title,
            type: question.type.slug,
            options: []
          })

          const questionIndex = groupOptionsByQuestion.findIndex(q => q.id === question.id)
          questionOptionsStore.options.forEach(option => {
            if (option.question.id === question.id) {
              groupOptionsByQuestion[questionIndex].options?.push({
                id: option.id,
                title: option.title,
                value: userResponses.some(response => response.option && response.option.id === option.id) ? option.id : '',
                selected: userResponses.some(response => response.option && response.option.id === option.id)
              })
            }
          })
        }
      }
    })

    surveyResponse.value = {
      title: props.participantToSurvey.survey.title,
      participant: `${props.participantToSurvey.participant.first_name} ${props.participantToSurvey.participant.last_name}`,
      description: props.participantToSurvey.survey.description,
      businessName: props.participantToSurvey.survey.business.name,
      questions: groupOptionsByQuestion
    }

    isLoading.value = false
  })
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Card>
        <CardContent class="grid grid-cols-2 p-6 hover:cursor-pointer">
          <div class="space-y-2 col-span-2">
            <div class="flex justify-between">
              <h1 class="text-lg font-bold">{{ `${participantToSurvey.participant.first_name} ${participantToSurvey.participant.last_name} - ${participantToSurvey.survey.title}` }}</h1>
            </div>
              <p class="text-sm text-muted-foreground">
                Clique para visualizar as respostas dessa entrevista.
              </p>
          </div>
        </CardContent>
      </Card>
    </SheetTrigger>
    <SheetContent class="min-w-full w-full min-h-fit overflow-y-scroll">
      <div class="fixed min-h-screen h-full w-96 border-r p-6 flex flex-col space-y-16">
        <div class="flex flex-1 justify-start p-4">
            <SheetClose class="flex items-center mr-2">
              <Button variant="outline">
                  <HomeIcon class="h-4 w-4 text-muted-foreground" />
              </Button>
            </SheetClose>
          <ThemeSwitcher />
        </div>
        <div class="flex flex-col justify-between h-full">
          <div v-if="isLoading" class="w-full h-fit flex flex-col justify-center items-start p-4 space-y-4">
            <div class="flex items-center justify-start">
              <Skeleton class="w-6 h-6 mr-2 rounded-full" />
              <Skeleton class="w-24 h-6" />
            </div>
            <div class="flex flex-col space-y-4">
              <Skeleton class="w-80 h-8" />
              <Skeleton class="w-52 h-8" />
              <Skeleton class="w-44 h-8" />
            </div>
          </div>
          <div v-else class="w-full h-fit flex flex-col justify-center items-start p-4 space-y-4">
            <div class="flex items-center justify-start">
              <VappLogo class="w-4 h-4 mr-2" />
              {{ surveyResponse.businessName }}
            </div>
            <h1 class="font-bold text-3xl">{{ surveyResponse.title }}</h1>
            <p class="text-sm text-muted-foreground">- {{ surveyResponse.participant }}</p>
          </div>
          <span class="flex justify-start items-center text-muted-foreground px-4">criado com <VappLogo class="w-4 h-4 ml-2 mr-1" /> Vendas App</span>
        </div>
      </div>
      <div class="flex flex-1 flex-col items-center px-6 py-36 space-y-16 ml-96 pointer-events-none">
        <div v-if="isLoading" v-for="n in 5" :key="n" class="max-w-2xl w-full flex flex-col gap-2">
          <Skeleton class="w-full h-4" />
          <div class="space-y-2 mt-4">
            <Skeleton class="h-4 w-[250px]" />
            <Skeleton class="h-4 w-[200px]" />
            <Skeleton class="h-4 w-[280px]" />
            <Skeleton class="h-4 w-[240px]" />
          </div>
        </div>
        <div v-else v-for="question in surveyResponse.questions" class="max-w-2xl w-full flex flex-col gap-2">
          <h1 class="font-medium">
            {{ question.title }}
          </h1>
          <div v-if="question.type === 'text'">
            <Input v-model="question.value" />
          </div>

          <div v-else-if="question.type === 'multiple'">
            <div class="flex flex-col gap-2">
              <div v-for="option in question.options" :key="option.title" class="flex items-center justify-start space-x-2">
                <Checkbox :id="option.title" :value="option.title" :checked="option.selected" />
                <Label :for="option.title" class="cursor-pointer">{{ option.title }}</Label>
              </div>
            </div>
          </div>

          <div v-else-if="question.type === 'unique'">
            <RadioGroup
              v-for="option in question.options"
              :key="option.title"
              v-model="option.value"
              class="flex items-center justify-start space-y-2"
            >
                <RadioGroupItem :id="option.title" :value="option.id" />
                <Label :for="option.title" class="cursor-pointer">{{ option.title }}</Label>
            </RadioGroup>
          </div>

          <div v-else-if="question.type === 'scale'">
            <div class="flex items-center space-x-2">
                <div v-for="option in question.options" class="flex gap-2" :key="option.title">
                  <Toggle
                    :class="option.selected ? 'border-2 border-zinc-950' : 'border-none'"
                    :value="option.id"
                    :pressed="option.selected"
                  >
                      <span>{{ option.title }}</span>
                  </Toggle>
                </div>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
