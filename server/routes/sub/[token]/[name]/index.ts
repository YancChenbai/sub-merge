import type { SubContent } from '#server/types'
import { db, sub } from '#server/db'
import { Platform } from '#server/types'
import { querySchema } from '#shared/schema'
import { eq } from 'drizzle-orm'
import YAML from 'yaml'

export default defineEventHandler(async (event) => {
  const { name } = await getValidatedRouterParams(event, (params) => {
    return TValue.Parse(T.Object({ name: T.String() }), params)
  })

  const { target } = await getValidatedQuery(event, data => TValue.Parse(querySchema, data))

  const row = await db.query.sub.findFirst({
    where: eq(sub.name, name),
  })

  if (!row)
    return setResponseStatus(event, 404)

  setHeaders(event, {
    'Content-Type': ' text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  })

  const { content } = row

  if (!content)
    return setResponseStatus(event, 404)

  if (target === Platform.V2RAY) {
    const parseContent = YAML.parse(content) as SubContent
    return transformToV2ray(parseContent.proxies)
  }

  return content
})
