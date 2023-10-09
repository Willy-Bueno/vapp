<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useBusinessStore } from '@/stores/business'
import { useSurveyStore } from '@/stores/surveys'

import { Card, CardContent } from '@/components/ui/card'

import SurveyInterviewOptionSheet from '@/views/dashboard/questionnaires/interview/SurveyInterviewOptionSheet.vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const businessStore = useBusinessStore()
const surveyStore = useSurveyStore()

const surveys = computed(() => surveyStore.surveys.filter(survey => survey.status === 'published'))

onMounted(async () => {
  if (!authStore.session) await authStore.fetchSession()
  if (!profileStore.profile && authStore.session && authStore.session.user) await profileStore.getProfileById(authStore.session.user.id)

  if (profileStore.profile && profileStore.profile.business) {
    if (!businessStore.business) await businessStore.getBusinessById(profileStore.profile.business.id)
    if (businessStore.business) await surveyStore.getSurveysByBusinessId(businessStore.business.id)
  }
})
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Aqui aparece os questionários que estão disponíveis para você no momento.
    </p>
    <p class="text-sm text-muted-foreground">
      Selecione um questionário para começar a entrevista.
    </p>
  </div>
  <div v-if="!!surveys.length">
    <SurveyInterviewOptionSheet v-for="survey in surveys" :key="survey.id" :survey="survey" />
  </div>
  <Card v-else>
    <CardContent class="flex justify-center items-center py-16">
      <p class="text-muted-foreground">Não há questionários disponíveis.</p>
    </CardContent>
  </Card>
</template>
