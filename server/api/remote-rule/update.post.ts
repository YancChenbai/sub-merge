import { db, remoteRule } from '#server/db'
import { updateRemoteRuleSchema } from '#shared/schema/remote-rule'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (body) => {
    return TValue.Parse(updateRemoteRuleSchema, body)
  })

  await db.update(remoteRule).set({
    name: data.name.trim(),
    url: data.url.trim(),
    proxy: data.proxy?.trim() || 'DIRECT',
  }).where(eq(remoteRule.id, data.id))
})
