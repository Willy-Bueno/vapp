<script setup lang="ts">
import { shallowRef } from "vue"

import ListQuestions from "@/views/surveys/survey/questions/ListQuestions.vue"

const activeComponent = shallowRef(ListQuestions)

interface ActiveComponentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any
}

function changeActiveComponent({ component }: ActiveComponentProps) {
  activeComponent.value = component
}
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">Aqui você pode visualizar, adicionar e remover questões do seu questionário.</p>
    <p class="text-sm text-muted-foreground">Obs: As questões só podem ser adicionadas ou removidas se o questionário nunca foi publicado.</p>
  </div>
  <component :is="activeComponent" @change-active-component="changeActiveComponent" />
</template>
