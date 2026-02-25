import type { Proxy, SubContent } from '#server/types'
import { DIRECT, EMPTY_SUB } from '#server/constants'
import { db, group, rule, sub } from '#server/db'
import { Platform } from '#server/types'
import { querySchema } from '#shared/schema'
import { desc, eq } from 'drizzle-orm'
import YAML from 'yaml'

// 获取所有规则
async function getCustomRules() {
  const rows = await db.select({ value: rule.value }).from(rule).where(eq(rule.enabled, true))
  return rows.map(({ value }) => value.split('\n')).flat()
}

// 获取所有自定义分组
async function getCustomGroups() {
  const rows = await db.select().from(group).where(eq(group.enabled, true))

  return {
    customGroupNames: rows.map(({ name }) => name),
    customProxies: rows.filter(({ insertProxies }) => insertProxies).map(({ name }) => name),
  }
}

function formatProxyName(prefix: string, name: string) {
  return name.startsWith(prefix) ? name : `${prefix} | ${name}`
}

function formatProxiesName(name: string, proxies: Proxy[]) {
  return proxies.map((proxy) => {
    return {
      ...proxy,
      name: formatProxyName(name, proxy.name),
    }
  })
}

function difference<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b)
  return [...new Set(a)].filter(x => !setB.has(x))
}

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')
  const { target, filter } = await getValidatedQuery(event, data => TValue.Parse(querySchema, data))

  if (!validateToken(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // 数据库查询
  const rows = await db
    .select({
      id: sub.id,
      content: sub.content,
      main: sub.main,
      name: sub.name,
    })
    .from(sub)
    .orderBy(desc(sub.main))

  if (rows.length === 0)
    return EMPTY_SUB

  // 解析订阅内容, 并且添加订阅名称前缀
  const subscriptions = rows.map((row) => {
    const parseContent = row.content ? (YAML.parse(row.content) as SubContent) : null

    if (!parseContent) {
      return {
        ...row,
        content: null,
      }
    }

    const rawProxyNames = [...parseContent?.proxies ?? []].map(proxy => proxy.name)

    return {
      ...row,
      rawProxyNames,
      content: {
        ...parseContent,
        proxies: formatProxiesName(row.name, parseContent.proxies),
      },
    }
  })

  setHeaders(event, {
    'Content-Type': ' text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  })

  const { customProxies, customGroupNames } = await getCustomGroups()

  let proxies: Proxy[] = []

  // 合并所有代理节点
  proxies = subscriptions.reduce(
    (pre, { content }) => {
      return content?.proxies ? pre.concat(content.proxies) : pre
    },
    proxies,
  )

  // 如果指定了 v2ray 直接转换返回
  if (target === Platform.V2RAY)
    return transformToV2ray(proxies)

  // 主订阅（优先 main，否则取第一个）
  const primarySub = subscriptions.find(s => s.main) ?? subscriptions[0]

  // 所有节点名称
  const proxyNameList = [...new Set(proxies.map(item => item.name))].filter(item => filter ? !item.includes(filter) : true)

  if (!primarySub?.content)
    return EMPTY_SUB

  // 加载自定义规则
  const additionalRules = await getCustomRules()

  // 合并规则
  primarySub.content.rules?.unshift(...additionalRules)

  primarySub.content.proxies = proxies.filter(item => filter ? !item.name.includes(filter) : true)

  primarySub.content['proxy-groups'] = primarySub.content['proxy-groups']
    ?.map((group) => {
      group.proxies = [...new Set(
        [
          DIRECT,
          // 自定义分组的节点
          ...customProxies,
          // 保留不在 proxies 中的节点
          ...difference(group.proxies, primarySub.rawProxyNames),
          // 过滤与当前分组名相等的代理
          ...proxyNameList.filter(name => name !== group.name),
        ],
      )]
      return group
    })

  // 构建自定义分组
  const customGroups = customGroupNames.map((name) => {
    return {
      name,
      type: 'select',
      proxies: [
        DIRECT,
        ...proxyNameList,
      ],
    }
  })

  primarySub.content['proxy-groups'].unshift(...customGroups)

  return YAML.stringify(primarySub.content)
})
