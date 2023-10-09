<script setup lang="ts">
import { h, ref, computed, ComputedRef, onMounted } from 'vue'

import { valueUpdater } from '@/lib/utils'

import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useUsersToBusinessStore } from '@/stores/usersToBusiness'

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'

import DropdownAction from '@/views/dashboard/settings/TeamMembersDataTableActions.vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const usersToBusinessStore = useUsersToBusinessStore()

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: string
}

const data: ComputedRef<User[]> = computed(() => {
  if (!usersToBusinessStore.profiles) return []

  return usersToBusinessStore.profiles.map((user) => ({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    role: user.role,
  }))
})


const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'checked': table.getIsAllPageRowsSelected(),
      'onUpdate:checked': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Selecionar tudo',
    }),
    cell: ({ row }) => h(Checkbox, {
      'checked': row.getIsSelected(),
      'onUpdate:checked': value => row.toggleSelected(!!value),
      'ariaLabel': 'Selecionar usuário',
    }),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'User',
    header: 'Usuário',
    cell: ({ row }) => {
      const user = row.original

      return h('div', { class: 'flex items-center space-x-4' }, [
          h(Avatar, { class: 'h-8 w-8' }, () => [
            h(AvatarImage, { src: user.avatar_url, alt: user.full_name }),
            h('div', { }, () => [
              h(AvatarFallback, {}, user.full_name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()),
            ]),
          ]),
          h('div', {
            class: 'flex flex-col justify-center space-y-1',
          }, [
            h('div', { class: 'text-md font-medium' }, user.full_name),
            h('div', { class: 'text-sm text-muted-foreground' }, user.email),
          ])
      ])
    },
  },

  {
    accessorKey: 'Nível de acesso',
    header: 'Nível de acesso',
    cell: ({ row }) => h('div', { class: 'captalize text-muted-foreground' }, row.original.role),
  },

  {
    accessorKey: 'email',
    header: ({ column }) => {
      return h(Button, {
        class: 'hidden',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    enableHiding: false,
    cell: ({ row }) => h('div', { class: 'captalize hidden' }, row.original.email),
  },

  {
    accessorKey: 'full_name',
    header: ({ column }) => {
      return h(Button, {
        class: 'hidden',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Nome', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    enableHiding: false,
    cell: ({ row }) => h('div', { class: 'captalize hidden' }, row.original.full_name),
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original

      return h('div', { class: 'relative' }, h(DropdownAction, {
        user,
      }))
    },
  },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const table = useVueTable({
  data: data.value,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
  }
})

onMounted(async () => {
  if (!authStore.session) await authStore.fetchSession()
  if (authStore.session && authStore.session.user) {
    if (!profileStore.profile) await profileStore.getProfileById(authStore.session.user.id)
    if (!usersToBusinessStore.profiles && profileStore.profile && profileStore.profile.business) await usersToBusinessStore.getUsersByBusinessId(profileStore.profile.business.id)
  }
})
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center py-4">
      <Input
        class="max-w-sm"
        placeholder="Filtre por email..."
        :model-value="(table.getColumn('email')?.getFilterValue() as string)"
        @update:model-value="table.getColumn('email')?.setFilterValue($event)"
      />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Colunas <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :checked="column.getIsVisible()"
            @update:checked="(value) => column.toggleVisibility(!!value)"
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              class="h-24"
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell
              col-span="{columns.length}"
              class="h-24 text-center"
            >
              Não foi encontrado resultados.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Próximo
        </Button>
      </div>
    </div>
  </div>
</template>
