/**
 * 国际化工具函数
 */

/**
 * 从路径中提取语言
 */
function getLangFromPath(path: string): 'zh' | 'en' {
  return path.startsWith('/en/') || path === '/en' ? 'en' : 'zh'
}

/**
 * 移除语言前缀，获取基础路径
 */
function getBasePath(path: string): string {
  if (path.startsWith('/en/')) {
    return path.replace('/en', '')
  }
  if (path === '/en') {
    return '/'
  }
  return path
}

/**
 * 添加语言前缀到路径
 */
function addLangPrefix(path: string, lang: 'zh' | 'en'): string {
  if (lang === 'zh') {
    return path
  }
  // 英文：添加 /en 前缀
  if (path === '/') {
    return '/en'
  }
  return `/en${path}`
}

/**
 * 获取带语言路径的完整URL
 * @param path 路径（如 '/about'）
 * @param lang 语言 ('zh' | 'en')
 * @returns 完整的URL
 */
export function getUrlWithLang(path: string, lang: 'zh' | 'en' = 'zh'): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const pathWithLang = addLangPrefix(path, lang)
  return `${baseUrl}${pathWithLang}`
}

/**
 * 获取当前语言的URL（保持当前路径）
 * @param lang 目标语言 ('zh' | 'en')
 * @returns 完整的URL
 */
export function getCurrentUrlWithLang(lang: 'zh' | 'en'): string {
  if (typeof window === 'undefined') return ''
  
  const currentPath = window.location.pathname
  const basePath = getBasePath(currentPath)
  const newPath = addLangPrefix(basePath, lang)
  const url = new URL(window.location.href)
  url.pathname = newPath
  return url.toString()
}

/**
 * 从URL中提取语言
 * @param url 可选，默认为当前URL
 * @returns 'zh' | 'en'
 */
export function getLangFromUrl(url?: string): 'zh' | 'en' {
  if (typeof window === 'undefined') return 'zh'
  
  const targetUrl = url || window.location.href
  const urlObj = new URL(targetUrl)
  return getLangFromPath(urlObj.pathname)
}
