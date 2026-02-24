# React 面试题大全（按频率排序）

> 为资深前端工程师整理的React面试题，包含详细解答、代码示例和扩展追问

---

## 🔥 高频题（面试官几乎必问）

### 1. [高频] React Hooks的原理是什么？为什么Hooks不能在条件语句中使用？

**详细解答：**

#### Hooks的实现原理

React Hooks基于**链表数据结构**和**闭包**实现：

```javascript
// React内部维护的Hooks链表（简化版）
let currentHook = null
let workInProgressHook = null
let isMount = true

function useState(initialState) {
  let hook
  
  if (isMount) {
    // 首次渲染：创建新的hook节点
    hook = {
      memoizedState: initialState,
      next: null
    }
    if (!workInProgressHook) {
      // 第一个hook
      workInProgressHook = hook
      currentHook = hook
    } else {
      // 后续hook，链接到链表
      workInProgressHook.next = hook
      workInProgressHook = hook
    }
  } else {
    // 更新：从链表中读取对应的hook
    hook = workInProgressHook
    workInProgressHook = workInProgressHook.next
  }
  
  const setState = (newState) => {
    hook.memoizedState = newState
    // 触发重新渲染
    scheduleUpdate()
  }
  
  return [hook.memoizedState, setState]
}
```

#### 为什么不能在条件语句中使用？

Hooks依赖**调用顺序**来识别每个Hook：

```javascript
// ❌ 错误示例
function Component() {
  if (condition) {
    const [state1, setState1] = useState(0) // 有时调用，有时不调用
  }
  const [state2, setState2] = useState(0)
  // 问题：Hooks的调用顺序不一致，导致状态错乱
}

// ✅ 正确示例
function Component() {
  const [state1, setState1] = useState(0)
  const [state2, setState2] = useState(0)
  // 所有Hooks都在顶层调用，顺序固定
}
```

**原因：**
- Hooks通过链表存储，依赖调用顺序来对应每个Hook
- 条件语句会导致Hooks调用顺序变化，导致状态错乱
- 这就是React的"Hooks规则"

**实际应用场景：**
```javascript
// 条件使用Hook的正确方式
function Component({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // 所有Hooks都在顶层
  useEffect(() => {
    if (userId) {
      fetchUser(userId).then(setUser)
    }
  }, [userId])
  
  // 条件逻辑在Hook内部处理，而不是条件调用Hook
}
```

**扩展追问（含简要解答）：**
- 为什么React要设计Hooks规则？  
  Hooks 依赖调用顺序来匹配内部保存的 Hook 节点，如果允许在条件/循环中任意调用，就无法静态推断“第 N 个 Hook 对应哪一段状态”，状态会错乱；通过“只能在顶层调用、不能在条件里调用”的规则，React 可以用简单的数据结构（链表 + 游标）实现高效且可靠的状态管理。
- 如何实现一个自定义Hook？  
  自定义 Hook 本质上是“以 `use` 开头的普通函数”，内部可以组合调用其他 Hooks（useState、useEffect 等），并将需要暴露的状态和方法以对象/数组形式返回，例如：`function useCounter() { const [count, setCount] = useState(0); return { count, increment: () => setCount(c => c + 1) } }`。
- Hooks和类组件的生命周期如何对应？  
  常见映射是：`componentDidMount + componentDidUpdate` ≈ 带依赖数组的 `useEffect`，`componentWillUnmount` ≈ `useEffect` 返回的清理函数，`shouldComponentUpdate` 可以用 `React.memo`/`useMemo`/`useCallback` 控制；但 Hooks 更偏向“以数据流和副作用为中心”，不完全一一等价。

---

### 2. [高频] React Fiber架构解决了什么问题？工作原理是什么？

**详细解答：**

#### Fiber解决的问题

**问题背景：**
- 旧版React使用递归遍历虚拟DOM，**不可中断**
- 当组件树很大或更新复杂时，长时间占用主线程
- 导致页面卡顿、掉帧，用户体验差

**Fiber的解决方案：**
- 将渲染工作拆分成**可中断、可恢复**的小任务
- 使用**时间切片**，在浏览器空闲时执行
- 支持**优先级调度**，高优先级任务先执行

#### Fiber的工作原理

**1. Fiber节点结构：**

```javascript
// Fiber节点（简化版）
const fiberNode = {
  type: 'div', // 节点类型
  key: null,
  child: null, // 第一个子节点
  sibling: null, // 下一个兄弟节点
  return: null, // 父节点
  alternate: null, // 对应的旧Fiber节点
  effectTag: null, // 副作用标记（增删改）
  updateQueue: null, // 更新队列
  memoizedState: null, // 状态
  memoizedProps: null, // props
}
```

**2. 双缓冲机制：**

```javascript
// React维护两棵Fiber树
let currentFiberTree = null // 当前显示的Fiber树
let workInProgressFiberTree = null // 正在构建的新Fiber树

// 渲染完成后交换
function commitRoot() {
  currentFiberTree = workInProgressFiberTree
  workInProgressFiberTree = null
}
```

**3. 渲染阶段（可中断）：**

```javascript
// 渲染阶段：构建新的Fiber树，可中断
function renderPhase(fiber) {
  // 1. 开始工作单元
  beginWork(fiber)
  
  // 2. 处理子节点
  if (fiber.child) {
    return fiber.child // 返回子节点继续处理
  }
  
  // 3. 处理兄弟节点
  while (fiber) {
    completeWork(fiber) // 完成当前节点
    if (fiber.sibling) {
      return fiber.sibling // 返回兄弟节点
    }
    fiber = fiber.return // 回到父节点
  }
}

// 时间切片：检查是否有时间继续
function workLoop() {
  while (workInProgressFiberTree && shouldYield()) {
    // 有时间，继续工作
    workInProgressFiberTree = renderPhase(workInProgressFiberTree)
  }
  
  if (workInProgressFiberTree) {
    // 没时间了，让出控制权，下次继续
    requestIdleCallback(workLoop)
  } else {
    // 完成，进入提交阶段
    commitRoot()
  }
}
```

**4. 提交阶段（不可中断）：**

```javascript
// 提交阶段：一次性更新DOM，不可中断
function commitPhase() {
  // 1. 提交前：调用getSnapshotBeforeUpdate等
  commitBeforeMutationEffects()
  
  // 2. 提交：更新DOM
  commitMutationEffects()
  
  // 3. 提交后：调用useEffect、componentDidUpdate等
  commitLayoutEffects()
}
```

#### Fiber带来的能力

1. **可中断渲染**：长时间任务可以分段执行
2. **优先级调度**：用户交互优先级高于低优先级更新
3. **并发模式**：支持Suspense、useTransition等特性
4. **更好的用户体验**：页面更流畅，响应更快

**实际应用场景：**
```javascript
// 使用useTransition实现低优先级更新
function App() {
  const [isPending, startTransition] = useTransition()
  const [input, setInput] = useState('')
  const [list, setList] = useState([])
  
  const handleChange = (e) => {
    setInput(e.target.value) // 高优先级：立即更新输入框
    
    startTransition(() => {
      // 低优先级：延迟更新列表
      setList(heavyFilter(e.target.value))
    })
  }
  
  return (
    <div>
      <input value={input} onChange={handleChange} />
      {isPending && <div>Loading...</div>}
      <List items={list} />
    </div>
  )
}
```

**扩展追问（含简要解答）：**
- Fiber架构相比递归调用栈有什么优势？  
  传统递归渲染在调用栈中一口气跑完，期间无法中断，容易长时间阻塞主线程；Fiber 将更新拆成可中断的“小工作单元”，配合调度器在空闲时间片执行，并根据优先级随时暂停/恢复/丢弃低优更新，从而避免长时间卡顿。
- Concurrent Mode的工作原理是什么？  
  核心是“可中断 + 可重做”的渲染：当有高优先级更新（如输入、动画）进来时，React 可以暂停当前低优任务，先渲染高优，再在后台继续低优任务；最终只在提交阶段一次性、同步地更新 DOM，确保 UI 一致性。
- useTransition和useDeferredValue的区别？  
  `useTransition` 用来标记某段“触发更新的代码”为低优先级（例如列表筛选），而 `useDeferredValue` 是对某个“值”做延迟视图跟随（例如输入框的值立即更新，但基于它的搜索结果用 deferredValue 来算）；前者包住“更新动作”，后者包住“依赖值”。

---

### 3. [高频] useState、useEffect、useMemo、useCallback的区别和使用场景？

**详细解答：**

#### useState - 状态管理

```javascript
function Counter() {
  const [count, setCount] = useState(0)
  
  // 函数式更新
  const increment = () => {
    setCount(prev => prev + 1)
  }
  
  return <button onClick={increment}>{count}</button>
}
```

**特点：**
- 用于组件内部状态管理
- 状态更新会触发重新渲染
- 支持函数式更新（避免闭包陷阱）

#### useEffect - 副作用处理

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    // 副作用：数据获取、订阅、DOM操作等
    fetchUser(userId).then(setUser)
    
    // 清理函数：组件卸载或依赖变化时执行
    return () => {
      cancelRequest()
    }
  }, [userId]) // 依赖数组：只有userId变化时才重新执行
  
  return <div>{user?.name}</div>
}
```

**使用场景：**
- 数据获取
- 订阅事件
- 手动操作DOM
- 定时器

**依赖数组规则：**
- `[]`：只在挂载时执行一次
- `[dep1, dep2]`：依赖变化时执行
- 无依赖数组：每次渲染都执行（通常不需要）

#### useMemo - 记忆化计算结果

```javascript
function ExpensiveComponent({ items, filter }) {
  // 只有items或filter变化时才重新计算
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.includes(filter))
  }, [items, filter])
  
  return (
    <div>
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

**使用场景：**
- 昂贵的计算（过滤、排序、转换等）
- 避免子组件不必要的重新渲染（配合React.memo）

**注意：** useMemo本身也有开销，不要过度使用

#### useCallback - 记忆化函数

```javascript
function Parent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  
  // 只有name变化时才重新创建函数
  const handleClick = useCallback(() => {
    console.log(name)
  }, [name])
  
  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <ExpensiveChild onClick={handleClick} />
    </div>
  )
}

// 配合React.memo使用
const ExpensiveChild = React.memo(({ onClick }) => {
  // 只有onClick引用变化时才重新渲染
  return <button onClick={onClick}>Click</button>
})
```

**使用场景：**
- 将函数作为props传递给子组件（配合React.memo）
- 作为其他Hooks的依赖

**对比总结：**

| Hook | 作用 | 返回值 | 使用场景 |
|-----|------|--------|---------|
| useState | 状态管理 | [state, setState] | 组件内部状态 |
| useEffect | 副作用 | undefined | 数据获取、订阅、DOM操作 |
| useMemo | 记忆化值 | 计算后的值 | 昂贵计算、优化渲染 |
| useCallback | 记忆化函数 | 记忆化的函数 | 优化子组件渲染 |

**扩展追问（含简要解答）：**
- 什么时候需要使用useMemo和useCallback？  
  当某个计算开销较大（复杂过滤、排序、大对象衍生）且依赖不频繁变化，或某个函数/对象作为 props 传入深层 memo 化子组件时，可以用 `useMemo/useCallback` 稳定结果/引用；对轻量组件、无明显重渲染问题的场景则不必刻意使用。
- useMemo和useCallback的性能开销是什么？  
  它们在每次渲染都要做依赖对比，并存储上次结果/引用，属于“用空间和少量 CPU 换渲染次数”的优化；在没有明显性能瓶颈时滥用，可能得不偿失，所以应先用 Profiler 找到热点，再有针对性地加。
- 如何避免useEffect的无限循环？  
  核心是确保依赖数组书写正确且不要在 effect 中无条件更新依赖本身：将 effect 中使用到的所有外部变量声明为依赖，必要时用 `useCallback/useMemo` 稳定引用；需要在 effect 中更新 state 时加入条件判断或拆分 state，避免“更新 → effect 触发 → 再更新”的死循环。

---

### 4. [高频] React的虚拟DOM和diff算法原理

**详细解答：**

#### 什么是虚拟DOM？

虚拟DOM是用JavaScript对象描述真实DOM的抽象：

```javascript
// 真实DOM
<div id="app" class="container">
  <p>Hello</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>

// 对应的虚拟DOM（React元素）
{
  type: 'div',
  props: {
    id: 'app',
    className: 'container',
    children: [
      {
        type: 'p',
        props: { children: 'Hello' }
      },
      {
        type: 'ul',
        props: {
          children: [
            { type: 'li', props: { children: 'Item 1' } },
            { type: 'li', props: { children: 'Item 2' } }
          ]
        }
      }
    ]
  }
}
```

#### 为什么需要虚拟DOM？

1. **性能优化**：批量更新DOM，减少重排重绘
2. **跨平台**：可以渲染到不同平台（Web、Native、Canvas）
3. **声明式编程**：开发者只需描述UI，框架负责更新

#### React的diff算法

**核心策略：**

1. **同层比较，不跨层级**
   - 只比较同一层的节点
   - 如果节点类型不同，直接替换整个子树

2. **通过key识别可复用节点**
   ```javascript
   // 有key时，React可以识别哪些节点可以复用
   {items.map(item => (
     <Item key={item.id} data={item} />
   ))}
   ```

3. **组件类型比较**
   ```javascript
   // 组件类型相同：更新props，复用实例
   <ComponentA prop1={value1} />
   
   // 组件类型不同：卸载旧组件，挂载新组件
   <ComponentB prop1={value1} />
   ```

**diff算法流程（简化版）：**

```javascript
function diff(oldVNode, newVNode) {
  // 1. 节点类型不同，直接替换
  if (oldVNode.type !== newVNode.type) {
    return replaceNode(oldVNode, newVNode)
  }
  
  // 2. 节点类型相同，更新属性
  updateProps(oldVNode, newVNode)
  
  // 3. 更新子节点
  updateChildren(oldVNode.children, newVNode.children)
}

function updateChildren(oldChildren, newChildren) {
  // 使用key优化列表diff
  const keyMap = new Map()
  oldChildren.forEach((child, index) => {
    if (child.key) {
      keyMap.set(child.key, { child, index })
    }
  })
  
  // 遍历新children，找到可复用的节点
  newChildren.forEach((newChild, newIndex) => {
    if (newChild.key && keyMap.has(newChild.key)) {
      // 找到可复用节点，移动位置
      const { child: oldChild, index: oldIndex } = keyMap.get(newChild.key)
      if (oldIndex !== newIndex) {
        moveNode(oldChild, newIndex)
      }
      diff(oldChild, newChild)
    } else {
      // 新节点，创建
      createNode(newChild, newIndex)
    }
  })
  
  // 删除不再存在的节点
  oldChildren.forEach(oldChild => {
    if (!newChildren.find(newChild => newChild.key === oldChild.key)) {
      removeNode(oldChild)
    }
  })
}
```

**时间复杂度：**
- 传统diff：O(n³)
- React diff：O(n)（通过key和同层比较优化）

**扩展追问（含简要解答）：**
- 为什么React的diff算法不跨层级比较？  
  跨层级全局最优 diff 计算代价过高（理论上 O(n³)），而真实 UI 结构变化大多局限在同一层级，React 采用“同层比较”的启发式算法，用 O(n) 复杂度换取性能与实现复杂度的平衡。
- key的作用是什么？为什么不能用index作为key？  
  key 用来标识列表中“同一个逻辑元素”，帮助 diff 精确复用节点和最小化插删移动；使用 index 作为 key，在中间插入/删除时会导致后续元素 key 全变，旧 DOM 被错位复用到错误数据上，引发受控输入、动画、选中状态等错乱，因此应优先使用稳定的业务 ID。
- React 18在diff算法上做了哪些优化？  
  React 18 的核心改进更多体现在调度层（并发渲染、优先级）和 SSR（流式、选择性 hydration），diff 本身沿用 Fiber 结构和同层比较策略，但结合更细粒度的优先级信息和“可中断渲染”，在复杂场景下整体更新行为更平滑高效。

---

### 5. [高频] React的性能优化方案有哪些？

**详细解答：**

#### 1. 使用React.memo避免不必要的渲染

```javascript
// 普通组件：props变化就重新渲染
function Child({ name }) {
  console.log('Child render')
  return <div>{name}</div>
}

// 使用memo：只有props变化时才重新渲染
const MemoChild = React.memo(Child, (prevProps, nextProps) => {
  // 自定义比较函数（可选）
  return prevProps.name === nextProps.name
})

function Parent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('John')
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {/* name不变时，MemoChild不会重新渲染 */}
      <MemoChild name={name} />
    </div>
  )
}
```

#### 2. 使用useMemo和useCallback

```javascript
function ExpensiveComponent({ items, filter }) {
  // 记忆化计算结果
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.includes(filter))
  }, [items, filter])
  
  // 记忆化函数
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])
  
  return <List items={filteredItems} onClick={handleClick} />
}
```

#### 3. 代码分割和懒加载

```javascript
// 路由懒加载
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./Home'))
const About = lazy(() => import('./About'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  )
}
```

#### 4. 虚拟列表（长列表优化）

```javascript
import { FixedSizeList } from 'react-window'

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          {items[index].name}
        </div>
      )}
    </FixedSizeList>
  )
}
```

#### 5. 避免在render中创建对象和函数

```javascript
// ❌ 错误：每次渲染都创建新对象
function Component() {
  return <Child style={{ color: 'red' }} />
}

// ✅ 正确：对象提取到组件外部或使用useMemo
const style = { color: 'red' }
function Component() {
  return <Child style={style} />
}
```

#### 6. 使用useTransition处理低优先级更新

```javascript
function SearchResults({ query }) {
  const [isPending, startTransition] = useTransition()
  const [results, setResults] = useState([])
  
  useEffect(() => {
    startTransition(() => {
      // 低优先级更新：不会阻塞用户交互
      setResults(heavySearch(query))
    })
  }, [query])
  
  return (
    <div>
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </div>
  )
}
```

#### 7. 使用React DevTools Profiler定位性能问题

```javascript
// 使用Profiler API
function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <ComponentTree />
    </Profiler>
  )
}

function onRenderCallback(id, phase, actualDuration) {
  console.log('Component:', id)
  console.log('Phase:', phase) // mount 或 update
  console.log('Duration:', actualDuration) // 渲染耗时
}
```

**性能优化检查清单：**

- [ ] 是否使用了React.memo避免不必要的渲染？
- [ ] 是否使用了useMemo和useCallback（但不过度使用）？
- [ ] 是否进行了代码分割和懒加载？
- [ ] 长列表是否使用了虚拟列表？
- [ ] 是否避免了在render中创建对象和函数？
- [ ] 是否使用了useTransition处理低优先级更新？
- [ ] 是否使用Profiler定位了性能瓶颈？

**扩展追问（含简要解答）：**
- 如何定位React应用的性能问题？  
  使用 React DevTools 的 Profiler 录制关键操作，查看哪些组件渲染次数异常多或耗时较高；配合高亮更新、`why-did-you-render`、埋点日志等手段，定位不必要的重渲染和昂贵计算，再针对性优化。
- useMemo和useCallback什么时候应该使用？  
  当组件已通过 Profiler 证实存在明显的“多余重渲染”或“昂贵计算重复执行”时，再使用它们缓存结果或稳定函数引用；否则保持代码简单，避免为理论上的微小收益付出额外心智负担。
- React 18的并发特性如何提升性能？  
  通过可中断渲染和优先级调度，让用户输入、动画等高优事件不再被大规模渲染任务长期阻塞，例如用 `useTransition` 标记低优搜索结果更新，让输入框始终丝滑，而繁重列表更新在后台慢慢完成。

---

## ⭐ 中频题（经常被问到）

### 6. [中频] React的状态管理方案有哪些？如何选型？

**详细解答：**

#### 1. useState / useReducer（组件内部状态）

```javascript
// useState：简单状态
const [count, setCount] = useState(0)

// useReducer：复杂状态
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
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <span>{state.count}</span>
    </div>
  )
}
```

**适用场景：** 组件内部状态，不需要跨组件共享

#### 2. Context API（跨组件共享）

```javascript
// 创建Context
const ThemeContext = createContext()

// Provider
function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Child />
    </ThemeContext.Provider>
  )
}

// Consumer
function Child() {
  const { theme, setTheme } = useContext(ThemeContext)
  return <div className={theme}>Theme: {theme}</div>
}
```

**适用场景：** 低频变化的全局配置（主题、语言、用户信息）

**缺点：** 所有订阅Context的组件都会重新渲染，不适合高频更新

#### 3. Redux（全局状态管理）

```javascript
// Store
import { createStore } from 'redux'

function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    default:
      return state
  }
}

const store = createStore(counterReducer)

// 组件中使用
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

**适用场景：** 大型应用，需要可预测的状态管理、时间旅行调试

**特点：**
- 单一数据源
- 不可变数据
- 纯函数reducer
- 强大的中间件生态

#### 4. Zustand（轻量级状态管理）

```javascript
import create from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

function Counter() {
  const { count, increment } = useStore()
  return <button onClick={increment}>{count}</button>
}
```

**适用场景：** 中小型项目，需要简单易用的状态管理

**特点：**
- API简单
- 支持按选择器订阅
- 性能好
- 体积小

#### 5. Recoil / Jotai（原子化状态管理）

```javascript
// Recoil
import { atom, useRecoilState } from 'recoil'

const countState = atom({
  key: 'countState',
  default: 0,
})

function Counter() {
  const [count, setCount] = useRecoilState(countState)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**适用场景：** 需要细粒度状态管理的场景

**选型建议：**

| 方案 | 适用场景 | 优点 | 缺点 |
|-----|---------|------|------|
| useState | 组件内部状态 | 简单直接 | 无法跨组件共享 |
| Context | 低频全局配置 | 官方支持，简单 | 性能问题，不适合高频更新 |
| Redux | 大型应用 | 可预测、可调试、生态丰富 | 样板代码多 |
| Zustand | 中小型项目 | 简单、性能好 | 生态相对较小 |
| Recoil/Jotai | 细粒度状态 | 原子化、性能好 | 学习曲线、生态较小 |

**扩展追问（含简要解答）：**
- Context和Redux的区别是什么？  
  Context 只是提供“跨层级传值”的机制，适合低频全局配置（主题、语言、当前用户），不负责状态变更流和时间旅行；Redux 是完整的数据流解决方案，有单一 Store、不可变 state、纯函数 reducer、中间件和 DevTools，更适合复杂业务和调试需求。
- 什么时候应该使用Redux？  
  当应用状态复杂、跨模块共享众多，且需要严格的修改路径、可回溯调试（时间旅行）、中间件能力（日志、埋点、权限、异步流）时，Redux 是一个稳健选择；小型项目或简单状态通常无需上 Redux。
- Zustand相比Redux有什么优势？  
  Zustand API 非常简洁，无需 action type/reducer 样板代码，支持按选择器订阅、默认性能表现好、心智模型更接近“一个简单的全局 store”；但生态和工具链相对 Redux 较小，适合中小规模或对 DevTools 依赖不那么强的项目。

---

### 7. [中频] React的事件系统（SyntheticEvent）原理

**详细解答：**

#### 合成事件（SyntheticEvent）

React使用**事件委托**机制，将所有事件统一委托到根节点：

```javascript
// React事件系统（简化版）
class SyntheticEvent {
  constructor(nativeEvent) {
    this.nativeEvent = nativeEvent
    this.type = nativeEvent.type
    this.target = nativeEvent.target
    this.currentTarget = null
    // ... 其他属性
  }
  
  stopPropagation() {
    this.nativeEvent.stopPropagation()
  }
  
  preventDefault() {
    this.nativeEvent.preventDefault()
  }
}

// 事件委托到根节点
document.addEventListener('click', (nativeEvent) => {
  const target = nativeEvent.target
  const fiberNode = getFiberNodeFromDOM(target)
  
  // 收集事件路径
  const path = collectPath(fiberNode)
  
  // 创建合成事件
  const syntheticEvent = new SyntheticEvent(nativeEvent)
  
  // 从下往上触发事件处理函数
  for (let i = path.length - 1; i >= 0; i--) {
    const handler = path[i].onClick
    if (handler) {
      syntheticEvent.currentTarget = path[i]
      handler(syntheticEvent)
    }
  }
})
```

#### 合成事件的优势

1. **跨浏览器兼容**：统一事件对象，兼容不同浏览器
2. **性能优化**：事件委托，减少事件监听器数量
3. **批量更新**：事件处理中的多个setState会被批处理
4. **统一管理**：便于实现事件池、优先级调度等

#### 事件池（React 17之前）

```javascript
// React 17之前：事件对象会被复用（事件池）
function handleClick(e) {
  setTimeout(() => {
    console.log(e.type) // ❌ 错误：e已经被回收
  }, 100)
}

// 解决方案：持久化事件对象
function handleClick(e) {
  e.persist() // 持久化事件对象
  setTimeout(() => {
    console.log(e.type) // ✅ 正确
  }, 100)
}
```

**React 17+：** 移除了事件池，事件对象不再复用

#### 原生事件和合成事件

```javascript
function Component() {
  const handleClick = (e) => {
    // e是合成事件
    console.log(e.nativeEvent) // 访问原生事件
  }
  
  useEffect(() => {
    const handleNativeClick = (e) => {
      // e是原生事件
      e.stopPropagation() // 阻止原生事件冒泡
    }
    
    document.addEventListener('click', handleNativeClick)
    return () => {
      document.removeEventListener('click', handleNativeClick)
    }
  }, [])
  
  return <button onClick={handleClick}>Click</button>
}
```

**扩展追问（含简要解答）：**
- 为什么React要使用合成事件？  
  合成事件统一了不同浏览器的事件行为和 API，简化了兼容性处理；通过事件委托减少大量 DOM 监听器，便于实现批量更新和优先级调度；同时可以在内部接入 Fiber 调度，让事件和渲染更好协同。
- 合成事件和原生事件的区别？  
  合成事件是 React 自己封装的一层，生命周期受 React 控制（17 以前还有事件池），属性跨浏览器统一；原生事件直接由浏览器分发、不经过 React 调度；在 React 事件处理函数中拿到的是合成事件，真正的原生事件在 `e.nativeEvent` 上。
- React 17在事件系统上做了哪些改进？  
  移除了事件池（不再复用事件对象，避免“异步中事件被清空”的坑），事件监听器从 `document` 迁移到根容器，使多个 React 版本/应用更容易并存，同时为并发特性和更灵活的嵌入场景做了铺垫。

---

### 8. [中频] React的受控组件和非受控组件

**详细解答：**

#### 受控组件（Controlled Component）

表单值完全由React state控制：

```javascript
function ControlledInput() {
  const [value, setValue] = useState('')
  
  const handleChange = (e) => {
    setValue(e.target.value)
  }
  
  return (
    <input
      value={value}
      onChange={handleChange}
    />
  )
}
```

**特点：**
- 表单值是单一数据源
- 可以实时验证、格式化
- 可以轻松重置表单
- 推荐使用

#### 非受控组件（Uncontrolled Component）

通过ref直接访问DOM：

```javascript
function UncontrolledInput() {
  const inputRef = useRef(null)
  
  const handleSubmit = () => {
    const value = inputRef.current.value
    console.log(value)
  }
  
  return (
    <input
      ref={inputRef}
      defaultValue="initial value"
    />
  )
}
```

**特点：**
- 表单值由DOM管理
- 代码更简单
- 适合简单表单
- 难以验证和格式化

#### 使用场景对比

| 场景 | 受控组件 | 非受控组件 |
|-----|---------|-----------|
| 需要实时验证 | ✅ | ❌ |
| 需要格式化输入 | ✅ | ❌ |
| 需要重置表单 | ✅ | ❌ |
| 简单表单 | ✅ | ✅ |
| 文件上传 | ❌ | ✅ |

**扩展追问（含简要解答）：**
- 什么时候应该使用非受控组件？  
  表单很简单、不需要实时校验/联动，或者需要直接利用原生表单行为（如文件上传、第三方库接管 DOM）时，可以用非受控组件，代码更接近原生表单。
- 如何实现一个受控的复杂表单？  
  将所有字段 state 收敛到表单容器组件（或表单库如 Formik/react-hook-form），每个字段组件通过 props 接收值和 onChange 回调；在容器里统一做校验、提交、重置等逻辑，必要时拆分成多个逻辑单元并配合 `useReducer` 或状态库管理。

---

### 9. [中频] React的错误边界（Error Boundary）

**详细解答：**

#### 错误边界的作用

错误边界可以捕获子组件树中的JavaScript错误，显示降级UI：

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    // 更新state，显示降级UI
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('Error caught:', error, errorInfo)
    // 可以发送错误到监控系统
    logErrorToService(error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      // 降级UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}

// 使用
function App() {
  return (
    <ErrorBoundary>
      <ComponentThatMightError />
    </ErrorBoundary>
  )
}
```

#### 错误边界的限制

**无法捕获：**
- 事件处理函数中的错误
- 异步代码中的错误（setTimeout、Promise）
- 服务端渲染错误
- 错误边界自身的错误

**处理方式：**
```javascript
function Component() {
  const handleClick = () => {
    try {
      // 可能出错的代码
      riskyOperation()
    } catch (error) {
      // 手动处理错误
      console.error(error)
    }
  }
  
  useEffect(() => {
    // 异步错误需要手动处理
    fetchData()
      .catch(error => {
        console.error(error)
      })
  }, [])
  
  return <button onClick={handleClick}>Click</button>
}
```

**扩展追问（含简要解答）：**
- 为什么错误边界必须是类组件？  
  错误边界依赖两个特殊生命周期钩子：`static getDerivedStateFromError` 和 `componentDidCatch`，它们只在类组件中提供，便于在渲染阶段捕获子树错误并更新自身 state 以展示降级 UI；函数组件暂不支持在渲染阶段以这种方式捕获错误。
- 如何实现一个函数组件的错误边界？  
  目前只能通过“外层用类组件封装 ErrorBoundary，内部用函数组件”这种组合方式；函数组件内部可以用 `try/catch` 捕获事件/异步中的错误，但不能捕获渲染错误，未来 React 若提供相应 Hook（如官方讨论过的 `useErrorBoundary`）才有可能原生支持。

---

### 10. [中频] React的Portal和Fragment

**详细解答：**

#### Portal（传送门）

将子节点渲染到DOM树的另一个位置：

```javascript
import { createPortal } from 'react-dom'

function Modal({ children, isOpen }) {
  if (!isOpen) return null
  
  return createPortal(
    <div className="modal">
      {children}
    </div>,
    document.body // 渲染到body下
  )
}

function App() {
  return (
    <div>
      <Modal isOpen={true}>
        <h1>Modal Content</h1>
      </Modal>
    </div>
  )
}
```

**使用场景：**
- 模态框
- 工具提示
- 下拉菜单
- Toast通知

#### Fragment（片段）

在不添加额外DOM节点的情况下组合子元素：

```javascript
// 使用Fragment
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  )
}

// 或者
function Component() {
  return (
    <React.Fragment>
      <h1>Title</h1>
      <p>Content</p>
    </React.Fragment>
  )
}

// 带key的Fragment（列表场景）
function List() {
  return (
    <>
      {items.map(item => (
        <React.Fragment key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.content}</p>
        </React.Fragment>
      ))}
    </>
  )
}
```

**扩展追问（含简要解答）：**
- Portal的事件冒泡是如何工作的？  
  虽然 Portal 的子节点真实挂载在根容器外部的 DOM 上，但 React 事件系统是基于 Fiber 树而非 DOM 树冒泡的，因此从 Portal 子节点触发的 React 事件仍然会沿着组件树向上传递到父组件，表现得像“逻辑上”就在父组件内部。
- Fragment和div的区别？  
  Fragment 不会在 DOM 中生成额外节点，只是一个包装多子节点的“虚拟容器”，避免出现多余的 `<div>` 影响布局和样式；而 `div` 会真实渲染一个元素，可能改变结构和 CSS 选择器行为。

---

## 📌 低频题（偶尔问到但需要了解）

### 11. [低频] React的SSR（服务端渲染）

**详细解答：**

#### SSR的优势

1. **SEO友好**：搜索引擎可以抓取完整内容
2. **首屏加载快**：服务端直接返回HTML
3. **更好的用户体验**：减少白屏时间

#### 实现方式

```javascript
// 服务端
import { renderToString } from 'react-dom/server'

function handleRequest(req, res) {
  const html = renderToString(<App />)
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>SSR App</title></head>
      <body>
        <div id="root">${html}</div>
        <script src="/client.js"></script>
      </body>
    </html>
  `)
}

// 客户端（hydration）
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(document.getElementById('root'), <App />)
```

**框架推荐：**
- Next.js（最流行）
- Remix
- Gatsby

**扩展追问（含简要解答）：**
- SSR和CSR的区别？  
  SSR 在服务端生成完整 HTML，首屏更快且对 SEO 友好，客户端再进行 hydration 接管；CSR 则是先下载 JS，再在浏览器中初始化和渲染，首屏白屏时间更长，但实现简单、前后端职责更清晰。
- 如何避免SSR和CSR的状态不一致？  
  确保服务端和客户端使用相同的初始数据（通过内联 JSON、请求约定等），避免在首次渲染前就依赖仅在客户端可用的随机值或副作用（如 `Date.now`、`Math.random`、`window`），必要时用 `useEffect` 延后只在客户端执行的逻辑。

---

### 12. [低频] React的并发特性（Concurrent Mode）

**详细解答：**

#### 并发特性

1. **useTransition**：标记低优先级更新
2. **useDeferredValue**：延迟更新值
3. **Suspense**：异步组件加载

```javascript
function App() {
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  
  const results = useMemo(() => {
    return search(deferredQuery)
  }, [deferredQuery])
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value) // 高优先级
          startTransition(() => {
            // 低优先级更新
          })
        }}
      />
      {isPending && <Spinner />}
      <Results results={results} />
    </div>
  )
}
```

**扩展追问（含简要解答）：**
- Concurrent Mode的工作原理？  
  通过 Fiber 将渲染拆成可中断的任务块，结合调度器（Scheduler）为更新赋予优先级，高优任务可以打断低优渲染；在后台准备好多份 UI 的“草稿”，最终只在 commit 阶段一次性切换到合适的版本，从而在保证一致性的前提下提升交互流畅度。
- useTransition和useDeferredValue的区别？  
  `useTransition` 用在“触发更新的地方”，把某段更新标记为低优先级；`useDeferredValue` 用在“使用某个值的地方”，为该值提供一个“延迟跟随版本”，UI 基于 deferredValue 渲染以避免频繁抖动，输入等则立即反映真实值。

---

## 📝 总结

### 高频题必掌握
1. React Hooks原理
2. Fiber架构
3. useState/useEffect/useMemo/useCallback
4. 虚拟DOM和diff算法
5. 性能优化方案

### 中频题要熟悉
6. 状态管理方案
7. 事件系统
8. 受控/非受控组件
9. 错误边界
10. Portal和Fragment

### 低频题需了解
11. SSR
12. 并发特性

---

**建议：**
- 高频题必须能流畅回答，最好能画图说明
- 中频题要能说出核心原理和实际应用
- 低频题至少要知道基本概念，能简单说明
