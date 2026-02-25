<script lang="tsx" setup>
import type { Table } from '#components'
import type { Rule } from '#server/db'
import type { TableColumn } from '@nuxt/ui'
import { UButton, USwitch } from '#components'
import { refThrottled } from '@vueuse/core'
import CreateRuleModal from './CreateRuleModal.vue'

const input = ref('')
const throttled = refThrottled(input, 300)
const dialog = useDialog()
const updateModal = useUpdateRuleModal()
const { remove, setEnabled, refetch, isLoading, data } = useRuleQuery()

const searchData = computed(() => {
  if (!data.value)
    return []

  if (!throttled.value)
    return data.value

  return data.value.filter(rule => rule.value.toLocaleLowerCase().includes(throttled.value.toLocaleLowerCase()))
})

const columns: TableColumn<Rule>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: {
      class: { th: 'w-2' },
    },
  },
  {
    accessorKey: 'value',
    header: '规则',
    meta: {
      class: {
        th: 'text-center',
        td: 'text-center',
      },
    },
    cell(props) {
      return (
        <pre class="line-clamp-2" title={props.row.original.value}>{props.row.original.value}</pre>
      )
    },
  },
  {
    accessorKey: 'remark',
    header: '备注',
    meta: {
      class: { th: 'w-[100px]' },
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
      class: { th: 'w-[200px]' },
    },

    cell({ row }) {
      async function handleEnabledUpdate(value: boolean) {
        await setEnabled({ id: row.original.id, value })
      }

      async function handleRemove() {
        await dialog.open({
          title: '确定要删除该规则吗？',
          confirmLabel: '删除',
        })

        await remove(row.original.id)
      }

      async function handleUpdate() {
        await updateModal.open({ data: row.original })
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
            color="error"
            icon="fluent:delete-12-regular"
            variant="soft"
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
  <Table :data="searchData" :columns="columns" :table-max-height="60" :loading="isLoading">
    <template #header>
      <div class="grid gap-2 grid-cols-[1fr_auto_auto]">
        <UInput v-model:model-value="input" placeholder="搜索规则" />
        <UButton
          size="sm" color="neutral" icon="mingcute:refresh-2-fill" variant="ghost" loading-auto
          class="justify-center" @click="async () => { await refetch() }"
        >
          刷新
        </UButton>

        <CreateRuleModal />
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
