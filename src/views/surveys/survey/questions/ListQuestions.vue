<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { toast } from 'vue-sonner'
import { cn } from '@/lib/utils'

import { useQuestionStore } from '@/stores/question'
import { useSurveyStore } from '@/stores/survey'

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

import DragHandleDots2 from '@/components/icons/DragHandleDots2Icon.vue'
import TrashIcon from '@/components/icons/TrashIcon.vue'

import AddQuestion from '@/views/surveys/survey/questions/AddQuestion.vue'

import { Tables } from '@/types'

const emit = defineEmits(['change-active-component'])

type Survey = Tables<'surveys'> & { questions: Tables<'questions'>[] & { options: Tables<'options'>[] | null }} | null & { survey_status: Tables<'survey_status'> } | null

const breakpoints = useBreakpoints(breakpointsTailwind)

const smallerMd = breakpoints.isSmaller('md')

const isLoading = ref(false)
const survey = ref<Survey | null>(null)
const surveyOnDrag = ref<Survey | null>(null)

const router = useRouter()

const questionStore = useQuestionStore()
const surveyStore = useSurveyStore()

function changeActiveComponent() {
  emit('change-active-component', {
    component: AddQuestion
  })
}

function onStart() {
  surveyOnDrag.value = JSON.parse(JSON.stringify(survey.value))
}

function onEnd() {
  survey.value?.questions?.forEach((question, index) => {
    question.order = index + 1
  })

  if (JSON.stringify(surveyOnDrag.value?.questions) === JSON.stringify(survey.value?.questions)) {
    return
  }

  const promise = new Promise(resolve => resolve(survey.value?.questions?.map((question) => questionStore.updateOrderQuestion({ id: question.id, order: question.order, updated_at: new Date().toISOString() }))))

  toast.promise(promise, {
    loading: 'Salvando ordem das questões...',
    success: () => 'Ordem das questões salva com sucesso!',
    error: () => 'Não foi possível salvar a ordem das questões.'
  })
}

function deleteQuestion(id: string) {
  const promise = () => new Promise(resolve => resolve(questionStore.deleteQuestion(id).then(() => {
    const surveyId = router.currentRoute.value.params.id as string
    surveyStore.getSurvey(surveyId).then(() => {
      survey.value = surveyStore.survey as Survey

      survey.value?.questions?.forEach((question, index) => {
        question.order = index + 1
      })

      survey.value?.questions?.map((question) => questionStore.updateOrderQuestion({
        id: question.id,
        order: question.order,
        updated_at: new Date().toISOString()
      }))
    })
  })))

  toast.promise(promise, {
    loading: 'Removendo questão...',
    success: () => 'Questão removida com sucesso!',
    error: () => 'Não foi possível remover a questão.'
  })
}

onMounted(async () => {
  isLoading.value = true
  const surveyId = router.currentRoute.value.params.id as string
  await surveyStore.getSurvey(surveyId)
  survey.value = surveyStore.survey as Survey
  isLoading.value = false
})
</script>

<template>
  <Card v-if="isLoading">
    <CardHeader class="flex flex-row items-center justify-start">
      <Skeleton class="h-4 w-96" />
    </CardHeader>
    <Separator />
    <CardContent class="flex flex-col pt-6 justify-center space-y-4">
      <Card v-for="i in 3" :key="i">
        <CardContent class="flex items-center p-4 md:p-6 justify-between gap-2">
          <div class="flex flex-col space-y-2 w-full">
            <Skeleton class="h-4 max-w-md w-full" />
            <Skeleton class="h-4 max-w-sm w-full" />
          </div>
          <div class="hidden md:flex flex-row items-center justify-end space-y-0">
            <Skeleton class="h-9 w-9 ml-2" />
            <Skeleton class="h-9 w-9 ml-2" />
          </div>
        </CardContent>
      </Card>
    </CardContent>
    <CardFooter>
      <Skeleton class="h-8 w-44" />
    </CardFooter>
  </Card>
  <Card v-else-if="survey && survey.questions && !!survey.questions.length">
    <CardHeader class="flex flex-row items-center justify-start space-y-0">
      <p>Aqui você pode modificar a ordem de suas questões, edita-las remove-las.</p>
    </CardHeader>
    <Separator />
    <CardContent class="flex flex-col pt-6 justify-center space-y-4">
      <draggable v-model="survey.questions" group="options" handle=".handle" @start="onStart" @end="onEnd"
        item-key="id" ghostClass="ghost" animation="200" :component-data="{
            tag: 'div',
            type: 'transition-group'
        }"
        class="flex flex-col gap-2"

        >
        <template #item="{ element }">
          <Card :class="cn(smallerMd ? 'handle' : '')">
            <CardContent class="flex items-center p-4 md:p-6 justify-between gap-2" >
              <div class="flex flex-col space-y-2">
                <p class="text-sm font-bold">{{`${element.order} - ${element.question_text}` }}</p>
              </div>
              <div class="hidden md:flex flex-row items-center justify-end space-y-0 handle">
                <Button v-if="!survey.has_published" type="button" variant="destructive" class="ml-2" @click="deleteQuestion(element.id)">
                  <TrashIcon class="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" class="ml-2" :disabled="survey.questions.length === 1">
                  <DragHandleDots2 class="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </template>
      </draggable>
    </CardContent>
    <CardFooter v-if="!survey.has_published">
      <Button type="button" @click="changeActiveComponent">
        Adicionar questão
      </Button>
    </CardFooter>
  </Card>
  <Card v-else>
    <CardHeader class="flex flex-row items-center justify-start space-y-0">
      <p>Visualize ou adicione questões ao seu questionário.</p>
    </CardHeader>
    <Separator />
    <CardContent class="flex gap-2 p-4 justify-center">
      <div class="w-fit flex flex-col justify-center items-center py-12">
        <h1 class="text-2xl font-bold text-center">Vamos adicionar algumas questões!</h1>
        <p class="text-sm text-muted-foreground text-center">
          Clique no botão abaixo para adicionar uma nova questão.
        </p>
        <div class="mt-4">
          <Button type="button" @click="changeActiveComponent">
            Adicionar questão
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
