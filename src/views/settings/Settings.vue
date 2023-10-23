<script setup lang="ts">
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '@/components/ui/tabs'

  import Appearance from '@/views/settings/Appearance.vue'
  import Account from '@/views/settings/Account.vue'
  import Company from '@/views/settings/Company.vue'
  import Team from '@/views/settings/Team.vue'
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
      <TabsTrigger value="company">
        Empresa
      </TabsTrigger>
      <TabsTrigger value="appearance">
        Aparência
      </TabsTrigger>
      <TabsTrigger value="team">
        Equipe
      </TabsTrigger>
    </TabsList>
    <TabsContent value="account" class="space-y-4">
      <div class="space-y-6 p-1">
        <div class="flex flex-col space-y-8">
          <div class="flex-1 space-y-6">
            <Account />
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="company" class="space-y-4">
      <div class="space-y-6 p-1">
        <div class="flex flex-col space-y-8">
          <div class="flex-1 space-y-6">
            <Company />
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="appearance" class="space-y-4">
      <div class="space-y-6 p-1">
        <div class="flex flex-col space-y-8">
          <div class="flex-1 space-y-6">
            <Appearance />
          </div>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="team" class="space-y-4">
      <div class="space-y-6 p-1">
        <div class="flex flex-col space-y-8">
          <div class="flex-1 space-y-6">
            <Team />
          </div>
        </div>
      </div>
    </TabsContent>
  </Tabs>
</template>
