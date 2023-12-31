<script setup lang="ts">
import { ref, watch, onBeforeMount } from "vue"
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core"

import { useRouter } from "vue-router"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectValue, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select"

type TabsProps = {
  defaultTab: string
  tabAction?: string
  tabs: Array<{
    name: string
    label: string
    disabled?: boolean
  }>
}

const props = defineProps<TabsProps>()

const router = useRouter()

const tab = ref(props.defaultTab)

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual("sm")

watch(tab, (value) => {
  const query = router.currentRoute.value.query
  if (query.tab && query.tab !== value) {
    router.replace({ query: { ...query, tab: undefined } })
  }
})

onBeforeMount(() => {
  const queryTab = router.currentRoute.value.query.tab
  if (queryTab) {
    tab.value = queryTab as string
  }
})
</script>

<template>
  <Tabs v-model="tab" :default-value="props.defaultTab" class="space-y-4 px-4 md:px-8">
    <div class="w-full flex justify-between items-center">
      <TabsList v-if="smAndLarger">
        <TabsTrigger v-for="tabT in props.tabs" :key="tabT.name" :value="tabT.name" :disabled="tabT.disabled">
          {{ tabT.label }}
        </TabsTrigger>
      </TabsList>
      <Select v-else v-model="tab" class="hidden">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Selecione uma rota" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="tabI in props.tabs" :key="tabI.name" :value="tabI.name">
              {{ tabI.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <slot v-if="!tabAction || tabAction === tab" name="actions"></slot>
    </div>
    <slot name="tabs-content"></slot>
  </Tabs>
</template>
