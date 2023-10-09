<script setup lang="ts">
  import { computed, onMounted } from 'vue'

  import { useParticipantToSurveyStore } from '@/stores/participantsToSurveys'

  import { useRouter } from 'vue-router'

  import ResponseSheet from '@/views/dashboard/questionnaires/ResponseSheet.vue'

  const router = useRouter()

  const participantsToSurveysStore = useParticipantToSurveyStore()

  const participantsToSurveys = computed(() => participantsToSurveysStore.participantsToSurveys.filter(participantToSurvey => participantToSurvey.status === 'completed'))

  onMounted(async () => {
    const surveyId = router.currentRoute.value.params.id as string
    await participantsToSurveysStore.getParticipantsToSurveysBySurveyId(surveyId)
  })
</script>

<template>
  <div>
    <div>
      <p class="text-sm text-muted-foreground">
        Aqui você pode visualizar as respostas dos participantes do seu questionário.
      </p>
    </div>
    <div class="space-y-8 mt-8">
      <ResponseSheet v-for="participantToSurvey in participantsToSurveys" :key="participantToSurvey.id" :participantToSurvey="participantToSurvey" />
    </div>
  </div>

</template>
