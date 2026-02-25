import type { Static } from '@sinclair/typebox'

export const createRuleSchema = T.Object({
  value: T.String({
    minLength: 1,
  }),
  remark: T.Optional(T.Union([T.String(), T.Null()])),
})

export const updateRuleSchema = T.Intersect([
  createRuleSchema,
  T.Object({
    id: T.Number(),
  }),
])

export type CreateRuleSchema = Static<typeof createRuleSchema>
export type UpdateRuleSchema = Static<typeof updateRuleSchema>
