import { db, remoteRule } from '#server/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  await db.delete(remoteRule).where(eq(remoteRule.id, id))
})
