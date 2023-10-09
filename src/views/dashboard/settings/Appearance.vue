<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useDark } from '@vueuse/core'

import { Loader2 } from 'lucide-vue-next'

import * as z from 'zod'

import { cn } from '@/lib/utils'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'

const isDark = useDark({ storageKey: 'theme' })

watch(isDark, () => {
  appearenceForm.value.theme = isDark.value ? 'dark' : 'light'
})

const isLoading = ref(false)
const appearenceForm = ref({
  theme: 'light'
})

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark'], {
    required_error: 'Por favor selecione um tema.',
  })
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>
const errors = ref<z.ZodFormattedError<AppearanceFormValues> | null>(null)

async function handleSubmit() {
  const result = appearanceFormSchema.safeParse(appearenceForm.value)
  if (!result.success) {
    errors.value = result.error.format()
    console.log(errors.value)
    return
  }

  if (appearenceForm.value.theme === 'dark') isDark.value = true
  else isDark.value = false
}

onMounted(() => appearenceForm.value.theme = isDark.value ? 'dark' : 'light')
</script>

<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Customize a aparência do seu dashboard.
    </p>
  </div>
  <form class="space-y-8" @submit.prevent="handleSubmit">
    <div class="grid gap-2">
      <Label for="theme" :class="cn('text-sm', errors?.theme && 'text-destructive')">
        Tema
      </Label>
      <span class="text-muted-foreground text-xs">
        Selecione o tema que você deseja usar no dashboard.
      </span>
      <RadioGroup
        v-model="appearenceForm.theme"
        default-value="light"
        class="grid max-w-md grid-cols-2 gap-8 pt-2"
      >
        <div class="grid gap-2">
          <Label class="[&:has([data-state=checked])>div]:border-primary">
            <div>
              <RadioGroupItem value="light" class="sr-only" />
            </div>
            <div class="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
              <div class="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div class="space-y-2 rounded-md bg-white p-2 shadow-sm">
                  <div class="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div class="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                  <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
            <span class="block w-full p-2 text-center font-normal">
              Claro
            </span>
          </Label>
        </div>
        <div>
          <Label class="[&:has([data-state=checked])>div]:border-primary">
            <div>
              <RadioGroupItem value="dark" class="sr-only" />
            </div>
            <div class="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
              <div class="space-y-2 rounded-sm bg-slate-950 p-2">
                <div class="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div class="h-2 w-[80px] rounded-lg bg-slate-400" />
                  <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div class="h-4 w-4 rounded-full bg-slate-400" />
                  <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div class="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div class="h-4 w-4 rounded-full bg-slate-400" />
                  <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
              </div>
            </div>
            <span class="block w-full p-2 text-center font-normal">
              Escuro
            </span>
          </Label>
        </div>

        <div class="col-span-2">
          <span v-if="errors?.theme" class="text-sm text-destructive">
            <span v-for="error in errors.theme._errors" :key="error">{{ error }}</span>
          </span>
        </div>
      </RadioGroup>
    </div>

    <div class="flex justify-start">
      <Button type="submit">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Atualizar aparência
      </Button>
    </div>
  </form>
</template>
