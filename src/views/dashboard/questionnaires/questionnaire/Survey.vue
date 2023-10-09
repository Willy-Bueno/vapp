<script setup lang="ts">
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '@/components/ui/tabs'

  import SurveyDetails from '@/views/dashboard/questionnaires/questionnaire/SurveyDetails.vue'
  import SurveyQuestions from '@/views/dashboard/questionnaires/questionnaire/SurveyQuestions.vue'
  import SurveyStatistcs from '@/views/dashboard/questionnaires/questionnaire/SurveyStatistcs.vue'
  import SurveyResponses from '@/views/dashboard/questionnaires/questionnaire/SurveyResponses.vue'
  import SurveyPendingResponses from '@/views/dashboard/questionnaires/questionnaire/SurveyPendingResponses.vue'
</script>

<template>
  <div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Questionário</h1>
    </div>
  </div>
  <Tabs default-value="basic-infos" class="space-y-4 px-8">
    <TabsList>
      <TabsTrigger value="basic-infos">
        Informações básicas
      </TabsTrigger>
      <TabsTrigger value="questions">
        Questões
      </TabsTrigger>
      <TabsTrigger value="statistcs">
        Estatísticas
      </TabsTrigger>
      <TabsTrigger value="responses">
        Respostas
      </TabsTrigger>
      <TabsTrigger value="pending-responses">
        Respostas pendentes
      </TabsTrigger>
    </TabsList>
    <TabsContent value="basic-infos" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1 lg:max-w-2xl">
            <div class="space-y-6">
              <SurveyDetails />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="questions" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1">
            <div class="space-y-6">
              <SurveyQuestions />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="statistcs" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1">
            <div class="space-y-6">
              <SurveyStatistcs />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="responses" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1">
            <div class="space-y-6">
              <SurveyResponses />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="pending-responses" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1">
            <div class="space-y-6">
              <SurveyPendingResponses />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>

