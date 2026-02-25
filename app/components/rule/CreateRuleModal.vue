<script lang="ts" setup>
import type { CreateRuleSchema } from '#shared/schema'
import { createRuleSchema } from '#shared/schema'
import { useToggle } from '@vueuse/core'

defineEmits<{
  (e: 'submit', data: CreateRuleSchema): void
}>()

const [isOpen, openToggle] = useToggle()
const { create, isCreating } = useRuleQuery()

const state = reactive<CreateRuleSchema>({
  value: '',
  remark: '',
})

const validate = createFormValidator(createRuleSchema)

function handleSubmit(data: CreateRuleSchema) {
  create(data).then(() => openToggle(false))
}
</script>

<template>
  <UModal v-model:open="isOpen" title="添加规则">
    <UButton color="neutral" variant="ghost" class="justify-center">
      添加
    </UButton>

    <template #body>
      <UForm :state="state" :validate="validate" class="gap-3 grid" @submit="(event) => handleSubmit(event.data)">
        <UFormField label="规则" name="value">
          <UTextarea v-model="state.value" class="w-full" />
        </UFormField>

        <UFormField label="备注" name="value">
          <UInput v-model="state.remark" class="w-full" />
        </UFormField>

        <UButton type="submit" class="w-full justify-center!" :loading="isCreating">
          提交
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<style></style>
