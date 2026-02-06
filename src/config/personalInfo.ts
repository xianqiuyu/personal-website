// 个人信息配置
// 请在这里修改你的个人信息

export interface PersonalInfo {
  name: string
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
  title: '前端工程师',
  description: '热爱创造酷炫的交互体验，用代码让世界更美好 ✨',
  avatar: '👨‍💻',
  education: '电子科学与技术',
  experience: '8年+ 前端开发经验',
  hobbies: '编程、设计、音乐、旅行',
  bio: '我是一名充满热情的前端工程师，专注于创造美观且功能强大的用户界面。我喜欢学习新技术，探索创新的解决方案，并将想法转化为现实。',
  email: '2535462360@qq.com',
  phone: '17835399347',
  location: '福建福州'
}

export const skills: Skill[] = [
  { name: 'Vue.js', icon: '⚡', level: 90 },
  { name: 'TypeScript', icon: '📘', level: 85 },
  { name: 'JavaScript', icon: '💛', level: 95 },
  { name: 'CSS3', icon: '🎨', level: 90 },
  { name: 'HTML5', icon: '🌐', level: 95 },
  { name: 'React', icon: '⚛️', level: 80 },
  { name: 'Angular', icon: '🅰️', level: 75 },
  { name: 'Node.js', icon: '🟢', level: 75 },
  { name: 'Git', icon: '🔧', level: 85 }
]

export const projects: Project[] = [
  {
    name: 'Angular 项目',
    description: '基于 Angular 框架开发的企业级应用，展示了我的 Angular 开发能力',
    icon: '🅰️',
    tags: ['Angular', 'TypeScript', 'RxJS'],
    demo: '#',
    github: '#'
  },
  {
    name: 'React 项目',
    description: '使用 React 构建的现代化 Web 应用，具有优秀的用户体验',
    icon: '⚛️',
    tags: ['React', 'TypeScript', 'Hooks'],
    demo: '#',
    github: '#'
  },
  {
    name: 'Vue 项目',
    description: '基于 Vue3 开发的单页应用，展示了 Vue 生态系统的强大功能',
    icon: '⚡',
    tags: ['Vue3', 'TypeScript', 'Composition API'],
    demo: '#',
    github: '#'
  }
]

export const socialLinks: SocialLink[] = [
  { name: '微信', icon: 'wechat', url: '#' },
  { name: 'QQ', icon: 'qq', url: '#' }
]
