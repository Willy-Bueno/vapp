<script setup lang="ts">
import { computed, onMounted } from "vue"

import { useRouter } from "vue-router"

import { useResponseStore } from "@/stores/response"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link2Icon from "@/components/icons/Link2Icon.vue"
import { Tables } from "@/types"

type Response = Tables<"responses"> & {
  people: Tables<"people">
  surveys: Tables<"surveys"> & {
    questions: Tables<"questions">[] &
      {
        question_types: Tables<"question_types">
        options: Tables<"options">[]
        answers: Tables<"answers"> &
          {
            answer_options: Array<Tables<"answer_options">> | null
          }[]
      }[]
  }
}

const router = useRouter()

const responseStore = useResponseStore()

const responses = computed(() => responseStore.responses as Response[])

function copyLink(response: Response) {
  const link = `${window.location.origin}/survey/${response.survey_id}/${response.people_id}`
  navigator.clipboard.writeText(link)
}

onMounted(async () => {
  await responseStore.getPendingResponsesBySurveyId(router.currentRoute.value.params.id as string)
})
</script>

<template>
  <p class="text-sm text-muted-foreground">Veja as respostas pendentes do seu questionário e compartilhe o link com os participantes.</p>
  <div v-if="responses && !!responses.length" class="space-y-2">
    <Card v-for="response in responses" :key="response.id">
      <CardContent class="grid grid-cols-4 p-6 hover:cursor-pointer">
        <div class="space-y-2 col-span-3">
          <div class="flex justify-between">
            <h1 class="text-lg font-bold">{{ `${response.people.first_name} ${response.people.last_name} - ${response.surveys.title}` }}</h1>
          </div>
          <p class="text-sm text-muted-foreground">Compartilhe o link com o participante para que ele possa responder o questionário.</p>
        </div>
        <Button type="button" variant="outline" class="col-span-1 flex items-center mr-2" @click="copyLink(response)">
          <Link2Icon class="w-4 h-4 mr-2" />
          <span class="text-sm">Copiar link</span>
        </Button>
      </CardContent>
    </Card>
  </div>
  <div v-else>
    <Card>
      <CardContent class="flex justify-center items-center p-6">
        <span class="text-lg text-muted-foreground">Ainda não há respostas pendentes.</span>
      </CardContent>
    </Card>
  </div>
</template>
