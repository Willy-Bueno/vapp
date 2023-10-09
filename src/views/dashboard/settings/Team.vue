<script setup lang="ts">
import { ref, onMounted } from 'vue'

import * as z from 'zod'
import { toast } from 'vue-sonner'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useBusinessStore } from '@/stores/business'
import { useInviteLinkStore } from '@/stores/inviteLink'

import { generateToken } from '@/lib/token'
import { cn } from '@/lib/utils'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import TeamMembers from '@/views/dashboard/settings/TeamMembers.vue'

import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue'
import Link2Icon from '@/components/icons/Link2Icon.vue'
import PlusCircledIcon from '@/components/icons/PlusCircledIcon.vue'
import MinusCircledIcon from '@/components/icons/MinusCircledIcon.vue'

import { Loader2 } from 'lucide-vue-next'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const businessStore = useBusinessStore()
const inviteLinkStore = useInviteLinkStore()

const isLoading = ref(false)
const token = ref('')

interface InviteByEmailInput {
  id: string
  email: string
  role: string
}

const inviteByEmailInput = ref<Array<InviteByEmailInput>>([
  {
    id: Math.random().toString(36).substring(2, 9),
    email: '',
    role: 'Membro'
  }
])

const addMoreInviteByEmailInput = () => {
  inviteByEmailInput.value.push({
    id: Math.random().toString(36).substring(2, 9),
    email: '',
    role: 'Membro'
  })
}

const removeInviteByEmailInput = (id: string) => {
  inviteByEmailInput.value = inviteByEmailInput.value.filter((input) => input.id !== id)
}

const teamInviteByEmailSchema = z.array(z.object({
  email: z
    .string()
    .email({
      message: 'O email deve ser válido.',
    })
    .refine((email) => inviteByEmailInput.value.filter((input) => input.email === email).length <= 1, {
      message: 'O email já foi adicionado.',
    }),
  role: z
    .string()
    .refine((role) => ['Membro', 'Admin', 'Dono'].includes(role), {
      message: 'O role deve ser válido.',
    })
}))

type TeamInviteByEmailValues = z.infer<typeof teamInviteByEmailSchema>
const errors = ref<z.ZodFormattedError<TeamInviteByEmailValues> | null>(null)

function handleSendInviteByEmail() {
  const result = teamInviteByEmailSchema.safeParse(inviteByEmailInput.value)
  if (!result.success) {
    errors.value = result.error.format()
    return
  }
  console.warn('Method yet to be implemented')
}

function clipboardText(plainText: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(plainText)
      .then(() => {
        toast.success('Link copiado com sucesso!')
      })
  }
}

onMounted(async () => {
  if (!businessStore.business?.name || !businessStore.business?.email || !businessStore.business?.phone) {
    if (!authStore.session) await authStore.fetchSession()
    if (!profileStore.profile && authStore.session) await profileStore.getProfileById(authStore.session.user.id)
    if (profileStore.profile && profileStore.profile.business) await businessStore.getBusinessById(profileStore.profile.business.id)
  }

  if (!inviteLinkStore.inviteLink) {
    await inviteLinkStore.getInviteByBusinessId(businessStore.business?.id as string)
    console.log(businessStore.business?.id as string)
    if (!inviteLinkStore.inviteLink && businessStore.business && businessStore.business.id) {
      console.log('teste')
      await inviteLinkStore.createInviteLink({
        token: generateToken(),
        business_id: businessStore.business.id,
        role: 'Membro',
      })
    }
  }

  token.value = `${window.location.origin}/start/invite/${inviteLinkStore.inviteLink?.token}`
})
</script>
<template>
  <div>
    <p class="text-sm text-muted-foreground">
      Gerencie e convide membros para sua equipe.
    </p>
  </div>
  <Card class="w-full">
    <CardHeader class="flex flex-row items-center justify-between">
      <p>Convide novos membros por endereço de e-mail ou link.</p>
      <Dialog>
        <DialogTrigger>
          <Button size="sm">
            <Link2Icon class="w-4 h-4 mr-2" />
            Link de convite
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link de convite</DialogTitle>
            <DialogDescription>
              Permita que outras pessoas se juntem à sua equipe através do link abaixo.
            </DialogDescription>
          </DialogHeader>

          <div class="flex flex-col items-center justify-center">
            <div class="flex flex-row items-center justify-center">
              <Input class="w-full" v-model="token" />
              <Button size="sm" class="ml-2" @click="clipboardText(token)">
                Copiar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </CardHeader>
    <Separator />
    <form @submit.prevent="handleSendInviteByEmail">
      <CardContent class="grid gap-2 pt-6">
        <div class="grid grid-cols-3 gap-2 items-start" v-for="(input, i) in inviteByEmailInput" :key="input.id">
          <div class="grid col-span-2">
            <Label for="email" :class="cn('text-sm', errors?.[i]?.email && 'text-destructive')">Email</Label>
            <Input id="email" v-model="input.email" placeholder="example@gmail.com" />
            <div v-if="errors?.[i]?.email" class="text-sm text-destructive">
              <template v-for="error in errors?.[i]?.email?._errors" :key="error">
                <p>{{ error }}</p>
              </template>
            </div>
          </div>
          <div class="grid col-span-1 grid-cols-3 gap-2">
            <div class="grid col-span-2">
              <Label for="role" :class="cn('text-sm', errors?.[i]?.role && 'text-destructive')">Nível de Acesso</Label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button id="role" variant="outline" class="flex justify-start w-full">
                    {{ input.role }}
                    <ChevronDownIcon class="ml-2 h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="p-0" align="end">
                  <Command v-model="input.role">
                    <CommandInput placeholder="Selecione um nível de acesso..." />
                    <CommandList>
                      <CommandEmpty>Nível de acesso não encontrado.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem value="Membro" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                          <p>Membro</p>
                          <p class="text-sm text-muted-foreground">
                            Pode visualizar relatórios individuais, entrvistar e realizar vendas.
                          </p>
                        </CommandItem>
                        <CommandItem value="Admin" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                          <p>Admin</p>
                          <p class="text-sm text-muted-foreground">
                            Pode visualizar todos os relatórios, criar questionários, entrevistar, cadastrar produtos, realizar vendas e cadatrar pontos de presença.
                          </p>
                        </CommandItem>
                        <CommandItem value="Dono" class="teamaspace-y-1 flex flex-col items-start px-4 py-2">
                          <p>Dono</p>
                          <p class="text-sm text-muted-foreground">
                            Tem acesso a todos os recursos do sistema.
                          </p>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div v-if="errors?.[i]?.role" class="text-sm text-destructive">
                <span v-for="error in errors?.[i]?.role?._errors" :key="error">{{ error }}</span>
              </div>
            </div>
            <div class="grid col-span-1 items-end">
              <Label for="remove">Remover</Label>
              <Button id="remove" class="h-[38px]" variant="outline" @click="removeInviteByEmailInput(input.id)" :disabled="inviteByEmailInput.length === 1">
                <MinusCircledIcon class="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Button type="button" size="sm" @click.prevent="addMoreInviteByEmailInput" disabled>
            <PlusCircledIcon class="w-4 h-4 mr-2" />
            Adicionar mais
          </Button>
        </div>
      </CardContent>
      <Separator />
      <CardFooter>
        <div class="flex justify-end items-center w-full pt-4">
          <Button type="submit" size="sm" disabled>
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Convidar
          </Button>
        </div>
      </CardFooter>
    </form>
  </Card>
  <div>
    <Tabs default-value="members" class="space-y-4">
      <TabsList class="bg-transparent space-x-4">
        <TabsTrigger class="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b border-b-black dark:border-b-neutral-200" value="members">
          Membros da Equipe
        </TabsTrigger>
        <TabsTrigger class="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b border-b-black dark:border-b-neutral-200" value="pending-invites" disabled>
          Convites Pendentes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="members" class="space-y-4">
      <div class="hidden space-y-6 p-1 md:block">
        <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div class="flex-1">
            <div class="w-full space-y-6">
              <TeamMembers />
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
    </Tabs>
  </div>
</template>
