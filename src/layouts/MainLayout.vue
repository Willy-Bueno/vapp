<script setup lang="ts">
import { computed } from 'vue'

import { useWindowScroll } from '@vueuse/core'

import { cn } from '@/lib/utils'

import ThemeSwitcher from '@/components/application/ThemeSwitcher.vue'
import MainNav from '@/components/application/MainNav.vue'
import UserNav from '@/components/application/UserNav.vue'
import VappLogo from '@/components/icons/VappLogo.vue'

const { y } = useWindowScroll()

const scrolled = computed(() => y.value > 40)
</script>

<template>
  <div class="hidden flex-col md:flex">
    <div :class="cn('fixed inset-x-0 top-0 z-30 w-full transition-all ', {
      'backdrop-blur-lg border-b': scrolled
    })">
      <div class="flex flex-grow h-16 items-center px-8 max-w-7xl mx-auto">
        <a href="/">
          <VappLogo class="h-8 w-8" name="Vendas App" />
        </a>
        <MainNav class="mx-6" />
        <div class="ml-auto flex items-center space-x-4">
          <ThemeSwitcher />
          <UserNav />
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col flex-grow max-w-7xl mx-auto mt-20">
    <RouterView />
  </div>
</template>
