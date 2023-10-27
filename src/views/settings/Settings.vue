<script setup lang="ts">
import { ref } from 'vue'

import TabRoutingList from '@/components/widgets/TabRoutingList.vue'

import { SectionTitle } from '@/components/ui/section-title'
import { TabsContent } from '@/components/ui/tabs'

import RecoveryPassword from '@/views/settings/RecoveryPassword.vue'
import Appearance from '@/views/settings/Appearance.vue'
import Account from '@/views/settings/Account.vue'
import Company from '@/views/settings/Company.vue'
import Team from '@/views/settings/Team.vue'

const tabs = ref([
  {
    name: 'account',
    label: 'Conta',
  },
  {
    name: 'recovery-password',
    label: 'Recuperar senha',
  },
  {
    name: 'company',
    label: 'Empresa',
  },
  {
    name: 'appearance',
    label: 'Aparência',
  },
  {
    name: 'team',
    label: 'Equipe',
  }
])
</script>

<template>
  <SectionTitle>Configurações</SectionTitle>
  <TabRoutingList :tabs="tabs" default-tab="account" tab-action="account">
    <template #tabs-content>
      <TabsContent value="account" class="space-y-4">
        <div class="space-y-6 p-1">
          <div class="flex flex-col space-y-8">
            <div class="flex-1 space-y-6">
              <Account />
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="recovery-password" class="space-y-4">
        <div class="space-y-6 p-1">
          <div class="flex flex-col space-y-8">
            <div class="flex-1 space-y-6">
              <RecoveryPassword/>
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
    </template>
  </TabRoutingList>
</template>
