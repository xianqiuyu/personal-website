## React 面试要点总纲

> 基于 React 官方文档与近期博文（含 React 19 / React Compiler / Sunsetting CRA 等），整理的前端面试复习大纲。

- **适用场景**
  - 想系统梳理 React 知识，用于前端面试复习
  - 已有 React 使用经验，希望对“为什么这么设计”有更深理解

- **快速使用方式**
  - 面试前通读本文件，按每节的“**典型问题**”自测
  - 真正不会的，直接去官网对应章节补课

---

## 一、React 的定位与核心思想

- **React 是什么**
  - 用组件方式构建 UI 的库（不是框架）
  - 支持 Web（React DOM）与原生（React Native）

- **核心思想**
  - **声明式 UI**：描述“界面长什么样”，而不是一步步操作 DOM
  - **组件化**：UI 拆成可复用组件，组件内部管理自己的状态
  - **单向数据流**：数据自上而下流动，避免状态混乱

- **典型问题**
  - React 和 jQuery 思路有什么根本不同？
  - React 和 Vue 在“数据流”上的主要差异是什么？

---

## 二、组件与 JSX

- **函数组件为主**
  - 现代 React 推荐函数组件 + Hooks，类组件已不再主推

- **JSX 本质**
  - 只是 `React.createElement` 的语法糖
  - 允许在“标签”里写 JS 表达式（用 `{}` 包起来）

- **条件渲染**
  - `if`、三元运算符 `cond ? a : b`、逻辑与 `cond && a`

- **列表渲染**
  - `Array.map` + `key`
  - `key` 要**稳定且唯一**（优先使用业务 ID，而不是数组下标）

- **典型问题**
  - 为什么列表渲染需要 `key`？`key` 不当会导致什么问题？
  - JSX 和模板引擎（如 Handlebars / Vue 模板）的区别？

---

## 三、状态管理与数据流

- **组件内部状态（local state）**
  - 使用 `useState` 等 hook
  - 状态是**快照**：每次渲染拿到的是当时那一刻的状态值

- **向下传数据（props）**
  - 父组件通过 `props` 给子组件传递数据与回调
  - `props` 是只读的

- **状态提升（Lifting State Up）**
  - 多个子组件需要共享状态时，把状态提升到它们的最近共同父组件

- **全局状态（跨页面／跨模块）**
  - React 官方不强制方案：可以用 Context、Redux、Zustand、Jotai 等
  - Context 适合**低频全局配置**（主题、语言、当前用户），不适合高频变动的大数据

- **典型问题**
  - 什么时候该“状态提升”？什么时候该用全局状态？
  - Context 的优缺点是什么，为什么说它不是“全局状态管理银弹”？

---

## 四、事件与交互

- **事件绑定**
  - 使用驼峰命名：`onClick`、`onChange`
  - 传入的是函数引用，而不是函数执行结果

- **受控组件 vs 非受控组件**
  - 受控：表单值完全由 React state 控制（`value` + `onChange`）
  - 非受控：通过 `ref` 或原生 DOM 操作读取输入值

- **典型问题**
  - 为什么表单一般推荐使用受控组件？
  - React 事件和原生 DOM 事件有什么不同？

---

## 五、渲染、提交与性能

- **渲染流程（简单版）**
  - 触发更新（`setState` / `dispatch`）
  - 计算新的 UI（渲染阶段：生成虚拟树）
  - 提交到 DOM（提交阶段：真正操作 DOM）

- **批量更新（batched updates）**
  - 多个状态更新会被合并，减少重复渲染

- **避免不必要的重渲染**
  - 拆分组件，缩小影响范围
  - 使用 `React.memo`、`useMemo`、`useCallback` 等做“记忆化”

- **典型问题**
  - 在 React 中，什么情况会触发组件重新渲染？
  - 如何定位和优化“频繁重渲染”问题？

---

## 六、数据获取与网络性能（重点：避免网络瀑布流）

> 来自官方博客：Sunsetting Create React App 中对“数据获取”的讨论。

- **传统方式：在 `useEffect` 里用 `fetch` 拉数据**

```js
useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(setData)
}, [])
```

- **问题：网络瀑布流（Network Waterfalls）**
  - 渲染 → 执行 `useEffect` → 再发请求
  - 代码下载、渲染、数据请求是**串行的**，导致用户白屏时间更长

- **改进方向：让“数据获取”和“渲染”尽量并行**
  - 使用数据获取库：**React Query、SWR、Apollo、Relay** 等
  - 在路由层提供 **loader** 或类似机制：
    - 先加载数据，再渲染对应的路由组件
    - 首屏可以在脚本加载时并行请求数据

- **示例（路由 loader 思路）**

```js
// 路由级数据获取
export async function loader() {
  const res = await fetch('/api/data')
  return res.json()
}

export default function Dashboard({ loaderData }) {
  return (
    <div>
      {loaderData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

- **典型问题**
  - 为什么在组件内部 `useEffect` 里请求数据会产生性能问题？
  - 什么时候应该考虑用 React Query / SWR 这类库？
  - 路由级数据预取的优点是什么？

---

## 七、路由与应用架构

- **SPA 路由**
  - 依赖第三方库（如 React Router）、或框架内置路由（如 Next.js）
  - 现代路由往往提供：
    - 嵌套路由
    - loader / action（路由级数据加载与提交）

- **元信息（Meta）、数据预取与代码拆分**
  - 路由与数据／代码分层，便于渐进加载

- **典型问题**
  - SPA 路由和服务端路由的区别？
  - 解释一下“路由级数据加载（loader）”的好处？

---

## 八、构建工具与 CRA 退役（Sunsetting Create React App）

- **Create React App（CRA）现状**
  - 官方已宣布“sunset”：不再作为推荐的起步方式
  - 主要问题：
    - 架构偏老（基于 webpack，配置封闭）
    - 对现代需求支持不足（SSR、流式渲染、数据获取约定等）

- **当前推荐的起步方式**
  - **Next.js**（官方主推，全家桶：路由、SSR、流式渲染、数据获取）
  - **Vite + React**（适合需要高度定制的 SPA）
  - Remix、Expo（React Native）等根据场景选择

- **对面试的启发**
  - 体现你对“工程化演进”的理解：
    - 不只是会用 CRA，而是知道为什么要迁移到更现代的架构
    - 能说出 SSR / SSG / 流式渲染 / 数据获取模式的优缺点

- **典型问题**
  - 为什么官方不再推荐 CRA？你会选什么替代方案？
  - Next.js 和“纯 React + Vite”在职责上的区别是什么？

---

## 九、React 19 与新特性方向（高层面理解）

> 细节可按需查官方博客，这里只强调“你需要知道它们在解决什么问题”。

- **React 发展方向**
  - 更好的数据获取与流式渲染
  - 编译时优化（React Compiler）
  - 和现代浏览器特性的更好配合（如 View Transitions）

- **面试里的作用**
  - 不需要死记 API，但要能大致说出：
    - React 19 向前兼容
    - 新特性多是“优化开发体验 / 性能”，而不是推翻原有思路

---

## 十、React Compiler 要点（非常新的考点）

- **React Compiler 是什么？**
  - 官方的**编译期优化器**，帮助你**自动做性能优化**：
    - 自动为组件和 hooks 做“记忆化”
    - 减少手写 `useMemo` / `useCallback` / `memo`

- **编译器的前提假设（官方文档重点）**
  - 代码是合法的、语义正确的 JavaScript
  - 访问可空值前要先判断 / 使用可选链（`strictNullChecks` 一类的约束）
  - 遵守 React 规则（Hooks 规则等）

- **出现问题时怎么办？**
  - 官方建议：
    - 使用 `eslint-plugin-react-compiler` 提前发现不安全用法
    - 如果编译后组件异常，可用 `"use no memo"` 暂时让该组件退出编译：

```js
function SuspiciousComponent() {
  "use no memo"; // 让此组件暂时不被 React Compiler 优化
  // ...
}
```

- **重要态度**
  - `"use no memo"` 是**临时逃生门**，不是长期方案
  - 修完问题后应该尝试去掉它，确保编译器能重新优化组件

- **典型问题**
  - React Compiler 解决的核心痛点是什么？
  - 它需要开发者遵守哪些规范？为什么“严格的 null 检查”很重要？
  - 什么时候会用 `"use no memo"`？用完之后应该做什么？

---

## 十一、调试与开发工具

- **React DevTools**
  - 查看组件树、props、state
  - React Compiler 支持：被优化的组件旁会出现 “Memo ✨” 标记

- **配合 ESLint / TypeScript**
  - 使用官方推荐的 ESLint 规则（含 React Compiler 插件）
  - 开启 TypeScript 严格模式（如 `strictNullChecks`），避免运行期空指针问题

- **典型问题**
  - 你如何定位一个“渲染次数异常多”的组件？
  - DevTools 里“Memo ✨” 表示什么？什么时候需要关注它？

---

## 十二、高频综合面试题清单（可自测）

- **基础 & 心智模型**
  - 用你自己的话解释：什么是声明式 UI？对比命令式编程。
  - React 如何实现“单向数据流”？这对调试有什么帮助？

- **状态 & 数据流**
  - 举例说明“状态提升”的场景，并画一下组件树。
  - Context、Redux、Zustand 各适合什么场景？

- **渲染 & 性能**
  - 什么时候需要 `memo` / `useMemo` / `useCallback`？什么时候不需要？
  - 解释什么是“网络瀑布流”，如何在 React 应用中减少它？

- **数据获取**
  - 在 `useEffect` 里调用 `fetch` 的优缺点？
  - 路由 loader / React Query / SWR 带来哪些体验上的提升？

- **工程化 & 生态**
  - 为什么 CRA 被官方“sunset”？现在官方推荐什么起步方式？
  - 你会如何在一个老项目中渐进式引入 SSR 或数据加载约定？

- **新特性（加分项）**
  - React Compiler 的工作原理大致是什么？它依赖哪些“约束”来安全优化代码？
  - `"use no memo"` 的作用与使用场景？

---

## 如何用这份笔记准备面试

- **第一轮：通读 + 打标签**
  - 把自己不熟悉的条目用 💡 标记（可以在本文件上直接做笔记）
- **第二轮：自问自答**
  - 按“典型问题”一条条大声回答，录音或在纸上写关键点
- **第三轮：查缺补漏**
  - 对答不上来的问题，直接回到 React 官网对应章节，补阅读
- **最后一轮：结合项目经验**
  - 把每个知识点都用“你自己做过的项目”来举例说明

> 面试时，比起“背 API”，面试官更在意：  
> 你是否理解 React 的设计思路，并能在真实业务里做出合理的技术选型与取舍。

