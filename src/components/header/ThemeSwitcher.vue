<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

import MoonIcon from '@/components/icons/MoonIcon.vue'
import SunIcon from '@/components/icons/SunIcon.vue'

import { Button } from '@/components/ui/button'

const isDark = useDark({ storageKey: 'theme' })

const toggleDark = useToggle(isDark)
</script>

<template>
  <Button variant="outline" size="icon" @click="toggleDark()">
    <MoonIcon class="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    <SunIcon class="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    <span class="sr-only">Altera o tema da aplicação</span>
  </Button>
</template>
