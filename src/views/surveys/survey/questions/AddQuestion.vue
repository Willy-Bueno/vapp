<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

import { generateToken } from '@/lib/token'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { toast } from 'vue-sonner'
import { cn } from '@/lib/utils'

import * as z from 'zod'

import { useQuestionTypeStore } from '@/stores/question-type'
import { useQuestionStore } from '@/stores/question'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

import DragHandleDots2 from '@/components/icons/DragHandleDots2Icon.vue'
import MinusCircledIcon from '@/components/icons/MinusCircledIcon.vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import ArrowLfetIcon from '@/components/icons/ArrowLeftIcon.vue'
import Loader from '@/components/icons/Loader.vue'

import ListQuestions from '@/views/surveys/survey/questions/ListQuestions.vue'

import { Tables } from '@/types/helpers'

type QuestionOptionWithKey<T> = Partial<T> & {
  key: string
}

const emit = defineEmits(['change-active-component'])

const router = useRouter()

const questionTypes = useQuestionTypeStore()
const questionStore = useQuestionStore()

const isLoading = ref(false)
const drag = ref(false)
const questionForm = ref({
  question_text: '',
  question_type: {} as Tables<'question_types'>,
  required: 'yes',
  placeholder: '',
  options: [] as QuestionOptionWithKey<Tables<'options'>>[]
})

watch(questionForm, (newValue) => {
  if (['multiple', 'unique'].includes(newValue.question_type.slug)) {
    if (!newValue.options?.length) {
      while (newValue.options.length < 4) addOption()
    } else {
      newValue.options?.forEach((option, index) => {
        option.order = index + 1
      }
    )}
  } else if (newValue.options?.length) {
    newValue.options = []
  }
}, {
  deep: true
})

const questionSchema = z.object({
  question_text: z
    .string()
    .min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres.',
    })
    .max(300, {
      message: 'O nome deve ter no máximo 300 caracteres.',
    }),

  question_type: z
  .object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string()
  })
  .refine(value => {
    if (value.id) return true
    return false
  }, {
    message: 'O tipo de questão deve ser selecionado.',
  }),

  required: z.string(),

  placeholder: z.string().nullable(),

  options: z.array(z.object({
    option_text: z.string()
      .min(1, {
        message: 'O título da opção deve ter pelo menos 1 caracteres.',
      })
      .max(100, {
        message: 'O título da opção deve ter no máximo 100 caracteres.',
      })
      .refine(value => {
        const options = questionForm.value.options?.map(option => option.option_text)
        if (options) {
          const filteredOptions = options.filter(option => option === value)
          if (filteredOptions.length > 1) return false
        }
        return true
      }, {
        message: 'O título da opção não pode ser duplicado.',
      }),

    order: z.number()
      .refine(value => {
        const options = questionForm.value.options?.map(option => option.order)
        if (options) {
          const filteredOptions = options.filter(option => option === value)
          if (filteredOptions.length > 1) return false
        }
        return true
      }, {
        message: 'A ordem da opção não pode ser duplicada.',
      })
  })).nullable()
})

type QuestionFormValues = z.infer<typeof questionSchema>
const errors = ref<z.ZodFormattedError<QuestionFormValues> | null>(null)

function changeActiveComponent() {
  emit('change-active-component', {
    component: ListQuestions
  })
}

function addOption() {
  questionForm.value.options.push({
    option_text: `Opção ${questionForm.value.options.length + 1}`,
    order: questionForm.value.options.length + 1,
    key: generateToken()
  })
}

function validate (): boolean {
  const result = questionSchema.safeParse(questionForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    console.log(errors.value)
    return false
  }
  return true
}

function reset () {
  questionForm.value = {
    question_text: '',
    question_type: {} as Tables<'question_types'>,
    required: 'yes',
    placeholder: '',
    options: [] as QuestionOptionWithKey<Tables<'options'>>[]
  }
}

function handleSubmit() {
  isLoading.value = true

  const isValid = validate()

  if (!isValid) {
    isLoading.value = false
    return
  }

  const surveyId = router.currentRoute.value.params.id as string

  const newObj = {
    question: {
      survey_id: surveyId,
      question_text: questionForm.value.question_text,
      question_type_id: questionForm.value.question_type.id,
      required: questionForm.value.required === 'yes',
      placeholder: questionForm.value.placeholder,
      order: questionStore.questions!.length + 1
    },
    surveyId,
    options: questionForm.value.options?.map(option => ({
      option_text: option.option_text as string,
      order: option.order as number
    }))
  }

  const promise = () => new Promise((resolve) => resolve(questionStore.getQuestions(surveyId).then(() => {
    questionStore.createQuestion(newObj)
  })))

  toast.promise(promise, {
    loading: 'Aguardando...',
    success: () => {
      isLoading.value = false
      return 'Questão adicionada com sucesso!'
    },
    error: () => {
      isLoading.value = false
      return 'Ocorreu um erro ao adicionar a questão.'
    }
  })

  reset()
}

onMounted(async () => {
  const surveyId = router.currentRoute.value.params.id as string
  await questionTypes.getTypes()
  await questionStore.getQuestions(surveyId)
})
</script>

<template>
  <Card class="w-full">
    <form @submit.prevent="handleSubmit">
      <CardHeader class="flex flex-row items-center justify-start space-y-0">
        <Button type="button" variant="outline" class="flex items-center mr-2" @click="changeActiveComponent">
          <ArrowLfetIcon class="h-4 w-4 text-muted-foreground" />
          <span class="ml-2">Voltar</span>
        </Button>
      </CardHeader>
      <Separator />
      <CardContent class="grid grid-cols-2 gap-2 pt-6 justify-center w-full space-y-8">
        <div class="grid gap-2 col-span-2 w-full">
          <Label for="name" :class="cn('text-sm', errors?.question_text && 'text-destructive')">
            Título da questão
          </Label>
          <Input id="name" v-model="questionForm.question_text" placeholder="ex: Qual é o seu provedor de internet atualmente?" />
          <span class="text-muted-foreground text-sm">
            Certifique-se de que a pergunta seja clara e objetiva.
          </span>
          <div v-if="errors?.question_text" class="text-sm text-destructive">
            <span v-for="error in errors.question_text._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <div class="grid gap-2 col-span-2 md:col-span-1">
          <Label for="question_type" :class="cn('text-sm', errors?.question_type && 'text-destructive')">
            Tipo de questão
          </Label>
          <Popover>
            <PopoverTrigger as-child>
              <Button type="button" name="role" variant="outline" class="flex justify-between w-full">
                {{ questionForm.question_type.id ? questionForm.question_type.title : 'Selecione o tipo de questão' }}
                <ChevronDownIcon class="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="p-0" align="end">
              <Command v-model="questionForm.question_type.title" class="flex flex-col w-full">
                <CommandList>
                  <CommandEmpty>
                    Nenhum tipo de questão encontrado.
                  </CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      v-for="questionType in questionTypes.types"
                      :key="questionType.id"
                      :value="questionType.title"
                      @select="questionForm.question_type = questionType"
                      class="teamaspace-y-1 flex flex-col items-start px-4 py-2"
                    >
                      <p>
                        {{ questionType.title }}
                      </p>
                      <p class="text-sm text-muted-foreground">
                        {{ questionType.description }}
                      </p>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <span class="text-muted-foreground text-sm">
            Selecione o tipo de questão que você deseja adicionar.
          </span>
          <div v-if="errors?.question_type" class="text-sm text-destructive">
            <span v-for="error in errors.question_type?._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <div class="grid gap-2 col-span-2 md:col-span-1 content-start">
          <Label for="required_question" :class="cn('text-sm', errors?.required && 'text-destructive')">
            Essa questão é obrigatória?
          </Label>
          <Select v-model="questionForm.required" name="question_type" class="w-full">
            <SelectTrigger name="required_question">
              <SelectValue placeholder="Selecione 'Sim' ou 'Não'" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="yes">
                  Sim
                </SelectItem>
                <SelectItem value="no">
                  Não
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <span class="text-muted-foreground text-sm">
            Selecione se essa questão pode ser pulada ou não.
          </span>
          <div v-if="errors?.required" class="text-sm text-destructive">
            <span v-for="error in errors.required?._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <div v-if="questionForm.question_type?.slug === 'text'" class="grid gap-2 col-span-2 w-full">
          <Label for="question-type-text-placeholder" class="text-sm">
            Placeholder do campo de texto <span class="text-muted-foreground">(Opcional)</span>
          </Label>
          <Input name="question-type-text-placeholder" v-model="(questionForm.placeholder as string)" placeholder="ex: Qual seu provedor de internet?" />
          <span class="text-muted-foreground text-sm">
            O placeholder ajuda o usuário a entender o que deve ser preenchido no campo de texto.
          </span>
          <div v-if="errors?.placeholder" class="text-sm text-destructive">
            <span v-for="error in errors.placeholder._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <div v-if="['multiple', 'unique'].includes(questionForm.question_type.slug)" class="grid gap-2 col-span-2 lg:col-span-1 w-full">
          <Label :class="cn('text-sm', errors?.options && 'text-destructive')">
            Opções
          </Label>
          <draggable v-model="questionForm.options" group="options" handle=".handle" @start="drag = true" @end="drag = false"
            item-key="id" ghostClass="ghost" animation="200" :component-data="{
                tag: 'div',
                type: 'transition-group',
                name: !drag ? 'flip-list' : null
            }"
            class="flex flex-col gap-2"
            >
            <template #item="{ element }">
              <div>
                <div class="flex items-center space-x-2">
                  <Input  v-model="element.option_text" placeholder="ex: Franet Telecom" class="capitalize" />
                  <Button
                    type="button" variant="outline"
                    :disabled="questionForm.options?.length === 1"
                    class="flex items-center"
                    @click="questionForm.options?.splice(questionForm.options?.findIndex(option => option.key === element.key), 1)"
                  >
                    <MinusCircledIcon class="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    type="button" variant="outline"
                    :disabled="questionForm.options?.length === 1"
                    class="flex items-center handle"
                  >
                    <DragHandleDots2 class="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <div v-if="errors?.options?.[questionForm.options?.findIndex(option => option.key === element.key)]?.option_text" class="text-sm text-destructive">
                  <template v-for="error in errors.options[questionForm.options?.findIndex(option => option.key === element.key)].option_text?._errors" :key="error">
                    <p>{{ error }}</p>
                  </template>
                </div>
              </div>
            </template>
          </draggable>
          <div class="flex justify-start">
            <Button type="button" variant="outline" @click="addOption">
              Adicionar opção
            </Button>
          </div>
          <span class="text-muted-foreground text-sm">
            As opções são as alternativas que o usuário pode escolher.
          </span>
        </div>
      </CardContent>
      <Separator />
      <CardContent class="grid grid-cols-2 gap-2 pt-6 justify-center w-full space-y-8">
        <div class="grid gap-2 col-span-2 w-full pointer-events-none">
          <Label for="name" class="text-sm">
            Pré-visualização
          </Label>

          <CardContent class="grid grid-cols-2 gap-2 pt-6 justify-center w-full space-y-2">
            <div v-if="!questionForm.question_text || !questionForm.question_type.slug" class="p-12 grid col-span-2 justify-center items-center">
              <p class="text-muted-foreground text-center">
                Preencha o título e o tipo da questão para pré-visualizar.
              </p>
            </div>
            <div v-else class="grid col-span-2 space-y-2">
              <h1 class="text-xl font-medium">
                {{ questionForm.question_text }}
              </h1>
              <div v-if="questionForm.question_type.slug === 'text'" class="grid gap-2 col-span-2 w-full">
                <Input v-model="(questionForm.placeholder as string)" :placeholder="questionForm.placeholder" />
              </div>
              <div v-if="questionForm.question_type.slug === 'multiple'" class="grid gap-3 col-span-2 w-full">
                <div v-for="option in questionForm.options" :key="option.option_text" class="flex items-center space-x-2">
                  <Checkbox :id="option.option_text" />
                  <label
                    :for="option.option_text"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {{ option.option_text }}
                  </label>
                </div>
              </div>
              <div v-if="questionForm.question_type.slug === 'unique'" class="grid gap-2 col-span-2 w-full">
                <RadioGroup>
                  <div v-for="option in questionForm.options" :key="option.option_text" class="flex items-center space-x-2">
                    <RadioGroupItem :id="option.option_text" :value="option.option_text" />
                    <Label :for="option.option_text">{{ option.option_text }}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </div>
      </CardContent>
      <Separator />
      <CardContent class="flex flex-row items-center justify-start space-y-0 mt-6">
        <Button type="submit" :disabled="isLoading">
          <Loader v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" :disabled="isLoading" />
          Adicionar questão
        </Button>
      </CardContent>
    </form>
  </Card>
</template>
