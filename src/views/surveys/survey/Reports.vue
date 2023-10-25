<script setup lang="ts">
import { ref, onMounted } from "vue"

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useRouter } from "vue-router"
import { StackedBar } from "@unovis/ts"

import { useResponseStore } from '@/stores/response'

import {
  VisAxis,
  VisStackedBar,
  VisXYContainer,
  VisTooltip,
} from "@unovis/vue"

import { Card, CardContent } from "@/components/ui/card"

import { Tables } from "@/types"

type Question = Tables<'questions'> & {
  question_types: Tables<'question_types'>
  options: Tables<'options'>[]
  answers: Tables<'answers'> & {
    answer_options: Tables<'answer_options'>[] | null
  }[]
}

type Response = Tables<'responses'> & {
  people: Tables<'people'>
  surveys: Tables<'surveys'> & {
    questions: Question[]
  }
}

interface Statistc {
  id: string
  title: string
  type: string
  options?: Array<{
    id: string
    title: string
    total: number
  }>
}

interface Data {
  id: string
  title: string
  total: number
}


const router = useRouter()

const responseStore = useResponseStore()

const statistcs = ref<Statistc[]>([])

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.isSmallerOrEqual('sm')

const color = (
  d: Data,
  options: Array<{ id: string; title: string; total: number }>
) =>
  [
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
  ][options.findIndex((option) => option.id === d.id)]

const triggers = {
  [StackedBar.selectors.bar]: (d: Data) => `
    <div class="flex flex-col items-start">
      <div class="text-sm font-semibold text-gray-700">${d.title}</div>
      <div class="text-sm font-semibold text-gray-700">${d.total} respostas</div>
    </div>
  `,
}

const events = ref({})

onMounted(async () => {
  const surveyId = router.currentRoute.value.params.id as string

  await responseStore.getResponsesBySurveyId(surveyId)

  const responses = responseStore.responses as Response[]

  responses.forEach(response => {
    response.surveys.questions.forEach(question => {
      let statistc: Statistc = {
        id: question.id,
        title: question.question_text,
        type: question.question_types.slug,
      }

      if (question.question_types.slug !== 'text') {
        statistc.options = question.options.map(option => {
          let total = 0

          response.surveys.questions.forEach(question => {
            if (question.question_types.slug !== 'text') {
              question.answers.forEach(answer => {
                if (answer.answer_options) {
                  answer.answer_options.forEach(answerOption => {
                    if (answerOption.question_option_id === option.id) {
                      total++
                    }
                  })
                }
              })
            }
          })

          return {
            id: option.id,
            title: option.option_text,
            total,
          }
        })
      }

      statistcs.value.push(statistc)
    })
  })
})
</script>

<template>
  <div>
    <div>
      <p class="text-sm text-muted-foreground">
        Veja as estatísticas de respostas do seu questionário.
      </p>
    </div>
  </div>
  <div class="flex flex-col space-y-16" v-if="statistcs && !!statistcs.length">
    <div v-for="statistc in statistcs" :key="statistc.id" class="flex flex-col gap-2">
      <div class="flex flex-col items-start">
        <div class="text-sm font-semibold">
          {{ statistc.title }}
        </div>
      </div>
      <Card v-if="statistc.options && !!statistc.options.length">
        <CardContent class="p-6 flex flex-col lg:flex-row">
          <div class="flex flex-col justify-end">
            <VisXYContainer
              height="250px"
              :width="isMobile ? '380px' : '480px'"
              :margin="{ left: 20, right: 20 }"
              :data="statistc.options"
            >
              <VisStackedBar
                :x="(_: Statistc, i: number) => i"
                :y="(d: Data) => d.total"
                :color="(d: Data) => color(d, statistc.options as Array<{ id: string, title: string, total: number }>)"
                :rounded-corners="4"
                :bar-padding="0.15"
                :cursor="(d: Data) => d.total > 0 ? 'pointer' : 'default'"
                :events="events"
              />
              <VisTooltip :triggers="triggers" />
              <VisAxis
                type="x"
                label="Movimente o mouse sobre as barras para ver mais detalhes"
                :num-ticks="statistc.options.length - 1"
                :grid-line="false"
                :tick-line="false"
                color="#888888"
              />
              <VisAxis
                type="y"
                :num-ticks="
                  statistc.options.reduce(
                    (gt, d) => (d.total > gt ? d.total : gt),
                    1
                  )
                "
                :tick-format="(d: Data) => d"
                :grid-line="false"
                :tick-line="false"
                :domain-line="false"
                color="#888888"
              />
            </VisXYContainer>
          </div>
          <div class="mt-12 lg:ml-12 flex flex-col gap-2">
            <div
              v-for="option in statistc.options"
              :key="option.id"
              class="flex flex-col items-start flex-start gap-1 p-2"
              :style="{ borderLeft: '4px solid ' + color(option, statistc.options as Array<{ id: string, title: string, total: number }>) }"
            >
              <span>{{ option.title }}</span>
              <span class="text-muted-foreground">{{ option.total }} {{ option.total > 1 ? 'votos' : 'voto' }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div v-else>
        <div class="w-fit">
          <div class="flex flex-col items-start space-y-8">
            <div class="text-sm text-muted-foreground">
              Essa é uma questão do tipo texto, não é possível gerar
              estatísticas. Confira os questionários respondidos na aba de respostas.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <Card>
      <CardContent class="flex justify-center items-center p-6">
        <span class="text-lg text-muted-foreground">Ainda não há respostas para gerar um relatório.</span>
      </CardContent>
    </Card>
  </div>
</template>
