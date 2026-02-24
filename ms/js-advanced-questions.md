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

**扩展追问：**
- 闭包是如何在内存中存储的？
- 如何识别和避免闭包导致的内存泄漏？
- 闭包和普通函数调用的性能差异？

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

**扩展追问：**
- Node.js的事件循环和浏览器有什么区别？
- 如何理解async/await在事件循环中的执行？
- 如何避免事件循环阻塞？

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

**扩展追问：**
- Promise.all和Promise.allSettled的区别？
- 如何实现Promise的链式调用？
- async/await的错误处理？

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

**扩展追问：**
- 箭头函数为什么不能改变this？
- bind和call/apply的区别？
- 如何理解this的绑定规则？

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

**扩展追问：**
- 原型链的查找机制？
- 如何实现多重继承？
- ES6 Class和ES5继承的区别？

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

**扩展追问：**
- 防抖和节流的区别和使用场景？
- 深拷贝如何处理函数、Date、RegExp等特殊对象？
- 如何实现一个通用的工具函数库？

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

**扩展追问：**
- 作用域链的查找机制？
- 如何理解闭包和作用域的关系？
- var、let、const的实际应用场景？

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

**扩展追问：**
- map、filter、reduce的性能对比？
- 如何实现数组去重？
- 数组方法的时间复杂度？

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

**扩展追问：**
- 前端开发中常用的设计模式有哪些？
- 如何在前端项目中应用设计模式？

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
