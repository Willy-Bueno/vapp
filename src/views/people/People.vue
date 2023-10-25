<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { usePeopleStore } from '@/stores/people'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import PeopleDataTable from '@/views/people/PeopleDataTable.vue'

const peopleStore = usePeopleStore()
const isLoading = ref(true)
const peoples = ref()

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
  <div class="flex-1 space-y-4 p-4 md:p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Pessoas</h2>
    </div>
  </div>
  <Tabs default-value="overview" class="space-y-4 px-4 md:px-8">
    <div class="w-full flex justify-between items-center">
      <TabsList>
        <TabsTrigger value="poples">
          Pessoas
        </TabsTrigger>
      </TabsList>
    </div>
    <TabsContent value="overview" class="space-y-4">
      <div class="space-y-6 p-1">
        <div class="flex flex-col space-y-8">
          <div class="flex-1 space-y-6">
            <PeopleDataTable v-if="!isLoading" :data="peoples" />
          </div>
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>
