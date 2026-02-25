<script lang="tsx" setup>
import type { Table } from '#components'
import type { RemoteRule } from '#server/db'
import type { TableColumn } from '@nuxt/ui'
import { UButton, USwitch } from '#components'
import CreateRemoteRuleModal from './CreateRemoteRuleModal.vue'

const dialog = useDialog()
const remoteRuleModal = useUpdateRemoteRuleModal()
const { data, isLoading, refreshRemoteRule, remove, setEnabled, refetch } = useRemoteRuleQuery()

const columns: TableColumn<RemoteRule>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: { th: 'w-[80px]' },
    },
  },
  {
    accessorKey: 'name',
    header: '名称',
    meta: {
      class: { th: 'w-[200px]' },
    },
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell({ row }) {
      return (
        <div class="w-30 text-ellipsis overflow-hidden" title={row.original.url}>
          {row.original.url}
        </div>
      )
    },
  },
  {
    accessorKey: 'content',
    header: '规则',
    meta: {
      class: {
        th: 'text-center',
        td: 'text-center',
      },
    },
    cell(props) {
      return (
        <pre class="line-clamp-2 w-80" title={props.row.original.content ?? ''}>{props.row.original.content}</pre>
      )
    },
  },
  {
    accessorKey: 'proxy',
    header: '代理',
    meta: {
      class: { th: 'w-[150px]' },
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'UpdatedAt',
    meta: {
      class: { th: 'w-[100px]' },
    },
    cell(props) {
      return formatDay(props.row.original.updatedAt)
    },
  },
  {
    id: 'actions',
    meta: {
      class: { th: 'w-[280px]' },
    },

    cell({ row }) {
      async function handleEnabledUpdate(value: boolean) {
        await setEnabled({ id: row.original.id, value })
      }

      async function handleUpdate() {
        await remoteRuleModal.open({
          data: row.original,
        })
      }

      async function handleRefresh() {
        await refreshRemoteRule(row.original.id)
      }

      async function handleRemove() {
        await dialog.open({
          title: '确定要删除该远程规则吗？',
          confirmLabel: '删除',
        })

        await remove(row.original.id)
      }

      return (
        <div class="flex gap-2 justify-end items-center">
          <USwitch
            defaultValue={row.original.enabled}
            onUpdate:modelValue={handleEnabledUpdate}
          >
          </USwitch>

          <UButton
            size="sm"
            color="neutral"
            icon="fluent:edit-12-filled"
            variant="ghost"
            loadingAuto
            onClick={handleUpdate}
          >
            修改
          </UButton>

          <UButton
            size="sm"
            color="neutral"
            icon="mingcute:refresh-2-fill"
            variant="ghost"
            loadingAuto
            onClick={handleRefresh}
          >
            刷新
          </UButton>

          <UButton
            size="sm"
            color="error"
            icon="fluent:delete-12-regular"
            variant="ghost"
            loadingAuto
            onClick={handleRemove}
          >
            删除
          </UButton>
        </div>
      )
    },
  },
]
</script>

<template>
  <Table :data="data ?? []" :columns="columns" :table-max-height="60" :loading="isLoading">
    <template #header>
      <div class="flex justify-end gap-2">
        <UButton
          size="sm" color="neutral" icon="mingcute:refresh-2-fill" variant="ghost" loading-auto
          @click="async () => { await refetch() }"
        >
          刷新
        </UButton>

        <CreateRemoteRuleModal />
      </div>
    </template>
    <template #footer>
      <UBadge variant="outline">
        Total: {{ data?.length ?? 0 }}
      </UBadge>
    </template>
  </Table>
</template>

<style></style>
