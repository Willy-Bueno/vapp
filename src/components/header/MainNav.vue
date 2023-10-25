<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { cn } from '@/lib/utils'

const navigationLinks = computed(() => {
  const route = useRoute()
  const path = route.path

  const links = [
    {
      name: 'Questionários',
      path: '/surveys',
      current: path.startsWith('/surveys'),
    },

    {
      name: 'Pessoas',
      path: '/people',
      current: path.startsWith('/people'),
    },

    {
      name: 'Configurações',
      path: '/settings',
      current: path.startsWith('/settings')
    },

  ]

  return links
})
</script>

<template>
  <nav
    :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')"
  >
    <a v-for="link in navigationLinks" :key="link.name" :href="link.path" :class="cn('text-sm font-medium transition-colors', link.current ? 'text-primary' : 'text-muted-foreground hover:text-primary')">
      {{ link.name }}
    </a>
  </nav>
</template>
