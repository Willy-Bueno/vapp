<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useInviteLinkStore } from '@/stores/inviteLink'
import { useUsersToBusinessStore } from '@/stores/usersToBusiness'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { Loader2 } from 'lucide-vue-next'

const router = useRouter()

const authStore = useAuthStore()
const profileStore = useProfileStore()
const inviteLinkStore = useInviteLinkStore()
const usersToBusinessStore = useUsersToBusinessStore()

const isLoadingAccept = ref(false)
const isLoadingDecline = ref(false)

const business = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
})

function handleAccept() {
  isLoadingAccept.value = true

  const promise = () => new Promise((resolve) => resolve(usersToBusinessStore.addUserToBusiness({
      user_id: authStore.session?.user.id as string,
      business_id: business.value.id
    }).then(() =>
      profileStore.updateProfile({
        id: authStore.session?.user.id as string,
        business: business.value.id,
        role: inviteLinkStore.inviteLink?.role as string || 'Membro',
      })
    )))

  toast.promise(promise, {
    loading: 'Aceitando convite...',
    success: () => 'Convite aceito com sucesso!',
    error: () => 'Ocorreu um erro ao aceitar o convite.',
  })

  setTimeout(() => router.push({ name: 'dashboard' }), 2000)
  isLoadingAccept.value = false
}

function handleDecline() {
  isLoadingDecline.value = true
  setTimeout(() => router.push({ name: 'dashboard' }), 2000)
  isLoadingDecline.value = false
}

onMounted(async () => {
  if (!authStore.session) await authStore.fetchSession()
  if (authStore.session && authStore.session.user) {
    if (!profileStore.profile) await profileStore.getProfileById(authStore.session.user.id)
    const token = router.currentRoute.value.params.token
    if (token) await inviteLinkStore.getBusinessByToken(token.toString())

    if (inviteLinkStore.business) business.value = inviteLinkStore.business
  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-2">
      <Label for="name" class="text-sm">
        Nome
      </Label>
      <Input id="name" v-model="business.name" placeholder="Nome da empresa" disabled />
    </div>
    <div class="grid gap-2">
      <Label for="email" class="text-sm">
        Email
      </Label>
      <Input id="email" v-model="business.email" placeholder="Email" disabled />
    </div>
    <div class="grid gap-2">
      <Label for="phone" class="text-sm">
        Telefone
      </Label>
      <Input id="phone" v-model="business.phone" placeholder="Telefone" disabled />
    </div>
    <div class="flex justify-end">
      <div class="flex gap-2">
        <Button variant="destructive" @click="handleDecline">
          <Loader2 v-if="isLoadingDecline" class="mr-2 h-4 w-4 animate-spin" />
          Recusar
        </Button>
        <Button @click="handleAccept">
          <Loader2 v-if="isLoadingAccept" class="mr-2 h-4 w-4 animate-spin" />
          Aceitar
        </Button>
      </div>
    </div>
  </div>
</template>
