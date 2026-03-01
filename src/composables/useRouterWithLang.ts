import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

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
 * 带语言路径的路由 composable
 * 确保切换路由时保持语言路径前缀
 */
export function useRouterWithLang() {
  const router = useRouter()
  const route = useRoute()
  const { locale } = useI18n()

  /**
   * 获取带语言前缀的路由对象
   */
  const getRouteWithLang = (to: string | { name?: string; path?: string; params?: Record<string, any>; query?: Record<string, any> }) => {
    const currentLang = locale.value
    
    // 如果目标路由是字符串
    if (typeof to === 'string') {
      const basePath = getBasePath(to)
      return {
        path: addLangPrefix(basePath, currentLang),
        query: route.query
      }
    }
    
    // 如果目标路由是对象
    const targetPath = to.path || route.path
    const basePath = getBasePath(targetPath)
    
    return {
      ...to,
      path: addLangPrefix(basePath, currentLang),
      query: {
        ...route.query,
        ...to.query
      }
    }
  }

  /**
   * 导航到指定路由，保持语言路径前缀
   */
  const pushWithLang = (to: string | { name?: string; path?: string; params?: Record<string, any>; query?: Record<string, any> }) => {
    const routeWithLang = getRouteWithLang(to)
    return router.push(routeWithLang)
  }

  /**
   * 替换当前路由，保持语言路径前缀
   */
  const replaceWithLang = (to: string | { name?: string; path?: string; params?: Record<string, any>; query?: Record<string, any> }) => {
    const routeWithLang = getRouteWithLang(to)
    return router.replace(routeWithLang)
  }

  /**
   * 计算属性：当前路由的语言
   */
  const currentLangParam = computed(() => {
    return getLangFromPath(route.path)
  })

  return {
    pushWithLang,
    replaceWithLang,
    getRouteWithLang,
    currentLangParam
  }
}
