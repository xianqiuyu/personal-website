# Vue 面试题大全（按频率排序）

> 为资深前端工程师整理的Vue面试题，包含详细解答、代码示例和扩展追问

---

## 🔥 高频题（面试官几乎必问）

### 1. [高频] Vue 2和Vue 3的响应式原理有什么区别？

**详细解答：**

#### Vue 2的响应式原理（Object.defineProperty）

Vue 2使用`Object.defineProperty`来劫持对象的属性访问和修改：

```javascript
// Vue 2响应式原理简化版
function defineReactive(obj, key, val) {
  const dep = new Dep() // 依赖收集器
  
  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集：当前正在执行的Watcher会被收集
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    set(newVal) {
      if (newVal === val) return
      val = newVal
      // 派发更新：通知所有依赖的Watcher更新
      dep.notify()
    }
  })
}
```

**Vue 2的局限性：**
1. **无法监听数组索引和length变化**：需要通过重写数组方法（push、pop、shift等）来触发更新
2. **无法监听对象属性的新增/删除**：需要使用`Vue.set`和`Vue.delete`
3. **需要递归遍历对象的所有属性**：初始化时性能开销较大
4. **无法监听Map、Set等新数据结构**

#### Vue 3的响应式原理（Proxy）

Vue 3使用`Proxy`来创建响应式对象：

```javascript
// Vue 3响应式原理简化版
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      // 依赖收集
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      // 如果值是对象，递归代理
      if (isObject(result)) {
        return reactive(result)
      }
      return result
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      // 派发更新
      if (oldValue !== value) {
        trigger(target, key)
      }
      return result
    },
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key)
      const result = Reflect.deleteProperty(target, key)
      if (hadKey) {
        trigger(target, key)
      }
      return result
    }
  })
}
```

**Vue 3的优势：**
1. **可以监听数组索引和length变化**
2. **可以监听对象属性的新增/删除**：无需特殊API
3. **支持Map、Set、WeakMap、WeakSet**
4. **性能更好**：Proxy是浏览器原生支持，性能优于Object.defineProperty
5. **更细粒度的依赖收集**：可以精确到属性级别

**实际应用场景：**
- Vue 2中动态添加响应式属性需要使用`Vue.set(this.obj, 'newKey', 'value')`
- Vue 3中可以直接`this.obj.newKey = 'value'`，自动变成响应式

**扩展追问（含简要解答）：**
- Proxy相比Object.defineProperty的性能优势体现在哪里？  
  Proxy 可以一次性代理整个对象，不必对每个 key 单独 `defineProperty`，初始化开销更低；对数组索引、`length` 等有引擎级优化，不再需要手动“打补丁”；还能原生支持 `Map`/`Set` 等新数据结构，整体由底层完成更多工作，长期可获得更好性能。
- Vue 3的响应式系统如何处理循环引用？  
  使用 `WeakMap(target → depsMap)` 存储依赖，`depsMap` 再用 `Map(key → dep)`，当某个目标对象不再被外部引用时，GC 可以正常回收它及其依赖记录，不会因为循环引用导致内存泄漏；同时通过 WeakMap 做缓存，对同一 `target` 只创建一次代理，避免无限递归。
- 为什么Vue 3要使用Reflect而不是直接操作对象？  
  `Reflect.get/set/deleteProperty` 与 Proxy handler 的签名一一对应，便于把默认行为“转发”回目标对象；同时能返回更精确的布尔结果（操作是否成功），有利于判断是否需要触发更新，并且在 `Reflect.get(target, key, receiver)` 中可以保证 getter 内部 `this` 绑定正确。

---

### 2. [高频] 解释Vue的虚拟DOM和diff算法

**详细解答：**

#### 什么是虚拟DOM？

虚拟DOM（Virtual DOM）是用JavaScript对象来描述真实DOM的抽象表示：

```javascript
// 真实DOM
<div id="app" class="container">
  <p>Hello</p>
</div>

// 对应的虚拟DOM
{
  tag: 'div',
  props: { id: 'app', class: 'container' },
  children: [
    {
      tag: 'p',
      props: {},
      children: ['Hello']
    }
  ]
}
```

#### 为什么需要虚拟DOM？

1. **性能优化**：直接操作DOM成本高，虚拟DOM可以在内存中批量更新
2. **跨平台**：虚拟DOM可以渲染到不同平台（Web、小程序、Native）
3. **声明式编程**：开发者只需描述UI状态，框架负责更新

#### Vue的diff算法

Vue的diff算法采用**同层比较**策略，不会跨层级比较：

```javascript
// Vue diff算法核心思想（简化版）
function patch(oldVNode, newVNode) {
  // 1. 如果节点类型不同，直接替换
  if (oldVNode.tag !== newVNode.tag) {
    replaceNode(oldVNode, newVNode)
    return
  }
  
  // 2. 节点类型相同，更新属性
  updateProps(oldVNode, newVNode)
  
  // 3. 更新子节点
  updateChildren(oldVNode.children, newVNode.children)
}

function updateChildren(oldChildren, newChildren) {
  // 使用双端指针优化列表diff
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldChildren.length - 1
  let newEndIdx = newChildren.length - 1
  
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 头头比较、尾尾比较、头尾比较、尾头比较
    // 找到可复用的节点，移动位置
    // 找不到则创建新节点或删除旧节点
  }
}
```

**Vue 3的优化：**
- 使用**最长递增子序列（LIS）算法**来最小化DOM移动操作
- 静态提升：将静态节点提升到渲染函数外部
- PatchFlag：标记动态节点类型，只对比需要更新的部分

**时间复杂度：**
- 传统diff算法：O(n³)
- Vue的diff算法：O(n)（通过key优化）

**扩展追问（含简要解答）：**
- 为什么Vue的diff算法不跨层级比较？  
  若允许跨层级全局比较，需要在整棵树上做复杂的“最小编辑距离”计算，理论复杂度可达 O(n³)，而实际 UI 变更绝大多数发生在同层节点；限制为“同层比较”是工程上的取舍：用更简单的 O(n) 算法换取足够好的结果，也让更新行为更可预测。
- key的作用是什么？为什么不能用index作为key？  
  key 用来标识“同一个逻辑节点”，帮助 diff 在新旧 children 之间准确匹配/复用节点并减少 DOM 操作；使用 index 时，中间插入/删除会导致后续节点 index 全变，旧 DOM 被错位复用到错误数据上，导致输入内容、选中状态、动画等错乱，因此应优先使用稳定的业务 ID 作为 key。
- Vue 3相比Vue 2在diff算法上做了哪些优化？  
  Vue 3 在编译阶段为动态节点打上 PatchFlag，并构建 Block Tree，只 diff 必须更新的部分；同时对静态子树做“静态提升”，渲染时直接复用；在列表 diff 中利用最长递增子序列（LIS）来最小化移动次数，整体减少运行时开销。

---

### 3. [高频] Vue组件间通信方式有哪些？

**详细解答：**

#### 1. Props / $emit（父子组件通信）

```vue
<!-- 父组件 -->
<template>
  <ChildComponent 
    :message="parentMsg" 
    @update="handleUpdate"
  />
</template>

<script>
export default {
  data() {
    return {
      parentMsg: 'Hello from parent'
    }
  },
  methods: {
    handleUpdate(newMsg) {
      this.parentMsg = newMsg
    }
  }
}
</script>

<!-- 子组件 -->
<script>
export default {
  props: {
    message: String
  },
  methods: {
    notifyParent() {
      this.$emit('update', 'New message')
    }
  }
}
</script>
```

#### 2. $parent / $children（父子组件直接访问）

```javascript
// 子组件访问父组件
this.$parent.someMethod()

// 父组件访问子组件
this.$children[0].someMethod()
```

**注意**：不推荐使用，耦合度高，Vue 3已移除$children

#### 3. provide / inject（跨层级通信）

```javascript
// 祖先组件
export default {
  provide() {
    return {
      theme: this.theme,
      updateTheme: this.updateTheme
    }
  }
}

// 后代组件
export default {
  inject: ['theme', 'updateTheme']
}
```

#### 4. $refs（访问子组件实例）

```vue
<template>
  <ChildComponent ref="child" />
</template>

<script>
export default {
  mounted() {
    this.$refs.child.someMethod()
  }
}
</script>
```

#### 5. EventBus（事件总线）

```javascript
// eventBus.js
import Vue from 'vue'
export default new Vue()

// 组件A
import eventBus from './eventBus'
eventBus.$emit('custom-event', data)

// 组件B
import eventBus from './eventBus'
eventBus.$on('custom-event', (data) => {
  // 处理数据
})
```

#### 6. Vuex / Pinia（全局状态管理）

```javascript
// 使用Vuex
this.$store.commit('mutationName', payload)
this.$store.dispatch('actionName', payload)

// 使用Pinia（Vue 3推荐）
import { useStore } from '@/stores'
const store = useStore()
store.increment()
```

#### 7. $attrs / $listeners（Vue 2）或 v-bind="$attrs"（Vue 3）

```vue
<!-- 父组件 -->
<ChildComponent v-bind="$attrs" />

<!-- 子组件自动接收未在props中声明的属性 -->
```

**使用场景对比：**

| 通信方式 | 适用场景 | 优点 | 缺点 |
|---------|---------|------|------|
| Props/$emit | 父子组件 | 简单直接 | 只能父子通信 |
| provide/inject | 跨层级 | 适合深层嵌套 | 数据流向不清晰 |
| EventBus | 任意组件 | 解耦 | 难以追踪，容易内存泄漏 |
| Vuex/Pinia | 全局状态 | 集中管理，可追踪 | 小型项目可能过度设计 |

**扩展追问（含简要解答）：**
- 什么时候应该使用provide/inject而不是props？  
  当同一份数据或能力需要在多层级组件间传递，而中间层组件并不关心这些字段（如表单上下文、主题、i18n、全局配置、路由对象等）时更适合使用 provide/inject；若仅跨 1～2 层且数据紧密相关，仍优先使用 props，数据流更清晰。
- EventBus的缺点是什么？如何避免内存泄漏？  
  EventBus 的数据流不透明，“谁发谁收”难以追踪，事件名是字符串易拼错且重构困难，并且订阅/取消订阅需手工管理，稍不注意就会造成内存泄漏；应在组件销毁钩子中成对调用 `$on/$off`，或封装成统一的 hook/mixin 集中清理，规模稍大时则用更结构化的状态管理库替代 EventBus。
- Vuex和Pinia的区别是什么？  
  Vuex 偏向传统 Flux 模式，区分 `state/mutations/actions`，样板代码相对较多；Pinia 是 Vue 3 官方推荐的状态库，API 更贴近 Composition API，`state/getters/actions` 都是普通函数或属性，不再强制区分 mutations/actions，类型推断更好、开发体验更现代，也支持 Vue 2。

---

### 4. [高频] Vue的生命周期钩子有哪些？执行顺序是什么？

**详细解答：**

#### Vue 2生命周期

```javascript
export default {
  beforeCreate() {
    // 实例初始化之后，数据观测和事件配置之前
    // 此时无法访问data、methods等
  },
  created() {
    // 实例创建完成，数据观测、属性、方法已完成
    // 可以访问data、methods，但DOM还未挂载
    // 适合：发送请求、初始化数据
  },
  beforeMount() {
    // 模板编译完成，但还未挂载到DOM
  },
  mounted() {
    // 实例挂载到DOM后调用
    // 可以访问DOM元素
    // 适合：操作DOM、初始化第三方库
  },
  beforeUpdate() {
    // 数据更新时，虚拟DOM重新渲染之前
  },
  updated() {
    // 数据更新后，虚拟DOM重新渲染完成
    // 注意：避免在此钩子中修改数据，可能导致无限循环
  },
  beforeDestroy() {
    // 实例销毁之前
    // 适合：清理定时器、取消订阅、解绑事件
  },
  destroyed() {
    // 实例销毁后
  }
}
```

#### Vue 3生命周期（Composition API）

```javascript
import { 
  onBeforeMount, 
  onMounted, 
  onBeforeUpdate, 
  onUpdated,
  onBeforeUnmount,
  onUnmounted 
} from 'vue'

export default {
  setup() {
    onBeforeMount(() => {
      // 对应beforeMount
    })
    
    onMounted(() => {
      // 对应mounted
    })
    
    onBeforeUpdate(() => {
      // 对应beforeUpdate
    })
    
    onUpdated(() => {
      // 对应updated
    })
    
    onBeforeUnmount(() => {
      // 对应beforeDestroy
    })
    
    onUnmounted(() => {
      // 对应destroyed
    })
  }
}
```

**执行顺序（父子组件）：**

```
父组件 beforeCreate
父组件 created
父组件 beforeMount
  子组件 beforeCreate
  子组件 created
  子组件 beforeMount
  子组件 mounted
父组件 mounted
```

**实际应用场景：**

```javascript
export default {
  data() {
    return {
      timer: null,
      data: null
    }
  },
  created() {
    // 发送请求，不依赖DOM
    this.fetchData()
  },
  mounted() {
    // 初始化需要DOM的第三方库
    this.initChart()
    // 添加事件监听
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    // 清理工作
    if (this.timer) {
      clearInterval(this.timer)
    }
    window.removeEventListener('resize', this.handleResize)
  }
}
```

**扩展追问（含简要解答）：**
- created和mounted的区别？什么时候用created，什么时候用mounted？  
  `created` 时组件实例已创建，`data/methods` 可用但 DOM 尚未挂载，适合执行不依赖 DOM 的逻辑（请求、初始化数据）；`mounted` 时模板已经插入 DOM，可访问 `$el` 和 `ref`，适合做依赖真实 DOM 的操作（图表初始化、尺寸测量、绑定原生事件等）。
- 为什么在updated钩子中修改数据可能导致无限循环？  
  `updated` 本身就是“因为响应式数据变化而触发的一次更新”之后调用的钩子，如果在这里再次修改同一份响应式数据，就会再次触发更新 → 再进入 `updated` → 再改数据，形成死循环，因此在该钩子中修改数据必须加以条件限制或避免。
- Vue 3为什么移除了beforeCreate和created？如何替代？  
  在 Composition API 下，组件初始化逻辑集中在 `setup` 中执行，语义上覆盖了 `beforeCreate/created` 做的事情，因此不再单独暴露这两个钩子；使用 Options API 时依然可以使用它们，而在 Composition API 中则直接在 `setup` 的同步代码里完成相应初始化。

---

### 5. [高频] Composition API和Options API的区别？为什么Vue 3要引入Composition API？

**详细解答：**

#### Options API（Vue 2风格）

```vue
<template>
  <div>{{ count }}</div>
  <button @click="increment">+</button>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      message: 'Hello'
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  watch: {
    count(newVal) {
      console.log('count changed:', newVal)
    }
  }
}
</script>
```

#### Composition API（Vue 3推荐）

```vue
<template>
  <div>{{ count }}</div>
  <button @click="increment">+</button>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const count = ref(0)
const message = ref('Hello')

const increment = () => {
  count.value++
}

const doubleCount = computed(() => count.value * 2)

watch(count, (newVal) => {
  console.log('count changed:', newVal)
})
</script>
```

#### 主要区别

| 特性 | Options API | Composition API |
|-----|------------|----------------|
| 组织方式 | 按选项类型组织（data、methods等） | 按功能逻辑组织 |
| 代码复用 | Mixins（有命名冲突问题） | 自定义Hooks（更灵活） |
| TypeScript支持 | 需要额外配置 | 原生支持更好 |
| 逻辑复用 | 困难 | 容易（提取为函数） |
| 代码组织 | 相关逻辑分散 | 相关逻辑集中 |

#### 为什么引入Composition API？

1. **更好的逻辑复用**

```javascript
// 使用Composition API提取复用逻辑
// useCounter.js
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => count.value++
  const decrement = () => count.value--
  return { count, increment, decrement }
}

// 在组件中使用
import { useCounter } from './useCounter'
const { count, increment } = useCounter(10)
```

2. **更好的TypeScript支持**

```typescript
// Composition API + TypeScript
import { ref, Ref } from 'vue'

function useCounter(): { count: Ref<number>, increment: () => void } {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}
```

3. **更好的代码组织**

```javascript
// Options API：相关逻辑分散
export default {
  data() {
    return { searchQuery: '', results: [] }
  },
  methods: {
    search() { /* ... */ }
  },
  watch: {
    searchQuery() { /* ... */ }
  }
}

// Composition API：相关逻辑集中
function useSearch() {
  const searchQuery = ref('')
  const results = ref([])
  
  const search = () => { /* ... */ }
  
  watch(searchQuery, search)
  
  return { searchQuery, results, search }
}
```

**实际应用场景：**
- 大型组件：Composition API可以按功能拆分，代码更清晰
- 逻辑复用：多个组件共享相同逻辑时，Composition API更方便
- TypeScript项目：Composition API的类型推断更好

**扩展追问（含简要解答）：**
- Composition API会完全替代Options API吗？  
  官方态度是不会强制替代：Options API 继续受支持，对简单组件和新手更友好；但在复杂业务、跨组件逻辑复用和 TypeScript 项目中，推荐优先使用 Composition API，生态也更偏向它。
- 如何在Composition API中访问this？  
  在 `setup` 中不要像 Options API 那样使用 `this`，`setup` 里的 `this` 在严格模式下是 `undefined`；如需访问实例，可通过 `getCurrentInstance()` 拿到 `proxy`，但这属于高级用法，一般建议通过 `setup` 的返回值暴露能力给模板和其他逻辑。
- setup函数和`<script setup>`的区别？  
  `setup` 是组件配置项中的一个函数，需要显式 `return` 暴露给模板；`<script setup>` 是编译期语法糖，顶层变量自动暴露给模板，不需要 `return`，并提供 `defineProps/defineEmits/defineExpose` 等编译宏，写法更简洁。

---

## ⭐ 中频题（经常被问到）

### 6. [中频] Vue 3的新特性有哪些？

**详细解答：**

#### 1. Composition API
- 更好的逻辑复用和代码组织
- 更好的TypeScript支持

#### 2. 多个根节点（Fragment）

```vue
<!-- Vue 2：只能有一个根节点 -->
<template>
  <div>
    <header></header>
    <main></main>
  </div>
</template>

<!-- Vue 3：可以有多个根节点 -->
<template>
  <header></header>
  <main></main>
</template>
```

#### 3. Teleport（传送门）

```vue
<template>
  <div>
    <button @click="show = true">打开弹窗</button>
    <!-- 将内容渲染到body下 -->
    <Teleport to="body">
      <Modal v-if="show" />
    </Teleport>
  </div>
</template>
```

#### 4. Suspense（异步组件）

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
const AsyncComponent = defineAsyncComponent(() => import('./Async.vue'))
</script>
```

#### 5. 更小的包体积
- 使用Tree-shaking，未使用的功能不会被打包
- 相比Vue 2体积减少约41%

#### 6. 更好的性能
- 响应式系统重构（Proxy）
- 编译时优化（静态提升、PatchFlag）
- 更快的虚拟DOM diff

#### 7. 更好的TypeScript支持
- 使用TypeScript重写
- 更好的类型推断

#### 8. 新的内置组件
- Fragment、Teleport、Suspense

**扩展追问（含简要解答）：**
- Teleport的使用场景是什么？  
  当一个组件在逻辑上属于当前组件树的一部分，但在 DOM 结构上需要挂载到其他位置（通常是 `body` 下）时，例如全局弹窗、模态框、抽屉、全屏遮罩、全局通知等，就适合使用 Teleport 以避免嵌套容器的 `overflow: hidden`、`z-index` 等问题。
- Suspense如何处理异步组件的错误？  
  异步组件通过 `defineAsyncComponent` 支持 `errorComponent` 和 `onError` 等配置，加载失败时可以展示错误组件或按自定义策略重试；Suspense 本身负责在“加载中”和“加载完成”之间切换 UI，错误则交由 async 组件配置或外层错误边界来处理。

---

### 7. [中频] Vue的nextTick原理是什么？

**详细解答：**

#### nextTick的作用

Vue的DOM更新是异步的，当数据变化后，DOM不会立即更新，而是等到下一个"tick"才更新：

```javascript
this.message = 'new message'
console.log(this.$el.textContent) // 还是旧值
this.$nextTick(() => {
  console.log(this.$el.textContent) // 新值
})
```

#### 实现原理

Vue内部使用微任务队列来实现nextTick：

```javascript
// Vue 3的nextTick实现（简化版）
const callbacks = []
let pending = false

function nextTick(cb) {
  callbacks.push(cb)
  if (!pending) {
    pending = true
    // 优先使用Promise（微任务）
    Promise.resolve().then(flushCallbacks)
  }
}

function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}
```

#### 为什么使用微任务？

1. **保证DOM更新顺序**：所有同步代码执行完后，再统一更新DOM
2. **性能优化**：避免频繁的DOM操作
3. **用户体验**：用户看到的是最终状态，不会看到中间状态

#### 实际应用场景

```javascript
// 场景1：获取更新后的DOM
this.count++
this.$nextTick(() => {
  const height = this.$refs.list.offsetHeight
  console.log('列表高度:', height)
})

// 场景2：在数据更新后操作DOM
this.showModal = true
this.$nextTick(() => {
  this.$refs.input.focus()
})
```

**扩展追问（含简要解答）：**
- nextTick和setTimeout的区别？  
  `nextTick` 通过微任务（优先使用 Promise）在当前响应式更新 flush 完成后、下一次浏览器渲染前执行回调，时序紧贴 DOM 更新；`setTimeout(fn, 0)` 则是宏任务，会在当前宏任务及其全部微任务之后执行，时机更靠后且受最小延迟等影响。
- 为什么Vue要异步更新DOM？  
  这样可以将同一 tick 内的多次状态修改合并为一次 DOM 更新，显著减少重排重绘开销，同时让状态更新更可预测：同步代码块中多次 `state` 变更只触发一次视图刷新，也便于在更新完成后统一触发 `updated`/`nextTick` 等钩子。

---

### 8. [中频] Vue的computed和watch的区别？

**详细解答：**

#### computed（计算属性）

```javascript
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    // 计算属性有缓存，只有依赖变化时才重新计算
    fullName() {
      return this.firstName + ' ' + this.lastName
    }
  }
}
```

**特点：**
- 有缓存，只有依赖变化时才重新计算
- 必须有返回值
- 适合：基于现有数据计算新数据

#### watch（侦听器）

```javascript
export default {
  data() {
    return {
      count: 0,
      user: { name: 'John' }
    }
  },
  watch: {
    // 简单类型
    count(newVal, oldVal) {
      console.log('count changed:', newVal, oldVal)
    },
    // 深度监听对象
    user: {
      handler(newVal, oldVal) {
        console.log('user changed')
      },
      deep: true, // 深度监听
      immediate: true // 立即执行
    },
    // 监听对象属性
    'user.name'(newVal) {
      console.log('name changed:', newVal)
    }
  }
}
```

**特点：**
- 无缓存，每次变化都执行
- 可以执行异步操作
- 适合：数据变化时执行副作用（请求、日志等）

#### 使用场景对比

| 场景 | 使用computed | 使用watch |
|-----|-------------|----------|
| 基于现有数据计算新值 | ✅ | ❌ |
| 数据变化时执行异步操作 | ❌ | ✅ |
| 需要缓存结果 | ✅ | ❌ |
| 监听对象深层变化 | ❌ | ✅ |

**扩展追问（含简要解答）：**
- computed的缓存机制是如何实现的？  
  计算属性内部是一个“惰性 effect”：首次访问时执行 getter 并收集依赖，依赖变更时仅标记为“脏”而不立刻重新计算；下一次访问 `.value` 时如果发现是脏的才重新运行 getter，否则直接返回上次缓存结果。
- watch的deep和immediate选项的作用？  
  `deep: true` 会递归遍历被监听对象的子属性，让任何深层属性变化都能触发回调（带来一定性能开销）；`immediate: true` 则会在建立监听时立即执行一次回调，常在“既要响应后续变化，又要用当前初始值跑一遍逻辑”的场景使用。

---

### 9. [中频] Vue的key的作用是什么？为什么不能用index作为key？

**详细解答：**

#### key的作用

key是Vue用来识别节点的唯一标识，帮助Vue在diff算法中更高效地更新DOM：

```vue
<template>
  <div v-for="item in list" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

#### 为什么需要key？

1. **提高diff效率**：通过key可以快速找到可复用的节点
2. **避免状态错乱**：确保组件状态和DOM正确对应

#### 为什么不能用index作为key？

**问题示例：**

```vue
<template>
  <div>
    <div v-for="(item, index) in list" :key="index">
      <input v-model="item.name" />
    </div>
    <button @click="removeFirst">删除第一项</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
        { id: 3, name: 'C' }
      ]
    }
  },
  methods: {
    removeFirst() {
      this.list.shift() // 删除第一项
    }
  }
}
</script>
```

**使用index作为key的问题：**
- 删除第一项后，原来的第二项（B）的key从1变成0
- Vue认为key=0的节点是新的，会复用原来的input元素
- 导致input的值错乱（显示的是B的值，但实际绑定的是A的数据）

**正确的做法：**

```vue
<template>
  <div v-for="item in list" :key="item.id">
    <input v-model="item.name" />
  </div>
</template>
```

使用唯一且稳定的id作为key，删除后其他项的key不变，Vue能正确识别和复用节点。

**扩展追问（含简要解答）：**
- 什么情况下可以用index作为key？  
  当列表纯展示、没有表单输入、动画、选中状态等与节点强绑定的 UI，且只在末尾追加/截断元素，不会在中间插入或删除时，可以使用 index 作为 key；即使 DOM 轻微错位复用也不会影响业务语义。
- key的变化会导致组件重新渲染吗？  
  会，key 被视为组件实例身份标识，变化时等同于卸载旧组件并挂载一个全新组件，其内部 state 和生命周期都会重新走一遍，这常用于“强制重置”子组件（例如重置表单、重新播放动画）。

---

### 10. [中频] Vue的keep-alive原理是什么？

**详细解答：**

#### keep-alive的作用

keep-alive是Vue的内置组件，用于缓存组件实例，避免重复渲染：

```vue
<template>
  <keep-alive :include="['ComponentA', 'ComponentB']" :exclude="['ComponentC']">
    <component :is="currentComponent" />
  </keep-alive>
</template>
```

#### 实现原理

keep-alive通过LRU（最近最少使用）算法缓存组件：

```javascript
// keep-alive核心逻辑（简化版）
export default {
  name: 'KeepAlive',
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },
  created() {
    this.cache = new Map() // 缓存组件实例
    this.keys = [] // 缓存的key列表
  },
  render() {
    const slot = this.$slots.default
    const vnode = getFirstComponentChild(slot)
    const componentOptions = vnode && vnode.componentOptions
    
    if (componentOptions) {
      const name = getComponentName(componentOptions)
      const { include, exclude } = this
      
      // 判断是否需要缓存
      if (
        (include && (!name || !matches(include, name))) ||
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }
      
      const { cache, keys } = this
      const key = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      
      if (cache[key]) {
        // 命中缓存，复用组件实例
        vnode.componentInstance = cache[key].componentInstance
        // 更新key位置（LRU）
        remove(keys, key)
        keys.push(key)
      } else {
        // 未命中，缓存新组件
        cache[key] = vnode
        keys.push(key)
        // 超过最大缓存数，删除最久未使用的
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
      
      vnode.data.keepAlive = true
    }
    
    return vnode || (slot && slot[0])
  }
}
```

#### 生命周期

被keep-alive包裹的组件会触发特殊的生命周期：

```javascript
export default {
  activated() {
    // 组件被激活时调用（从缓存中恢复）
    console.log('组件激活')
  },
  deactivated() {
    // 组件被停用时调用（被缓存）
    console.log('组件停用')
  }
}
```

**实际应用场景：**
- 列表页和详情页切换，保持列表滚动位置
- Tab切换，保持各个Tab的状态
- 表单填写，切换页面后回来数据还在

**扩展追问（含简要解答）：**
- keep-alive的max属性是如何工作的？  
  内部维护 `cache(Map)` 与 `keys(Array)`，当新组件被缓存时写入 `cache[key]` 并 `keys.push(key)`，若长度超过 `max`，则按 LRU 策略删除最久未使用的那个 key（通常是 `keys[0]`），对应组件实例被销毁，从而限制缓存数量和内存占用。
- 如何手动清除keep-alive的缓存？  
  推荐做法是通过响应式地调整 `include/exclude` 或改变组件的 `key`，让某些组件不再命中缓存或强制重建；在 Vue 2 中也可以通过访问 KeepAlive 实例并调用内部的清理逻辑，但这属于不稳定的内部 API，一般不建议直接依赖。

---

## 📌 低频题（偶尔问到但需要了解）

### 11. [低频] Vue的模板编译过程

**详细解答：**

Vue的模板编译分为三个阶段：

1. **解析（Parse）**：将模板字符串解析成AST（抽象语法树）
2. **优化（Optimize）**：标记静态节点，用于diff优化
3. **生成（Generate）**：将AST生成渲染函数

```javascript
// 模板
<template>
  <div id="app">{{ message }}</div>
</template>

// 1. 解析成AST
{
  type: 1,
  tag: 'div',
  attrs: [{ name: 'id', value: 'app' }],
  children: [{
    type: 2,
    expression: '_s(message)',
    text: '{{ message }}'
  }]
}

// 2. 优化：标记静态节点

// 3. 生成渲染函数
function render() {
  return _c('div', { attrs: { id: 'app' } }, [_v(_s(message))])
}
```

**扩展追问（含简要解答）：**
- Vue 3在编译时做了哪些优化？  
  编译阶段会对模板做静态分析，将完全静态的节点提升出渲染函数（静态提升），为不同类型的动态绑定打上 PatchFlag，只在必要的地方做 diff；同时构建 Block Tree，将包含动态节点的部分单独标记出来，使运行时更新可以跳过大块静态子树，从而减少创建 vnode 和比较的成本。

---

### 12. [低频] Vue的插件机制

**详细解答：**

Vue插件是一个对象，必须提供install方法：

```javascript
// 定义插件
const MyPlugin = {
  install(Vue, options) {
    // 添加全局方法或属性
    Vue.myGlobalMethod = function() {
      console.log('全局方法')
    }
    
    // 添加全局资源
    Vue.directive('my-directive', {
      bind(el, binding) {
        // ...
      }
    })
    
    // 注入组件选项
    Vue.mixin({
      created() {
        // ...
      }
    })
    
    // 添加实例方法
    Vue.prototype.$myMethod = function() {
      console.log('实例方法')
    }
  }
}

// 使用插件
Vue.use(MyPlugin, { someOption: true })
```

**扩展追问（含简要解答）：**
- Vue.use的实现原理是什么？  
  `Vue.use(plugin, options)` 内部会维护一个已安装插件列表，避免重复安装；若传入的是函数则直接调用 `plugin(Vue, options...)`，若是对象则调用其 `install(Vue, options...)` 方法，插件可以在其中注册全局指令、mixin、原型方法等，从而扩展框架能力。

---

### 13. [低频] Vue的自定义指令

**详细解答：**

```javascript
// 全局注册
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})

// 局部注册
export default {
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  }
}

// 使用
<input v-focus />
```

**指令钩子：**
- bind：只调用一次，指令第一次绑定到元素时
- inserted：被绑定元素插入父节点时调用
- update：所在组件的VNode更新时调用
- componentUpdated：所在组件的VNode及其子VNode全部更新后调用
- unbind：只调用一次，指令与元素解绑时调用

**扩展追问（含简要解答）：**
- 如何实现一个v-debounce指令？  
  核心思路是在指令的 `mounted/inserted` 钩子里创建一个带防抖逻辑的事件处理函数，挂到元素上，并在 `unmounted/unbind` 钩子中移除监听和清理定时器，例如：  
  ```javascript
  Vue.directive('debounce', {
    inserted(el, binding) {
      const delay = binding.arg ? Number(binding.arg) : 300
      const fn = binding.value
      let timer = null
      el.__debounceHandler__ = function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), delay)
      }
      el.addEventListener('click', el.__debounceHandler__)
    },
    unbind(el) {
      el.removeEventListener('click', el.__debounceHandler__)
      delete el.__debounceHandler__
    }
  })
  // <button v-debounce:500=\"handleClick\">提交</button>
  ```

---

## 📝 总结

### 高频题必掌握
1. Vue 2/3响应式原理
2. 虚拟DOM和diff算法
3. 组件通信方式
4. 生命周期
5. Composition API vs Options API

### 中频题要熟悉
6. Vue 3新特性
7. nextTick原理
8. computed和watch区别
9. key的作用
10. keep-alive原理

### 低频题需了解
11. 模板编译
12. 插件机制
13. 自定义指令

---

**建议：**
- 高频题必须能流畅回答，最好能画图说明
- 中频题要能说出核心原理和实际应用
- 低频题至少要知道基本概念，能简单说明
