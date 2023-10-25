<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import MoreHorizontal from '@/components/icons/MoreHorizontalIcon.vue'

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Exibir Menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
      <DropdownMenuItem>Entrevistar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
