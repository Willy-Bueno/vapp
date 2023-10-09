<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  import { cn } from '@/lib/utils'
  import * as z from 'zod'
  import { toast } from 'vue-sonner'

  import { useRoute } from 'vue-router'

  import { useSurveyStore } from '@/stores/surveys'

  import { Button } from '@/components/ui/button'
  import { Label } from '@/components/ui/label'
  import { Input } from '@/components/ui/input'
  import { Textarea } from '@/components/ui/textarea'

  import { Loader2 } from 'lucide-vue-next'

  const surveyStore = useSurveyStore()

  interface Survey {
    id: string
    title: string
    description: string
    status: string
    business: string & {}
  }

  const isLoading = ref(false)
  const survey = ref<Survey>({
    id: '',
    title: '',
    description: '',
    status: 'unpublished',
    business: '',
  })

  const surveySchema = z.object({
    title: z
      .string()
      .min(2, {
        message: 'O nome deve ter pelo menos 2 caracteres.',
      })
      .max(50, {
        message: 'O nome deve ter no máximo 50 caracteres.',
      }),

    description: z
      .string()
      .min(2, {
        message: 'A descrição deve ter pelo menos 2 caracteres.',
      })
      .max(300, {
        message: 'A descrição deve ter no máximo 300 caracteres.',
      }),

    status: z
      .string()
      .nonempty({
        message: 'O status é obrigatório.',
      }),
  })

  type SurveyFormValues = z.infer<typeof surveySchema>
  const errors = ref<z.ZodFormattedError<SurveyFormValues> | null>(null)

  function handleSubmit() {
    isLoading.value = true
    const result = surveySchema.safeParse(survey.value)
    if (!result.success) {
      errors.value = result.error.format()
      return
    }

    const promise = () => new Promise(resolve => resolve(surveyStore.updateSurvey(survey.value)))

    toast.promise(promise, {
      loading: 'Atualizando questionário...',
      success: () => 'Questionário atualizado com sucesso!',
      error: () => 'Ocorreu um erro ao atualizar o questionário.',
    })
    isLoading.value = false
  }

  onMounted(async () => {
    const { params } = useRoute()
    const { id } = params as { id: string }

    await surveyStore.getSurveyById(id)

    if (surveyStore.survey) survey.value = {
      id: surveyStore.survey.id,
      title: surveyStore.survey.title,
      description: surveyStore.survey.description,
      status: surveyStore.survey.status,
      business: surveyStore.survey.business.id
    }
  })
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Aqui você pode atualizar informações basicas do seu questionário antes de habilita-lo.
    </p>
  </div>
  <form class="space-y-8">
    <div class="grid gap-2">
      <Label for="title" :class="cn('text-sm', errors?.title && 'text-destructive')">
        Título
      </Label>
      <Input id="title" v-model="survey.title" placeholder="Nome do seu questionário" class="max-w-md" />
      <span class="text-muted-foreground text-sm">
        Este é o nome que será exibido no seu questionário.
      </span>
      <div v-if="errors?.title" class="text-sm text-destructive">
        <span v-for="error in errors.title._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label for="description" :class="cn('text-sm', errors?.description && 'text-destructive')">
        Descrição
      </Label>
      <Textarea id="description" v-model="survey.description" placeholder="Descrição do seu questionário..." class="max-w-md" />
      <span class="text-muted-foreground text-sm">
        Este é a descrição que será exibido no seu questionário.
      </span>
      <div v-if="errors?.description" class="text-sm text-destructive">
        <span v-for="error in errors.description?._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <div class="grid gap-2">
      <Label :class="cn('text-sm', errors?.description && 'text-destructive')">
        Publicar
      </Label>
      <div class="flex gap-2">
        <Button type="button" :variant="survey.status === 'unpublished' ? 'destructive': 'secondary'" :class="survey.status === 'published' && 'bg-green-600 text-neutral-100 hover:bg-green-700'"  @click="() => survey.status = survey.status === 'published' ? 'unpublished' : 'published'">
          {{ survey.status === 'published' ? 'Publicado' : 'Não publicado'}}
        </Button>
      </div>
      <span class="text-muted-foreground text-sm">
        Seu questionário só será exibido para os entrevistadores quando estiver publicado.
      </span>
      <div v-if="errors?.status" class="text-sm text-destructive">
        <span v-for="error in errors.status?._errors" :key="error">{{ error }}</span>
      </div>
    </div>
    <Button type="submit" @click.prevent="handleSubmit" :disabled="isLoading">
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      Salvar alterações
    </Button>
  </form>
</template>
