<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Card,
  CardContent
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import ThemeSwitcher from '@/components/header/ThemeSwitcher.vue'

import { Button } from '@/components/ui/button'

import VappLogo from '@/components/icons/VappLogo.vue'
import Home from '@/components/icons/HomeIcon.vue'

import { Tables } from '@/types'

type Response = Tables<'responses'> & {
  people: Tables<'people'>
  surveys: Tables<'surveys'> & {
    questions: Tables<'questions'>[] & {
      question_types: Tables<'question_types'>
      options: Tables<'options'>[]
      answers: Array<Tables<'answers'> & {
        answer_options: Array<Tables<'answer_options'>> | null
      }>
    }[]
  }
}

const props = defineProps<{
  response: Response
}>()
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Card>
        <CardContent class="grid grid-cols-2 p-6 hover:cursor-pointer">
          <div class="space-y-2 col-span-2">
            <div class="flex justify-between">
              <h1 class="text-lg font-bold">{{ `${props.response.people.first_name} ${props.response.people.last_name} - ${props.response.surveys.title}` }}</h1>
              <span class="text-sm text-muted-foreground">{{
                new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                }).format(new Date(props.response.created_at))
               }}</span>
            </div>
              <p class="text-sm text-muted-foreground">Clique para visualizar as respostas dessa entrevista.</p>
          </div>
        </CardContent>
      </Card>
    </SheetTrigger>
    <SheetContent class="min-w-full w-full min-h-fit overflow-y-scroll">
      <div class="hidden fixed min-h-screen h-full w-96 border-r p-6 lg:flex flex-col space-y-16">
        <div class="flex flex-1 justify-start p-4">
            <SheetClose class="flex items-center mr-2">
              <Button variant="outline">
                  <Home class="h-4 w-4 text-muted-foreground" />
              </Button>
            </SheetClose>
          <ThemeSwitcher />
        </div>
        <div class="flex flex-col justify-between h-full">
          <div class="w-full h-fit flex flex-col justify-center items-start p-4 space-y-4">
            <div class="flex items-center justify-start">
              <VappLogo class="w-4 h-4 mr-2" />
              Franet Telecom
            </div>
            <h1 class="font-bold text-3xl">{{ props.response.surveys.title }}</h1>
            <p class="text-sm text-muted-foreground">- {{ `${props.response.people.first_name} ${props.response.people.last_name}` }}</p>
          </div>
          <span class="flex justify-start items-center text-muted-foreground px-4">criado com <VappLogo class="w-4 h-4 ml-2 mr-1" /> Vendas App</span>
        </div>
      </div>
      <div class="lg:hidden flex w-full p-4 border-b">
      <div class="flex flex-1 flex-col gap-4 justify-center">
        <div class="flex gap-2">
          <SheetClose class="flex items-center mr-2">
              <Button variant="outline">
                  <Home class="h-4 w-4 text-muted-foreground" />
              </Button>
            </SheetClose>
          <ThemeSwitcher />
        </div>
        <div class="flex flex-col justify-between h-full mx-auto">
          <div class="w-full h-fit flex flex-col justify-center items-start space-y-4">
            <div class="flex items-center justify-start">
              <VappLogo class="w-4 h-4 mr-2" />
              Franet Telecom
            </div>
            <h1 class="font-bold text-3xl">{{ props.response.surveys.title }}</h1>
          </div>
        </div>
      </div>
    </div>
      <div class="flex flex-1 flex-col items-center px-4 md:px-8 py-36 space-y-16 lg:mt-32 lg:ml-96 pointer-events-none">
        <div v-for="question in props.response.surveys.questions" class="max-w-2xl w-full flex flex-col gap-2">
          <h1 class="font-medium">
            {{ `${question.order} - ${question.question_text}` }}
          </h1>
          <div v-if="question.question_types.slug === 'text'">
            <div v-if="question.answers.find((answer) => answer.response_id === response.id)">
              <p>{{ question.answers.find((answer) => answer.response_id === response.id)?.answer }}</p>
            </div>
            <div v-else>
              <p class="text-sm text-muted-foreground">Pergunta opcional não respondida.</p>
            </div>
          </div>

          <div v-else-if="question.question_types.slug === 'multiple'">
            <div class="flex flex-col gap-2">
              <div v-for="option in question.options" :key="option.id" class="flex items-center justify-start space-x-2">
                <Checkbox :id="option.id" :value="option.id" :checked="option.id === question.answers.find((answer) => answer.response_id === props.response.id)?.answer_options?.find((answerOption) => answerOption.question_option_id)?.question_option_id" />
                <Label :for="option.id" class="cursor-pointer">{{ option.option_text }}</Label>
              </div>
            </div>
          </div>
          <div v-else-if="question.question_types.slug === 'unique'">
            <RadioGroup
              v-for="option in question.options"
              :key="option.id"
              :default-value="question.answers.find((answer) => answer.response_id === props.response.id)?.answer_options?.find((answerOption) => answerOption.question_option_id)?.question_option_id"
              class="flex items-center justify-start space-y-2"
            >
                <RadioGroupItem :id="option.id" :value="option.id" />
                <Label :for="option.id" class="cursor-pointer">{{ option.option_text }}</Label>
            </RadioGroup>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
