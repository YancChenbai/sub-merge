<script lang="ts" setup>
import type { UpdateRemoteRuleSchema } from '#shared/schema/remote-rule'
import { updateRemoteRuleSchema } from '#shared/schema/remote-rule'

const props = defineProps<{
  data: UpdateRemoteRuleSchema
}>()

const emit = defineEmits(['close'])

const { isUpdating, update } = useRemoteRuleQuery()
const state = reactive(props.data)
const validate = createFormValidator(updateRemoteRuleSchema)

function handleSubmit(data: UpdateRemoteRuleSchema) {
  update(data).then(() => emit('close'))
}
</script>

<template>
  <UModal title="修改远程规则">
    <template #body>
      <UForm :state="state" :validate="validate" class="gap-3 grid" @submit="(event) => handleSubmit(event.data)">
        <UFormField label="名称" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField label="地址" name="url">
          <UInput v-model="state.url" class="w-full" />
        </UFormField>

        <UFormField label="代理" name="proxy">
          <UInput v-model="state.proxy" class="w-full" />
        </UFormField>

        <UButton type="submit" class="w-full !justify-center" :loading="isUpdating">
          提交
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<style>

</style>
