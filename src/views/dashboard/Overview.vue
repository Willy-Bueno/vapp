<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useSurveyStore } from '@/stores/survey'
import { useResponseStore } from '@/stores/response'

import CardReportWidget from '@/components/widgets/CardReportWidget.vue'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent
} from '@/components/ui/card'

import ResponseSheet from '@/components/survey/ResponseSheet.vue'

import { Tables } from '@/types'

type Surveys = Tables<'surveys'>[] & { survey_status: Tables<'survey_status'> }[] | null
type Response = Tables<'responses'> & {
  people: Tables<'people'>
  surveys: Tables<'surveys'> & {
    questions: Tables<'questions'>[] & {
      question_types: Tables<'question_types'>
      options: Tables<'options'>[]
      answers: Array<Tables<'answers'> & {
        answer_options: Array<Tables<'answer_options'>> | null
      }>
    }[]
  }
}

const isLoading = ref(false)

const surveyStore = useSurveyStore()
const responseStore = useResponseStore()

const createdSurveysCount = computed(() => surveyStore.createdSurveysCount)
const publishedSurveysCount = computed(() => surveyStore.pulishedSurveysCount)
const unpublishedSurveysCount = computed(() => surveyStore.unpublishedSurveysCount)
const respnosesCount = computed(() => responseStore.responsesCount)

const surveys = computed(() => surveyStore.surveys as Surveys)
const responses = computed(() => responseStore.responses as Response[])

onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    surveyStore.getSurveysCount(),
    surveyStore.getPublishedSurveysCount(),
    surveyStore.getUnpublishedSurveysCount(),
    surveyStore.getRecentSurveys(),
    responseStore.getResponsesCount(),
    responseStore.getRecentResponses()
  ])
  isLoading.value = false
})
</script>

<template>
  <p class="text-sm text-muted-foreground">
    Visão geral sobre seus questionários.
  </p>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <CardReportWidget :is-loading="isLoading" title="Questionários Criados" :value="createdSurveysCount" />
    <CardReportWidget :is-loading="isLoading" title="Questionários Não Publicados" :value="unpublishedSurveysCount" />
    <CardReportWidget :is-loading="isLoading" title="Questionários Publicados" :value="publishedSurveysCount" />
    <CardReportWidget :is-loading="isLoading" title="Questionários Respondidos" :value="respnosesCount" />
  </div>
  <div class="flex flex-col gap-4 py-8 space-y-6">
    <div class="flex flex-col">
      <div class="flex items-center justify-between space-y-2 mb-4">
        <h1 class="text-2xl font-bold tracking-tight">Questionários recentes</h1>
      </div>
      <div v-if="surveys && !!surveys.length" class="space-y-2">
        <Card v-for="survey in surveys" :key="survey.id">
          <CardContent class="flex flex-col p-6 hover:cursor-pointer" @click="() => $router.push({ name: 'survey', params: { id: survey.id } })">
            <div class="space-y-2">
              <div class="flex justify-between">
                <h1 class="text-lg font-bold">{{ survey.title }}</h1>
                <Badge :variant="survey.survey_status.slug === 'published' ? 'default' : 'destructive'">
                  {{ survey.survey_status.slug === 'published' ? 'Publicado' : 'Não publicado' }}
                </Badge>
              </div>
                <p class="text-sm text-muted-foreground">{{ survey.description }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card v-else>
        <CardContent class="flex justify-center items-center py-16">
          <p class="text-muted-foreground">Não há questionários recentes.</p>
        </CardContent>
      </Card>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center justify-between space-y-2 mb-4">
        <h1 class="text-2xl font-bold tracking-tight">Respostas recentes</h1>
      </div>
      <div v-if="responses && !!responses.length" class="space-y-2">
        <div v-for="response in responses" :key="response.id">
          <ResponseSheet :response="response" />
        </div>
      </div>
      <Card v-else>
        <CardContent class="flex justify-center items-center py-16">
          <p class="text-muted-foreground">Não há respostas recentes.</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
