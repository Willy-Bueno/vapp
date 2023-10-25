<script setup lang="ts">
import { ref } from 'vue'

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectValue,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'

type TabsProps = {
  defaultTab: string
  tabs: Array<{
    name: string
    label: string
    disabled?: boolean
  }>
}

const props = defineProps<TabsProps>()

const tab = ref(props.defaultTab)

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual('sm')
</script>

<template>
  <Tabs v-model="tab" :default-value="props.defaultTab" class="space-y-4 px-4 md:px-8">
    <div class="w-full flex justify-between items-center">
      <TabsList v-if="smAndLarger">
        <TabsTrigger  v-for="tab in props.tabs" :key="tab.name" :value="tab.name" :disabled="tab.disabled">
          {{ tab.label }}
        </TabsTrigger>
      </TabsList>
      <Select v-else v-model="tab" class="hidden">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Selecione uma rota" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="tab in props.tabs" :key="tab.name" :value="tab.name">
              {{ tab.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <slot name="actions" ></slot>
    </div>
    <slot name="tabs-content"></slot>
  </Tabs>
</template>
