<script lang="ts" setup>
import type { CreateRemoteRuleSchema } from '#shared/schema/remote-rule'
import { createRemoteRuleSchema } from '#shared/schema/remote-rule'
import { useToggle } from '@vueuse/core'

const state = reactive<CreateRemoteRuleSchema>({
  name: '',
  url: '',
  proxy: 'DIRECT',
})

const [isOpen, openToggle] = useToggle()
const validate = createFormValidator(createRemoteRuleSchema)

const { isCreating, create } = useRemoteRuleQuery()

function handleSubmit(data: CreateRemoteRuleSchema) {
  create(data).then(() => openToggle(false))
}
</script>

<template>
  <UModal v-model:open="isOpen" title="添加远程规则">
    <UButton color="neutral" variant="ghost" @click="openToggle(true)">
      添加
    </UButton>

    <template #body>
      <UForm :state="state" :validate="validate" class="gap-3 grid" @submit="(event) => handleSubmit(event.data)">
        <UFormField label="名称" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField label="地址" name="url">
          <UInput v-model="state.url" class="w-full" />
        </UFormField>

        <UFormField label="代理" name="proxy">
          <UInput v-model="state.proxy" class="w-full" placeholder="默认 DIRECT" />
        </UFormField>

        <UButton type="submit" class="w-full !justify-center" :loading="isCreating">
          提交
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<style>

</style>
