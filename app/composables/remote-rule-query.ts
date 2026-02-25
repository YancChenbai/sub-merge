import type { RemoteRule } from '#server/db'
import type { CreateRemoteRuleSchema, UpdateRemoteRuleSchema } from '#shared/schema/remote-rule'

export const useRemoteRuleQuery = defineQuery(() => {
  const toast = useToast()

  const { data, isLoading, refetch, refresh } = useQuery({
    key: () => ['remote-rule'],
    placeholderData: () => [],
    enabled: !import.meta.env.SSR,
    async query() {
      return $fetch<RemoteRule[]>('/api/remote-rule', {
        credentials: 'include',
      })
    },
  })

  const { mutateAsync: create, isLoading: isCreating } = useMutation({
    key: () => ['remote-rule-create'],
    async mutation(schema: CreateRemoteRuleSchema) {
      return $fetch('/api/remote-rule/create', {
        method: 'POST',
        body: schema,
        credentials: 'include',
      })
    },

    onSuccess() {
      refetch()
      toast.add({
        title: '创建成功😎',
        color: 'success',
      })
    },

    onError() {
      toast.add({
        title: '创建失败😅',
        color: 'error',
      })
    },
  })

  const { mutateAsync: update, isLoading: isUpdating } = useMutation({
    key: () => ['remote-rule-update'],
    async mutation(schema: UpdateRemoteRuleSchema) {
      return $fetch('/api/remote-rule/update', {
        method: 'POST',
        body: schema,
        credentials: 'include',
      })
    },

    onSuccess() {
      refetch()
      toast.add({
        title: '修改成功😎',
        color: 'success',
      })
    },

    onError() {
      toast.add({
        title: '修改失败😅',
        color: 'error',
      })
    },
  })

  const { mutateAsync: remove, isLoading: isRemoving } = useMutation({
    key: () => ['remote-rule-remove'],
    mutation: async (id: number) => {
      return $fetch(`/api/remote-rule/delete/${id}`, {
        credentials: 'include',
      })
    },

    onSuccess() {
      refetch()
      toast.add({
        title: '删除成功🎉',
        color: 'success',
      })
    },

    onError() {
      toast.add({
        title: '删除失败😂',
        color: 'error',
      })
    },
  })

  const { mutateAsync: refreshRemoteRule, isLoading: isRefreshing } = useMutation({
    key: () => ['remote-rule-refresh'],
    mutation: async (id: number) => {
      return $fetch(`/api/remote-rule/refresh/${id}`, {
        credentials: 'include',
      })
    },

    onSuccess() {
      refetch()
      toast.add({
        title: '刷新成功🎉',
        color: 'success',
      })
    },

    onError() {
      toast.add({
        title: '刷新失败😂',
        color: 'error',
      })
    },
  })

  const { mutateAsync: setEnabled, isLoading: isSetEnabledLoading } = useMutation({
    key: () => ['remote-rule-enabled'],
    mutation: async ({ id, value }: { id: number, value: boolean }) => {
      return $fetch(`/api/remote-rule/enabled/${id}`, {
        credentials: 'include',
        method: 'POST',
        body: {
          enabled: value,
        },
      })
    },

    onSuccess() {
      refetch()
      toast.add({
        title: '设置成功🎉',
        color: 'success',
      })
    },

    onError() {
      toast.add({
        title: '设置失败😂',
        color: 'error',
      })
    },
  })

  return {
    data,
    isLoading,
    isCreating,
    isUpdating,
    isRemoving,
    isRefreshing,
    isSetEnabledLoading,
    setEnabled,
    refreshRemoteRule,
    create,
    update,
    remove,
    refetch,
    refresh,
  }
})
