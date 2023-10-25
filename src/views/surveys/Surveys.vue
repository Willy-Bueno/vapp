<script setup lang="ts">
import { computed } from 'vue'

import { useRouter } from 'vue-router'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import Overview from '@/views/surveys/Overview.vue'
import Interview from '@/views/surveys/Interview.vue'
import SurveysList from '@/views/surveys/SurveysList.vue'
import Responses from '@/views/surveys/Responses.vue'

import SurveySheet from '@/components/survey/SurveySheet.vue'

const router = useRouter()

const currentRoute = computed(() => router.currentRoute.value.name)
</script>

<template>
  <div class="flex-1 space-y-4 p-4 md:p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Questionários</h2>
    </div>
  </div>
  <Tabs default-value="overview" class="space-y-4 px-4 md:px-8">
    <div class="w-full flex justify-between items-center">
      <TabsList>
        <TabsTrigger value="overview">
          Visão Geral
        </TabsTrigger>
        <TabsTrigger value="surveys">
          Questionários
        </TabsTrigger>
        <TabsTrigger value="interview">
          Entrevistar
        </TabsTrigger>
        <TabsTrigger value="responses">
          Respostas
        </TabsTrigger>
      </TabsList>
      <SurveySheet v-if="currentRoute === 'surveys'" />
    </div>
    <TabsContent value="overview" class="space-y-4">
      <div class="space-y-6 p-1">
        <div class="flex flex-col space-y-8">
          <div class="flex-1 space-y-6">
            <Overview />
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="surveys" class="space-y-4">
      <div class="space-y-6 p-1">
        <div class="flex flex-col space-y-8">
          <div class="flex-1 space-y-6">
            <SurveysList />
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="interview" class="space-y-4">
      <div class="space-y-6 p-1">
        <div class="flex flex-col space-y-8">
          <div class="flex-1 space-y-6">
            <Interview />
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="responses" class="space-y-4">
      <div class="space-y-6 p-1">
        <div class="flex flex-col space-y-8">
          <div class="flex-1 space-y-6">
            <Responses />
          </div>
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>
