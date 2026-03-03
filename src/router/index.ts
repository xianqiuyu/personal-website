import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import PortfolioView from '../views/PortfolioView.vue'
import BlogView from '../views/BlogView.vue'
import BlogDetailView from '../views/BlogDetailView.vue'
import ContactView from '../views/ContactView.vue'
import FootprintsView from '../views/FootprintsView.vue'
import AlgorithmsHot100View from '../views/AlgorithmsHot100View.vue'
import IntersectionOfTwoLinkedListsView from '../views/IntersectionOfTwoLinkedListsView.vue'
import LowestCommonAncestorView from '../views/LowestCommonAncestorView.vue'
import PalindromeLinkedListView from '../views/PalindromeLinkedListView.vue'
import i18n from '../i18n'

// 定义路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: PortfolioView,
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogView,
  },
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: BlogDetailView,
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
  },
  {
    path: '/footprints',
    name: 'footprints',
    component: FootprintsView,
  },
  {
    path: '/algorithms/hot100',
    name: 'algorithms-hot100',
    component: AlgorithmsHot100View,
  },
  {
    path: '/algorithms/hot100/intersection-of-two-linked-lists',
    name: 'intersection-of-two-linked-lists',
    component: IntersectionOfTwoLinkedListsView,
  },
  {
    path: '/algorithms/hot100/lowest-common-ancestor-of-a-binary-tree',
    name: 'lowest-common-ancestor-of-a-binary-tree',
    component: LowestCommonAncestorView,
  },
  {
    path: '/algorithms/hot100/palindrome-linked-list',
    name: 'palindrome-linked-list',
    component: PalindromeLinkedListView,
  },
]

// 为英文版本创建带 /en/ 前缀的路由
const enRoutes = routes.map(route => ({
  ...route,
  path: `/en${route.path}`,
  name: route.name ? `${route.name}-en` : undefined,
}))

// 合并所有路由（中文默认路径 + 英文路径）
const allRoutes = [...routes, ...enRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRoutes,
})

// 从路径中提取语言
function getLangFromPath(path: string): 'zh' | 'en' | null {
  if (path.startsWith('/en/') || path === '/en') {
    return 'en'
  }
  return 'zh' // 默认中文
}

// 移除语言前缀，获取基础路径
function getBasePath(path: string): string {
  if (path.startsWith('/en/')) {
    return path.replace('/en', '')
  }
  if (path === '/en') {
    return '/'
  }
  return path
}

// 路由守卫：根据路径设置语言，并保持语言前缀
router.beforeEach((to, from, next) => {
  const pathLang = getLangFromPath(to.path)
  const fromLang = getLangFromPath(from.path)
  const currentLang = i18n.global.locale.value
  const toBasePath = getBasePath(to.path)
  const fromBasePath = getBasePath(from.path)

  // 判断是否是语言切换操作（基础路径相同，但语言前缀不同）
  const isLanguageSwitch = toBasePath === fromBasePath && pathLang !== fromLang

  // 根据路径设置语言
  if (pathLang === 'en') {
    if (currentLang !== 'en') {
      i18n.global.locale.value = 'en'
      localStorage.setItem('locale', 'en')
    }
    next()
  } else {
    // 中文路径
    if (isLanguageSwitch) {
      // 如果是用户主动切换语言（从英文切换到中文），允许切换
      if (currentLang !== 'zh') {
        i18n.global.locale.value = 'zh'
        localStorage.setItem('locale', 'zh')
      }
      next()
    } else if (fromLang === 'en') {
      // 如果来源是英文路径，但不是语言切换操作，重定向到英文版本
      const basePath = getBasePath(to.path)
      next({
        path: `/en${basePath}`,
        query: to.query,
        replace: true
      })
    } else {
      // 检查 localStorage
      const savedLocale = localStorage.getItem('locale')
      
      if (savedLocale === 'en') {
        // 如果保存的是英文，重定向到英文版本
        const basePath = getBasePath(to.path)
        next({
          path: `/en${basePath}`,
          query: to.query,
          replace: true
        })
      } else {
        // 默认中文
        if (currentLang !== 'zh') {
          i18n.global.locale.value = 'zh'
          localStorage.setItem('locale', 'zh')
        }
        next()
      }
    }
  }
})

export default router
