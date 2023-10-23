<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';

import DotFilledIcon from '@/components/icons/DotFilledIcon.vue'

interface CardReportWidgetProps {
  title: string
  value: any
  isLoading: boolean
}

defineProps<CardReportWidgetProps>()
</script>

<template>
  <Card v-if="!isLoading">
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
  <Card v-else>
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle class="text-sm font-medium">
        <Skeleton class="w-24 h-4" />
      </CardTitle>
      <DotFilledIcon class="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div class="text-2xl font-bold">
        <Skeleton class="w-24 h-4" />
      </div>
    </CardContent>
  </Card>
</template>
