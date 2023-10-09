<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useParticipantToSurveyStore } from '@/stores/participantsToSurveys'
import { useResponseStore } from '@/stores/responses'
import { useBusinessStore } from '@/stores/business'
import { useProfileStore } from '@/stores/profile'
import { useSurveyStore } from '@/stores/surveys'
import { useAuthStore } from '@/stores/auth'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'

import VappLogo from '@/components/icons/VappLogo.vue'

import CardStats from '@/components/application/CardStats.vue'

import SurveySheet from '@/views/dashboard/questionnaires/SurveySheet.vue'
import ResponseSheet from '@/views/dashboard/questionnaires/ResponseSheet.vue'


const participantsToSurveysStore = useParticipantToSurveyStore()
const responseStore = useResponseStore()
const businessStore = useBusinessStore()
const profileStore = useProfileStore()
const surveyStore = useSurveyStore()
const authStore = useAuthStore()

const surveys = computed(() => surveyStore.surveys)
const responses = computed(() => responseStore.responses)
const participantsToSurveys = computed(() => participantsToSurveysStore.participantsToSurveys)

const surveysCreatedCount = computed(() => surveys.value.length)
const surveysPublishedCount = computed(() => surveys.value.filter(survey => survey.status === 'published').length)
const surveysUnpublishedCount = computed(() => surveys.value.filter(survey => survey.status === 'unpublished').length)
const questionsAnsweredCount = computed(() => {
  const uniqueQuestionParticipantPairs = new Set()
  const result: {
    questionId: string
    participantId: string
  }[] = []

  responses.value.forEach(response => {
    const questionId = response.question.id;
    const participantId = response.participant.id;
    const pair = `${questionId}-${participantId}`;

    if (!uniqueQuestionParticipantPairs.has(pair)) {
      uniqueQuestionParticipantPairs.add(pair);
      result.push({ questionId, participantId });
    }
  });

  return result.length;

})

onMounted(async () => {
  if (!authStore.session) await authStore.fetchSession()
  if (authStore.session && !authStore.session.user) await authStore.fetchSession()
  if (authStore.session && authStore.session.user) {
    if (!profileStore.profile) await profileStore.getProfileById(authStore.session.user.id)
    if (!businessStore.business && profileStore.profile && profileStore.profile.business) await businessStore.getBusinessById(profileStore.profile.business.id)
    if (businessStore.business) await surveyStore.getSurveysByBusinessIdWithLimit(businessStore.business.id, 3)
    if (businessStore.business) await responseStore.getResponsesByBusinessId(businessStore.business.id)
    if (businessStore.business) await participantsToSurveysStore.getParticipantsToSurveysByBusinessIdWithLimitAndStatusStatus(businessStore.business.id, 3, 'completed')
  }
})
</script>

<template>
  <p class="text-sm text-muted-foreground">
    Visão geral sobre seus questionários.
  </p>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <CardStats title="Questionários Criados" :value="surveysCreatedCount" />
    <CardStats title="Questionários Não Publicados" :value="surveysUnpublishedCount" />
    <CardStats title="Questionários Publicados" :value="surveysPublishedCount" />
    <CardStats title="Questões Respondidas" :value="questionsAnsweredCount" />
  </div>
  <div class="grid grid-cols-3 gap-4 py-8">
    <div class="grid grid-cols-1 space-y-6 col-span-2">
      <div class="flex flex-col">
        <div class="flex items-center justify-between space-y-2 mb-4">
          <h1 class="text-2xl font-bold tracking-tight">Questionários recentes</h1>
        </div>
        <div v-if="!!surveys.length">
          <Card v-for="survey in surveys" :key="survey.id">
            <CardContent class="grid grid-cols-2 p-6 hover:cursor-pointer" @click="() => $router.push({ name: 'survey', params: { id: survey.id } })">
              <div class="space-y-2 col-span-2">
                <div class="flex justify-between">
                  <h1 class="text-lg font-bold">{{ survey.title }}</h1>
                  <Badge :variant="survey.status === 'published' ? 'default' : 'destructive'">
                    {{ survey.status === 'published' ? 'Publicado' : 'Não publicado' }}
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
        <div v-if="!!participantsToSurveys.length" class="space-y-2">
          <ResponseSheet v-for="participant in participantsToSurveys" :key="participant.id" :participantToSurvey="participant" />
        </div>
        <Card v-else>
          <CardContent class="flex justify-center items-center py-16">
            <p class="text-muted-foreground">Não há respostas recentes.</p>
          </CardContent>
        </Card>
      </div>
    </div>
    <Card class="grid col-span-1 mt-12 h-fit">
      <CardHeader>
        <CardTitle class="flex justify-center items-center">
          <VappLogo class="h-12 w-12" name="Vendas App" />
        </CardTitle>
      </CardHeader>
      <CardContent class="flex flex-col justify-center items-center">
        <h1 class="text-lg font-bold">Crie um novo questionário</h1>
        <p class="text-sm text-muted-foreground text-center">Clique no botão abaixo e colete dados com facilidade.</p>
        <SurveySheet />
      </CardContent>
    </Card>
  </div>
</template>
