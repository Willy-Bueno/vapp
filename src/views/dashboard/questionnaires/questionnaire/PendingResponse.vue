<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  import { toast } from 'vue-sonner'

  import {
    Card,
    CardContent
  } from '@/components/ui/card'
  import { Button } from '@/components/ui/button'

  import Link2Icon from '@/components/icons/Link2Icon.vue'

  import { ParticipantsToSurveys } from '@/models'

  const props = defineProps<{participantToSurvey: ParticipantsToSurveys }>()

  const surveyId = ref('')
  const participantId = ref('')

  function copyLink() {
    const surveyId = props.participantToSurvey.survey.id
    const participantId = props.participantToSurvey.participant.id

    const link = `${window.location.origin}/ask/${surveyId}/${participantId}`

    navigator.clipboard.writeText(link)

    toast.success('Link copiado com sucesso!')
  }

  onMounted(async () => {
    surveyId.value = props.participantToSurvey.survey.id
    participantId.value = props.participantToSurvey.participant.id
  })
</script>

<template>
  <Card>
    <CardContent class="grid grid-cols-4 p-6 hover:cursor-pointer">
      <div class="space-y-2 col-span-3">
        <div class="flex justify-between">
          <h1 class="text-lg font-bold">{{ `${participantToSurvey.participant.first_name} ${participantToSurvey.participant.last_name} - ${participantToSurvey.survey.title}` }}</h1>
        </div>
          <p class="text-sm text-muted-foreground">
            Clique para visualizar as respostas dessa entrevista.
          </p>
      </div>
      <Button type="button" variant="outline" class="col-span-1 flex items-center mr-2" @click="copyLink">
        <Link2Icon class="w-4 h-4 mr-2" />
        <span class="text-sm">Copiar link</span>
      </Button>
    </CardContent>
  </Card>
</template>
