import { createI18n } from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'

// 获取初始语言：优先从URL路径，其次从localStorage，最后默认中文
function getInitialLocale(): string {
  // 检查URL路径
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    if (path.startsWith('/en/') || path === '/en') {
      return 'en'
    }
  }

  // 从 localStorage 获取保存的语言
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale === 'en' || savedLocale === 'zh') {
    return savedLocale
  }

  // 默认中文
  return 'zh'
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getInitialLocale(),
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
  },
})

export default i18n
