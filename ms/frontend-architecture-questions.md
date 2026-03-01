# 前端架构面试题大全（按频率排序）

> 为资深前端工程师整理的前端架构面试题，包含详细解答、代码示例和扩展追问

---

## 🔥 高频题（面试官几乎必问）

### 1. [高频] 微前端架构是什么？如何实现？有哪些方案？

**详细解答：**

#### 什么是微前端？

微前端是一种将**单体前端应用拆分为多个独立前端应用**的架构模式，每个应用可以独立开发、部署、运行。

#### 为什么需要微前端？

1. **团队协作**：不同团队可以独立开发、部署
2. **技术栈自由**：不同应用可以使用不同框架（React、Vue、Angular）
3. **独立部署**：某个应用更新不影响其他应用
4. **渐进式升级**：可以逐步升级老系统

#### 微前端实现方案

##### 1. 单SPA（Single-SPA）

**原理：** 路由级别的应用加载

```javascript
// 主应用（Main App）
import { registerApplication, start } from 'single-spa'

// 注册子应用
registerApplication({
  name: 'app1',
  app: () => System.import('app1'),
  activeWhen: '/app1'
})

registerApplication({
  name: 'app2',
  app: () => System.import('app2'),
  activeWhen: '/app2'
})

start()
```

**特点：**
- 路由级别的应用切换
- 支持多框架
- 需要应用改造

##### 2. qiankun（基于Single-SPA）

**原理：** 基于Single-SPA，提供更完善的解决方案

```javascript
// 主应用
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100',
    container: '#subapp-viewport',
    activeRule: '/react',
  },
  {
    name: 'vue-app',
    entry: '//localhost:7101',
    container: '#subapp-viewport',
    activeRule: '/vue',
  },
])

start({
  sandbox: {
    strictStyleIsolation: true, // 样式隔离
    experimentalStyleIsolation: true
  }
})
```

**特点：**
- 完善的沙箱隔离（JS、CSS）
- 应用间通信
- 生命周期管理
- 预加载

##### 3. Module Federation（Webpack 5）

**原理：** 运行时动态加载远程模块

```javascript
// 主应用 webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        remoteApp: 'remote@http://localhost:3001/remoteEntry.js'
      }
    })
  ]
}

// 主应用使用
import RemoteComponent from 'remoteApp/Component'

function App() {
  return <RemoteComponent />
}
```

**特点：**
- 模块级别的共享
- 运行时加载
- 支持代码共享
- 需要Webpack 5

##### 4. iframe方案

**原理：** 使用iframe隔离应用

```html
<iframe src="http://subapp.com" />
```

**特点：**
- 完全隔离
- 通信复杂
- 性能开销大
- SEO不友好

#### 微前端核心问题

**1. 应用隔离**

```javascript
// JS隔离：使用Proxy代理window
function createSandbox(appName) {
  const proxy = new Proxy(window, {
    get(target, prop) {
      if (prop === 'document') {
        return createFakeDocument()
      }
      return target[prop]
    },
    set(target, prop, value) {
      // 隔离全局变量
      if (!target.hasOwnProperty(prop)) {
        target[`${appName}_${prop}`] = value
      } else {
        target[prop] = value
      }
      return true
    }
  })
  return proxy
}

// CSS隔离：使用Shadow DOM或CSS Scope
```

**2. 应用通信**

```javascript
// 使用CustomEvent
window.dispatchEvent(new CustomEvent('app-message', {
  detail: { type: 'UPDATE_USER', payload: userData }
}))

window.addEventListener('app-message', (event) => {
  const { type, payload } = event.detail
  // 处理消息
})
```

**3. 路由管理**

```javascript
// 主应用路由
const routes = [
  { path: '/app1/*', component: App1 },
  { path: '/app2/*', component: App2 }
]
```

#### 选型建议

| 方案 | 适用场景 | 优点 | 缺点 |
|-----|---------|------|------|
| Single-SPA | 需要路由级切换 | 灵活、支持多框架 | 需要改造应用 |
| qiankun | 企业级应用 | 完善、易用 | 体积较大 |
| Module Federation | 模块级共享 | 性能好、代码共享 | 需要Webpack 5 |
| iframe | 完全隔离需求 | 简单、隔离彻底 | 性能差、通信复杂 |

**扩展追问（含简要解答）：**

**Q: 微前端的样式隔离如何实现？**
> 1. **Shadow DOM**：将子应用挂载到 Shadow DOM 中，样式完全隔离
> 2. **CSS Scope**：给所有样式加上子应用特定前缀（如 `[data-qiankun="app1"]`）
> 3. **CSS Modules**：编译时生成唯一类名
> 4. **动态样式表**：子应用激活时加载样式，卸载时移除

**Q: 如何实现微前端应用间的通信？**
> 1. **CustomEvent**：`window.dispatchEvent(new CustomEvent('msg', { detail: data }))`
> 2. **全局状态**：qiankun 的 `initGlobalState` 创建共享状态
> 3. **发布订阅**：自建 EventBus 或使用 mitt 库
> 4. **URL 参数**：通过路由参数传递简单数据
> 5. **LocalStorage/SessionStorage**：持久化共享数据

**Q: 微前端的性能优化策略？**
> 1. **预加载**：`prefetchApps()` 预加载子应用资源
> 2. **资源共享**：Module Federation 共享公共依赖（Vue、React）
> 3. **按需加载**：路由激活时才加载子应用
> 4. **缓存策略**：子应用资源设置强缓存
> 5. **沙箱优化**：使用 SnapshotSandbox 代替 ProxySandbox（兼容性场景）

---

### 2. [高频] 前端状态管理方案如何选型？Redux、Vuex、Pinia、Zustand的区别？

**详细解答：**

#### 状态管理方案对比

##### 1. Redux（React生态）

```javascript
// Store定义
import { createStore } from 'redux'

function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state
  }
}

const store = createStore(counterReducer)

// 使用
import { useSelector, useDispatch } from 'react-redux'

function Counter() {
  const count = useSelector(state => state.count)
  const dispatch = useDispatch()
  return (
    <button onClick={() => dispatch({ type: 'INCREMENT' })}>
      {count}
    </button>
  )
}
```

**特点：**
- 单一数据源
- 不可变数据
- 纯函数reducer
- 强大的中间件生态（redux-thunk、redux-saga）
- 时间旅行调试

**适用场景：** 大型React应用，需要可预测的状态管理

##### 2. Vuex（Vue 2）

```javascript
// Store定义
import Vuex from 'vuex'

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    INCREMENT(state) {
      state.count++
    }
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT')
    }
  },
  getters: {
    doubleCount: state => state.count * 2
  }
})

// 使用
export default {
  computed: {
    count() {
      return this.$store.state.count
    }
  },
  methods: {
    increment() {
      this.$store.dispatch('increment')
    }
  }
}
```

**特点：**
- 专为Vue设计
- 响应式状态
- mutations同步、actions异步
- 模块化支持

**适用场景：** Vue 2大型应用

##### 3. Pinia（Vue 3推荐）

```javascript
// Store定义
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

// 使用
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()
    return {
      count: counter.count,
      increment: counter.increment
    }
  }
}
```

**特点：**
- Vue 3官方推荐
- 更好的TypeScript支持
- 更简单的API
- 支持Composition API
- 无需mutations，actions可以是同步或异步

**适用场景：** Vue 3应用

##### 4. Zustand（轻量级）

```javascript
// Store定义
import create from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 }))
}))

// 使用
function Counter() {
  const { count, increment } = useStore()
  return <button onClick={increment}>{count}</button>
}

// 按需订阅（性能优化）
function CountDisplay() {
  const count = useStore(state => state.count) // 只订阅count
  return <div>{count}</div>
}
```

**特点：**
- API简单
- 体积小（~1KB）
- 支持按选择器订阅
- 性能好
- 无样板代码

**适用场景：** 中小型项目，需要简单易用的状态管理

#### 选型对比表

| 方案 | 框架 | 复杂度 | 体积 | TypeScript | 适用场景 |
|-----|------|--------|------|-----------|---------|
| Redux | React | 高 | 大 | ✅ | 大型应用 |
| Vuex | Vue 2 | 中 | 中 | ⚠️ | Vue 2应用 |
| Pinia | Vue 3 | 低 | 中 | ✅ | Vue 3应用 |
| Zustand | 框架无关 | 低 | 小 | ✅ | 中小型项目 |

**选型建议：**

1. **React项目**
   - 大型应用：Redux + Redux Toolkit
   - 中小型应用：Zustand或Context API

2. **Vue项目**
   - Vue 2：Vuex
   - Vue 3：Pinia

3. **通用原则**
   - 简单状态：useState/useReducer
   - 跨组件共享：Context/Zustand
   - 全局状态：Redux/Pinia

**扩展追问（含简要解答）：**

**Q: Redux的中间件原理是什么？**
> Redux 中间件采用**洋葱模型**，对 dispatch 进行增强：
> ```javascript
> const middleware = store => next => action => {
>   console.log('before', action)
>   const result = next(action)  // 调用下一个中间件
>   console.log('after', action)
>   return result
> }
> ```
> 核心是 `applyMiddleware` 使用 `compose` 将多个中间件串联，每个中间件可以在 action 到达 reducer 前后执行逻辑。

**Q: 如何实现一个状态管理库？**
> 核心要素：
> 1. **存储状态**：使用闭包保存 state
> 2. **订阅机制**：维护 listeners 数组，state 变化时通知
> 3. **更新方法**：提供 setState/dispatch 方法修改状态
> ```javascript
> function createStore(initialState) {
>   let state = initialState
>   const listeners = []
>   return {
>     getState: () => state,
>     setState: (newState) => {
>       state = { ...state, ...newState }
>       listeners.forEach(fn => fn(state))
>     },
>     subscribe: (fn) => listeners.push(fn)
>   }
> }
> ```

**Q: 状态管理的最佳实践？**
> 1. **最小化全局状态**：只放真正需要共享的数据
> 2. **状态规范化**：避免嵌套过深，使用 ID 引用
> 3. **派生状态用 computed/selector**：避免冗余存储
> 4. **异步逻辑分离**：使用 actions 或中间件处理副作用
> 5. **模块化拆分**：大型应用按功能拆分 store

---

### 3. [高频] 前端工程化实践有哪些？构建工具如何选型？

**详细解答：**

#### 前端工程化核心内容

##### 1. 构建工具

**Webpack（传统主流）**

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin()
  ]
}
```

**特点：**
- 功能强大，生态丰富
- 配置复杂
- 构建速度较慢

**Vite（现代推荐）**

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
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
})
```

**特点：**
- 开发服务器启动快（ESM）
- 热更新快（HMR）
- 生产构建使用Rollup
- 配置简单

**Turbopack（Next.js团队）**

- 使用Rust编写
- 构建速度极快
- 目前主要用于Next.js

**选型建议：**

| 工具 | 适用场景 | 优点 | 缺点 |
|-----|---------|------|------|
| Webpack | 复杂项目、需要丰富插件 | 生态丰富、功能强大 | 配置复杂、速度慢 |
| Vite | 现代项目、追求开发体验 | 速度快、配置简单 | 生态相对较小 |
| Turbopack | Next.js项目 | 速度极快 | 目前仅支持Next.js |

##### 2. 代码规范

**ESLint（代码检查）**

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-console': 'warn',
    'react/prop-types': 'off'
  }
}
```

**Prettier（代码格式化）**

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

**Husky + lint-staged（Git钩子）**

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

##### 3. 类型检查

**TypeScript**

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "jsx": "react"
  }
}
```

##### 4. 测试

**Jest（单元测试）**

```javascript
// test.js
import { render, screen } from '@testing-library/react'
import Component from './Component'

test('renders component', () => {
  render(<Component />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

**Playwright / Cypress（E2E测试）**

```javascript
// e2e.test.js
test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.fill('#username', 'user')
  await page.fill('#password', 'pass')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

##### 5. CI/CD

**GitHub Actions示例**

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test
      - run: npm run build
```

**扩展追问（含简要解答）：**

**Q: Webpack和Vite的区别是什么？**
> | 对比项 | Webpack | Vite |
> |-------|---------|------|
> | 开发模式 | 打包所有模块后启动 | 基于 ESM，按需编译 |
> | 启动速度 | 慢（需要打包） | 快（秒级启动） |
> | 热更新 | 重新构建受影响模块 | 精确到单文件，毫秒级 |
> | 生产构建 | 自身打包 | 使用 Rollup |
> | 生态 | 非常丰富 | 快速增长中 |
> | 配置复杂度 | 高 | 低 |

**Q: 如何优化构建速度？**
> 1. **缓存**：使用 `cache: { type: 'filesystem' }`（Webpack 5）
> 2. **并行处理**：`thread-loader` 多线程编译
> 3. **减少范围**：配置 `include/exclude` 缩小 loader 处理范围
> 4. **DLL 预编译**：提前打包不变的依赖
> 5. **按需编译**：开发环境使用 Vite 或 ESBuild
> 6. **代码分割**：合理配置 `splitChunks`

**Q: 前端工程化的最佳实践？**
> 1. **规范统一**：ESLint + Prettier + EditorConfig
> 2. **Git 工作流**：Husky + lint-staged + commitlint
> 3. **自动化测试**：单元测试 + E2E 测试
> 4. **CI/CD**：GitHub Actions / GitLab CI 自动构建部署
> 5. **文档化**：README + Storybook 组件文档
> 6. **监控告警**：错误监控 + 性能监控

---

### 4. [高频] 前端代码组织和模块化方案

**详细解答：**

#### 模块化方案

##### 1. ES Modules（现代标准）

```javascript
// math.js
export function add(a, b) {
  return a + b
}

export const PI = 3.14

// main.js
import { add, PI } from './math.js'
console.log(add(1, 2))
```

##### 2. CommonJS（Node.js）

```javascript
// math.js
function add(a, b) {
  return a + b
}
module.exports = { add }

// main.js
const { add } = require('./math.js')
```

##### 3. AMD（RequireJS）

```javascript
// math.js
define(['dependency'], function(dependency) {
  return {
    add: function(a, b) {
      return a + b
    }
  }
})

// main.js
require(['math'], function(math) {
  console.log(math.add(1, 2))
})
```

#### 代码组织方式

##### 1. 按功能组织（推荐）

```
src/
  features/
    user/
      components/
      hooks/
      services/
      types/
      index.ts
    product/
      components/
      hooks/
      services/
      types/
      index.ts
  shared/
    components/
    utils/
    hooks/
  app/
    routes/
    store/
```

##### 2. 按类型组织

```
src/
  components/
  pages/
  hooks/
  services/
  utils/
  types/
```

##### 3. 领域驱动设计（DDD）

```
src/
  domains/
    user/
      entities/
      repositories/
      services/
      components/
    product/
      entities/
      repositories/
      services/
      components/
```

#### 模块化最佳实践

**1. 单一职责原则**

```javascript
// ❌ 不好：一个文件做太多事情
// user.js
export function getUser() { }
export function createUser() { }
export function deleteUser() { }
export function formatUser() { }
export function validateUser() { }

// ✅ 好：按职责拆分
// user.service.js
export function getUser() { }
export function createUser() { }

// user.utils.js
export function formatUser() { }
export function validateUser() { }
```

**2. 依赖注入**

```javascript
// ❌ 不好：硬编码依赖
function UserService() {
  this.api = new ApiClient('https://api.example.com')
}

// ✅ 好：依赖注入
function UserService(apiClient) {
  this.api = apiClient
}

const api = new ApiClient('https://api.example.com')
const userService = new UserService(api)
```

**3. 接口抽象**

```typescript
// 定义接口
interface IUserRepository {
  getUser(id: string): Promise<User>
  createUser(user: User): Promise<User>
}

// 实现
class ApiUserRepository implements IUserRepository {
  async getUser(id: string) {
    // API实现
  }
}

class LocalUserRepository implements IUserRepository {
  async getUser(id: string) {
    // 本地存储实现
  }
}
```

**扩展追问（含简要解答）：**

**Q: ES Modules和CommonJS的区别？**
> | 对比项 | ES Modules | CommonJS |
> |-------|-----------|----------|
> | 加载方式 | 编译时静态分析 | 运行时动态加载 |
> | 导出 | `export` / `export default` | `module.exports` |
> | 导入 | `import` | `require()` |
> | 值类型 | 引用绑定（实时） | 值拷贝 |
> | 循环依赖 | 支持（引用绑定） | 可能出问题 |
> | Tree Shaking | ✅ 支持 | ❌ 不支持 |
> | 使用环境 | 浏览器 + Node.js | Node.js |

**Q: 如何设计可复用的组件库？**
> 1. **API 设计**：props 命名一致、提供默认值、支持 v-model
> 2. **样式隔离**：CSS Modules / Scoped CSS / CSS-in-JS
> 3. **主题定制**：CSS 变量 / SCSS 变量 / Design Token
> 4. **按需加载**：支持 tree shaking，提供 ESM 产物
> 5. **文档完善**：Storybook / VitePress 展示用例
> 6. **类型支持**：完整的 TypeScript 类型定义
> 7. **测试覆盖**：单元测试 + 视觉回归测试

**Q: 模块化的最佳实践？**
> 1. **单一职责**：每个模块只做一件事
> 2. **高内聚低耦合**：相关代码放一起，减少模块间依赖
> 3. **统一导出**：使用 `index.ts` 作为模块入口
> 4. **避免循环依赖**：提取公共模块或使用依赖注入
> 5. **命名规范**：文件名、导出名保持一致

---

## ⭐ 中频题（经常被问到）

### 5. [中频] 前端监控和错误处理方案

**详细解答：**

#### 错误监控

**1. 全局错误捕获**

```javascript
// 捕获JavaScript错误
window.addEventListener('error', (event) => {
  console.error('Error:', event.error)
  // 发送到监控系统
  sendToMonitoring({
    type: 'javascript-error',
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  })
})

// 捕获Promise错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason)
  sendToMonitoring({
    type: 'promise-rejection',
    reason: event.reason
  })
})

// React错误边界
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    sendToMonitoring({
      type: 'react-error',
      error: error.toString(),
      errorInfo
    })
  }
}
```

**2. 性能监控**

```javascript
// 使用Performance API
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'navigation') {
      // 页面加载性能
      const metrics = {
        dns: entry.domainLookupEnd - entry.domainLookupStart,
        tcp: entry.connectEnd - entry.connectStart,
        request: entry.responseStart - entry.requestStart,
        response: entry.responseEnd - entry.responseStart,
        dom: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
        load: entry.loadEventEnd - entry.loadEventStart
      }
      sendToMonitoring({ type: 'performance', metrics })
    }
  }
})
observer.observe({ entryTypes: ['navigation'] })

// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

**3. 用户行为追踪**

```javascript
// 埋点系统
class Tracker {
  track(event, properties) {
    sendToAnalytics({
      event,
      properties,
      timestamp: Date.now(),
      userId: getUserId(),
      sessionId: getSessionId()
    })
  }
  
  pageView(page) {
    this.track('page_view', { page })
  }
  
  click(element) {
    this.track('click', { element })
  }
}

const tracker = new Tracker()
```

#### 监控平台

**1. Sentry（错误监控）**

```javascript
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'your-dsn',
  environment: 'production',
  tracesSampleRate: 1.0
})
```

**2. Google Analytics（数据分析）**

```javascript
// gtag.js
gtag('event', 'page_view', {
  page_path: window.location.pathname
})
```

**3. 自建监控系统**

```javascript
// 监控服务
class MonitoringService {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.queue = []
    this.batchSize = 10
  }
  
  send(data) {
    this.queue.push(data)
    if (this.queue.length >= this.batchSize) {
      this.flush()
    }
  }
  
  flush() {
    if (this.queue.length === 0) return
    
    fetch(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(this.queue)
    }).then(() => {
      this.queue = []
    })
  }
}
```

**扩展追问（含简要解答）：**

**Q: 如何实现前端错误监控系统？**
> 1. **错误捕获**：
>    - `window.onerror` / `window.addEventListener('error')` 捕获 JS 错误
>    - `unhandledrejection` 捕获 Promise 错误
>    - React ErrorBoundary / Vue errorHandler 捕获框架错误
> 2. **数据采集**：错误信息、堆栈、用户信息、页面 URL、时间戳
> 3. **上报策略**：批量上报、采样上报、错误去重
> 4. **Source Map**：生产环境还原压缩代码的堆栈
> 5. **告警通知**：邮件、钉钉、飞书等通知

**Q: 性能监控的关键指标有哪些？**
> **Core Web Vitals（核心指标）**：
> - **LCP**（Largest Contentful Paint）：最大内容绘制，< 2.5s
> - **FID**（First Input Delay）：首次输入延迟，< 100ms
> - **CLS**（Cumulative Layout Shift）：累积布局偏移，< 0.1
>
> **其他重要指标**：
> - **FCP**（First Contentful Paint）：首次内容绘制
> - **TTFB**（Time to First Byte）：首字节时间
> - **TTI**（Time to Interactive）：可交互时间

**Q: 如何避免监控系统影响用户体验？**
> 1. **异步上报**：使用 `requestIdleCallback` 或 `setTimeout` 延迟上报
> 2. **批量合并**：积累一定数量后批量发送
> 3. **采样策略**：非关键数据进行采样（如 10%）
> 4. **使用 Beacon API**：页面卸载时也能可靠发送
> 5. **压缩数据**：减少上报数据体积
> 6. **独立域名**：监控请求不与业务请求竞争

---

### 6. [中频] 前端安全防护方案

**详细解答：**

#### 常见安全问题

**1. XSS（跨站脚本攻击）**

```javascript
// ❌ 危险：直接渲染用户输入
<div>{userInput}</div>

// ✅ 安全：转义或使用框架
<div>{escapeHtml(userInput)}</div>
// 或使用React/Vue的自动转义
<div>{userInput}</div> // React/Vue会自动转义
```

**2. CSRF（跨站请求伪造）**

```javascript
// 使用CSRF Token
const token = getCsrfToken()
fetch('/api/data', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': token
  }
})
```

**3. 点击劫持**

```javascript
// 使用X-Frame-Options
// 服务端设置
// X-Frame-Options: DENY

// 或使用CSP
// Content-Security-Policy: frame-ancestors 'none'
```

**4. 敏感信息泄露**

```javascript
// ❌ 危险：在代码中硬编码密钥
const API_KEY = 'sk-1234567890'

// ✅ 安全：使用环境变量
const API_KEY = process.env.REACT_APP_API_KEY

// 注意：前端环境变量仍然会暴露，敏感信息应该放在后端
```

#### 安全最佳实践

**1. 输入验证和转义**

```javascript
function sanitizeInput(input) {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
```

**2. 使用HTTPS**

```javascript
// 强制HTTPS
if (location.protocol !== 'https:') {
  location.replace('https:' + window.location.href.substring(window.location.protocol.length))
}
```

**3. Content Security Policy（CSP）**

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

**扩展追问（含简要解答）：**

**Q: 如何防范XSS攻击？**
> 1. **输入过滤**：对用户输入进行验证和过滤
> 2. **输出转义**：渲染时转义 `< > " ' &` 等特殊字符
> 3. **使用框架**：React/Vue 默认会转义 `{}`/`{{}}` 中的内容
> 4. **避免 innerHTML**：使用 `textContent` 或框架绑定
> 5. **CSP 策略**：禁止内联脚本，限制资源来源
> 6. **HttpOnly Cookie**：防止 JS 读取敏感 Cookie

**Q: 前端安全的最佳实践？**
> 1. **HTTPS 全站**：防止中间人攻击
> 2. **CSP 头**：限制资源加载来源
> 3. **CSRF Token**：表单和 API 请求携带 Token
> 4. **敏感信息不存前端**：密钥、密码等放后端
> 5. **依赖安全**：定期 `npm audit`，更新有漏洞的包
> 6. **输入验证**：前后端都要验证
> 7. **权限控制**：前端路由守卫 + 后端接口鉴权

**Q: 如何实现安全的认证和授权？**
> 1. **认证方式**：
>    - **JWT**：无状态，适合分布式；注意设置过期时间
>    - **Session**：有状态，更安全；需要 Redis 存储
>    - **OAuth 2.0**：第三方登录
> 2. **Token 存储**：
>    - `HttpOnly Cookie`（推荐，防 XSS）
>    - `localStorage`（方便，但有 XSS 风险）
> 3. **刷新机制**：Access Token 短期 + Refresh Token 长期
> 4. **权限设计**：RBAC（基于角色） / ABAC（基于属性）

---

## 📌 低频题（偶尔问到但需要了解）

### 7. [低频] 前端设计模式应用

**详细解答：**

#### 常用设计模式

**1. 单例模式**

```javascript
class ApiClient {
  static instance = null
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new ApiClient()
    }
    return this.instance
  }
}
```

**2. 观察者模式**

```javascript
class EventEmitter {
  constructor() {
    this.events = {}
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }
}
```

**3. 工厂模式**

```javascript
function createButton(type) {
  switch (type) {
    case 'primary':
      return new PrimaryButton()
    case 'secondary':
      return new SecondaryButton()
    default:
      return new DefaultButton()
  }
}
```

**扩展追问（含简要解答）：**

**Q: 前端开发中常用的设计模式有哪些？**
> 1. **单例模式**：全局状态管理、API Client、日志服务
> 2. **观察者模式**：事件系统、Vue 响应式、Redux subscribe
> 3. **发布订阅模式**：EventBus、Node.js EventEmitter
> 4. **工厂模式**：组件工厂、根据类型创建不同实例
> 5. **策略模式**：表单验证规则、不同支付方式
> 6. **装饰器模式**：HOC、装饰器语法 @decorator
> 7. **代理模式**：Vue 3 Proxy、axios 拦截器
> 8. **适配器模式**：统一不同 API 的数据格式

**Q: 如何在前端项目中应用设计模式？**
> 1. **单例模式**：
>    ```javascript
>    // API 服务单例
>    export const apiClient = new ApiClient() // 直接导出实例
>    ```
> 2. **策略模式**：
>    ```javascript
>    const validators = {
>      email: (v) => /^.+@.+$/.test(v),
>      phone: (v) => /^\d{11}$/.test(v)
>    }
>    const validate = (type, value) => validators[type](value)
>    ```
> 3. **观察者模式**：
>    ```javascript
>    // Vue watch / React useEffect 本质就是观察者
>    watch(count, (newVal) => console.log(newVal))
>    ```
> 4. **装饰器模式**：
>    ```javascript
>    // React HOC
>    const withAuth = (Component) => (props) => {
>      if (!isLogin) return <Login />
>      return <Component {...props} />
>    }
>    ```

---

## 📝 总结

### 高频题必掌握
1. 微前端架构
2. 状态管理方案选型
3. 前端工程化实践
4. 代码组织和模块化

### 中频题要熟悉
5. 前端监控和错误处理
6. 前端安全防护

### 低频题需了解
7. 前端设计模式

---

**建议：**
- 高频题必须能流畅回答，最好能结合实际项目经验
- 中频题要能说出核心原理和实际应用
- 低频题至少要知道基本概念，能简单说明
