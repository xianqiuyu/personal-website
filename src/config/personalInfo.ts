// 个人信息配置
// 请在这里修改你的个人信息

import i18n from '@/i18n'

export interface PersonalInfo {
  name: string
  nickname?: string
  title: string
  description: string
  avatar: string
  education: string
  experience: string
  hobbies: string
  bio: string
  email: string
  phone: string
  location: string
  github?: string
  website?: string
}

export interface Skill {
  name: string
  icon: string
  level: number
}

export interface Project {
  name: string
  description: string
  icon: string
  tags: string[]
  category?: string
  highlights?: string[]
  demo?: string
  github?: string
}

export interface SocialLink {
  name: string
  icon: string
  url: string
}

export function getPersonalInfo(): PersonalInfo {
  const t = i18n.global.t
  const currentLocale = i18n.global.locale.value

  return {
    name: currentLocale === 'en' ? t('personal.nameEn') : t('personal.name'),
    nickname: 'Locke',
    title: t('personal.title'),
    description: t('personal.description'),
    avatar: '👨‍💻',
    education: t('personal.education'),
    experience: t('personal.experience'),
    hobbies: t('personal.hobbies'),
    bio: t('personal.bio'),
    email: '2535462360@qq.com',
    phone: '17835399347',
    location: currentLocale === 'en' ? 'Fuzhou, Fujian' : '福建福州',
    github: 'https://github.com/xianqiuyu',
    website: 'https://personal-website1-sable.vercel.app/'
  }
}

// 为了向后兼容，导出默认值
export const personalInfo = getPersonalInfo()

export function getSkills(): Skill[] {
  const t = i18n.global.t

  const skillNames = [
    'Vue3',
    'React',
    'TypeScript',
    'JavaScript',
    '前端工程化',
    '性能优化',
    'Vite / Webpack',
    'Node.js',
    '架构设计',
    'CSS / 动画',
    'HTML5',
    'Git'
  ]

  const icons = ['⚡', '⚛️', '📘', '💛', '🧰', '🚀', '📦', '🟢', '🏗️', '🎨', '🌐', '🔧']
  const levels = [92, 88, 90, 95, 90, 88, 88, 80, 86, 85, 95, 85]

  return skillNames.map((name, index) => ({
    name: t(`skills.${name}`) || name,
    icon: icons[index],
    level: levels[index]
  }))
}

// 为了向后兼容，导出默认值
export const skills = getSkills()

export function getProjects(): Project[] {
  const t = i18n.global.t

  const projectsData = [
    {
      name: 'personal-website',
      descriptionKey: 'projects.personal-website.description',
      icon: '🏠',
      categoryKey: '个人作品',
      tags: ['Vue3', 'Vite', 'TypeScript'],
      github: 'https://github.com/xianqiuyu/personal-website',
      demo: 'https://personal-website1-sable.vercel.app/'
    },
    {
      name: 'mini-vue3',
      descriptionKey: 'projects.mini-vue3.description',
      icon: '🧪',
      categoryKey: '源码实现',
      tags: ['Vue3', '响应式', 'computed', '虚拟 DOM', 'TypeScript'],
      highlightsKey: 'projects.mini-vue3.highlights',
      github: 'https://github.com/xianqiuyu/mini-vue3'
    },
    {
      name: 'mini-react',
      descriptionKey: 'projects.mini-react.description',
      icon: '🧬',
      categoryKey: '源码实现',
      tags: ['React', 'Fiber', 'Hooks', 'Scheduler', 'JavaScript'],
      highlightsKey: 'projects.mini-react.highlights',
      github: 'https://github.com/xianqiuyu/mini-react'
    },
    {
      name: 'vue3-source-analysis',
      descriptionKey: 'projects.vue3-source-analysis.description',
      icon: '🔍',
      categoryKey: '源码阅读',
      tags: ['Vue3', '源码阅读', '响应式', '编译器'],
      highlightsKey: 'projects.vue3-source-analysis.highlights',
      github: 'https://github.com/xianqiuyu/vue3-source-analysis'
    },
    {
      name: 'react-source-analysis',
      descriptionKey: 'projects.react-source-analysis.description',
      icon: '🧠',
      categoryKey: '源码阅读',
      tags: ['React', '源码阅读', 'Fiber', 'Hooks'],
      highlightsKey: 'projects.react-source-analysis.highlights',
      github: 'https://github.com/xianqiuyu/react-source-analysis'
    },
    {
      name: 'vue3-component-lib',
      descriptionKey: 'projects.vue3-component-lib.description',
      icon: '🧩',
      categoryKey: '组件库',
      tags: ['Vue3', '组件库', 'TypeScript'],
      highlightsKey: 'projects.vue3-component-lib.highlights',
      github: 'https://github.com/xianqiuyu/vue3-component-lib'
    },
    {
      name: 'react-component-lib',
      descriptionKey: 'projects.react-component-lib.description',
      icon: '🧱',
      categoryKey: '组件库',
      tags: ['React', '组件库', 'TypeScript'],
      highlightsKey: 'projects.react-component-lib.highlights',
      github: 'https://github.com/xianqiuyu/react-component-lib'
    },
    {
      name: 'vue3-admin-template',
      descriptionKey: 'projects.vue3-admin-template.description',
      icon: '🗂️',
      categoryKey: 'Admin 模板',
      tags: ['Vue3', 'Pinia', 'Router', '鉴权'],
      highlightsKey: 'projects.vue3-admin-template.highlights',
      github: 'https://github.com/xianqiuyu/vue3-admin-template'
    },
    {
      name: 'react-admin-template',
      descriptionKey: 'projects.react-admin-template.description',
      icon: '🧭',
      categoryKey: 'Admin 模板',
      tags: ['React', 'Zustand', 'Router', '鉴权'],
      highlightsKey: 'projects.react-admin-template.highlights',
      github: 'https://github.com/xianqiuyu/react-admin-template'
    },
    {
      name: 'react-hooks-collection',
      descriptionKey: 'projects.react-hooks-collection.description',
      icon: '🪝',
      categoryKey: 'Hooks / 工具',
      tags: ['React', 'Hooks', '工程实践'],
      highlightsKey: 'projects.react-hooks-collection.highlights',
      github: 'https://github.com/xianqiuyu/react-hooks-collection'
    },
    {
      name: 'mini-webpack',
      descriptionKey: 'projects.mini-webpack.description',
      icon: '🔧',
      categoryKey: '工程化 / 构建',
      tags: ['Webpack', '打包器', 'JavaScript'],
      highlightsKey: 'projects.mini-webpack.highlights',
      github: 'https://github.com/xianqiuyu/mini-webpack'
    },
    {
      name: 'mini-bundler',
      descriptionKey: 'projects.mini-bundler.description',
      icon: '🧷',
      categoryKey: '工程化 / 构建',
      tags: ['AST', 'Babel', 'Loader/Plugin', '打包器'],
      highlightsKey: 'projects.mini-bundler.highlights',
      github: 'https://github.com/xianqiuyu/mini-bundler'
    }
  ]

  return projectsData.map(project => {
    const result: Project = {
      name: project.name,
      description: t(project.descriptionKey),
      icon: project.icon,
      category: t(`projectCategories.${project.categoryKey}`) || project.categoryKey,
      tags: project.tags.map(tag => t(`tags.${tag}`) || tag),
      github: project.github,
      demo: project.demo
    }

    if (project.highlightsKey) {
      try {
        // 直接从 messages 中获取数组
        const locale = i18n.global.locale.value
        const messages = i18n.global.messages.value[locale] as Record<string, unknown>
        const projects = messages?.projects as Record<string, { highlights?: string[] }> | undefined
        const highlights = projects?.[project.name]?.highlights
        result.highlights = Array.isArray(highlights) ? highlights : []
      } catch {
        result.highlights = []
      }
    }

    return result
  })
}

// 为了向后兼容，导出默认值
export const projects = getProjects()

export function getSocialLinks(): SocialLink[] {
  const t = i18n.global.t

  return [
    { name: t('social.github'), icon: '🐙', url: 'https://github.com/xianqiuyu' },
    { name: t('social.site'), icon: '🌐', url: 'https://personal-website1-sable.vercel.app/' },
    { name: t('social.wechat'), icon: 'wechat', url: '#' },
    { name: t('social.qq'), icon: 'qq', url: '#' }
  ]
}

// 为了向后兼容，导出默认值
export const socialLinks = getSocialLinks()
