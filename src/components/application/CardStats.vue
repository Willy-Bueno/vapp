<script setup lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'

  import DotFilledIcon from '@/components/icons/DotFilledIcon.vue'

  interface CardStatsProps {
    title: string
    value: any
  }

  defineProps<CardStatsProps>()
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        {{ title }}
      </CardTitle>
      <DotFilledIcon class="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">
        {{ value }}
      </div>
    </CardContent>
  </Card>
</template>
