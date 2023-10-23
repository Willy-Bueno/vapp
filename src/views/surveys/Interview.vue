<script setup lang="ts">
import { computed } from 'vue'

import { toast } from 'vue-sonner'

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

const surveyStore = useSurveyStore()

const surveys = computed(() => surveyStore.surveys?.filter((survey: any) => survey.survey_status.slug === 'published') as Surveys)

function copyLink (surveyId: string) {
  const link = `${window.location.origin}/survey/${surveyId}`

  navigator.clipboard.writeText(link)

  toast.success('Link copiado com sucesso!')
}
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
        <SheetContent class="w-full">
          <SheetHeader>
            <SheetTitle>Selecione uma opção de entrevista.</SheetTitle>
            <SheetDescription>
              Escolha a opção de entrevista que você deseja realizar.
            </SheetDescription>
          </SheetHeader>
          <div class="grid space-y-4 mt-4">
            <Card>
              <CardContent class="flex flex-1 p-6 hover:cursor-pointer" @click="() => $router.push({ name: 'register-respondent', params: { id: survey.id }, query: { interview: 'on-site' } })">
                <div class="space-y-8">
                  <div>
                    <h1 class="text-lg font-bold">Entrevista presencial.</h1>
                    <p class="text-sm text-muted-foreground">O entrevistador cadastra o participante e realiza a entrevista presencialmente.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="flex flex-1 p-6 hover:cursor-pointer" @click="() => $router.push({ name: 'register-respondent', params: { id: survey.id }, query: { interview: 'remote-pre' } })">
                <div class="space-y-8">
                  <div>
                    <h1 class="text-lg font-bold">Entrevista remota com participante já cadastrado.</h1>
                    <p class="text-sm text-muted-foreground">O entrevistador cadastra o participante e compartilha o link para que ele responda a pesquisa.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent class="flex flex-1 p-6 hover:cursor-pointer" @click="copyLink(survey.id)">
                <div class="space-y-8">
                  <div>
                    <h1 class="text-lg font-bold">Entrevista totalmente remota.<span class="text-sm text-muted-foreground">(Clique para copiar o link)</span></h1>
                    <p class="text-sm text-muted-foreground">O entrevistador compartilha o link e o participante cadastra suas informações e responde a pesquisa.</p>
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
