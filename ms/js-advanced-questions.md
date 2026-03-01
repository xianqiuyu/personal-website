# JavaScript 高级面试题大全（按频率排序）

> 为资深前端工程师整理的JavaScript高级面试题，包含详细解答、代码示例和扩展追问

---

## 🔥 高频题（面试官几乎必问）

### 1. [高频] 闭包是什么？有什么应用场景？如何避免内存泄漏？

**详细解答：**

#### 闭包的定义

闭包是指**函数能够访问其外部作用域中的变量**，即使外部函数已经执行完毕。

```javascript
function outerFunction() {
  const outerVariable = 'I am outside!'
  
  function innerFunction() {
    console.log(outerVariable) // 访问外部变量
  }
  
  return innerFunction
}

const inner = outerFunction()
inner() // "I am outside!"
// outerFunction已经执行完毕，但inner仍然可以访问outerVariable
```

#### 闭包的形成条件

1. **函数嵌套**：内部函数定义在外部函数内部
2. **内部函数引用外部变量**：内部函数使用了外部函数的变量
3. **内部函数被返回或传递**：内部函数在外部函数执行后仍然存在

#### 闭包的应用场景

##### 1. 封装私有变量

```javascript
function createCounter() {
  let count = 0 // 私有变量
  
  return {
    increment: function() {
      count++
      return count
    },
    decrement: function() {
      count--
      return count
    },
    getCount: function() {
      return count
    }
  }
}

const counter = createCounter()
console.log(counter.increment()) // 1
console.log(counter.increment()) // 2
console.log(counter.getCount()) // 2
// count无法直接访问，实现了私有化
```

##### 2. 函数工厂

```javascript
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier
  }
}

const double = createMultiplier(2)
const triple = createMultiplier(3)

console.log(double(5)) // 10
console.log(triple(5)) // 15
```

##### 3. 防抖和节流

```javascript
// 防抖：延迟执行
function debounce(func, wait) {
  let timeout // 闭包保存timeout
  
  return function(...args) {
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}

// 节流：限制执行频率
function throttle(func, wait) {
  let lastTime = 0 // 闭包保存lastTime
  
  return function(...args) {
    const context = this
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func.apply(context, args)
    }
  }
}

// 使用
const handleResize = debounce(() => {
  console.log('resized')
}, 300)

window.addEventListener('resize', handleResize)
```

##### 4. 模块模式

```javascript
const MyModule = (function() {
  let privateVariable = 0 // 私有变量
  
  function privateFunction() {
    console.log('private')
  }
  
  return {
    publicMethod: function() {
      privateVariable++
      privateFunction()
      return privateVariable
    },
    getPrivate: function() {
      return privateVariable
    }
  }
})()

MyModule.publicMethod() // 1
MyModule.getPrivate() // 1
// privateVariable和privateFunction无法直接访问
```

##### 5. 循环中的闭包问题

```javascript
// ❌ 问题：所有定时器都输出5
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i) // 5, 5, 5, 5, 5
  }, 1000)
}

// ✅ 解决1：使用IIFE创建闭包
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j) // 0, 1, 2, 3, 4
    }, 1000)
  })(i)
}

// ✅ 解决2：使用let（块级作用域）
for (let i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i) // 0, 1, 2, 3, 4
  }, 1000)
}

// ✅ 解决3：使用bind
for (var i = 0; i < 5; i++) {
  setTimeout(function(j) {
    console.log(j) // 0, 1, 2, 3, 4
  }.bind(null, i), 1000)
}
```

#### 闭包的内存泄漏问题

```javascript
// ❌ 可能导致内存泄漏
function attachHandler() {
  const largeData = new Array(1000000).fill('data')
  const button = document.getElementById('button')
  
  button.onclick = function() {
    // 闭包引用了largeData，即使不需要
    console.log('clicked')
  }
}

// ✅ 避免内存泄漏：不引用不需要的变量
function attachHandler() {
  const button = document.getElementById('button')
  
  button.onclick = function() {
    console.log('clicked')
    // 不引用largeData
  }
}

// ✅ 或者显式清除引用
function attachHandler() {
  const largeData = new Array(1000000).fill('data')
  const button = document.getElementById('button')
  
  button.onclick = function() {
    console.log('clicked')
  }
  
  // 使用完后清除
  largeData = null
}
```

**扩展追问（含简要解答）：**

**Q: 闭包是如何在内存中存储的？**
> 1. **作用域链保存**：闭包函数创建时，会捕获外部作用域的变量引用，形成 `[[Scope]]` 内部属性
> 2. **堆内存存储**：被引用的外部变量存储在堆内存中，不会随外部函数执行完毕而销毁
> 3. **词法环境**：每个函数都有一个词法环境（Lexical Environment），闭包会保持对外部词法环境的引用
> 4. **生命周期**：只要闭包函数还被引用，其捕获的变量就不会被垃圾回收

**Q: 如何识别和避免闭包导致的内存泄漏？**
> **识别方法**：
> - Chrome DevTools → Memory → Heap Snapshot
> - 查找 Detached DOM 节点和未释放的闭包引用
> - Timeline 观察内存是否持续增长
>
> **避免方法**：
> 1. 及时解除引用：`handler = null`
> 2. 不捕获不需要的大对象
> 3. 组件卸载时清理事件监听、定时器
> 4. 使用 WeakMap/WeakSet 存储对象引用（可被GC回收）

**Q: 闭包和普通函数调用的性能差异？**
> 1. **内存占用**：闭包会保持外部变量引用，内存占用更高
> 2. **创建开销**：每次创建闭包都会生成新的作用域链，略有开销
> 3. **访问速度**：访问闭包变量需要沿作用域链查找，比访问局部变量稍慢
> 4. **实际影响**：现代 JS 引擎优化良好，差异通常可忽略
> 5. **建议**：不必为性能而避免闭包，但要注意内存管理

---

### 2. [高频] 解释JavaScript的事件循环（Event Loop）机制

**详细解答：**

#### 事件循环的基本概念

JavaScript是**单线程**的，通过事件循环机制实现异步操作。

#### 执行栈和任务队列

```javascript
// 执行栈（Call Stack）
// 同步代码按顺序执行

// 任务队列
// - 宏任务队列（Macrotask Queue）
// - 微任务队列（Microtask Queue）
```

#### 事件循环的执行流程

```javascript
// 1. 执行同步代码
console.log('1')

// 2. 遇到异步操作，放入任务队列
setTimeout(() => {
  console.log('2') // 宏任务
}, 0)

Promise.resolve().then(() => {
  console.log('3') // 微任务
})

console.log('4')

// 输出顺序：1, 4, 3, 2
```

#### 宏任务和微任务

**宏任务（Macrotask）：**
- setTimeout
- setInterval
- setImmediate（Node.js）
- I/O操作
- UI渲染

**微任务（Microtask）：**
- Promise.then/catch/finally
- queueMicrotask
- MutationObserver
- process.nextTick（Node.js，优先级最高）

#### 执行顺序

```javascript
console.log('1') // 同步

setTimeout(() => {
  console.log('2') // 宏任务
}, 0)

Promise.resolve().then(() => {
  console.log('3') // 微任务
})

Promise.resolve().then(() => {
  console.log('4') // 微任务
})

setTimeout(() => {
  console.log('5') // 宏任务
}, 0)

console.log('6') // 同步

// 输出：1, 6, 3, 4, 2, 5
// 执行顺序：同步代码 -> 微任务 -> 宏任务
```

#### 详细执行流程

```javascript
// 一轮事件循环
function eventLoop() {
  // 1. 执行所有同步代码
  // 2. 执行所有微任务（直到微任务队列为空）
  // 3. 执行一个宏任务
  // 4. 再次执行所有微任务
  // 5. 重复步骤3-4
}

// 示例
console.log('start')

setTimeout(() => {
  console.log('timeout1')
  Promise.resolve().then(() => {
    console.log('promise1')
  })
}, 0)

Promise.resolve().then(() => {
  console.log('promise2')
  setTimeout(() => {
    console.log('timeout2')
  }, 0)
})

console.log('end')

// 输出：start, end, promise2, timeout1, promise1, timeout2
```

#### async/await的执行

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')
async1()
console.log('script end')

// 输出：script start, async1 start, async2, script end, async1 end
// await后面的代码相当于Promise.then，是微任务
```

**扩展追问（含简要解答）：**

**Q: Node.js的事件循环和浏览器有什么区别？**
> | 对比项 | 浏览器 | Node.js |
> |-------|--------|---------|
> | 阶段划分 | 宏任务 → 微任务 | 6个阶段：timers → pending → idle → poll → check → close |
> | 微任务时机 | 每个宏任务后清空 | 每个阶段切换时清空 |
> | `process.nextTick` | 无 | 优先级最高的微任务 |
> | `setImmediate` | 无 | check 阶段执行 |
> | I/O 处理 | 较简单 | poll 阶段专门处理 |

**Q: 如何理解async/await在事件循环中的执行？**
> 1. **async 函数**：返回一个 Promise
> 2. **await 之前**：同步执行
> 3. **await 表达式**：暂停函数执行，让出线程
> 4. **await 之后**：相当于 `.then()` 回调，作为微任务执行
> ```javascript
> async function foo() {
>   console.log(1)      // 同步
>   await bar()         // 暂停，bar() 同步执行
>   console.log(2)      // 微任务
> }
> // 等价于：foo().then(() => console.log(2))
> ```

**Q: 如何避免事件循环阻塞？**
> 1. **拆分长任务**：使用 `setTimeout(fn, 0)` 或 `requestIdleCallback`
> 2. **Web Worker**：将 CPU 密集型任务移到 Worker 线程
> 3. **时间分片**：将大循环拆成多个小批次
>    ```javascript
>    function processChunk(items, index = 0) {
>      const chunk = items.slice(index, index + 100)
>      chunk.forEach(process)
>      if (index + 100 < items.length) {
>        setTimeout(() => processChunk(items, index + 100), 0)
>      }
>    }
>    ```
> 4. **避免同步 I/O**：使用异步 API
> 5. **React 18 并发特性**：`useTransition` 标记非紧急更新

---

### 3. [高频] Promise的原理和实现？async/await的原理？

**详细解答：**

#### Promise的基本原理

Promise是一个状态机，有三种状态：
- **pending**：初始状态
- **fulfilled**：成功状态
- **rejected**：失败状态

状态只能从pending转换到fulfilled或rejected，且不可逆。

#### 手写Promise

```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    
    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    }
    
    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.state === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    })
    
    return promise2
  }
  
  catch(onRejected) {
    return this.then(null, onRejected)
  }
  
  static resolve(value) {
    if (value instanceof MyPromise) {
      return value
    }
    return new MyPromise(resolve => resolve(value))
  }
  
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }
  
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = []
      let count = 0
      
      if (promises.length === 0) {
        resolve(results)
        return
      }
      
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          value => {
            results[index] = value
            count++
            if (count === promises.length) {
              resolve(results)
            }
          },
          reason => {
            reject(reason)
          }
        )
      })
    })
  }
  
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        MyPromise.resolve(promise).then(resolve, reject)
      })
    })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected'))
  }
  
  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
```

#### async/await的原理

async/await是Promise的语法糖，基于Generator实现：

```javascript
// async/await
async function fetchData() {
  const data = await fetch('/api/data')
  return data.json()
}

// 等价于
function fetchData() {
  return fetch('/api/data')
    .then(data => data.json())
}

// Generator实现（简化版）
function* fetchDataGenerator() {
  const data = yield fetch('/api/data')
  return data.json()
}

function asyncToGenerator(generatorFunc) {
  return function(...args) {
    const gen = generatorFunc.apply(this, args)
    
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let result
        try {
          result = gen[key](arg)
        } catch (error) {
          return reject(error)
        }
        
        const { value, done } = result
        if (done) {
          return resolve(value)
        }
        
        return Promise.resolve(value).then(
          val => step('next', val),
          err => step('throw', err)
        )
      }
      
      step('next')
    })
  }
}
```

**扩展追问（含简要解答）：**

**Q: Promise.all和Promise.allSettled的区别？**
> | 方法 | 行为 | 返回值 | 适用场景 |
> |-----|------|--------|---------|
> | `Promise.all` | 任一失败立即 reject | 成功数组 / 第一个错误 | 所有请求都必须成功 |
> | `Promise.allSettled` | 等待全部完成 | `[{status, value/reason}]` | 需要知道每个结果 |
> | `Promise.race` | 第一个完成（成功或失败） | 第一个结果 | 超时控制 |
> | `Promise.any` | 第一个成功 | 第一个成功值 / AggregateError | 取最快成功的 |

**Q: 如何实现Promise的链式调用？**
> 核心：`.then()` 返回一个新的 Promise
> ```javascript
> then(onFulfilled, onRejected) {
>   return new Promise((resolve, reject) => {
>     // 1. 执行回调
>     const result = onFulfilled(this.value)
>     // 2. 如果返回的是 Promise，等待它完成
>     if (result instanceof Promise) {
>       result.then(resolve, reject)
>     } else {
>       // 3. 否则直接 resolve
>       resolve(result)
>     }
>   })
> }
> ```
> 关键点：每个 `.then()` 返回新 Promise，形成链条

**Q: async/await的错误处理？**
> 1. **try/catch**（推荐）：
>    ```javascript
>    async function fetchData() {
>      try {
>        const data = await fetch(url)
>        return data.json()
>      } catch (error) {
>        console.error('请求失败:', error)
>      }
>    }
>    ```
> 2. **await 后 .catch()**：
>    ```javascript
>    const data = await fetch(url).catch(err => null)
>    ```
> 3. **统一错误处理**：
>    ```javascript
>    async function wrapper(promise) {
>      try {
>        return [await promise, null]
>      } catch (err) {
>        return [null, err]
>      }
>    }
>    const [data, error] = await wrapper(fetch(url))
>    ```

---

### 4. [高频] this的指向问题？如何改变this指向？

**详细解答：**

#### this的绑定规则

##### 1. 默认绑定（函数调用）

```javascript
function foo() {
  console.log(this) // window（严格模式下是undefined）
}
foo()
```

##### 2. 隐式绑定（方法调用）

```javascript
const obj = {
  name: 'obj',
  foo: function() {
    console.log(this.name) // 'obj'
  }
}
obj.foo()
```

##### 3. 显式绑定（call/apply/bind）

```javascript
function foo() {
  console.log(this.name)
}

const obj1 = { name: 'obj1' }
const obj2 = { name: 'obj2' }

foo.call(obj1) // 'obj1'
foo.apply(obj2) // 'obj2'

const boundFoo = foo.bind(obj1)
boundFoo() // 'obj1'
```

##### 4. new绑定（构造函数）

```javascript
function Person(name) {
  this.name = name
}

const person = new Person('John')
console.log(person.name) // 'John'
// this指向新创建的对象
```

#### this的优先级

**new绑定 > 显式绑定 > 隐式绑定 > 默认绑定**

```javascript
function foo() {
  console.log(this.name)
}

const obj = { name: 'obj' }

// 显式绑定
const boundFoo = foo.bind(obj)
boundFoo() // 'obj'

// new绑定优先级更高
const instance = new boundFoo() // undefined（新对象）
```

#### 箭头函数的this

箭头函数没有自己的this，继承外层作用域的this：

```javascript
const obj = {
  name: 'obj',
  foo: function() {
    console.log(this.name) // 'obj'
    
    const bar = () => {
      console.log(this.name) // 'obj'（继承foo的this）
    }
    bar()
    
    const baz = function() {
      console.log(this.name) // undefined（默认绑定）
    }
    baz()
  }
}
obj.foo()
```

#### 改变this指向的方法

##### 1. call

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`)
}

const person = { name: 'John' }
greet.call(person, 'Hello', '!') // "Hello, John!"
```

##### 2. apply

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`)
}

const person = { name: 'John' }
greet.apply(person, ['Hello', '!']) // "Hello, John!"
```

##### 3. bind

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`)
}

const person = { name: 'John' }
const boundGreet = greet.bind(person)
boundGreet('Hello', '!') // "Hello, John!"
```

#### 手写call/apply/bind

```javascript
// 手写call
Function.prototype.myCall = function(context, ...args) {
  context = context || window
  const fnSymbol = Symbol('fn')
  context[fnSymbol] = this
  const result = context[fnSymbol](...args)
  delete context[fnSymbol]
  return result
}

// 手写apply
Function.prototype.myApply = function(context, args) {
  context = context || window
  const fnSymbol = Symbol('fn')
  context[fnSymbol] = this
  const result = context[fnSymbol](...args)
  delete context[fnSymbol]
  return result
}

// 手写bind
Function.prototype.myBind = function(context, ...args1) {
  const fn = this
  return function(...args2) {
    return fn.apply(context, [...args1, ...args2])
  }
}
```

**扩展追问（含简要解答）：**

**Q: 箭头函数为什么不能改变this？**
> 1. **没有自己的 this**：箭头函数不绑定 this，继承定义时外层作用域的 this
> 2. **词法作用域**：this 在定义时就确定，而非调用时
> 3. **call/apply/bind 无效**：因为箭头函数没有 `[[ThisValue]]` 内部槽
> 4. **不能作为构造函数**：没有 `[[Construct]]` 方法，不能 new
> ```javascript
> const obj = {
>   name: 'obj',
>   arrow: () => console.log(this.name), // undefined（继承全局）
>   normal() { console.log(this.name) }  // 'obj'
> }
> ```

**Q: bind和call/apply的区别？**
> | 方法 | 执行时机 | 参数形式 | 返回值 |
> |-----|---------|---------|--------|
> | `call` | 立即执行 | 逐个传参 `fn.call(ctx, a, b)` | 函数返回值 |
> | `apply` | 立即执行 | 数组传参 `fn.apply(ctx, [a, b])` | 函数返回值 |
> | `bind` | 返回新函数 | 逐个传参，支持柯里化 | 绑定后的新函数 |
>
> **使用场景**：
> - `call/apply`：借用方法、立即调用
> - `bind`：事件回调、延迟调用

**Q: 如何理解this的绑定规则？**
> **优先级从高到低**：
> 1. **new 绑定**：`new Foo()` → this 指向新对象
> 2. **显式绑定**：`call/apply/bind` → this 指向指定对象
> 3. **隐式绑定**：`obj.foo()` → this 指向 obj
> 4. **默认绑定**：`foo()` → this 指向 window（严格模式 undefined）
>
> **特殊情况**：
> - 箭头函数：继承外层 this
> - DOM 事件：this 指向触发元素
> - setTimeout 回调：默认指向 window

---

### 5. [高频] 原型链和继承？ES6的class继承原理？

**详细解答：**

#### 原型链

每个对象都有一个`__proto__`属性，指向其构造函数的`prototype`：

```javascript
function Person(name) {
  this.name = name
}

Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`)
}

const person = new Person('John')
console.log(person.__proto__ === Person.prototype) // true
console.log(Person.prototype.__proto__ === Object.prototype) // true
console.log(Object.prototype.__proto__ === null) // true
```

#### 原型链查找

```javascript
person.sayHello() // 查找顺序：
// 1. person自身是否有sayHello？没有
// 2. person.__proto__（Person.prototype）是否有sayHello？有，执行
// 3. 如果还没有，继续向上查找Object.prototype
// 4. 如果还没有，返回undefined
```

#### 继承方式

##### 1. 原型链继承

```javascript
function Parent() {
  this.name = 'parent'
}

Parent.prototype.sayHello = function() {
  console.log('Hello from parent')
}

function Child() {
  this.age = 10
}

Child.prototype = new Parent() // 继承

const child = new Child()
child.sayHello() // "Hello from parent"

// 问题：
// 1. 引用类型属性被所有实例共享
// 2. 无法向父构造函数传参
```

##### 2. 构造函数继承

```javascript
function Parent(name) {
  this.name = name
}

function Child(name, age) {
  Parent.call(this, name) // 继承
  this.age = age
}

const child = new Child('John', 10)

// 问题：
// 1. 无法继承父类原型上的方法
```

##### 3. 组合继承（最常用）

```javascript
function Parent(name) {
  this.name = name
}

Parent.prototype.sayHello = function() {
  console.log('Hello from parent')
}

function Child(name, age) {
  Parent.call(this, name) // 继承属性
  this.age = age
}

Child.prototype = new Parent() // 继承方法
Child.prototype.constructor = Child // 修正constructor

const child = new Child('John', 10)
child.sayHello() // "Hello from parent"

// 问题：
// 1. 调用了两次父构造函数
```

##### 4. 寄生组合继承（最佳）

```javascript
function Parent(name) {
  this.name = name
}

Parent.prototype.sayHello = function() {
  console.log('Hello from parent')
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

// 使用Object.create避免调用父构造函数
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

const child = new Child('John', 10)
child.sayHello() // "Hello from parent"
```

##### 5. ES6 Class继承

```javascript
class Parent {
  constructor(name) {
    this.name = name
  }
  
  sayHello() {
    console.log('Hello from parent')
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name) // 调用父类构造函数
    this.age = age
  }
  
  sayHello() {
    super.sayHello() // 调用父类方法
    console.log('Hello from child')
  }
}

const child = new Child('John', 10)
child.sayHello()
// "Hello from parent"
// "Hello from child"
```

#### ES6 Class继承原理

ES6的class本质上是语法糖，底层还是基于原型链：

```javascript
// ES6 Class
class Parent {
  constructor(name) {
    this.name = name
  }
}

// 等价于
function Parent(name) {
  this.name = name
}

// extends的实现（简化版）
function _inherits(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype)
  subClass.prototype.constructor = subClass
  subClass.__proto__ = superClass
}

// super的实现（简化版）
function _super(subClass, instance) {
  return Object.getPrototypeOf(subClass.prototype).constructor.call(instance)
}
```

**扩展追问（含简要解答）：**

**Q: 原型链的查找机制？**
> 1. **查找顺序**：对象自身 → `__proto__` → 原型的 `__proto__` → ... → `Object.prototype` → `null`
> 2. **属性遮蔽**：自身属性会遮蔽原型链上的同名属性
> 3. **hasOwnProperty**：只检查自身属性，不查原型链
> 4. **in 操作符**：检查自身 + 原型链
> ```javascript
> const obj = { a: 1 }
> obj.hasOwnProperty('a')      // true
> obj.hasOwnProperty('toString') // false
> 'toString' in obj             // true（来自 Object.prototype）
> ```

**Q: 如何实现多重继承？**
> JavaScript 不支持多重继承，但可以通过以下方式模拟：
> 1. **Mixin 模式**：
>    ```javascript
>    const canFly = { fly() { console.log('flying') } }
>    const canSwim = { swim() { console.log('swimming') } }
>    
>    class Duck {}
>    Object.assign(Duck.prototype, canFly, canSwim)
>    ```
> 2. **组合继承**：将多个类的方法复制到目标类
> 3. **装饰器模式**：用函数包装增强类
> 4. **注意**：Mixin 会有方法冲突和 this 绑定问题

**Q: ES6 Class和ES5继承的区别？**
> | 对比项 | ES5 | ES6 Class |
> |-------|-----|-----------|
> | 语法 | 函数 + prototype | class + extends |
> | 调用方式 | 可以普通调用 | 必须 new 调用 |
> | 继承机制 | 先创建子类实例，再调用父构造函数 | 先创建父类实例（super），再修改 this |
> | 静态方法继承 | 需手动 `Child.__proto__ = Parent` | 自动继承 |
> | 内置类型继承 | 不能正确继承 Array 等 | 可以继承 |
> | 变量提升 | 函数声明会提升 | class 不会提升 |

---

## ⭐ 中频题（经常被问到）

### 6. [中频] 手写常见工具函数（防抖、节流、深拷贝等）

**详细解答：**

#### 防抖（Debounce）

```javascript
function debounce(func, wait, immediate) {
  let timeout
  
  return function(...args) {
    const context = this
    const later = () => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func.apply(context, args)
  }
}

// 使用
const handleResize = debounce(() => {
  console.log('resized')
}, 300)

window.addEventListener('resize', handleResize)
```

#### 节流（Throttle）

```javascript
// 时间戳版本
function throttle(func, wait) {
  let lastTime = 0
  
  return function(...args) {
    const context = this
    const now = Date.now()
    
    if (now - lastTime >= wait) {
      lastTime = now
      func.apply(context, args)
    }
  }
}

// 定时器版本
function throttle(func, wait) {
  let timeout
  
  return function(...args) {
    const context = this
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}

// 结合版本（第一次和最后一次都执行）
function throttle(func, wait) {
  let timeout, lastTime = 0
  
  return function(...args) {
    const context = this
    const now = Date.now()
    const remaining = wait - (now - lastTime)
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      lastTime = now
      func.apply(context, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now()
        timeout = null
        func.apply(context, args)
      }, remaining)
    }
  }
}
```

#### 深拷贝

```javascript
// 基础版本（不考虑循环引用、函数、Date等）
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  
  if (typeof obj === 'object') {
    const cloned = {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
}

// 完整版本（处理循环引用）
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  // 处理循环引用
  if (map.has(obj)) {
    return map.get(obj)
  }
  
  let cloned
  
  if (obj instanceof Date) {
    cloned = new Date(obj.getTime())
  } else if (obj instanceof RegExp) {
    cloned = new RegExp(obj)
  } else if (obj instanceof Array) {
    cloned = []
    map.set(obj, cloned)
    obj.forEach((item, index) => {
      cloned[index] = deepClone(item, map)
    })
  } else if (typeof obj === 'object') {
    cloned = {}
    map.set(obj, cloned)
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key], map)
      }
    }
  }
  
  return cloned
}
```

#### 数组扁平化

```javascript
// 递归版本
function flatten(arr) {
  return arr.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}

// 迭代版本
function flatten(arr) {
  const stack = [...arr]
  const result = []
  
  while (stack.length) {
    const item = stack.pop()
    if (Array.isArray(item)) {
      stack.push(...item)
    } else {
      result.push(item)
    }
  }
  
  return result.reverse()
}

// 使用flat（ES2019）
arr.flat(Infinity)
```

#### 函数柯里化

```javascript
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args)
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}

// 使用
function add(a, b, c) {
  return a + b + c
}

const curriedAdd = curry(add)
curriedAdd(1)(2)(3) // 6
curriedAdd(1, 2)(3) // 6
curriedAdd(1)(2, 3) // 6
```

**扩展追问（含简要解答）：**

**Q: 防抖和节流的区别和使用场景？**
> | 对比项 | 防抖（Debounce） | 节流（Throttle） |
> |-------|-----------------|-----------------|
> | 原理 | 延迟执行，重复触发会重置计时 | 固定间隔执行，忽略中间触发 |
> | 执行次数 | 只执行最后一次 | 按频率执行多次 |
> | 场景 | 搜索框输入、窗口 resize 后处理 | 滚动事件、鼠标移动、按钮防重复点击 |
> | 比喻 | 电梯关门（有人进来就重新等） | 地铁发车（固定间隔发一班） |
>
> ```javascript
> // 搜索框：用户停止输入 300ms 后才搜索
> input.addEventListener('input', debounce(search, 300))
> // 滚动：每 100ms 检测一次位置
> window.addEventListener('scroll', throttle(checkPosition, 100))
> ```

**Q: 深拷贝如何处理函数、Date、RegExp等特殊对象？**
> ```javascript
> function deepClone(obj, map = new WeakMap()) {
>   if (obj === null || typeof obj !== 'object') return obj
>   if (map.has(obj)) return map.get(obj) // 循环引用
>   
>   // 特殊对象处理
>   if (obj instanceof Date) return new Date(obj.getTime())
>   if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)
>   if (obj instanceof Map) {
>     const clone = new Map()
>     map.set(obj, clone)
>     obj.forEach((v, k) => clone.set(deepClone(k, map), deepClone(v, map)))
>     return clone
>   }
>   if (obj instanceof Set) {
>     const clone = new Set()
>     map.set(obj, clone)
>     obj.forEach(v => clone.add(deepClone(v, map)))
>     return clone
>   }
>   // 函数：通常直接引用（或用 new Function）
>   if (typeof obj === 'function') return obj
>   
>   // 普通对象/数组
>   const clone = Array.isArray(obj) ? [] : {}
>   map.set(obj, clone)
>   for (const key of Reflect.ownKeys(obj)) {
>     clone[key] = deepClone(obj[key], map)
>   }
>   return clone
> }
> ```

**Q: 如何实现一个通用的工具函数库？**
> 1. **模块化设计**：按功能分模块（array、object、string、function）
> 2. **TypeScript 类型**：提供完整的类型定义
> 3. **Tree-shaking 友好**：使用 ESM 导出
> 4. **单元测试**：每个函数都有测试用例
> 5. **文档**：JSDoc 注释 + 使用示例
> 6. **参考**：lodash-es、radash 的设计

---

### 7. [中频] 作用域和作用域链

**详细解答：**

#### 作用域类型

##### 1. 全局作用域

```javascript
var globalVar = 'global'

function foo() {
  console.log(globalVar) // 可以访问
}
```

##### 2. 函数作用域

```javascript
function foo() {
  var functionVar = 'function'
  console.log(functionVar) // 可以访问
}
console.log(functionVar) // 错误：无法访问
```

##### 3. 块级作用域（ES6）

```javascript
if (true) {
  let blockVar = 'block'
  const blockConst = 'block'
  console.log(blockVar) // 可以访问
}
console.log(blockVar) // 错误：无法访问
```

#### 作用域链

```javascript
var a = 1

function outer() {
  var b = 2
  
  function inner() {
    var c = 3
    console.log(a, b, c) // 1, 2, 3
    // 查找顺序：inner -> outer -> global
  }
  
  inner()
}

outer()
```

#### var、let、const的区别

| 特性 | var | let | const |
|-----|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | ✅ | ❌（TDZ） | ❌（TDZ） |
| 重复声明 | ✅ | ❌ | ❌ |
| 初始值 | 可选 | 可选 | 必须 |
| 可修改 | ✅ | ✅ | ❌（对象属性可修改） |

#### 变量提升（Hoisting）

```javascript
// var的变量提升
console.log(a) // undefined
var a = 1

// 等价于
var a
console.log(a) // undefined
a = 1

// let/const的暂时性死区（TDZ）
console.log(b) // 错误：Cannot access 'b' before initialization
let b = 2
```

**扩展追问（含简要解答）：**

**Q: 作用域链的查找机制？**
> 1. **词法作用域**：作用域在代码书写时就确定，与调用位置无关
> 2. **查找顺序**：当前作用域 → 父作用域 → ... → 全局作用域
> 3. **查找终止**：找到变量立即停止，找不到则报 ReferenceError
> 4. **遮蔽效应**：内层同名变量会遮蔽外层变量
> ```javascript
> const a = 1
> function outer() {
>   const b = 2
>   function inner() {
>     const c = 3
>     console.log(a, b, c) // 沿作用域链查找
>   }
> }
> ```

**Q: 如何理解闭包和作用域的关系？**
> 1. **闭包 = 函数 + 词法作用域**：闭包是函数和其词法环境的组合
> 2. **作用域链的延续**：闭包保持对外部作用域的引用，使变量不被销毁
> 3. **本质**：闭包让函数能够"记住"定义时的作用域
> ```javascript
> function createCounter() {
>   let count = 0 // 在 createCounter 的作用域中
>   return function() {
>     return ++count // 闭包保持对 count 的引用
>   }
> }
> const counter = createCounter()
> counter() // 1 - count 没有被销毁
> counter() // 2
> ```

**Q: var、let、const的实际应用场景？**
> | 场景 | 推荐 | 原因 |
> |-----|-----|------|
> | 常量 | `const` | 不可重新赋值，意图清晰 |
> | 循环计数器 | `let` | 每次迭代创建新的绑定 |
> | 需要重新赋值的变量 | `let` | 块级作用域，更安全 |
> | 对象/数组（修改属性） | `const` | 引用不变，属性可变 |
> | 全局变量 | 避免使用 | 污染全局作用域 |
>
> **现代最佳实践**：默认用 `const`，需要重新赋值时用 `let`，避免 `var`

---

### 8. [中频] 数组方法（map、filter、reduce等）的实现原理

**详细解答：**

#### 手写map

```javascript
Array.prototype.myMap = function(callback, thisArg) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result[i] = callback.call(thisArg, this[i], i, this)
    }
  }
  return result
}

// 使用
const arr = [1, 2, 3]
const doubled = arr.myMap(x => x * 2)
console.log(doubled) // [2, 4, 6]
```

#### 手写filter

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      result.push(this[i])
    }
  }
  return result
}

// 使用
const arr = [1, 2, 3, 4, 5]
const evens = arr.myFilter(x => x % 2 === 0)
console.log(evens) // [2, 4]
```

#### 手写reduce

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : this[0]
  let startIndex = initialValue !== undefined ? 0 : 1
  
  for (let i = startIndex; i < this.length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this)
    }
  }
  
  return accumulator
}

// 使用
const arr = [1, 2, 3, 4]
const sum = arr.myReduce((acc, curr) => acc + curr, 0)
console.log(sum) // 10
```

#### 手写flat

```javascript
Array.prototype.myFlat = function(depth = 1) {
  const result = []
  
  const flatten = (arr, currentDepth) => {
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i]) && currentDepth > 0) {
        flatten(arr[i], currentDepth - 1)
      } else {
        result.push(arr[i])
      }
    }
  }
  
  flatten(this, depth)
  return result
}

// 使用
const arr = [1, [2, [3, [4]]]]
console.log(arr.myFlat(2)) // [1, 2, 3, [4]]
```

**扩展追问（含简要解答）：**

**Q: map、filter、reduce的性能对比？**
> | 方法 | 时间复杂度 | 返回值 | 特点 |
> |-----|-----------|--------|------|
> | `map` | O(n) | 新数组（等长） | 每个元素都会处理 |
> | `filter` | O(n) | 新数组（≤原长） | 只保留符合条件的 |
> | `reduce` | O(n) | 任意值 | 最灵活，可实现 map/filter |
> | `forEach` | O(n) | undefined | 无返回值，不能链式 |
>
> **性能建议**：
> - 链式调用 `arr.map().filter()` 会遍历两次，可用 `reduce` 合并
> - 大数据量考虑用 for 循环或 `for...of`

**Q: 如何实现数组去重？**
> ```javascript
> // 1. Set（最简洁，推荐）
> const unique = [...new Set(arr)]
>
> // 2. filter + indexOf
> const unique = arr.filter((item, index) => arr.indexOf(item) === index)
>
> // 3. reduce
> const unique = arr.reduce((acc, cur) => 
>   acc.includes(cur) ? acc : [...acc, cur], [])
>
> // 4. 对象去重（适合对象数组）
> const uniqueById = arr.filter((item, index, self) =>
>   index === self.findIndex(t => t.id === item.id))
>
> // 5. Map（保持顺序，适合对象）
> const map = new Map(arr.map(item => [item.id, item]))
> const unique = [...map.values()]
> ```

**Q: 数组方法的时间复杂度？**
> | 方法 | 时间复杂度 | 说明 |
> |-----|-----------|------|
> | `push/pop` | O(1) | 尾部操作 |
> | `shift/unshift` | O(n) | 头部操作，需要移动元素 |
> | `splice` | O(n) | 中间插入/删除 |
> | `indexOf/includes` | O(n) | 线性查找 |
> | `find/findIndex` | O(n) | 线性查找 |
> | `map/filter/reduce` | O(n) | 遍历一次 |
> | `sort` | O(n log n) | 通常是快排或 TimSort |
> | `slice` | O(n) | 复制部分数组 |

---

## 📌 低频题（偶尔问到但需要了解）

### 9. [低频] 设计模式在前端的应用

**详细解答：**

#### 单例模式

```javascript
class Singleton {
  static instance = null
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new Singleton()
    }
    return this.instance
  }
}

const instance1 = Singleton.getInstance()
const instance2 = Singleton.getInstance()
console.log(instance1 === instance2) // true
```

#### 观察者模式

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
  
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args))
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
}
```

#### 工厂模式

```javascript
class ButtonFactory {
  static createButton(type) {
    switch (type) {
      case 'primary':
        return new PrimaryButton()
      case 'secondary':
        return new SecondaryButton()
      default:
        return new DefaultButton()
    }
  }
}
```

**扩展追问（含简要解答）：**

**Q: 前端开发中常用的设计模式有哪些？**
> 1. **单例模式**：全局状态管理（Vuex Store、Redux Store）、API 实例
> 2. **观察者模式**：Vue 响应式、EventEmitter、Redux subscribe
> 3. **发布订阅模式**：EventBus、Node.js events、DOM 事件
> 4. **工厂模式**：React.createElement、组件动态创建
> 5. **策略模式**：表单验证规则、不同支付方式处理
> 6. **装饰器模式**：React HOC、类装饰器 @decorator
> 7. **代理模式**：Vue 3 Proxy、axios 拦截器
> 8. **适配器模式**：统一不同 API 的数据格式
> 9. **组合模式**：React 组件树、Vue 组件嵌套

**Q: 如何在前端项目中应用设计模式？**
> 1. **单例模式 - API 服务**：
>    ```javascript
>    export const api = new ApiService() // 模块导出即单例
>    ```
> 2. **观察者模式 - 状态订阅**：
>    ```javascript
>    store.subscribe((state) => console.log(state))
>    ```
> 3. **策略模式 - 表单验证**：
>    ```javascript
>    const validators = {
>      required: (v) => !!v || '必填',
>      email: (v) => /^.+@.+$/.test(v) || '邮箱格式错误'
>    }
>    const validate = (rules, value) => rules.map(r => validators[r](value))
>    ```
> 4. **装饰器模式 - 权限控制**：
>    ```javascript
>    const withAuth = (Component) => (props) => {
>      if (!isLogin) return <Redirect to="/login" />
>      return <Component {...props} />
>    }
>    ```
> 5. **原则**：不要为了用模式而用，解决实际问题时自然会用到

---

## 📝 总结

### 高频题必掌握
1. 闭包
2. 事件循环
3. Promise和async/await
4. this指向
5. 原型链和继承

### 中频题要熟悉
6. 手写工具函数
7. 作用域和作用域链
8. 数组方法实现

### 低频题需了解
9. 设计模式

---

**建议：**
- 高频题必须能流畅回答，最好能手写代码
- 中频题要能说出核心原理和实现思路
- 低频题至少要知道基本概念，能简单说明
