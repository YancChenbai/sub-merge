import YAML from 'yaml'

// 转换远程规则内容
export function transformRemoteRules(content: string, proxy?: string): string {
  try {
    const parsed = YAML.parse(content) as { payload?: string[] }

    if (!parsed.payload)
      throw new Error('payload is undefined')

    if (!Array.isArray(parsed.payload))
      throw new Error('payload is not an array')

    if (!proxy)
      return parsed.payload.join('\n')

    return parsed.payload.map(rule => `${rule},${proxy}`).join('\n')
  }
  catch {
    // 如果解析失败，返回空内容
    return ''
  }
}
