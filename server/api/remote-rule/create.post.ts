import { db, remoteRule } from '#server/db'
import { createRemoteRuleSchema } from '#shared/schema/remote-rule'
import { transformRemoteRules } from '~~/server/utils/transform-remote-rules'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (body) => {
    return TValue.Parse(createRemoteRuleSchema, body)
  })

  const url = data.url.trim()
  const proxy = data.proxy?.trim() || 'DIRECT'

  try {
    // 先获取远程规则内容
    const response = await fetch(url)

    if (!response.ok) {
      throw createError({
        statusCode: 400,
        statusMessage: `Failed to fetch remote rule: ${response.statusText}`,
      })
    }

    const rawContent = await response.text()

    // 转换规则内容
    const content = transformRemoteRules(rawContent, proxy)

    // 获取成功后才创建
    await db.insert(remoteRule).values({
      name: data.name.trim(),
      url,
      proxy,
      content,
    })
  }
  catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Failed to fetch remote rule',
    })
  }
})
