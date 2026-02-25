import { db, remoteRule } from '#server/db'
import { eq } from 'drizzle-orm'
import { transformRemoteRules } from '~~/server/utils/transform-remote-rules'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  // 获取远程规则配置
  const row = await db.select().from(remoteRule).where(eq(remoteRule.id, id)).then(rows => rows[0])

  if (!row) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Remote rule not found',
    })
  }

  try {
    // 获取远程规则内容
    const response = await fetch(row.url)

    if (!response.ok) {
      throw createError({
        statusCode: 400,
        statusMessage: `Failed to fetch remote rule: ${response.statusText}`,
      })
    }

    const rawContent = await response.text()

    // 转换规则内容
    const content = transformRemoteRules(rawContent, row.proxy)

    // 更新数据库
    await db.update(remoteRule).set({
      content,
    }).where(eq(remoteRule.id, id))

    return { success: true }
  }
  catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Failed to sync remote rule',
    })
  }
})
