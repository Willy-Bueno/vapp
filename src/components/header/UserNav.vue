<script setup lang="ts">
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"

import { useAuthStore } from "@/stores/auth"
import { useUserStore } from "@/stores/user"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const router = useRouter()

const userStore = useUserStore()
const authStore = useAuthStore()

const user = computed(() => userStore.user)

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: "login" })
}

onMounted(async () => {
  await userStore.getUser()
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="relative h-8 w-8 rounded-full">
        <Avatar class="h-8 w-8">
          <AvatarImage v-if="user?.avatar" :src="user.avatar" :alt="user.name" />
          <AvatarFallback>
            {{
              user?.name
                .split(" ")
                .slice(0, 2)
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
            }}
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="font-normal flex">
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ user?.name.split(" ").slice(0, 2).join(" ") }}
          </p>
          <p class="text-xs leading-none text-muted-foreground">
            {{ user?.email }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleLogout"> Sair </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
