<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { usePeopleStore } from '@/stores/people'

import TabRoutingList from '@/components/widgets/TabRoutingList.vue'

import { SectionTitle } from '@/components/ui/section-title'
import { TabsContent } from '@/components/ui/tabs'

import PeopleDataTable from '@/views/people/PeopleDataTable.vue'

const peopleStore = usePeopleStore()

const tabs = ref([
  {
    name: 'people',
    label: 'Pessoas',
  }
])

onMounted(async () => {
  await peopleStore.getPeoples()
})
</script>

<template>
  <SectionTitle>Pessoas</SectionTitle>
  <TabRoutingList :tabs="tabs" default-tab="people">
    <template #tabs-content>
      <TabsContent value="people" class="space-y-4">
      <div class="space-y-6 p-1">
        <div class="flex flex-col space-y-8">
          <div class="flex-1 space-y-6">
            <PeopleDataTable />
          </div>
        </div>
      </div>
    </TabsContent>
    </template>
  </TabRoutingList>
</template>
