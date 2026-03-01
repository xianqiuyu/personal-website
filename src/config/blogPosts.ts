// 博客文章数据配置

import i18n from '@/i18n'

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  icon: string
  author: string
  readTime: string
  content: string
  tags: string[]
}

// 原始文章数据（用于获取 content，因为内容太长不适合放在 JSON 中）
const blogPostsContent: Record<string, { content: string }> = {
  'opensource-projects': {
    content: `
# 开源项目导航

这篇文章把我 GitHub 上的一些代表性仓库按"学习路径 + 工程价值"梳理一遍，方便你快速找到你关心的方向。

> GitHub 主页：[@xianqiuyu](https://github.com/xianqiuyu)

## 1）源码实现类（从零造轮子，理解原理）

* **mini-vue3**：从零实现 Vue3 核心响应式、computed、虚拟 DOM 渲染器  
  - 推荐给：想把 Vue3 响应式/渲染器吃透的人  
  - 链接：[mini-vue3](https://github.com/xianqiuyu/mini-vue3)
* **mini-react**：实现 React Fiber / Hooks / Scheduler 的迷你版本  
  - 推荐给：想理解 React16+ 内核的人  
  - 链接：[mini-react](https://github.com/xianqiuyu/mini-react)

## 2）源码阅读类（体系化笔记，构建认知地图）

* **vue3-source-analysis**：Vue3 源码阅读笔记（响应式 / 虚拟 DOM / 编译器 / 组件系统）  
  - 链接：[vue3-source-analysis](https://github.com/xianqiuyu/vue3-source-analysis)
* **react-source-analysis**：React 源码阅读笔记（Fiber / Reconciliation / Hooks / Scheduler）  
  - 链接：[react-source-analysis](https://github.com/xianqiuyu/react-source-analysis)

## 3）组件库类（工程化与设计系统落地）

* **vue3-component-lib**：参考 Element Plus 的 Vue3 组件库（含总览/Playground）  
  - 链接：[vue3-component-lib](https://github.com/xianqiuyu/vue3-component-lib)
* **react-component-lib**：参考 Ant Design 的 React 组件库（每个组件配 demo）  
  - 链接：[react-component-lib](https://github.com/xianqiuyu/react-component-lib)

## 4）Admin 模板类（路由/权限/工程骨架）

* **vue3-admin-template**：Vue3 + Router + Pinia + Axios 精简后台模板（登录鉴权/角色路由）  
  - 链接：[vue3-admin-template](https://github.com/xianqiuyu/vue3-admin-template)
* **react-admin-template**：React Router + Zustand + Axios 后台模板（对齐 Vue 版模型）  
  - 链接：[react-admin-template](https://github.com/xianqiuyu/react-admin-template)

## 5）工程化 / 构建类（打包器原理）

* **mini-webpack**：依赖解析 + 模块打包 + runtime require 的迷你版 Webpack  
  - 链接：[mini-webpack](https://github.com/xianqiuyu/mini-webpack)
* **mini-bundler**：AST + 依赖图 + Loader/Plugin + Babel 流程的迷你打包器  
  - 链接：[mini-bundler](https://github.com/xianqiuyu/mini-bundler)

## 6）Hooks / 工具类（高复用业务抽象）

* **react-hooks-collection**：业务级 Hooks 集合（useRequest / useVirtualList / useWebSocket 等）  
  - 链接：[react-hooks-collection](https://github.com/xianqiuyu/react-hooks-collection)

## 后记

后续我会把每个项目背后的"设计取舍、踩坑、可复用套路"拆成系列文章发出来，也欢迎你在 GitHub 上提 Issue 交流。
    `
  }
}

const postsData = [
  {
    id: 'opensource-projects',
    title: '开源项目导航：我做过哪些"从零实现/源码分析/工程化"',
    excerpt: '把 GitHub 上的核心项目按类型梳理一遍：从 mini-vue3 / mini-react 到组件库、后台模板与打包器。',
    date: '2026-02-25',
    category: '开源',
    icon: '🧭',
    author: 'Locke（于贤秋）',
    readTime: '8 分钟',
    tags: ['开源', '项目索引', 'Vue', 'React', '工程化']
  },
  {
    id: 'vue3-composition-api',
    title: 'Vue3 Composition API 深度解析',
    excerpt: '深入探讨 Vue3 的 Composition API，了解其设计理念和最佳实践...',
    date: '2024-01-15',
    category: '前端开发',
    icon: '⚡',
    author: '于贤秋',
    readTime: '15 分钟',
    tags: ['Vue3', 'Composition API', '前端框架'],
    content: `
# Vue3 Composition API 深度解析

Vue3 的 Composition API 是 Vue 框架的一次重大革新，它为我们提供了更灵活、更强大的组件组织方式。本文将深入探讨 Composition API 的核心概念、使用场景和最佳实践。

## 什么是 Composition API？

Composition API 是 Vue3 引入的一套新的 API，它允许我们使用函数式的方式来组织组件逻辑。与传统的 Options API 不同，Composition API 将相关的逻辑组织在一起，而不是按照选项（data、methods、computed 等）分散。

### 为什么需要 Composition API？

在大型项目中，使用 Options API 时，相关的逻辑可能会分散在不同的选项中：

\`\`\`javascript
export default {
  data() {
    return {
      count: 0,
      name: ''
    }
  },
  methods: {
    increment() {
      this.count++
    },
    updateName() {
      // 处理 name 的逻辑
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  }
}
\`\`\`

当组件变得复杂时，这种组织方式会让代码难以维护。Composition API 解决了这个问题：

\`\`\`javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const name = ref('')
    
    const increment = () => {
      count.value++
    }
    
    const doubleCount = computed(() => count.value * 2)
    
    return {
      count,
      name,
      increment,
      doubleCount
    }
  }
}
\`\`\`

## 核心 API 详解

### 1. ref 和 reactive

\`ref\` 用于创建响应式的原始值，\`reactive\` 用于创建响应式的对象：

\`\`\`javascript
import { ref, reactive } from 'vue'

// ref 用于基本类型
const count = ref(0)
const message = ref('Hello')

// reactive 用于对象
const state = reactive({
  name: 'Vue3',
  version: '3.0'
})

// 访问 ref 的值需要使用 .value
console.log(count.value) // 0
count.value = 1

// reactive 对象可以直接访问
console.log(state.name) // 'Vue3'
state.name = 'Vue 3'
\`\`\`

### 2. computed 计算属性

\`computed\` 用于创建计算属性，它会根据依赖自动更新：

\`\`\`javascript
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get: () => \`\${firstName.value} \${lastName.value}\`,
  set: (newValue) => {
    const names = newValue.split(' ')
    firstName.value = names[0]
    lastName.value = names[names.length - 1]
  }
})
\`\`\`

### 3. watch 和 watchEffect

\`watch\` 用于监听特定的数据源，\`watchEffect\` 会自动追踪依赖：

\`\`\`javascript
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)
const name = ref('')

// watch 监听特定数据源
watch(count, (newVal, oldVal) => {
  console.log(\`count 从 \${oldVal} 变为 \${newVal}\`)
})

// watchEffect 自动追踪依赖
watchEffect(() => {
  console.log(\`count 是: \${count.value}\`)
})
\`\`\`

### 4. 生命周期钩子

Composition API 提供了对应的生命周期钩子：

\`\`\`javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    onUpdated(() => {
      console.log('组件已更新')
    })
    
    onUnmounted(() => {
      console.log('组件已卸载')
    })
  }
}
\`\`\`

## 组合式函数（Composables）

组合式函数是 Composition API 的核心优势之一，它允许我们提取和复用逻辑：

\`\`\`javascript
// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
\`\`\`

在组件中使用：

\`\`\`javascript
import { useCounter } from './useCounter'

export default {
  setup() {
    const { count, increment, decrement, reset } = useCounter(10)
    
    return {
      count,
      increment,
      decrement,
      reset
    }
  }
}
\`\`\`

## 实际应用场景

### 1. 数据获取

\`\`\`javascript
import { ref, onMounted } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const fetchData = async () => {
    loading.value = true
    try {
      const response = await fetch(url)
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchData()
  })
  
  return {
    data,
    loading,
    error,
    fetchData
  }
}
\`\`\`

### 2. 表单处理

\`\`\`javascript
import { ref } from 'vue'

export function useForm(initialValues) {
  const formData = ref({ ...initialValues })
  const errors = ref({})
  
  const validate = () => {
    errors.value = {}
    // 验证逻辑
    return Object.keys(errors.value).length === 0
  }
  
  const reset = () => {
    formData.value = { ...initialValues }
    errors.value = {}
  }
  
  return {
    formData,
    errors,
    validate,
    reset
  }
}
\`\`\`

## 最佳实践

1. **使用组合式函数提取逻辑**：将可复用的逻辑提取到组合式函数中
2. **合理使用 ref 和 reactive**：基本类型用 ref，对象用 reactive
3. **注意响应式丢失**：解构 reactive 对象会丢失响应式，使用 toRefs
4. **性能优化**：使用 shallowRef 和 shallowReactive 处理大型对象
5. **TypeScript 支持**：充分利用 TypeScript 的类型推断

## 总结

Composition API 为 Vue3 带来了更强大的逻辑组织能力，特别适合大型项目。通过组合式函数，我们可以更好地复用代码，提高开发效率。虽然学习曲线相对陡峭，但一旦掌握，你会发现它带来的好处是巨大的。

希望这篇文章能帮助你更好地理解和使用 Composition API。如果你有任何问题，欢迎在评论区讨论！
    `
  },
  {
    id: 'typescript-advanced-types',
    title: 'TypeScript 类型系统进阶',
    excerpt: '掌握 TypeScript 的高级类型特性，提升代码质量和开发效率...',
    date: '2024-01-10',
    category: '编程语言',
    icon: '📘',
    author: '于贤秋',
    readTime: '20 分钟',
    tags: ['TypeScript', '类型系统', '编程'],
    content: `
# TypeScript 类型系统进阶

TypeScript 的类型系统是其最强大的特性之一。掌握高级类型特性不仅能提升代码质量，还能显著提高开发效率。本文将深入探讨 TypeScript 的高级类型系统。

## 联合类型和交叉类型

### 联合类型（Union Types）

联合类型允许一个值可以是多种类型之一：

\`\`\`typescript
type StringOrNumber = string | number

function processValue(value: StringOrNumber) {
  if (typeof value === 'string') {
    return value.toUpperCase()
  } else {
    return value.toFixed(2)
  }
}
\`\`\`

### 交叉类型（Intersection Types）

交叉类型将多个类型合并为一个类型：

\`\`\`typescript
interface Person {
  name: string
  age: number
}

interface Employee {
  employeeId: string
  department: string
}

type EmployeePerson = Person & Employee

const employee: EmployeePerson = {
  name: 'John',
  age: 30,
  employeeId: 'E001',
  department: 'Engineering'
}
\`\`\`

## 泛型（Generics）

泛型允许我们创建可重用的组件，这些组件可以处理多种类型：

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}

// 使用
const number = identity<number>(42)
const string = identity<string>('hello')
\`\`\`

### 泛型约束

使用 \`extends\` 关键字约束泛型：

\`\`\`typescript
interface Lengthwise {
  length: number
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}
\`\`\`

### 条件类型

条件类型允许我们根据条件选择类型：

\`\`\`typescript
type IsArray<T> = T extends Array<any> ? true : false

type Test1 = IsArray<number[]> // true
type Test2 = IsArray<string> // false
\`\`\`

## 映射类型（Mapped Types）

映射类型允许我们基于旧类型创建新类型：

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Partial<T> = {
  [P in keyof T]?: T[P]
}

type Required<T> = {
  [P in keyof T]-?: T[P]
}
\`\`\`

## 工具类型

TypeScript 提供了许多内置的工具类型：

### Pick 和 Omit

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
  age: number
}

type UserPreview = Pick<User, 'id' | 'name'>
// { id: number; name: string }

type UserWithoutEmail = Omit<User, 'email'>
// { id: number; name: string; age: number }
\`\`\`

### Record

\`\`\`typescript
type UserRoles = Record<string, boolean>

const roles: UserRoles = {
  admin: true,
  user: false
}
\`\`\`

## 类型守卫（Type Guards）

类型守卫帮助我们缩小类型范围：

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: string | number) {
  if (isString(value)) {
    // TypeScript 知道这里 value 是 string
    return value.toUpperCase()
  } else {
    // TypeScript 知道这里 value 是 number
    return value.toFixed(2)
  }
}
\`\`\`

## 模板字面量类型

TypeScript 4.1 引入了模板字面量类型：

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`

type ClickEvent = EventName<'click'> // 'onClick'
type ChangeEvent = EventName<'change'> // 'onChange'
\`\`\`

## 实际应用示例

### API 响应类型

\`\`\`typescript
type ApiResponse<T> = {
  data: T
  status: number
  message: string
}

type UserResponse = ApiResponse<{
  id: number
  name: string
  email: string
}>
\`\`\`

### 函数重载

\`\`\`typescript
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}
\`\`\`

## 总结

TypeScript 的高级类型系统为我们提供了强大的工具来构建类型安全的应用程序。通过合理使用这些特性，我们可以：

- 提高代码的可维护性
- 减少运行时错误
- 改善开发体验
- 增强代码的可读性

掌握这些高级类型特性需要时间和实践，但投入是值得的。希望这篇文章能帮助你更好地理解和使用 TypeScript 的类型系统！
    `
  },
  {
    id: 'react-hooks-practice',
    title: 'React Hooks 实战技巧',
    excerpt: '分享 React Hooks 在实际项目中的应用经验和常见问题解决方案...',
    date: '2024-01-05',
    category: '前端开发',
    icon: '⚛️',
    author: '于贤秋',
    readTime: '18 分钟',
    tags: ['React', 'Hooks', '前端开发'],
    content: `
# React Hooks 实战技巧

React Hooks 自 16.8 版本引入以来，彻底改变了我们编写 React 组件的方式。本文将分享在实际项目中使用 Hooks 的经验和技巧。

## 常用 Hooks 详解

### useState

\`useState\` 是最基础的 Hook，用于管理组件状态：

\`\`\`javascript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
\`\`\`

### useEffect

\`useEffect\` 用于处理副作用，如数据获取、订阅等：

\`\`\`javascript
import { useState, useEffect } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      const response = await fetch(\`/api/users/\${userId}\`)
      const data = await response.json()
      setUser(data)
      setLoading(false)
    }
    
    fetchUser()
  }, [userId]) // 依赖数组
  
  if (loading) return <div>Loading...</div>
  return <div>{user.name}</div>
}
\`\`\`

### useContext

\`useContext\` 用于访问 Context：

\`\`\`javascript
import { createContext, useContext } from 'react'

const ThemeContext = createContext('light')

function ThemedButton() {
  const theme = useContext(ThemeContext)
  return <button className={theme}>Themed Button</button>
}
\`\`\`

### useReducer

\`useReducer\` 用于管理复杂的状态逻辑：

\`\`\`javascript
import { useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  )
}
\`\`\`

## 自定义 Hooks

自定义 Hooks 允许我们提取组件逻辑：

### useFetch Hook

\`\`\`javascript
import { useState, useEffect } from 'react'

function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(url)
        const data = await response.json()
        setData(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [url])
  
  return { data, loading, error }
}
\`\`\`

### useLocalStorage Hook

\`\`\`javascript
import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })
  
  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }
  
  return [storedValue, setValue]
}
\`\`\`

## 性能优化技巧

### useMemo

\`useMemo\` 用于缓存计算结果：

\`\`\`javascript
import { useMemo } from 'react'

function ExpensiveComponent({ items }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value)
  }, [items])
  
  return <div>{/* 使用 sortedItems */}</div>
}
\`\`\`

### useCallback

\`useCallback\` 用于缓存函数：

\`\`\`javascript
import { useCallback, useState } from 'react'

function Parent() {
  const [count, setCount] = useState(0)
  
  const handleClick = useCallback(() => {
    console.log('Clicked')
  }, [])
  
  return <Child onClick={handleClick} />
}
\`\`\`

## 常见问题和解决方案

### 1. 无限循环问题

\`\`\`javascript
// ❌ 错误：会导致无限循环
useEffect(() => {
  setCount(count + 1)
}, [count])

// ✅ 正确：使用函数式更新
useEffect(() => {
  setCount(prev => prev + 1)
}, [])
\`\`\`

### 2. 清理副作用

\`\`\`javascript
useEffect(() => {
  const subscription = subscribe()
  
  return () => {
    subscription.unsubscribe() // 清理函数
  }
}, [])
\`\`\`

### 3. 条件执行

\`\`\`javascript
useEffect(() => {
  if (condition) {
    // 只在 condition 为 true 时执行
    doSomething()
  }
}, [condition])
\`\`\`

## 最佳实践

1. **只在顶层调用 Hooks**：不要在循环、条件或嵌套函数中调用
2. **合理使用依赖数组**：确保包含所有外部依赖
3. **提取自定义 Hooks**：将复杂逻辑提取到自定义 Hooks
4. **使用 useMemo 和 useCallback 优化性能**：但不要过度使用
5. **保持 Hooks 的单一职责**：每个 Hook 应该只做一件事

## 总结

React Hooks 为我们提供了更灵活、更强大的组件编写方式。通过合理使用 Hooks 和自定义 Hooks，我们可以构建更易维护、性能更好的 React 应用。希望这些实战技巧能帮助你在项目中更好地使用 React Hooks！
    `
  },
  {
    id: 'angular-enterprise-architecture',
    title: 'Angular 企业级应用架构',
    excerpt: '探讨如何使用 Angular 构建可扩展的企业级应用程序...',
    date: '2023-12-28',
    category: '前端开发',
    icon: '🅰️',
    author: '于贤秋',
    readTime: '25 分钟',
    tags: ['Angular', '架构设计', '企业级应用'],
    content: `
# Angular 企业级应用架构

Angular 是一个强大的前端框架，特别适合构建大型企业级应用。本文将探讨如何使用 Angular 构建可扩展、可维护的企业级应用程序。

## Angular 架构概述

Angular 采用组件化架构，核心概念包括：

- **模块（Modules）**：组织应用代码
- **组件（Components）**：构建用户界面
- **服务（Services）**：处理业务逻辑
- **指令（Directives）**：扩展 HTML 功能
- **管道（Pipes）**：数据转换

## 项目结构设计

### 推荐的目录结构

\`\`\`
src/
├── app/
│   ├── core/              # 核心模块（单例服务）
│   │   ├── services/
│   │   └── guards/
│   ├── shared/            # 共享模块
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   ├── features/          # 功能模块
│   │   ├── user/
│   │   ├── product/
│   │   └── order/
│   └── layout/            # 布局组件
├── assets/
└── environments/
\`\`\`

## 核心模块设计

### Core Module

Core Module 应该只被 AppModule 导入一次，包含：

\`\`\`typescript
import { NgModule, Optional, SkipSelf } from '@angular/core'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AuthInterceptor } from './interceptors/auth.interceptor'

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule 只能被 AppModule 导入')
    }
  }
}
\`\`\`

## 服务设计模式

### 单例服务

\`\`\`typescript
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(null)
  
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable()
  }
  
  login(credentials: LoginCredentials): Observable<User> {
    // 登录逻辑
  }
}
\`\`\`

### 功能服务

\`\`\`typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users')
  }
  
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(\`/api/users/\${id}\`)
  }
}
\`\`\`

## 状态管理

### RxJS 状态管理

\`\`\`typescript
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state$ = new BehaviorSubject<AppState>(initialState)
  
  getState(): Observable<AppState> {
    return this.state$.asObservable()
  }
  
  updateState(updates: Partial<AppState>): void {
    this.state$.next({
      ...this.state$.value,
      ...updates
    })
  }
}
\`\`\`

### NgRx（可选）

对于复杂应用，可以考虑使用 NgRx：

\`\`\`typescript
// actions
export const loadUsers = createAction('[User] Load Users')
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: User[] }>()
)

// reducer
export const userReducer = createReducer(
  initialState,
  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users
  }))
)
\`\`\`

## 路由设计

### 路由配置

\`\`\`typescript
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'users',
        loadChildren: () => import('./features/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./features/product/product.module').then(m => m.ProductModule)
      }
    ]
  }
]
\`\`\`

### 路由守卫

\`\`\`typescript
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true
    }
    this.router.navigate(['/login'])
    return false
  }
}
\`\`\`

## HTTP 拦截器

### 认证拦截器

\`\`\`typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken()
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: \`Bearer \${token}\`
        }
      })
    }
    
    return next.handle(req)
  }
}
\`\`\`

### 错误处理拦截器

\`\`\`typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.authService.logout()
        }
        return throwError(error)
      })
    )
  }
}
\`\`\`

## 性能优化

### 懒加载模块

\`\`\`typescript
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
}
\`\`\`

### OnPush 变更检测

\`\`\`typescript
@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`...\`
})
export class UserListComponent {}
\`\`\`

### 虚拟滚动

\`\`\`typescript
<cdk-virtual-scroll-viewport itemSize="50" class="viewport">
  <div *cdkVirtualFor="let user of users">
    {{ user.name }}
  </div>
</cdk-virtual-scroll-viewport>
\`\`\`

## 测试策略

### 单元测试

\`\`\`typescript
describe('UserService', () => {
  let service: UserService
  let httpMock: HttpTestingController
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
    service = TestBed.inject(UserService)
    httpMock = TestBed.inject(HttpTestingController)
  })
  
  it('should fetch users', () => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2)
    })
    
    const req = httpMock.expectOne('/api/users')
    expect(req.request.method).toBe('GET')
    req.flush([{ id: 1, name: 'User 1' }])
  })
})
\`\`\`

## 最佳实践

1. **模块化设计**：将应用拆分为功能模块
2. **服务分离**：业务逻辑放在服务中
3. **组件复用**：创建可复用的共享组件
4. **类型安全**：充分利用 TypeScript
5. **性能优化**：使用懒加载、OnPush 等策略
6. **错误处理**：统一的错误处理机制
7. **代码规范**：遵循 Angular 风格指南

## 总结

构建 Angular 企业级应用需要良好的架构设计。通过合理的模块划分、服务设计、状态管理和性能优化，我们可以构建出可扩展、可维护的大型应用。希望这些经验能帮助你在 Angular 项目中做出更好的架构决策！
    `
  },
  {
    id: 'css-animation-performance',
    title: 'CSS 动画与性能优化',
    excerpt: '学习如何创建流畅的 CSS 动画，并优化动画性能...',
    date: '2023-12-20',
    category: '前端开发',
    icon: '🎨',
    author: '于贤秋',
    readTime: '12 分钟',
    tags: ['CSS', '动画', '性能优化'],
    content: `
# CSS 动画与性能优化

流畅的动画能够显著提升用户体验，但不当的动画实现可能导致性能问题。本文将深入探讨 CSS 动画的最佳实践和性能优化技巧。

## CSS 动画基础

### @keyframes 和 animation

\`\`\`css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.element {
  animation: slideIn 0.5s ease-in-out;
}
\`\`\`

### transition

\`\`\`css
.button {
  transition: all 0.3s ease;
}

.button:hover {
  transform: scale(1.1);
  background-color: #ff6b9d;
}
\`\`\`

## 性能优化原则

### 1. 使用 transform 和 opacity

这两个属性不会触发重排（reflow），只触发重绘（repaint），性能最佳：

\`\`\`css
/* ✅ 好的做法 */
.element {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ 避免 */
.element {
  left: 100px; /* 触发重排 */
  color: red; /* 触发重绘 */
}
\`\`\`

### 2. 使用 will-change

\`will-change\` 提示浏览器哪些属性会改变：

\`\`\`css
.animated-element {
  will-change: transform, opacity;
}

/* 动画结束后移除 */
.animated-element.animation-complete {
  will-change: auto;
}
\`\`\`

### 3. 避免触发重排的属性

以下属性会触发重排，应避免在动画中使用：

- width, height
- margin, padding
- border
- top, left, right, bottom
- font-size
- display

### 4. 使用 GPU 加速

\`\`\`css
.gpu-accelerated {
  transform: translateZ(0);
  /* 或者 */
  transform: translate3d(0, 0, 0);
}
\`\`\`

## 动画技巧

### 缓动函数

\`\`\`css
/* 自定义缓动 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-50px);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
\`\`\`

### 动画组合

\`\`\`css
.complex-animation {
  animation: 
    fadeIn 0.5s ease-in,
    slideIn 0.5s ease-out 0.2s,
    scaleIn 0.3s ease-out 0.4s;
}
\`\`\`

### 暂停和恢复

\`\`\`css
.paused {
  animation-play-state: paused;
}
\`\`\`

## 实际应用示例

### 加载动画

\`\`\`css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
  will-change: transform;
}
\`\`\`

### 淡入淡出

\`\`\`css
@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.fade-element {
  animation: fadeInOut 2s ease-in-out infinite;
}
\`\`\`

### 滑动效果

\`\`\`css
@keyframes slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in {
  animation: slide 0.5s ease-out;
}
\`\`\`

## 性能监控

### 使用 DevTools

Chrome DevTools 的 Performance 面板可以分析动画性能：

1. 打开 Performance 面板
2. 开始录制
3. 触发动画
4. 停止录制
5. 查看 FPS 和渲染时间

### 目标帧率

- 60 FPS：流畅体验
- 30 FPS：可接受
- < 30 FPS：需要优化

## 最佳实践

1. **优先使用 transform 和 opacity**
2. **合理使用 will-change**
3. **避免动画过多元素**
4. **使用 requestAnimationFrame 同步**
5. **减少动画持续时间**
6. **使用硬件加速**
7. **测试不同设备性能**

## 总结

CSS 动画性能优化是一个持续的过程。通过遵循最佳实践，我们可以创建既美观又流畅的动画效果。记住：性能优化应该在保持良好用户体验的前提下进行。

希望这些技巧能帮助你在项目中创建更好的动画效果！
    `
  },
  {
    id: 'frontend-engineering',
    title: '前端工程化实践',
    excerpt: '从构建工具到代码规范，全面了解前端工程化的最佳实践...',
    date: '2023-12-15',
    category: '工程化',
    icon: '🔧',
    author: '于贤秋',
    readTime: '22 分钟',
    tags: ['工程化', '构建工具', 'CI/CD'],
    content: `
# 前端工程化实践

前端工程化是现代前端开发的重要组成部分，它涵盖了从开发到部署的整个流程。本文将全面介绍前端工程化的最佳实践。

## 构建工具

### Webpack

Webpack 是最流行的模块打包工具之一：

\`\`\`javascript
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
}
\`\`\`

### Vite

Vite 是新一代的前端构建工具，提供极速的开发体验：

\`\`\`javascript
// vite.config.js
export default {
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router']
        }
      }
    }
  }
}
\`\`\`

## 代码规范

### ESLint

\`\`\`json
{
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
\`\`\`

### Prettier

\`\`\`json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
\`\`\`

## 版本控制

### Git Hooks

使用 Husky 设置 Git Hooks：

\`\`\`json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
\`\`\`

### 提交规范

遵循 Conventional Commits：

\`\`\`
feat: 添加新功能
fix: 修复 bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建过程或辅助工具的变动
\`\`\`

## 测试

### 单元测试

使用 Jest 进行单元测试：

\`\`\`javascript
describe('Calculator', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3)
  })
})
\`\`\`

### E2E 测试

使用 Cypress 进行端到端测试：

\`\`\`javascript
describe('Login', () => {
  it('should login successfully', () => {
    cy.visit('/login')
    cy.get('[data-cy=username]').type('user')
    cy.get('[data-cy=password]').type('pass')
    cy.get('[data-cy=submit]').click()
    cy.url().should('include', '/dashboard')
  })
})
\`\`\`

## CI/CD

### GitHub Actions

\`\`\`yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run build
\`\`\`

## 性能优化

### 代码分割

\`\`\`javascript
const Home = () => import('./views/Home.vue')
const About = () => import('./views/About.vue')
\`\`\`

### 资源优化

- 图片压缩
- 代码压缩
- Tree Shaking
- 懒加载

## 监控和日志

### 错误监控

使用 Sentry 进行错误监控：

\`\`\`javascript
import * as Sentry from '@sentry/vue'

Sentry.init({
  dsn: 'your-dsn',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0
})
\`\`\`

### 性能监控

\`\`\`javascript
// 使用 Performance API
const perfData = performance.getEntriesByType('navigation')[0]
console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart)
\`\`\`

## 最佳实践

1. **自动化一切**：构建、测试、部署
2. **代码质量**：使用 Linter 和 Formatter
3. **持续集成**：自动化测试和部署
4. **性能监控**：持续关注应用性能
5. **文档完善**：保持文档更新
6. **团队协作**：统一的开发规范

## 总结

前端工程化是一个系统性的工作，需要从多个方面入手。通过合理的工具选择和流程设计，我们可以显著提升开发效率和代码质量。希望这些实践能帮助你的团队建立更好的工程化体系！
    `
  },
  {
    id: 'nodejs-backend-development',
    title: 'Node.js 后端开发实战指南',
    excerpt: '从零开始学习 Node.js，掌握后端开发的核心技能和最佳实践...',
    date: '2024-01-20',
    category: '后端开发',
    icon: '🟢',
    author: '于贤秋',
    readTime: '25 分钟',
    tags: ['Node.js', '后端开发', 'Express', 'JavaScript'],
    content: `
# Node.js 后端开发实战指南

Node.js 让 JavaScript 能够在服务器端运行，这为前端开发者打开了一扇新的大门。本文将分享我在 Node.js 后端开发中的实战经验和感悟。

## 为什么选择 Node.js？

作为一名前端开发者，选择 Node.js 作为后端技术栈有很多优势：

1. **语言统一**：前后端都使用 JavaScript，减少上下文切换
2. **生态丰富**：npm 生态系统庞大，有大量现成的包可以使用
3. **性能优秀**：基于事件驱动和非阻塞 I/O，适合高并发场景
4. **学习曲线平缓**：前端开发者可以快速上手

## Express 框架基础

Express 是 Node.js 最流行的 Web 框架：

\`\`\`javascript
const express = require('express')
const app = express()

// 中间件
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由
app.get('/api/users', (req, res) => {
  res.json({ users: [] })
})

app.post('/api/users', (req, res) => {
  const { name, email } = req.body
  // 处理逻辑
  res.status(201).json({ message: 'User created' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`)
})
\`\`\`

## 中间件开发

中间件是 Express 的核心概念：

\`\`\`javascript
// 日志中间件
const logger = (req, res, next) => {
  console.log(\`\${req.method} \${req.path} - \${new Date().toISOString()}\`)
  next()
}

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  })
}

app.use(logger)
app.use(errorHandler)
\`\`\`

## 数据库操作

### 使用 MongoDB

\`\`\`javascript
const mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// 定义模型
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', UserSchema)

// 使用
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
\`\`\`

### 使用 MySQL

\`\`\`javascript
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'myapp',
  waitForConnections: true,
  connectionLimit: 10
})

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
\`\`\`

## RESTful API 设计

遵循 RESTful 设计原则：

\`\`\`javascript
// GET    /api/users      - 获取所有用户
// GET    /api/users/:id   - 获取单个用户
// POST   /api/users      - 创建用户
// PUT    /api/users/:id   - 更新用户
// DELETE /api/users/:id   - 删除用户

const router = express.Router()

router.get('/users', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

router.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.json(user)
})

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  await user.save()
  res.status(201).json(user)
})

router.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.json(user)
})

router.delete('/users/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.json({ message: 'User deleted' })
})

app.use('/api', router)
\`\`\`

## 身份验证

使用 JWT 实现身份验证：

\`\`\`javascript
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// 登录
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
  
  res.json({ token, user: { id: user._id, email: user.email } })
})

// 验证中间件
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// 受保护的路由
app.get('/api/profile', authenticate, async (req, res) => {
  const user = await User.findById(req.userId)
  res.json(user)
})
\`\`\`

## 错误处理最佳实践

\`\`\`javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    throw new AppError('User not found', 404)
  }
  res.json(user)
}))

// 全局错误处理
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})
\`\`\`

## 性能优化

### 使用 Redis 缓存

\`\`\`javascript
const redis = require('redis')
const client = redis.createClient()

app.get('/api/users/:id', async (req, res) => {
  const cacheKey = \`user:\${req.params.id}\`
  
  // 尝试从缓存获取
  const cached = await client.get(cacheKey)
  if (cached) {
    return res.json(JSON.parse(cached))
  }
  
  // 从数据库获取
  const user = await User.findById(req.params.id)
  
  // 存入缓存（过期时间 1 小时）
  await client.setEx(cacheKey, 3600, JSON.stringify(user))
  
  res.json(user)
})
\`\`\`

### 连接池优化

\`\`\`javascript
// MongoDB 连接池
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000
})
\`\`\`

## 部署实践

### 使用 PM2 管理进程

\`\`\`bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start app.js --name myapp

# 查看状态
pm2 status

# 查看日志
pm2 logs myapp

# 重启应用
pm2 restart myapp

# 停止应用
pm2 stop myapp
\`\`\`

### 环境变量管理

\`\`\`javascript
// 使用 dotenv
require('dotenv').config()

const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development'
}
\`\`\`

## 我的感悟

从纯前端转向全栈开发，Node.js 给了我很大的帮助。最大的感受是：

1. **前后端思维的统一**：使用同一种语言，思维更加连贯
2. **对前后端交互的理解更深**：知道后端如何工作，前端调用时更有把握
3. **解决问题的能力提升**：能够独立完成全栈项目，不再依赖后端同事
4. **职业发展更广阔**：全栈能力让职业选择更多

当然，学习 Node.js 也遇到了一些挑战：
- 异步编程的理解需要时间
- 错误处理比前端更复杂
- 性能优化需要考虑更多因素

但这些都是成长的过程，每一次解决问题都是进步。

## 总结

Node.js 为前端开发者提供了进入后端开发的绝佳机会。通过 Express、数据库操作、身份验证等核心技能的学习，我们可以构建完整的全栈应用。希望这篇文章能帮助你在 Node.js 的学习路上少走弯路！
    `
  },
  {
    id: 'javascript-async-programming',
    title: 'JavaScript 异步编程深度理解',
    excerpt: '深入理解 Promise、async/await 和事件循环，掌握异步编程的精髓...',
    date: '2024-01-18',
    category: '前端开发',
    icon: '⏳',
    author: '于贤秋',
    readTime: '18 分钟',
    tags: ['JavaScript', '异步编程', 'Promise', 'async/await'],
    content: `
# JavaScript 异步编程深度理解

异步编程是 JavaScript 的核心特性之一，也是很多开发者容易混淆的地方。本文将深入探讨 JavaScript 异步编程的方方面面。

## 为什么需要异步？

JavaScript 是单线程的，这意味着同一时间只能执行一个任务。如果所有操作都是同步的，那么在执行耗时操作（如网络请求）时，整个页面会被阻塞。

异步编程让我们可以在等待耗时操作完成的同时，继续执行其他代码。

## 回调函数（Callback）

最原始的异步处理方式：

\`\`\`javascript
function fetchData(callback) {
  setTimeout(() => {
    callback('Data received')
  }, 1000)
}

fetchData((data) => {
  console.log(data)
})
\`\`\`

### 回调地狱

\`\`\`javascript
// ❌ 回调地狱
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        console.log(d)
      })
    })
  })
})
\`\`\`

## Promise

Promise 解决了回调地狱的问题：

\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true
    if (success) {
      resolve('Success!')
    } else {
      reject('Error!')
    }
  }, 1000)
})

promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
\`\`\`

### Promise 链式调用

\`\`\`javascript
fetch('/api/users')
  .then(response => response.json())
  .then(users => {
    return fetch(\`/api/users/\${users[0].id}\`)
  })
  .then(response => response.json())
  .then(user => console.log(user))
  .catch(error => console.error(error))
\`\`\`

### Promise 静态方法

\`\`\`javascript
// Promise.all - 所有 Promise 都成功
Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
]).then(([users, posts, comments]) => {
  console.log('All data loaded')
})

// Promise.race - 第一个完成的
Promise.race([
  fetch('/api/slow'),
  fetch('/api/fast')
]).then(result => {
  console.log('First one completed')
})

// Promise.allSettled - 等待所有完成（无论成功失败）
Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts')
]).then(results => {
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log('Success:', result.value)
    } else {
      console.log('Failed:', result.reason)
    }
  })
})
\`\`\`

## async/await

async/await 让异步代码看起来像同步代码：

\`\`\`javascript
async function fetchUserData() {
  try {
    const response = await fetch('/api/users')
    const users = await response.json()
    const user = await fetch(\`/api/users/\${users[0].id}\`)
    const userData = await user.json()
    console.log(userData)
  } catch (error) {
    console.error('Error:', error)
  }
}
\`\`\`

### 并行执行

\`\`\`javascript
// 串行执行（慢）
async function serial() {
  const user = await fetch('/api/user')
  const posts = await fetch('/api/posts')
  const comments = await fetch('/api/comments')
}

// 并行执行（快）
async function parallel() {
  const [user, posts, comments] = await Promise.all([
    fetch('/api/user'),
    fetch('/api/posts'),
    fetch('/api/comments')
  ])
}
\`\`\`

## 事件循环（Event Loop）

理解事件循环是掌握异步编程的关键：

\`\`\`javascript
console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

Promise.resolve().then(() => {
  console.log('3')
})

console.log('4')

// 输出：1, 4, 3, 2
\`\`\`

### 执行顺序

1. **同步代码**：立即执行
2. **微任务**：Promise.then、queueMicrotask
3. **宏任务**：setTimeout、setInterval、I/O

## 实际应用

### 请求重试

\`\`\`javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return await response.json()
      }
      throw new Error('Request failed')
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
\`\`\`

### 超时控制

\`\`\`javascript
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ])
}
\`\`\`

### 批量处理

\`\`\`javascript
async function processBatch(items, batchSize = 5) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    await Promise.all(batch.map(item => processItem(item)))
  }
}
\`\`\`

## 我的感悟

学习异步编程的过程让我深刻理解了 JavaScript 的执行机制。最大的收获是：

1. **理解事件循环**：明白了代码的执行顺序，不再对异步结果感到困惑
2. **选择合适的方案**：知道什么时候用 Promise，什么时候用 async/await
3. **性能优化**：通过并行执行提升应用性能
4. **错误处理**：学会了如何优雅地处理异步错误

异步编程是前端开发的基础，掌握它能让我们的代码更加高效和优雅。

## 总结

JavaScript 异步编程从回调到 Promise 再到 async/await，每一步都是进步。理解事件循环、掌握 Promise 的各种用法、合理使用 async/await，这些都是成为优秀前端开发者的必备技能。
    `
  },
  {
    id: 'webpack-vite-comparison',
    title: 'Webpack vs Vite：构建工具的选择与思考',
    excerpt: '对比 Webpack 和 Vite 的优劣，分享在实际项目中的选择经验...',
    date: '2024-01-12',
    category: '工程化',
    icon: '📦',
    author: '于贤秋',
    readTime: '15 分钟',
    tags: ['Webpack', 'Vite', '构建工具', '工程化'],
    content: `
# Webpack vs Vite：构建工具的选择与思考

作为前端开发者，选择合适的构建工具至关重要。Webpack 和 Vite 是目前最流行的两个选择，本文将深入对比它们的优劣。

## Webpack：成熟稳定的选择

Webpack 已经存在了很长时间，生态非常成熟。

### 优势

1. **生态丰富**：有大量的 loader 和 plugin
2. **配置灵活**：几乎可以满足任何需求
3. **社区支持**：遇到问题容易找到解决方案
4. **生产环境稳定**：经过大量项目验证

### 劣势

1. **开发速度慢**：大型项目启动和热更新较慢
2. **配置复杂**：学习曲线陡峭
3. **打包体积**：配置不当容易产生冗余代码

### 适用场景

- 大型企业级项目
- 需要复杂配置的项目
- 团队对 Webpack 熟悉

## Vite：新一代的构建工具

Vite 由 Vue 作者尤雨溪开发，带来了全新的开发体验。

### 优势

1. **极速启动**：利用 ES modules，启动速度极快
2. **热更新快**：只更新修改的模块
3. **配置简单**：开箱即用，配置简洁
4. **现代化**：基于原生 ES modules

### 劣势

1. **生态相对较新**：部分插件可能不完善
2. **生产构建**：虽然快，但 Webpack 在某些场景下更成熟
3. **学习资源**：相对较少

### 适用场景

- 新项目
- 中小型项目
- 追求开发体验的团队
- Vue/React 项目

## 性能对比

### 开发环境

\`\`\`bash
# Webpack 启动时间
npm run dev
# 通常需要 10-30 秒（取决于项目大小）

# Vite 启动时间
npm run dev
# 通常只需要 1-3 秒
\`\`\`

### 热更新速度

- **Webpack**：需要重新编译整个模块
- **Vite**：只更新修改的文件，几乎瞬间完成

## 配置对比

### Webpack 配置

\`\`\`javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new VueLoaderPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
\`\`\`

### Vite 配置

\`\`\`javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
\`\`\`

## 我的选择经验

在实际项目中，我的选择原则是：

### 选择 Webpack 的情况

1. **大型遗留项目**：已经使用 Webpack，迁移成本高
2. **复杂需求**：需要特殊的构建配置
3. **团队熟悉度**：团队对 Webpack 更熟悉

### 选择 Vite 的情况

1. **新项目**：从零开始，没有历史包袱
2. **开发体验优先**：追求快速的开发反馈
3. **现代框架**：Vue 3、React 等现代框架项目

## 迁移建议

如果要从 Webpack 迁移到 Vite：

1. **逐步迁移**：先在新功能中使用
2. **插件兼容**：检查现有插件是否有 Vite 版本
3. **测试充分**：确保功能正常
4. **性能对比**：验证性能提升

## 未来趋势

- **Vite 生态在快速发展**：越来越多的项目采用
- **Webpack 仍在维护**：但新功能开发放缓
- **其他工具**：Turbopack、Rspack 等新工具出现

## 我的感悟

使用过两个工具后，我的感受是：

1. **工具只是手段**：重要的是理解构建原理
2. **选择适合的**：没有绝对的好坏，只有是否适合
3. **保持学习**：新技术不断出现，要保持开放心态

## 总结

Webpack 和 Vite 各有优势，选择哪个取决于项目需求、团队情况和技术栈。对于新项目，我倾向于选择 Vite，因为它提供了更好的开发体验。但对于已有项目，迁移需要谨慎评估。

无论选择哪个工具，理解其工作原理都是最重要的。这样无论工具如何变化，我们都能快速适应。
    `
  },
  {
    id: 'frontend-career-growth',
    title: '前端开发者的成长之路：从入门到进阶',
    excerpt: '分享我作为前端开发者的成长经历，包括学习路径、遇到的挑战和收获...',
    date: '2024-01-08',
    category: '生活感悟',
    icon: '🌱',
    author: '于贤秋',
    readTime: '20 分钟',
    tags: ['职业发展', '学习心得', '成长感悟'],
    content: `
# 前端开发者的成长之路：从入门到进阶

作为一名前端开发者，我想分享这些年的成长经历和感悟，希望能给正在路上的朋友们一些启发。

## 初入前端：迷茫与探索

还记得刚开始学习前端的时候，面对 HTML、CSS、JavaScript 三大基础，感觉知识体系庞大，不知道从哪里开始。

### 我的学习路径

1. **基础阶段**（3-6个月）
   - HTML/CSS 基础
   - JavaScript 基础语法
   - 简单的页面布局
   - 响应式设计

2. **框架学习**（6-12个月）
   - Vue.js 基础
   - 组件化开发
   - 状态管理
   - 路由管理

3. **进阶阶段**（1-2年）
   - TypeScript
   - 工程化工具
   - 性能优化
   - 全栈开发

4. **持续学习**（现在）
   - 新技术探索
   - 架构设计
   - 团队协作
   - 技术分享

## 遇到的挑战

### 1. 技术更新快

前端技术更新速度很快，新框架、新工具层出不穷。刚开始会焦虑，觉得学不完。

**我的应对方法**：
- 关注核心原理，而不是具体工具
- 选择主流技术深入学习
- 保持学习习惯，但不盲目追新

### 2. 知识体系庞大

前端涉及的知识面很广：HTML、CSS、JavaScript、框架、工具、工程化、性能优化...

**我的应对方法**：
- 建立知识地图
- 分阶段学习，不要贪多
- 通过项目实践巩固知识

### 3. 解决问题的能力

遇到 bug 时，如何快速定位和解决问题？

**我的应对方法**：
- 学会使用调试工具
- 善用搜索引擎和社区
- 建立问题解决流程
- 记录常见问题和解决方案

## 学习方法分享

### 1. 项目驱动学习

不要只看教程，要通过实际项目来学习：

\`\`\`javascript
// 比如学习 Vue3，不要只看文档
// 而是做一个实际的项目
// 在项目中遇到问题，再去查文档
// 这样学得更深刻
\`\`\`

### 2. 写技术博客

把学到的知识写成博客，有几个好处：
- 加深理解
- 建立个人品牌
- 帮助他人
- 记录成长

### 3. 参与开源项目

参与开源项目能学到很多：
- 代码规范
- 协作流程
- 最佳实践
- 社区文化

### 4. 技术分享

在团队内做技术分享，能：
- 巩固知识
- 提升表达能力
- 获得反馈
- 建立影响力

## 技能树建议

### 基础技能（必须掌握）

- HTML/CSS/JavaScript
- 至少一个主流框架（Vue/React/Angular）
- Git 版本控制
- 基本的调试能力

### 进阶技能（建议掌握）

- TypeScript
- 工程化工具（Webpack/Vite）
- 状态管理（Vuex/Pinia/Redux）
- 测试（单元测试/E2E测试）

### 高级技能（加分项）

- 性能优化
- 架构设计
- 全栈开发
- 团队管理

## 职业发展思考

### 技术深度 vs 广度

这是一个永恒的话题。我的建议是：
- **前期**：先有深度，再扩展广度
- **中期**：在某个领域深入，同时了解相关技术
- **后期**：根据职业规划选择方向

### 全栈 vs 前端专家

两种路径都有价值：
- **全栈**：能独立完成项目，职业选择更多
- **前端专家**：在某个领域深入，成为技术专家

选择哪个取决于个人兴趣和职业规划。

## 我的感悟

### 1. 持续学习是必须的

技术更新快，不学习就会被淘汰。但不要焦虑，保持学习节奏就好。

### 2. 基础很重要

无论框架如何变化，HTML/CSS/JavaScript 的基础永远不会过时。打好基础，学习新技术会更快。

### 3. 实践是最好的老师

看再多教程，不如做一个实际项目。在项目中遇到的问题，才是真正需要掌握的。

### 4. 分享是成长

教别人是最好的学习方式。通过分享，不仅能帮助他人，也能加深自己的理解。

### 5. 保持好奇心

对新技术保持好奇心，但不要盲目追新。选择有价值的技术深入学习。

## 给新手的建议

1. **打好基础**：HTML/CSS/JavaScript 是根本
2. **做项目**：通过项目学习，不要只看教程
3. **写代码**：多写代码，多练习
4. **问问题**：遇到问题先自己思考，再寻求帮助
5. **保持耐心**：学习是一个长期过程，不要急于求成

## 总结

前端开发是一个充满挑战和机遇的领域。只要保持学习热情，持续实践，每个人都能在这个领域找到自己的位置。

成长路上没有捷径，但每一步都算数。希望我的分享能给你一些启发，让我们一起在前端的路上继续前行！

记住：**代码改变世界，我们改变代码** 💪
    `
  },
  {
    id: 'micro-frontends-architecture',
    title: '微前端架构实践：大型项目的拆分与协作',
    excerpt: '探讨微前端架构的设计思路，分享在实际项目中的应用经验...',
    date: '2024-01-05',
    category: '架构设计',
    icon: '🧩',
    author: '于贤秋',
    readTime: '22 分钟',
    tags: ['微前端', '架构设计', '大型项目'],
    content: `
# 微前端架构实践：大型项目的拆分与协作

随着前端项目越来越复杂，微前端架构逐渐成为解决大型项目问题的有效方案。本文将分享微前端架构的实践经验和思考。

## 什么是微前端？

微前端是一种将前端应用拆分为多个独立应用的架构模式。每个应用可以独立开发、部署和运行。

### 核心概念

- **独立开发**：每个团队可以独立开发自己的模块
- **独立部署**：可以单独部署，不影响其他模块
- **技术栈自由**：不同模块可以使用不同的技术栈
- **运行时集成**：在运行时组合成完整的应用

## 为什么需要微前端？

### 传统单体应用的痛点

1. **代码库庞大**：难以维护
2. **团队协作困难**：多人修改同一代码库容易冲突
3. **技术栈锁定**：难以升级或更换技术栈
4. **部署风险高**：一个小改动需要部署整个应用

### 微前端的优势

1. **团队自治**：每个团队负责自己的模块
2. **技术多样性**：可以使用最适合的技术栈
3. **独立部署**：降低部署风险
4. **渐进式升级**：可以逐步升级技术栈

## 微前端实现方案

### 1. iframe 方案

\`\`\`html
<iframe src="http://sub-app.com"></iframe>
\`\`\`

**优点**：简单，隔离性好
**缺点**：性能差，通信复杂

### 2. 路由分发方案

\`\`\`javascript
// 主应用
const routes = {
  '/app1/*': 'http://app1.com',
  '/app2/*': 'http://app2.com'
}

function loadApp(path) {
  const appUrl = routes[path]
  // 加载子应用
}
\`\`\`

### 3. 模块联邦（Module Federation）

使用 Webpack 5 的 Module Federation：

\`\`\`javascript
// 主应用 webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js',
        app2: 'app2@http://localhost:3002/remoteEntry.js'
      }
    })
  ]
}

// 子应用
new ModuleFederationPlugin({
  name: 'app1',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App'
  }
})
\`\`\`

### 4. qiankun 框架

qiankun 是蚂蚁金服开源的微前端框架：

\`\`\`javascript
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:3001',
    container: '#subapp-container',
    activeRule: '/react'
  },
  {
    name: 'vue-app',
    entry: '//localhost:3002',
    container: '#subapp-container',
    activeRule: '/vue'
  }
])

start()
\`\`\`

## 实际应用场景

### 场景一：多团队协作

\`\`\`javascript
// 主应用：负责导航和布局
// 子应用1：用户管理（React 团队）
// 子应用2：订单管理（Vue 团队）
// 子应用3：数据分析（Angular 团队）
\`\`\`

### 场景二：渐进式升级

\`\`\`javascript
// 老系统：jQuery
// 新功能：Vue 3
// 通过微前端逐步迁移
\`\`\`

### 场景三：多产品线

\`\`\`javascript
// 主应用：统一入口
// 子应用1：电商系统
// 子应用2：内容管理系统
// 子应用3：数据分析平台
\`\`\`

## 通信机制

### 全局事件总线

\`\`\`javascript
// 主应用
window.eventBus = new EventEmitter()

// 子应用
window.eventBus.emit('user-login', userData)

// 其他子应用
window.eventBus.on('user-login', (userData) => {
  // 处理登录事件
})
\`\`\`

### 共享状态

\`\`\`javascript
// 使用 Redux 或 Vuex 共享状态
// 主应用提供全局 store
// 子应用可以访问和修改
\`\`\`

### Props 传递

\`\`\`javascript
// 主应用向子应用传递数据
<MicroApp 
  user={currentUser}
  config={appConfig}
/>
\`\`\`

## 样式隔离

### CSS Modules

\`\`\`css
/* 每个应用使用独立的样式作用域 */
.app1-button { }
.app2-button { }
\`\`\`

### Shadow DOM

\`\`\`javascript
const shadowRoot = element.attachShadow({ mode: 'closed' })
shadowRoot.innerHTML = '<style>...</style><div>...</div>'
\`\`\`

### 命名空间

\`\`\`css
/* 使用前缀避免冲突 */
.app1 .button { }
.app2 .button { }
\`\`\`

## 最佳实践

1. **统一规范**：制定统一的开发规范
2. **版本管理**：管理好各子应用的版本
3. **错误处理**：完善的错误边界和降级方案
4. **性能监控**：监控各子应用的性能
5. **文档完善**：维护好技术文档

## 我的感悟

在实际项目中应用微前端架构后，我的感受是：

1. **适合大型项目**：小型项目不需要，会增加复杂度
2. **团队协作改善**：各团队可以独立工作，减少冲突
3. **技术选型灵活**：可以根据需求选择最适合的技术
4. **需要完善的工具链**：开发、构建、部署工具要跟上

## 总结

微前端架构是解决大型前端项目问题的有效方案，但也不是银弹。需要根据项目实际情况判断是否采用。如果项目规模不大，团队协作良好，可能不需要微前端。

但如果你面临大型项目、多团队协作、技术栈多样化的挑战，微前端架构值得考虑。
    `
  }
]

export function getBlogPosts(locale?: string): BlogPost[] {
  const t = i18n.global.t
  const currentLocale = locale || i18n.global.locale.value
  
  return postsData.map((post: any) => {
    const postKey = `blog.posts.${post.id}`
    const contentKey = `blogPosts.content.${post.id}`
    
    // 尝试从国际化文件获取内容，如果不存在则使用原始内容
    let content = ''
    try {
      const translatedContent = t(contentKey)
      if (translatedContent && translatedContent !== contentKey) {
        content = translatedContent
      } else {
        // 如果翻译不存在，使用原始内容（从 blogPostsContent 或 post.content）
        content = blogPostsContent[post.id]?.content || post.content || ''
      }
    } catch {
      content = blogPostsContent[post.id]?.content || post.content || ''
    }
    
    return {
      id: post.id,
      title: t(`${postKey}.title`) || post.title,
      excerpt: t(`${postKey}.excerpt`) || post.excerpt,
      date: post.date,
      category: t(`blog.categories.${post.category}`) || post.category,
      icon: post.icon,
      author: currentLocale === 'en' ? 'Locke' : post.author,
      readTime: post.readTime,
      content: content,
      tags: post.tags.map((tag: string) => {
        // 尝试翻译标签，如果不存在则使用原标签
        const tagTranslation = t(`tags.${tag}`)
        return tagTranslation !== `tags.${tag}` ? tagTranslation : tag
      })
    }
  })
}

// 为了向后兼容，导出默认值
export const blogPosts = getBlogPosts()

// 根据 ID 获取文章
export function getPostById(id: string, locale?: string): BlogPost | undefined {
  return getBlogPosts(locale).find(post => post.id === id)
}

// 获取所有文章
export function getAllPosts(locale?: string): BlogPost[] {
  return getBlogPosts(locale)
}
