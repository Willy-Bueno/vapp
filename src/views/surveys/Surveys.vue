<script setup lang="ts">
import { ref } from "vue"

import TabRoutingList from "@/components/widgets/TabRoutingList.vue"

import { SectionTitle } from "@/components/ui/section-title"
import { TabsContent } from "@/components/ui/tabs"

import SurveySheet from "@/components/survey/SurveySheet.vue"

import SurveysList from "@/views/surveys/SurveysList.vue"
import Interview from "@/views/surveys/Interview.vue"
import Responses from "@/views/surveys/Responses.vue"

const tabs = ref([
  {
    name: "surveys",
    label: "Questionários",
  },
  {
    name: "interview",
    label: "Entrevistar",
  },
  {
    name: "responses",
    label: "Respostas",
  },
])
</script>

<template>
  <SectionTitle>Questionários</SectionTitle>
  <TabRoutingList :tabs="tabs" default-tab="surveys">
    <template #actions>
      <SurveySheet />
    </template>
    <template #tabs-content>
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
    </template>
  </TabRoutingList>
</template>
