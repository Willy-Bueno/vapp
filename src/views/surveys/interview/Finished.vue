<script setup lang="ts">
  import CheckIcon from '@/components/icons/CheckIcon.vue'

  import { useRouter } from 'vue-router'

  import { Button } from '@/components/ui/button'

  const router = useRouter()

  function newRespondent() {
    const id = router.currentRoute.value.query.id as string

    router.push({ name: 'register-respondent', params: { id }, query: { interview: 'on-site' } })
  }

  function backToInterviewSurveysList() {
    router.push({ name: 'surveys' })
  }
</script>

<template>
  <div class="max-w-2xl w-full h-full flex flex-col gap-2 justify-center items-center space-y-6">
    <div class="w-16 h-16 flex justify-center items-center rounded-full border shadow dark:bg-zinc-900 dark:border-none dark:shadow-none">
      <CheckIcon class="w-8 h-8 text-success" />
    </div>
    <div class="flex flex-col justify-center items-center max-w-md">
      <h1 class="text-2xl font-bold text-center">Entrevista finalizada!</h1>
      <span class="text-muted-foreground text-sm text-center">
        Escolha a baixo se deseja cadastrar um novo participante ou voltar para a lista de pesquisas.
      </span>
    </div>
    <div class="flex flex-1 flex-start">
      <Button type="button" variant="outline" class="flex items-center mr-2" @click="newRespondent">
        <span class="text-sm">Cadastrar novo participante</span>
      </Button>
      <Button type="button" variant="outline" class="flex items-center" @click="backToInterviewSurveysList">
        <span class="text-sm">Voltar para lista de pesquisas</span>
      </Button>
    </div>
  </div>
</template>
