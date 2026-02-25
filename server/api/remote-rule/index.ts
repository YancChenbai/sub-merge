import { db, remoteRule } from '#server/db'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  return await db.select().from(remoteRule).orderBy(desc(remoteRule.createdAt))
})
