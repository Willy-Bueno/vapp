<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useResponseStore } from '@/stores/response'

import {
  Card,
  CardContent
} from '@/components/ui/card'

import ResponseSheet from '@/components/survey/ResponseSheet.vue'

import { Tables } from '@/types'

type Response = Tables<'responses'> & {
  respondents: Tables<'respondents'>
  surveys: Tables<'surveys'> & {
    questions: Tables<'questions'>[] & {
      question_types: Tables<'question_types'>
      options: Tables<'options'>[]
      answers: Tables<'answers'> & {
        answer_options: Array<Tables<'answer_options'>> | null
      }[]
    }[]
  }
}

const responseStore = useResponseStore()

const responses = computed(() => responseStore.responses as Response[])

onMounted(async () => {
  await responseStore.getResponses()
})
</script>

<template>
  <p class="text-sm text-muted-foreground">
    Aqui você pode visualizar as respostas dos participantes dos seus questionários.
  </p>
  <div class="space-y-8 mt-8">
    <div v-if="responses && !!responses.length">
      <div v-for="response in responses" :key="response.id">
        <ResponseSheet :response="response" />
      </div>
    </div>
    <div v-else>
      <Card>
        <CardContent class="flex justify-center items-center p-6">
          <span class="text-lg text-muted-foreground">Ainda não há respostas.</span>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
