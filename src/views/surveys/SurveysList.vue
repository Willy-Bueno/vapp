<script setup lang="ts">
import { computed, onMounted } from "vue"

import { useSurveyStore } from "@/stores/survey"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import { Tables } from "@/types"

type Surveys = (Tables<"surveys">[] & { survey_status: Tables<"survey_status"> }[]) | null

const surveyStore = useSurveyStore()

const surveys = computed(() => surveyStore.surveys as Surveys)

onMounted(async () => {
  await surveyStore.getSurveys()
})
</script>

<template>
  <p class="text-sm text-muted-foreground">Aqui aparece os seus questionários.</p>
  <div class="flex flex-col">
    <div v-if="surveys && !!surveys.length" class="space-y-2">
      <Card v-for="survey in surveys" :key="survey.id">
        <CardContent class="flex flex-col p-6 hover:cursor-pointer" @click="() => $router.push({ name: 'survey', params: { id: survey.id } })">
          <div class="space-y-2">
            <div class="flex justify-between">
              <h1 class="text-lg font-bold">{{ survey.title }}</h1>
              <Badge :variant="survey.survey_status.slug === 'published' ? 'default' : 'destructive'">
                {{ survey.survey_status.slug === "published" ? "Publicado" : "Não publicado" }}
              </Badge>
            </div>
            <p class="text-sm text-muted-foreground">{{ survey.description }}</p>
          </div>
        </CardContent>
      </Card>
    </div>
    <Card v-else>
      <CardContent class="flex justify-center items-center py-16">
        <p class="text-muted-foreground">Não há questionários criados.</p>
      </CardContent>
    </Card>
  </div>
</template>
