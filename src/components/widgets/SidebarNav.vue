<script setup lang="ts">
import { useRoute } from "vue-router"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

interface Item {
  title: string
  tab: string
}

const $route = useRoute()

const sidebarNavItems: Item[] = [
  {
    title: "Detalhes",
    tab: "details",
  },
  {
    title: "Questões",
    tab: "questions",
  },
  {
    title: "Respostas",
    tab: "responses",
  },
  {
    title: "Respostas Pendentes",
    tab: "pending-responses",
  },
  {
    title: "Relatório",
    tab: "reports",
  },
]
</script>

<template>
  <nav class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
    <Button v-for="item in sidebarNavItems" :key="item.title" as="a" variant="ghost" :class="cn('w-full text-left justify-start', $route.path === `teste` && 'bg-muted hover:bg-muted')">
      {{ item.title }}
    </Button>
  </nav>
</template>
