<script setup lang="ts">
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import SurveysOverview from '@/views/dashboard/questionnaires/SurveysOverview.vue'
import Interview from '@/views/dashboard/questionnaires/interview/Interview.vue'
</script>

<template>
  <div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Questionários</h1>
    </div>
  </div>
  <Tabs default-value="overview" class="space-y-4 px-8">
    <TabsList>
      <TabsTrigger value="overview">
        Geral
      </TabsTrigger>
      <TabsTrigger value="interview">
        Entrevista
      </TabsTrigger>
    </TabsList>
    <TabsContent value="overview" class="space-y-4">
      <SurveysOverview />
    </TabsContent>
    <TabsContent value="interview" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1">
            <div class="space-y-6">
              <Interview/>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>
