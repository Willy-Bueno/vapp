<script setup lang="ts">
import { ref } from 'vue'

import TabRoutingList from '@/components/widgets/TabRoutingList.vue'
import { SectionTitle } from '@/components/ui/section-title'
import { Button } from '@/components/ui/button'

import {
  TabsContent,
} from '@/components/ui/tabs'

import Details from '@/views/surveys/survey/Details.vue'
import Questions from '@/views/surveys/survey/Questions.vue'
import Responses from '@/views/surveys/survey/Responses.vue'
import PendingResponses from '@/views/surveys/survey/PendingResponses.vue'
import Reports from '@/views/surveys/survey/Reports.vue'

const tabs = ref([
  {
    name: 'details',
    label: 'Detalhes',
  },
  {
    name: 'questions',
    label: 'Questões',
  },
  {
    name: 'responses',
    label: 'Respostas',
  },
  {
    name: 'pending-responses',
    label: 'Respostas Pendentes',
  },
  {
    name: 'reports',
    label: 'Relatório',
  }
])
</script>

<template>
  <SectionTitle>
    <Button type="button" variant="outline" class="mr-4 group" @click="$router.go(-1)">
      voltar
    </Button>
    Questionário
  </SectionTitle>
  <TabRoutingList :tabs="tabs" default-tab="details">
    <template #tabs-content>
      <TabsContent value="details" class="space-y-4">
        <div class="space-y-6 p-1">
          <div class="flex flex-col space-y-8">
            <div class="flex-1 space-y-6">
              <Details />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="questions" class="space-y-4">
        <div class="space-y-6 p-1">
          <div class="flex flex-col space-y-8">
            <div class="flex-1 space-y-6">
              <Questions />
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
      <TabsContent value="pending-responses" class="space-y-4">
        <div class="space-y-6 p-1">
          <div class="flex flex-col space-y-8">
            <div class="flex-1 space-y-6">
              <PendingResponses />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="reports" class="space-y-4">
        <div class="space-y-6 p-1">
          <div class="flex flex-col space-y-8">
            <div class="flex-1 space-y-6">
              <Reports />
            </div>
          </div>
        </div>
      </TabsContent>
    </template>
  </TabRoutingList>
</template>

