<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'

import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { useResponseStore } from '@/stores/response'
import { useSurveyStore } from '@/stores/survey'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Card,
  CardContent
} from '@/components/ui/card'

import { Tables } from '@/types'

type Surveys = Tables<'surveys'>[] & { survey_status: Tables<'survey_status'> } | null

const router = useRouter()

const responseStore = useResponseStore()
const surveyStore = useSurveyStore()

const surveys = computed(() => surveyStore.surveys?.filter((survey: any) => survey.survey_status.slug === 'published') as Surveys)

function presentialInterview(id: string) {
  const peopleId = router.currentRoute.value.query.people as string
  if (peopleId) {
    const promise = () => new Promise((resolve) => resolve(responseStore.createResponse({ people_id: peopleId, survey_id: id })
      .then((data) => router.push({
        name: 'register-response',
          params: {
            id,
            responseId: data.id
          },
          query: {
            interview: 'on-site'
          }
        })
      )))

    toast.promise(promise(), {
      loading: 'Criando entrevista...',
      success: () => 'Entrevista criada com sucesso!',
      error: () => 'Não foi possível criar a entrevista.',
    })
  } else {
    router.push({ name: 'register-people', params: { id }, query: { interview: 'on-site' } })
  }
}

function preRemoteInterview (id: string) {
  const peopleId = router.currentRoute.value.query.people as string
  if (peopleId) {
    const promise = () => new Promise((resolve) => resolve(responseStore.createResponse({ people_id: peopleId, survey_id: id })
      .then((data) => router.push({
        name: 'share-link',
        params: {
          id,
          responseId: data.id
        }
      })
    )))

    toast.promise(promise(), {
      loading: 'Criando entrevista...',
      success: () => 'Entrevista criada com sucesso!',
      error: () => 'Não foi possível criar a entrevista.',
    })
  } else {
    router.push({ name: 'register-people', params: { id }, query: { interview: 'remote-pre' } })
  }
}

onBeforeMount(() => {
  surveyStore.getSurveys()
})
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Aqui aparece os questionários que estão <strong>publicados</strong> no momento.
    </p>
    <p class="text-sm text-muted-foreground">
      Selecione um questionário para começar a entrevista.
    </p>
  </div>
  <div v-if="surveys && !!surveys.length">
    <div v-for="survey in surveys" :key="survey.id">
      <Sheet>
        <SheetTrigger as-child>
          <Card>
            <CardContent class="flex flex-1 p-4 md:p-6 hover:cursor-pointer">
              <div class="space-y-8">
                <div>
                  <h1 class="text-lg font-bold">{{ survey.title }}</h1>
                  <p class="text-sm text-muted-foreground">{{ survey.description }}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </SheetTrigger>
        <SheetContent class="min-w-fit w-full">
          <SheetHeader>
            <SheetTitle>Selecione uma opção de entrevista.</SheetTitle>
            <SheetDescription>
              Escolha a opção de entrevista que você deseja realizar.
            </SheetDescription>
          </SheetHeader>
          <div class="grid space-y-4 mt-4">
            <Card>
              <CardContent class="flex flex-1 p-6 hover:cursor-pointer" @click="() => presentialInterview(survey.id)">
                <div class="space-y-8">
                  <div>
                    <h1 class="text-lg font-bold">Entrevista presencial.</h1>
                    <p class="text-sm text-muted-foreground">O entrevistador cadastra o participante e realiza a entrevista presencialmente.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="flex flex-1 p-6 hover:cursor-pointer" @click="() => preRemoteInterview(survey.id)">
                <div class="space-y-8">
                  <div>
                    <h1 class="text-lg font-bold">Entrevista remota com participante já cadastrado.</h1>
                    <p class="text-sm text-muted-foreground">O entrevistador cadastra o participante e compartilha o link para que ele responda a pesquisa.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </div>
  <Card v-else>
    <CardContent class="flex justify-center items-center py-16">
      <p class="text-muted-foreground">Não há questionários disponíveis.</p>
    </CardContent>
  </Card>
</template>
