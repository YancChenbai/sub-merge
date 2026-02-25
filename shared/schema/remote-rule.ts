import type { Static } from '@sinclair/typebox'

export const createRemoteRuleSchema = T.Object({
  name: T.String({
    minLength: 2,
  }),
  url: T.String({
    pattern: '^https?://.+',
  }),
  proxy: T.Optional(T.String({
    minLength: 1,
  })),
})

export const updateRemoteRuleSchema = T.Intersect([
  createRemoteRuleSchema,
  T.Object({
    id: T.Number(),
  }),
])

export type CreateRemoteRuleSchema = Static<typeof createRemoteRuleSchema>
export type UpdateRemoteRuleSchema = Static<typeof updateRemoteRuleSchema>
