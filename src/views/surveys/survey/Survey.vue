<script setup lang="ts">
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '@/components/ui/tabs'

  import Details from '@/views/surveys/survey/Details.vue'
  import Questions from '@/views/surveys/survey/Questions.vue'
  import Responses from '@/views/surveys/survey/Responses.vue'
  import PendingResponses from '@/views/surveys/survey/PendingResponses.vue'
  import Reports from '@/views/surveys/survey/Reports.vue'
</script>

<template>
  <div class="flex-1 space-y-4 p-4 md:p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Questionário</h1>
    </div>
  </div>
  <Tabs default-value="details" class="space-y-4 px-4 md:px-8">
    <TabsList>
      <TabsTrigger value="details">
        Detalhes
      </TabsTrigger>
      <TabsTrigger value="questions">
        Questões
      </TabsTrigger>
      <TabsTrigger value="responses">
        Respostas
      </TabsTrigger>
      <TabsTrigger value="pending-responses">
        Respostas Pendentes
      </TabsTrigger>
      <TabsTrigger value="reports">
        Relatório
      </TabsTrigger>
    </TabsList>
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
  </Tabs>
</template>

