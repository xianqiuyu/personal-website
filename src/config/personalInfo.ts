// 个人信息配置
// 请在这里修改你的个人信息

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

export const personalInfo: PersonalInfo = {
  name: '于贤秋',
  nickname: 'Locke',
  title: '前端工程师（Vue / React / 工程化）',
  description: '8 年前端开发经验，专注 Vue / React 生态与前端工程化，擅长复杂架构与性能优化。',
  avatar: '👨‍💻',
  education: '电子科学与技术',
  experience: '8年+ 前端开发经验',
  hobbies: '编程、设计、音乐、旅行',
  bio: 'Hi, 我是 Locke（于贤秋）。专注 Vue / React 生态与工程化基础设施（构建、CI/CD、规范、质量），擅长复杂前端架构设计与性能优化，喜欢用可复用的抽象把复杂问题讲清楚、做扎实。',
  email: '2535462360@qq.com',
  phone: '17835399347',
  location: '福建福州',
  github: 'https://github.com/xianqiuyu',
  website: 'https://personal-website1-sable.vercel.app/'
}

export const skills: Skill[] = [
  { name: 'Vue3', icon: '⚡', level: 92 },
  { name: 'React', icon: '⚛️', level: 88 },
  { name: 'TypeScript', icon: '📘', level: 90 },
  { name: 'JavaScript', icon: '💛', level: 95 },
  { name: '前端工程化', icon: '🧰', level: 90 },
  { name: '性能优化', icon: '🚀', level: 88 },
  { name: 'Vite / Webpack', icon: '📦', level: 88 },
  { name: 'Node.js', icon: '🟢', level: 80 },
  { name: '架构设计', icon: '🏗️', level: 86 },
  { name: 'CSS / 动画', icon: '🎨', level: 85 },
  { name: 'HTML5', icon: '🌐', level: 95 },
  { name: 'Git', icon: '🔧', level: 85 }
]

export const projects: Project[] = [
  {
    name: 'personal-website',
    description: '个人网站：承载项目/文章/联系方式，持续迭代中。',
    icon: '🏠',
    category: '个人作品',
    tags: ['Vue3', 'Vite', 'TypeScript'],
    github: 'https://github.com/xianqiuyu/personal-website',
    demo: 'https://personal-website1-sable.vercel.app/'
  },
  {
    name: 'mini-vue3',
    description: '从零实现 Vue3 核心响应式、computed、虚拟 DOM 渲染器。',
    icon: '🧪',
    category: '源码实现',
    tags: ['Vue3', '响应式', 'computed', '虚拟 DOM', 'TypeScript'],
    highlights: ['响应式系统', 'computed / effect', '渲染器与 patch 流程'],
    github: 'https://github.com/xianqiuyu/mini-vue3'
  },
  {
    name: 'mini-react',
    description: '实现 React Fiber / Hooks / Scheduler 的迷你版本。',
    icon: '🧬',
    category: '源码实现',
    tags: ['React', 'Fiber', 'Hooks', 'Scheduler', 'JavaScript'],
    highlights: ['Fiber 调度', 'Hooks 机制', 'reconciliation 基础流程'],
    github: 'https://github.com/xianqiuyu/mini-react'
  },
  {
    name: 'vue3-source-analysis',
    description: 'Vue3 源码阅读笔记（响应式 / 虚拟 DOM / 编译器 / 组件系统）。',
    icon: '🔍',
    category: '源码阅读',
    tags: ['Vue3', '源码阅读', '响应式', '编译器'],
    highlights: ['知识体系化梳理', '配套 mini-vue3', '面试/实践可复用'],
    github: 'https://github.com/xianqiuyu/vue3-source-analysis'
  },
  {
    name: 'react-source-analysis',
    description: 'React 源码阅读笔记（Fiber 架构 / Reconciliation / Hooks / Scheduler）。',
    icon: '🧠',
    category: '源码阅读',
    tags: ['React', '源码阅读', 'Fiber', 'Hooks'],
    highlights: ['从架构到细节', '配套 mini-react', '理解 React16+ 内核'],
    github: 'https://github.com/xianqiuyu/react-source-analysis'
  },
  {
    name: 'vue3-component-lib',
    description: '参考 Element Plus 的 Vue3 组件库（含组件总览/Playground）。',
    icon: '🧩',
    category: '组件库',
    tags: ['Vue3', '组件库', 'TypeScript'],
    highlights: ['常用组件沉淀', '交互/可用性打磨', '可扩展架构'],
    github: 'https://github.com/xianqiuyu/vue3-component-lib'
  },
  {
    name: 'react-component-lib',
    description: '参考 Ant Design 的 React 组件库（组件齐全，配套 demo）。',
    icon: '🧱',
    category: '组件库',
    tags: ['React', '组件库', 'TypeScript'],
    highlights: ['组件工程化', '可复用组件模式', '一致性与体验'],
    github: 'https://github.com/xianqiuyu/react-component-lib'
  },
  {
    name: 'vue3-admin-template',
    description: 'Vue3 + Router + Pinia + Axios 的精简后台模板（登录鉴权/角色路由）。',
    icon: '🗂️',
    category: 'Admin 模板',
    tags: ['Vue3', 'Pinia', 'Router', '鉴权'],
    highlights: ['登录鉴权', '角色路由控制', '基础布局'],
    github: 'https://github.com/xianqiuyu/vue3-admin-template'
  },
  {
    name: 'react-admin-template',
    description: 'React Router + Zustand + Axios 的后台模板，对齐 Vue 版路由/权限模型。',
    icon: '🧭',
    category: 'Admin 模板',
    tags: ['React', 'Zustand', 'Router', '鉴权'],
    highlights: ['路由/权限模型', '工程化基础', '可扩展'],
    github: 'https://github.com/xianqiuyu/react-admin-template'
  },
  {
    name: 'react-hooks-collection',
    description: '业务级 Hooks 集合（useRequest / useVirtualList / useWebSocket 等）。',
    icon: '🪝',
    category: 'Hooks / 工具',
    tags: ['React', 'Hooks', '工程实践'],
    highlights: ['可复用业务抽象', '覆盖常见场景', '注重边界与体验'],
    github: 'https://github.com/xianqiuyu/react-hooks-collection'
  },
  {
    name: 'mini-webpack',
    description: '迷你版 Webpack：依赖解析 + 模块打包 + runtime require。',
    icon: '🔧',
    category: '工程化 / 构建',
    tags: ['Webpack', '打包器', 'JavaScript'],
    highlights: ['依赖图', '模块系统', '打包流程理解'],
    github: 'https://github.com/xianqiuyu/mini-webpack'
  },
  {
    name: 'mini-bundler',
    description: '实现 AST 解析、依赖图、Loader / Plugin / Babel 流程的迷你打包器。',
    icon: '🧷',
    category: '工程化 / 构建',
    tags: ['AST', 'Babel', 'Loader/Plugin', '打包器'],
    highlights: ['AST 解析', '依赖图构建', '插件化机制'],
    github: 'https://github.com/xianqiuyu/mini-bundler'
  }
]

export const socialLinks: SocialLink[] = [
  { name: 'GitHub', icon: '🐙', url: 'https://github.com/xianqiuyu' },
  { name: '站点（Vercel）', icon: '🌐', url: 'https://personal-website1-sable.vercel.app/' },
  { name: '微信', icon: 'wechat', url: '#' },
  { name: 'QQ', icon: 'qq', url: '#' }
]
