<script setup lang="ts">
import { h, ref, computed, ComputedRef, onMounted } from "vue"

import { valueUpdater } from "@/lib/utils"

import { useCompanyStore } from "@/stores/company"

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/vue-table"
import { FlexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from "@tanstack/vue-table"

import ArrowUpDown from "@/components/icons/ArrowUpDownIcon.vue"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Tables } from "@/types"

type Company = Tables<"companies"> & {
  users: Tables<"users">[]
}

type User = {
  id: string
  email: string
  name: string
  avatar: string
}

const companyStore = useCompanyStore()

const data: ComputedRef<User[]> = computed(() => {
  const dataCompany = companyStore.company as Company
  if (!dataCompany) return []

  return dataCompany.users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  }))
})

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        "onUpdate:checked": (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Selecionar tudo",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value) => row.toggleSelected(!!value),
        ariaLabel: "Selecionar usuário",
      }),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "User",
    header: "Usuário",
    cell: ({ row }) => {
      const user = row.original

      return h("div", { class: "flex items-center space-x-4" }, [
        h(Avatar, { class: "h-8 w-8" }, () => [
          h(AvatarImage, { src: user.avatar, alt: user.name }),
          h("div", {}, () => [
            h(
              AvatarFallback,
              {},
              user.name
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            ),
          ]),
        ]),
        h(
          "div",
          {
            class: "flex flex-col justify-center space-y-1",
          },
          [h("div", { class: "text-md font-medium" }, user.name), h("div", { class: "text-sm text-muted-foreground" }, user.email)]
        ),
      ])
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return h(
        Button,
        {
          class: "hidden",
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Email", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      )
    },
    enableHiding: false,
    cell: ({ row }) => h("div", { class: "captalize hidden" }, row.original.email),
  },

  {
    accessorKey: "name",
    header: ({ column }) => {
      return h(
        Button,
        {
          class: "hidden",
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Nome", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      )
    },
    enableHiding: false,
    cell: ({ row }) => h("div", { class: "captalize hidden" }, row.original.name),
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
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
  },
})

onMounted(async () => {
  await companyStore.getCompany()
})
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center py-4">
      <Input
        class="max-w-sm"
        placeholder="Filtre por email..."
        :model-value="table.getColumn('email')?.getFilterValue() as string"
        @update:model-value="table.getColumn('email')?.setFilterValue($event)"
      />
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
            <TableRow class="h-24" v-for="row in table.getRowModel().rows" :key="row.id" :data-state="row.getIsSelected() && 'selected'">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>

          <TableRow v-else>
            <TableCell col-span="{columns.length}" class="h-24 text-center"> Não foi encontrado resultados. </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} de {{ table.getFilteredRowModel().rows.length }} {{ `usuário${table.getFilteredRowModel().rows.length > 1 ? "s" : ""}` }} selecionado{{
          table.getFilteredSelectedRowModel().rows.length > 1 ? "s" : ""
        }}
      </div>
      <div class="space-x-2">
        <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()"> Anterior </Button>
        <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()"> Próximo </Button>
      </div>
    </div>
  </div>
</template>
