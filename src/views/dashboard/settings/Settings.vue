<script setup lang="ts">
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '@/components/ui/tabs'

  import Account from '@/views/dashboard/settings/Account.vue'
  import Business from '@/views/dashboard/settings/Business.vue'
  import Appearance from '@/views/dashboard/settings/Appearance.vue'
  import Team from '@/views/dashboard/settings/Team.vue'
</script>

<template>
  <div class="flex-1 space-y-4 p-8 pt-6">
    <div class="flex items-center justify-between space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Configurações</h2>
    </div>
  </div>
  <Tabs default-value="account" class="space-y-4 px-8">
    <TabsList>
      <TabsTrigger value="account">
        Conta
      </TabsTrigger>
      <TabsTrigger value="business">
        Empresa
      </TabsTrigger>
      <TabsTrigger value="team">
        Equipe
      </TabsTrigger>
      <TabsTrigger value="appearance">
        Aparência
      </TabsTrigger>
    </TabsList>
    <TabsContent value="account" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1 lg:max-w-2xl">
            <div class="space-y-6">
              <Account />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="business" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1 lg:max-w-2xl">
            <div class="space-y-6">
              <Business />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="appearance" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1 lg:max-w-2xl">
            <div class="space-y-6">
              <Appearance />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="team" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1">
            <div class="space-y-6">
              <Team />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>
