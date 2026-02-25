import { db, remoteRule } from '#server/db'
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, (params) => {
    return TValue.Parse(T.Object({ id: T.Number() }), params)
  })

  const { enabled } = await readValidatedBody(event, (body) => {
    return TValue.Parse(T.Object({ enabled: T.Boolean() }), body)
  })

  await db.update(remoteRule).set({ enabled }).where(eq(remoteRule.id, id))
})
