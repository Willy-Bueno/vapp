<script setup lang="ts">
import { computed, shallowRef, onMounted } from 'vue'

import { useRouter } from 'vue-router'

import { useQuestionStore } from '@/stores/questions'

import { cn } from '@/lib/utils'

import Questions from '@/views/dashboard/questionnaires/questionnaire/questions/Questions.vue'

const router = useRouter()

const questionStore = useQuestionStore()

const questions = computed(() => questionStore.questions)

const activeComponent = shallowRef(Questions)

function changeActiveComponent(component: any) {
  activeComponent.value = component
}

onMounted(async () => {
  const surveyId = router.currentRoute.value.params.id as string
  if (surveyId) await questionStore.getQuestionsBySurveyId(surveyId)
  if (!!questions.value.length) changeActiveComponent(Questions)
  else changeActiveComponent(Questions)
})
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Aqui você pode visualizar, adicionar, editar e remover questões do seu questionário.
    </p>
    <p class="text-sm text-muted-foreground">
      Obs: As questões só podem ser adicionadas, editadas ou removidas se o questionário estiver desabilitado.
    </p>
  </div>
  <Transition
    name="slide"
    enter-active-class="transition-all duration-300 ease-out"
    :enter-from-class="cn('opacity-0', 'transform translate-x-full')"
    :enter-to-class="cn('opacity-100', 'transform translate-x-0')"
  >
    <component
      :is="activeComponent"
      @change-active-component="changeActiveComponent"
    />
  </Transition>
</template>
