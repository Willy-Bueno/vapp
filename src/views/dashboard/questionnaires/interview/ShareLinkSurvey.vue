<script setup lang="ts">
  import { toast } from 'vue-sonner';

  import CheckIcon from '@/components/icons/CheckIcon.vue'
  import Link2Icon from '@/components/icons/Link2Icon.vue';

  import { useRouter } from 'vue-router'

  import { Button } from '@/components/ui/button'

  const router = useRouter()

  function copyLink() {
    const surveyId = router.currentRoute.value.params.surveyId as string
    const participantId = router.currentRoute.value.params.participantId as string

    const link = `${window.location.origin}/ask/${surveyId}/${participantId}`

    navigator.clipboard.writeText(link)

    toast.success('Link copiado com sucesso!')
  }
</script>

<template>
  <div class="flex flex-1 flex-col items-center px-6 py-36 space-y-16 ml-96">
    <div class="max-w-2xl w-full h-full flex flex-col gap-2 justify-center items-center space-y-6">
      <div class="w-16 h-16 flex justify-center items-center rounded-full border shadow dark:bg-zinc-900 dark:border-none dark:shadow-none">
        <CheckIcon class="w-8 h-8 text-success" />
      </div>
      <div class="flex flex-col justify-center items-center max-w-md">
        <h1 class="text-2xl font-bold text-center">Compartilhe o link!</h1>
        <span class="text-muted-foreground text-sm text-center">
          Compartilhe o link abaixo com o participante para que ele possa responder a pesquisa.
        </span>
      </div>
      <div class="flex flex-1 flex-start">
        <Button type="button" variant="outline" class="flex items-center mr-2" @click="copyLink">
          <Link2Icon class="w-4 h-4 mr-2" />
          <span class="text-sm">Copiar link</span>
        </Button>
      </div>
    </div>
  </div>
</template>
