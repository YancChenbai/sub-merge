<script lang="ts" setup>
import type { TabsItem } from '@nuxt/ui'

useHead(() => {
  return {
    title: 'Sub Merge',
  }
})

const items = [
  {
    label: '订阅列表',
    icon: 'fontisto:email',
    slot: 'sub',
    value: 'sub',
  },
  {
    label: '规则列表',
    icon: 'mynaui:ruler',
    slot: 'rule',
    value: 'rule',
  },
  {
    label: '远程规则',
    icon: 'mdi:cloud-download',
    slot: 'remote-rule',
    value: 'remote-rule',
  },
  {
    label: '分组列表',
    icon: 'material-symbols-light:stack-group-outline',
    slot: 'group',
    value: 'group',
  },
] satisfies TabsItem[]

const { data: isLogin } = useQuery({
  key: () => ['isLogin'],
  query: async () => {
    return $fetch('/api/validate-auth', { credentials: 'include' })
  },
})
</script>

<template>
  <Transition>
    <template v-if="isLogin">
      <UTabs
        :items="items" class="w-full" :default-value="$route.query.tab ? String($route.query.tab) : 'sub'"
        @update:model-value="(value) => $router.push({ path: '/', query: { tab: value } })"
      >
        <template #sub>
          <SubTable />
        </template>
        <template #rule>
          <RuleTable />
        </template>
        <template #remote-rule>
          <RemoteRuleTable />
        </template>
        <template #group>
          <GroupTable />
        </template>
      </UTabs>
    </template>
    <template v-else>
      <Login />
    </template>
  </Transition>
</template>

<style scoped>
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
