<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { cn } from "@/lib/utils"

import Home from "@/components/icons/HomeIcon.vue"
import FileText from "@/components/icons/FileTextIcon.vue"
import Person from "@/components/icons/PersonIcon.vue"
import Settings from "@/components/icons/SettingsIcon.vue"

const navigationLinks = computed(() => {
  const route = useRoute()
  const path = route.path

  const links = [
    {
      name: "Dashboard",
      path: "/",
      icon: Home,
      current: path === "/",
    },

    {
      name: "Questionários",
      path: "/surveys",
      icon: FileText,
      current: path.startsWith("/surveys"),
    },

    {
      name: "Pessoas",
      path: "/people",
      icon: Person,
      current: path.startsWith("/people"),
    },

    {
      name: "Configurações",
      path: "/settings",
      icon: Settings,
      current: path.startsWith("/settings"),
    },
  ]

  return links
})
</script>

<template>
  <nav :class="cn('flex items-center space-x-6 lg:space-x-8', $attrs.class ?? '')">
    <a
      v-for="link in navigationLinks"
      :key="link.name"
      :href="link.path"
      :class="cn('text-sm font-medium transition-colors', link.current ? 'text-primary' : 'text-muted-foreground hover:text-primary')"
    >
      <span class="flex items-center space-x-2">
        <component :is="link.icon" class="h-5 w-5" />
        <span class="hidden sm:block">{{ link.name }}</span>
      </span>
    </a>
  </nav>
</template>
