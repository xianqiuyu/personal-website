<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <span class="logo-icon">🚀</span>
        <span class="logo-text">{{ logoText }}</span>
      </router-link>
      <ul class="nav-menu" :class="{ active: menuOpen }">
        <li>
          <router-link :to="getLink('/')" @click="closeMenu">{{ $t('nav.home') }}</router-link>
        </li>
        <li>
          <router-link :to="getLink('/about')" @click="closeMenu">{{ $t('nav.about') }}</router-link>
        </li>
        <li>
          <router-link :to="getLink('/portfolio')" @click="closeMenu">{{ $t('nav.portfolio') }}</router-link>
        </li>
        <li>
          <router-link :to="getLink('/blog')" @click="closeMenu">{{ $t('nav.blog') }}</router-link>
        </li>
        <li>
          <router-link :to="getLink('/footprints')" @click="closeMenu">{{ $t('nav.footprints') }}</router-link>
        </li>
        <li>
          <router-link :to="getLink('/algorithms/hot100')" @click="closeMenu">{{ $t('nav.algorithms') }}</router-link>
        </li>
        <li>
          <router-link :to="getLink('/contact')" @click="closeMenu">{{ $t('nav.contact') }}</router-link>
        </li>
      </ul>
      <div class="nav-actions">
        <button class="lang-switch" @click="toggleLocale" :title="currentLocale === 'zh' ? $t('nav.switchToEnglish') : $t('nav.switchToChinese')">
          {{ currentLocale === 'zh' ? 'EN' : $t('nav.chinese') }}
        </button>
        <button class="menu-toggle" @click="menuOpen = !menuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { personalInfo } from '@/config/personalInfo'
import { useRouterWithLang } from '@/composables/useRouterWithLang'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const { pushWithLang, getRouteWithLang } = useRouterWithLang()
const isScrolled = ref(false)
const menuOpen = ref(false)

const currentLocale = computed(() => locale.value)

const logoText = computed(() => {
  if (currentLocale.value === 'zh') {
    // 中文环境：显示 "Locke · 于贤秋的个人网站"
    return `${personalInfo.nickname || ''} · ${personalInfo.name}的个人网站`
  } else {
    // 英文环境：只显示 "Locke's Personal Website"（避免重复显示名字）
    return `${personalInfo.nickname || personalInfo.name}'s Personal Website`
  }
})

const toggleLocale = () => {
  const newLocale = currentLocale.value === 'zh' ? 'en' : 'zh'
  
  // 先更新语言设置
  locale.value = newLocale
  localStorage.setItem('locale', newLocale)
  
  // 获取当前路径的基础路径（移除语言前缀）
  let basePath = route.path
  if (basePath.startsWith('/en/')) {
    basePath = basePath.replace('/en', '')
  } else if (basePath === '/en') {
    basePath = '/'
  }
  
  // 确保基础路径不为空
  if (!basePath || basePath === '') {
    basePath = '/'
  }
  
  // 根据新语言构建路径
  let newPath: string
  if (newLocale === 'en') {
    // 切换到英文，添加 /en 前缀
    if (basePath === '/') {
      newPath = '/en'
    } else {
      newPath = `/en${basePath}`
    }
  } else {
    // 切换到中文，使用基础路径（已移除 /en 前缀）
    newPath = basePath
  }
  
  // 使用 replace 更新路径，保持查询参数
  router.replace({
    path: newPath,
    query: route.query
  }).catch(() => {
    // 如果路由不存在，忽略错误（可能是路由守卫导致的）
  })
}

// 生成带语言参数的路由链接
const getLink = (path: string) => {
  return getRouteWithLang(path)
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const closeMenu = () => {
  menuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  background: rgba(254, 245, 231, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar.scrolled {
  padding: 0.5rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  transition: transform 0.3s ease;
  text-decoration: none;
}

.logo:hover {
  transform: scale(1.1) rotate(-5deg);
}

.logo-icon {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: var(--primary);
}

.nav-menu a:hover::after,
.nav-menu a.router-link-active::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.lang-switch {
  background: rgba(255, 107, 157, 0.1);
  border: 2px solid var(--primary);
  color: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.lang-switch:hover {
  background: var(--primary);
  color: white;
  transform: scale(1.05);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: var(--primary);
  border-radius: 3px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 70px);
    background: rgba(254, 245, 231, 0.98);
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 2rem;
    transition: left 0.3s ease;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  .nav-menu.active {
    left: 0;
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
