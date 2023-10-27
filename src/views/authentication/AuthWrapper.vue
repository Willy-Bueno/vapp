<script setup lang="ts">
import VappLogo from '@/components/icons/VappLogo.vue'

defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="relative z-10 h-fit w-full max-w-xl overflow-hidden border border-gray-100 sm:rounded-2xl sm:shadow-xl">
    <div class="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
        <a href="/">
          <VappLogo class="h-10 w-10" />
        </a>
        <h3 class="text-xl font-semibold">{{ title  }}</h3>
        <p class="text-sm text-gray-500">
          {{ subtitle }}
        </p>
      </div>
      <slot></slot>
  </div>
</template>
