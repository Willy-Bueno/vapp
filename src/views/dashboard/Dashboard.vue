<script setup lang="ts">
import { ref } from 'vue'

import TabRoutingList from '@/components/widgets/TabRoutingList.vue'

import { SectionTitle } from '@/components/ui/section-title'
import { TabsContent } from '@/components/ui/tabs'

import Overview from '@/views/dashboard/Overview.vue'

const tabs = ref([
  {
    name: 'overview',
    label: 'Visão Geral',
  }
])
</script>

<template>
  <SectionTitle>Questionários</SectionTitle>
  <TabRoutingList :tabs="tabs" default-tab="overview">
    <template #tabs-content>
      <TabsContent value="overview" class="space-y-4">
        <div class="space-y-6 p-1">
          <div class="flex flex-col space-y-8">
            <div class="flex-1 space-y-6">
              <Overview />
            </div>
          </div>
        </div>
      </TabsContent>
    </template>
  </TabRoutingList>
</template>
