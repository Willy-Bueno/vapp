<script setup lang="ts">
  import { computed, onMounted } from 'vue'

  import { useParticipantToSurveyStore } from '@/stores/participantsToSurveys'

  import { useRouter } from 'vue-router'

  import {
    Card,
    CardContent,
  } from '@/components/ui/card'

  import PendingResponse from '@/views/dashboard/questionnaires/questionnaire/PendingResponse.vue'

  const router = useRouter()

  const participantsToSurveysStore = useParticipantToSurveyStore()

  const participantsToSurveys = computed(() => participantsToSurveysStore.participantsToSurveys.filter(participantToSurvey => participantToSurvey.status === 'pending'))

  onMounted(async () => {
    const surveyId = router.currentRoute.value.params.id as string
    await participantsToSurveysStore.getParticipantsToSurveysBySurveyId(surveyId)
  })
</script>

<template>
  <div>
    <div>
      <p class="text-sm text-muted-foreground">
        Veja aqui as entrevistas que ainda não foram respondidas.
      </p>
      <p class="text-sm text-muted-foreground">
        Copie e reenvie o link para o participante caso necessário.
      </p>
    </div>
    <div v-if="!!participantsToSurveys.length" class="space-y-8 mt-8">
      <PendingResponse v-for="participantToSurvey in participantsToSurveys" :key="participantToSurvey.id" :participantToSurvey="participantToSurvey" />
    </div>
    <div v-else class="space-y-8 mt-8">
      <Card>
        <CardContent class="flex flex-col items-center justify-center p-6">
          <p class="text-sm text-muted-foreground">
            Não há entrevistas pendentes.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>

</template>
