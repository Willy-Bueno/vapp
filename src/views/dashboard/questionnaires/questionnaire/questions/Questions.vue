<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { toast } from 'vue-sonner'

import { useRouter } from 'vue-router'

import { useQuestionStore } from '@/stores/questions'

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import TrashIcon from '@/components/icons/TrashIcon.vue'
import { Loader2 } from 'lucide-vue-next'

import CreateQuestion from '@/views/dashboard/questionnaires/questionnaire/questions/CreateQuestion.vue'

const emit = defineEmits(['change-active-component'])

const isLoading = ref(false)

const router = useRouter()

const questionStore = useQuestionStore()

function changeActiveComponent() {
  emit('change-active-component', CreateQuestion)
}

const questions = computed(() => questionStore.questions)

function handleRemoveQuestion(questionId: string) {
  isLoading.value = true
  const promise = () => new Promise(resolve => resolve(questionStore.removeQuestion(questionId).then(() => {
    const surveyId = router.currentRoute.value.params.id as string
    questionStore.getQuestionsBySurveyId(surveyId)
  })))

  toast.promise(promise, {
    loading: 'Removendo questão...',
    success: () => 'Questão removida com sucesso!',
    error: () => 'Ocorreu um erro ao remover a questão.',
  })
  isLoading.value = false
}

onMounted(async () => {
  const surveyId = router.currentRoute.value.params.id as string
  if (surveyId) await questionStore.getQuestionsBySurveyId(surveyId)
})
</script>

<template>
  <Card v-if="!!questions.length">
    <CardHeader class="flex flex-row items-center justify-start space-y-0">
      <p>Aqui você pode modificar a ordem de suas questões, edita-las remove-las.</p>
    </CardHeader>
    <Separator />
    <CardContent class="flex flex-col pt-6 justify-center space-y-4">
      <Card v-for="question in questions" :key="question.id">
        <CardContent class="flex items-center p-6 justify-between space-y-0" >
          <div class="flex flex-col space-y-2">
            <p class="text-sm font-bold">{{ question.title }}</p>
            <p class="text-sm text-muted-foreground">{{ question.type.title }}</p>
          </div>
          <div class="flex flex-row items-center justify-end space-y-0">
            <Button type="button" variant="destructive" :disabled="question.survey.status === 'published'" class="mr-2" @click="handleRemoveQuestion(question.id)">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              <TrashIcon v-else class="w-4 h-4 mr-2" />
              Remover
            </Button>
          </div>
        </CardContent>
      </Card>
    </CardContent>
    <CardFooter>
      <Button type="button" @click="changeActiveComponent">
        Adicionar questão
      </Button>
    </CardFooter>
  </Card>
  <Card v-else>
    <CardHeader class="flex flex-row items-center justify-start space-y-0">
      <p>Visualize ou adicione questões ao seu questionário.</p>
    </CardHeader>
    <Separator />
    <CardContent class="flex gap-2 pt-6 justify-center">
      <div class="w-fit flex flex-col justify-center items-center py-12">
        <h1 class="text-2xl font-bold">Vamos adicionar algumas questões!</h1>
        <p class="text-sm text-muted-foreground">
          Clique no botão abaixo para adicionar uma nova questão.
        </p>
        <div class="mt-4">
          <Button type="button" @click="changeActiveComponent">
            Adicionar questão
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
