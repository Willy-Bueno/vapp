<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { toast } from "vue-sonner"

import { useUserStore } from "@/stores/user"
import { useInviteStore } from "@/stores/invite"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import Loader from "@/components/icons/Loader.vue"

import { Tables } from "@/types"

type Company = Tables<"companies">

type Invite = Tables<"invite_tokens"> & {
  companies: Company
}

const router = useRouter()

const userStore = useUserStore()
const inviteStore = useInviteStore()

const isLoadingAccept = ref(false)
const isLoadingDecline = ref(false)

const company = ref({
  id: "",
  name: "",
  email: "",
  phone: "",
})

function handleAccept() {
  isLoadingAccept.value = true

  const promise = () =>
    new Promise((resolve) =>
      resolve(
        userStore.updateUser({
          company_id: company.value.id,
        })
      )
    )

  toast.promise(promise, {
    loading: "Aceitando convite...",
    success: () => {
      isLoadingAccept.value = false
      router.push({ name: "surveys" })
      return "Convite aceito com sucesso."
    },
    error: () => {
      isLoadingAccept.value = false
      return "Erro ao aceitar convite."
    },
  })
}

function handleDecline() {
  isLoadingDecline.value = true
  router.push({ name: "surveys" })
  isLoadingDecline.value = false
}

onMounted(async () => {
  const inviteToken = router.currentRoute.value.params.token as string
  await inviteStore.getInviteTokenByToken(inviteToken)
  console.log(inviteStore.inviteToken)
  if (inviteStore.inviteToken) {
    const data = inviteStore.inviteToken as Invite
    company.value = data.companies
  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-2">
      <Label for="name" class="text-sm"> Nome </Label>
      <Input id="name" v-model="company.name" placeholder="Nome da empresa" disabled />
    </div>
    <div class="grid gap-2">
      <Label for="email" class="text-sm"> Email </Label>
      <Input id="email" v-model="company.email" placeholder="Email" disabled />
    </div>
    <div class="grid gap-2">
      <Label for="phone" class="text-sm"> Telefone </Label>
      <Input id="phone" v-model="company.phone" placeholder="Telefone" disabled />
    </div>
    <div class="flex justify-end">
      <div class="flex gap-2">
        <Button variant="destructive" @click="handleDecline">
          <Loader v-if="isLoadingDecline" class="mr-2 h-4 w-4 animate-spin" />
          Recusar
        </Button>
        <Button @click="handleAccept">
          <Loader v-if="isLoadingAccept" class="mr-2 h-4 w-4 animate-spin" />
          Aceitar
        </Button>
      </div>
    </div>
  </div>
</template>
