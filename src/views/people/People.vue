<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

import TabRoutingList from '@/components/widgets/TabRoutingList.vue'

import { SectionTitle } from '@/components/ui/section-title'
import { TabsContent } from '@/components/ui/tabs'

import PeopleDataTable from '@/views/people/PeopleDataTable.vue'

import { usePeopleStore } from '@/stores/people'

const peopleStore = usePeopleStore()
const isLoading = ref(true)
const peoples = ref()

const tabs = ref([
  {
    name: 'people',
    label: 'Pessoas',
  }
])

onBeforeMount(async () => {
  const res = await peopleStore.getPeoples()
  peoples.value = res.map((people) => ({
    id: people.id,
    first_name: people.first_name,
    last_name: people.last_name,
    email: people.email,
    phone: people.phone,
  }))
  isLoading.value = false
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
            <PeopleDataTable v-if="!isLoading" :data="peoples" />
          </div>
        </div>
      </div>
    </TabsContent>
    </template>
  </TabRoutingList>
</template>
