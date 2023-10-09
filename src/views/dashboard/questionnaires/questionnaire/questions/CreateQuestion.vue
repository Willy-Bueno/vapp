<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { cn } from '@/lib/utils'
import { generateToken } from '@/lib/token'
import * as z from 'zod'

import { useQuestionOptionsStore } from '@/stores/questionOptions'
import { useQuestionTypeStore } from '@/stores/questionType'
import { useQuestionStore } from '@/stores/questions'

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

import MinusCircledIcon from '@/components/icons/MinusCircledIcon.vue'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import ArrowLfetIcon from '@/components/icons/ArrowLeftIcon.vue'
import { Loader2 } from 'lucide-vue-next'

import Questions from '@/views/dashboard/questionnaires/questionnaire/questions/Questions.vue'


interface Option {
  title: string
  question?: string
  key?: string
}

interface Question {
  id?: string
  title: string
  type: string
  skip: string
  placeholder: string
  options?: Option[]
}

const emit = defineEmits(['change-active-component'])

const router = useRouter()

const questionStore = useQuestionStore()
const questionTypeStore = useQuestionTypeStore()
const questionOptionsStore = useQuestionOptionsStore()

const questionTypes = computed(() => questionTypeStore.questionTypes)
const questionSelectedTypeName = computed(() => questionTypes.value?.find(questionType => questionType.id === questionForm.value.type)?.title ?? '')

const isLoading = ref(false)
const questionForm = ref<Question>({
  title: '',
  type: '',
  skip: 'no',
  placeholder: '',
  options: []
})

watch(questionForm, (value) => {
  if (['Múltipla Escolha', 'Única Escolha', 'Escala'].includes(questionSelectedTypeName.value)) {
    if (value.placeholder) value.placeholder = ''
    if (!value.options) {
      value.options = []
      while (value.options.length < 4) addOption()
    } else if (value.options.length === 0) {
      while (value.options.length < 4) addOption()
    }
  } else {
    if (questionSelectedTypeName.value === 'Texto' && value.options && value.options.length > 0) value.options = []
  }
}, {
  deep: true
})

const questionSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres.',
    })
    .max(300, {
      message: 'O nome deve ter no máximo 300 caracteres.',
    }),

  type: z
    .string()
    .nonempty({
      message: 'Selecione um tipo de questão.',
    }),

  skip: z.string(),

  placeholder: z.string().nullable(),

  options: z.array(z.object({
    title: z.string()
      .nonempty({
        message: 'O título da opção não pode ser vazio.',
      })
      .min(1, {
        message: 'O título da opção deve ter pelo menos 1 caracteres.',
      })
      .max(100, {
        message: 'O título da opção deve ter no máximo 100 caracteres.',
      })
      .refine(value => {
        const options = questionForm.value.options?.map(option => option.title)
        if (options) {
          const filteredOptions = options.filter(option => option === value)
          if (filteredOptions.length > 1) return false
        }
        return true
      }, {
        message: 'O título da opção não pode ser duplicado.',
      })
  })).nullable()
})

type QuestionFormValues = z.infer<typeof questionSchema>
const errors = ref<z.ZodFormattedError<QuestionFormValues> | null>(null)

function changeActiveComponent() {
  emit('change-active-component', Questions)
}

async function createQuestion(question: Question) {
  const surveyId = router.currentRoute.value.params.id

  if (!surveyId) throw new Error('Survey id is not defined.')

  const { id } = await questionStore.createQuestion({
    title: question.title,
    skip: question.skip === 'yes',
    placeholder: question.placeholder,
    type: question.type,
    survey: surveyId as string
  })

  if (question.options && !!question.options.length) {
    for (const option of question.options) {
      option.question = id
      if (option.key) delete option.key
    }

    await questionOptionsStore.createQuestionOptions(question.options as any)
  }
}

function addOption() {
  questionForm.value.options?.push({
    key: generateToken(),
    title: `Opção ${questionForm.value.options?.length + 1}`
  })
}

function resetForm () {
  questionForm.value = {
    title: '',
    type: '',
    skip: 'no',
    placeholder: '',
    options: []
  }
}

function handleSubmit() {
  const result = questionSchema.safeParse(questionForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    return
  }

  isLoading.value = true

  const newQuestion = Object.assign({}, questionForm.value)

  const promise = () => new Promise(resolve => resolve(createQuestion(newQuestion)))

  toast.promise(promise, {
    loading: 'Adicionando questão...',
    success: () => 'Questão adicionada com sucesso!',
    error: () => 'Não foi possível adicionar a questão.'
  })

  resetForm()

  isLoading.value = false
}

onMounted(async () => {
  await questionTypeStore.getQuestionTypes()
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
          <Label for="name" :class="cn('text-sm', errors?.title && 'text-destructive')">
            Título da questão
          </Label>
          <Input id="name" v-model="questionForm.title" placeholder="ex: Qual é o seu provedor de internet atualmente?" />
          <span class="text-muted-foreground text-sm">
            Certifique-se de que a pergunta seja clara e objetiva.
          </span>
          <div v-if="errors?.title" class="text-sm text-destructive">
            <span v-for="error in errors.title._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <div class="grid gap-2 col-span-1">
          <Label for="question_type" :class="cn('text-sm', errors?.type && 'text-destructive')">
            Tipo de questão
          </Label>
          <Popover>
            <PopoverTrigger as-child>
              <Button type="button" id="role" variant="outline" class="flex justify-between w-full">
                {{ questionForm.type !== '' && questionTypes ? questionSelectedTypeName : 'Selecione o tipo de questão' }}
                <ChevronDownIcon class="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="p-0" align="end">
              <Command v-model="questionForm.type" class="flex flex-col w-full">
                <CommandList>
                  <CommandEmpty>
                    Nenhum tipo de questão encontrado.
                  </CommandEmpty>
                  <CommandGroup>
                    <CommandItem v-for="questionType in questionTypes" :key="questionType.id" :value="questionType.id" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                      <p>{{ questionType.title }}</p>
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
          <div v-if="errors?.type" class="text-sm text-destructive">
            <span v-for="error in errors.type?._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <div class="grid gap-2 col-span-1 items-start">
          <Label for="question_type" :class="cn('text-sm', errors?.skip && 'text-destructive')">
            Essa questão pode ser pulada?
          </Label>
          <Select v-model="questionForm.skip" id="question_type" class="w-full">
            <SelectTrigger id="question_type">
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
          <div v-if="errors?.skip" class="text-sm text-destructive">
            <span v-for="error in errors.skip?._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <div v-if="questionSelectedTypeName === 'Texto'" class="grid gap-2 col-span-2 w-full">
          <Label for="question-type-text-placeholder" class="text-sm">
            Placeholder do campo de texto <span class="text-muted-foreground">(Opcional)</span>
          </Label>
          <Input id="question-type-text-placeholder" v-model="(questionForm.placeholder as string)" placeholder="ex: Qual seu provedor de internet?" />
          <span class="text-muted-foreground text-sm">
            O placeholder ajuda o usuário a entender o que deve ser preenchido no campo de texto.
          </span>
          <div v-if="errors?.placeholder" class="text-sm text-destructive">
            <span v-for="error in errors.placeholder._errors" :key="error">{{ error }}</span>
          </div>
        </div>
        <div v-if="['Múltipla Escolha', 'Única Escolha', 'Escala'].includes(questionSelectedTypeName)" class="grid gap-2 col-span-1 w-full">
          <Label :class="cn('text-sm', errors?.options && 'text-destructive')">
            Opções
          </Label>
          <div v-for="(option, index) in questionForm.options" :key="option.key" class="flex flex-col gap-2">
            <div class="flex items-center space-x-2">
              <Input  v-model="option.title" placeholder="ex: Franet Telecom" class="capitalize" />
              <Button
                type="button" variant="outline"
                :disabled="questionForm.options?.length === 1"
                class="flex items-center" @click="questionForm.options?.splice(index, 1)">
                <MinusCircledIcon class="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
            <div v-if="errors?.options?.[index]?.title" class="text-sm text-destructive">
              <template v-for="error in errors.options[index].title?._errors" :key="error">
                <p>{{ error }}</p>
              </template>
            </div>
          </div>
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
            <div v-if="questionForm.title === '' || questionForm.type === ''" class="p-12 grid col-span-2 justify-center items-center">
              <p class="text-muted-foreground text-center">
                Preencha o título e o tipo da questão para pré-visualizar.
              </p>
            </div>
            <div v-else class="grid col-span-2 space-y-2">
              <h1 class="text-xl font-medium">
                {{ questionForm.title }}
              </h1>
              <div v-if="questionSelectedTypeName === 'Texto'" class="grid gap-2 col-span-2 w-full">
                <Input v-model="(questionForm.placeholder as string)" :placeholder="questionForm.placeholder" />
              </div>
              <div v-if="questionSelectedTypeName === 'Múltipla Escolha'" class="grid gap-3 col-span-2 w-full">
                <div v-for="option in questionForm.options" :key="option.key" class="flex items-center space-x-2">
                  <Checkbox :id="option.title" />
                  <label
                    :for="option.title"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {{ option.title }}
                  </label>
                </div>
              </div>
              <div v-if="questionSelectedTypeName === 'Única Escolha'" class="grid gap-2 col-span-2 w-full">
                <RadioGroup>
                  <div v-for="option in questionForm.options" :key="option.key" class="flex items-center space-x-2">
                    <RadioGroupItem :id="option.title" :value="option.title" />
                    <Label :for="option.title">{{ option.title }}</Label>
                  </div>
                </RadioGroup>
              </div>
              <div v-if="questionSelectedTypeName === 'Escala'" class="grid gap-2 col-span-2 w-full">
                <div class="flex items-center space-x-2">
                  <Button v-for="option in questionForm.options" :key="option.key" type="button" variant="secondary" class="flex items-center">
                    {{ option.title }}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </CardContent>
      <Separator />
      <CardContent class="flex flex-row items-center justify-start space-y-0 mt-6">
        <Button type="submit" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" :disabled="isLoading" />
          Adicionar questão
        </Button>
      </CardContent>
    </form>
  </Card>
</template>
