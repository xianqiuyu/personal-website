# 前端性能优化面试题大全（按频率排序）

> 为资深前端工程师整理的性能优化面试题，包含详细解答、代码示例和扩展追问

---

## 🔥 高频题（面试官几乎必问）

### 1. [高频] 前端性能优化的方案有哪些？如何优化首屏加载时间？

**详细解答：**

#### 首屏优化方案

##### 1. 代码分割和懒加载

```javascript
// 路由懒加载
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

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

// 组件懒加载
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

**效果：** 减少首屏JS体积，提升加载速度

##### 2. 资源预加载和预获取

```html
<!-- DNS预解析 -->
<link rel="dns-prefetch" href="https://api.example.com">

<!-- 预连接 -->
<link rel="preconnect" href="https://api.example.com">

<!-- 预加载关键资源 -->
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/critical.js" as="script">

<!-- 预获取非关键资源 -->
<link rel="prefetch" href="/next-page.js">
```

##### 3. 代码压缩和Tree-shaking

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true, // Tree-shaking
    minimize: true, // 压缩
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
```

##### 4. 图片优化

```html
<!-- 使用现代图片格式 -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Image">
</picture>

<!-- 懒加载 -->
<img src="image.jpg" loading="lazy" alt="Image">

<!-- 响应式图片 -->
<img 
  srcset="image-320w.jpg 320w,
          image-640w.jpg 640w,
          image-1280w.jpg 1280w"
  sizes="(max-width: 640px) 100vw, 50vw"
  src="image-640w.jpg"
  alt="Image"
>
```

##### 5. CDN加速

```html
<!-- 静态资源使用CDN -->
<script src="https://cdn.example.com/react.min.js"></script>
<link rel="stylesheet" href="https://cdn.example.com/style.css">
```

##### 6. HTTP缓存策略

```javascript
// 服务端设置缓存头
// Cache-Control: public, max-age=31536000 (静态资源)
// Cache-Control: no-cache (HTML文件)

// 使用Service Worker缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

##### 7. SSR/SSG（服务端渲染/静态生成）

```javascript
// Next.js SSR示例
export async function getServerSideProps(context) {
  const data = await fetchData()
  return {
    props: { data }
  }
}

// SSG示例
export async function getStaticProps() {
  const data = await fetchData()
  return {
    props: { data },
    revalidate: 60 // ISR: 60秒后重新生成
  }
}
```

##### 8. 骨架屏

```javascript
function SkeletonScreen() {
  return (
    <div className="skeleton">
      <div className="skeleton-header"></div>
      <div className="skeleton-content">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    </div>
  )
}

function Page() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetchData().then(data => {
      setData(data)
      setLoading(false)
    })
  }, [])
  
  if (loading) return <SkeletonScreen />
  return <Content data={data} />
}
```

#### 性能优化检查清单

- [ ] 代码分割和懒加载
- [ ] 资源预加载
- [ ] 代码压缩和Tree-shaking
- [ ] 图片优化（格式、懒加载、响应式）
- [ ] CDN加速
- [ ] HTTP缓存策略
- [ ] SSR/SSG（如适用）
- [ ] 骨架屏
- [ ] 减少HTTP请求数
- [ ] 使用HTTP/2

**扩展追问：**
- 如何量化首屏加载时间？
- SSR和CSR的性能对比？
- Tree-shaking的原理是什么？

---

### 2. [高频] 如何优化渲染性能？减少重排和重绘？

**详细解答：**

#### 重排（Reflow）和重绘（Repaint）

**重排：** 当DOM元素的几何属性（位置、尺寸）发生变化时，浏览器需要重新计算布局

**重绘：** 当元素的视觉属性（颜色、背景）发生变化，但不影响布局

**性能影响：** 重排 > 重绘 > 合成

#### 优化策略

##### 1. 批量DOM操作

```javascript
// ❌ 不好：多次重排
const element = document.getElementById('myDiv')
element.style.width = '100px'
element.style.height = '100px'
element.style.left = '10px'
element.style.top = '10px'

// ✅ 好：一次重排
const element = document.getElementById('myDiv')
element.style.cssText = 'width: 100px; height: 100px; left: 10px; top: 10px;'

// ✅ 更好：使用class
element.className = 'new-style'
```

##### 2. 使用DocumentFragment

```javascript
// ❌ 不好：每次appendChild都会触发重排
const list = document.getElementById('list')
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('li')
  item.textContent = `Item ${i}`
  list.appendChild(item)
}

// ✅ 好：使用DocumentFragment，只触发一次重排
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('li')
  item.textContent = `Item ${i}`
  fragment.appendChild(item)
}
list.appendChild(fragment)
```

##### 3. 避免频繁读取布局属性

```javascript
// ❌ 不好：强制同步布局（强制重排）
function badLayout() {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].style.width = boxes[i].offsetWidth + 10 + 'px'
    // 读取offsetWidth会强制浏览器同步计算布局
  }
}

// ✅ 好：批量读取和写入
function goodLayout() {
  const widths = []
  // 批量读取
  for (let i = 0; i < boxes.length; i++) {
    widths[i] = boxes[i].offsetWidth
  }
  // 批量写入
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].style.width = widths[i] + 10 + 'px'
  }
}
```

##### 4. 使用transform和opacity（GPU加速）

```javascript
// ❌ 不好：触发重排
element.style.left = x + 'px'
element.style.top = y + 'px'

// ✅ 好：使用transform，只触发合成，不触发重排
element.style.transform = `translate(${x}px, ${y}px)`

// ✅ 好：opacity只触发重绘，不触发重排
element.style.opacity = 0.5
```

##### 5. 使用will-change提示浏览器

```css
.element {
  will-change: transform;
  /* 浏览器会提前优化，但不要滥用 */
}
```

##### 6. 虚拟列表（长列表优化）

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

##### 7. 防抖和节流

```javascript
// 防抖：延迟执行
function debounce(func, wait) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// 节流：限制执行频率
function throttle(func, wait) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func.apply(this, args)
    }
  }
}

// 使用
window.addEventListener('resize', debounce(handleResize, 300))
window.addEventListener('scroll', throttle(handleScroll, 100))
```

#### 性能监控

```javascript
// 使用Performance API监控
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'measure') {
      console.log(`${entry.name}: ${entry.duration}ms`)
    }
  }
})
observer.observe({ entryTypes: ['measure'] })

// 测量代码执行时间
performance.mark('start')
// ... 代码执行
performance.mark('end')
performance.measure('my-measure', 'start', 'end')
```

**扩展追问：**
- 如何定位性能瓶颈？
- 重排和重绘的区别？
- GPU加速的原理是什么？

---

### 3. [高频] 网络性能优化方案

**详细解答：**

#### HTTP/1.1的优化

##### 1. 减少HTTP请求数

```javascript
// ❌ 不好：多个请求
fetch('/api/user')
fetch('/api/posts')
fetch('/api/comments')

// ✅ 好：合并请求
fetch('/api/data?include=user,posts,comments')
```

##### 2. 使用HTTP缓存

```javascript
// 强缓存
// Cache-Control: max-age=31536000

// 协商缓存
// ETag / If-None-Match
// Last-Modified / If-Modified-Since

// 使用Service Worker缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('my-cache').then((cache) => {
      return cache.match(event.request).then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request).then((response) => {
          cache.put(event.request, response.clone())
          return response
        })
      })
    })
  )
})
```

##### 3. 压缩资源

```javascript
// Gzip压缩
// Content-Encoding: gzip

// Brotli压缩（更好的压缩比）
// Content-Encoding: br

// 代码压缩
// webpack.config.js
module.exports = {
  optimization: {
    minimize: true
  }
}
```

#### HTTP/2的优化

##### 1. 多路复用

```javascript
// HTTP/2可以在一个连接上并发多个请求
// 不需要合并请求，可以并行请求
fetch('/api/user')
fetch('/api/posts')
fetch('/api/comments')
// 三个请求可以在一个TCP连接上并发
```

##### 2. 服务器推送

```javascript
// 服务端可以主动推送资源
// 例如：推送CSS文件
Link: </style.css>; rel=preload; as=style
```

##### 3. 头部压缩（HPACK）

```javascript
// HTTP/2使用HPACK压缩头部
// 减少重复头部信息的传输
```

#### 其他优化策略

##### 1. 使用CDN

```html
<!-- 静态资源使用CDN -->
<script src="https://cdn.example.com/react.min.js"></script>
```

##### 2. 预加载和预获取

```html
<!-- 预加载关键资源 -->
<link rel="preload" href="/critical.css" as="style">

<!-- 预获取非关键资源 -->
<link rel="prefetch" href="/next-page.js">

<!-- DNS预解析 -->
<link rel="dns-prefetch" href="https://api.example.com">
```

##### 3. 请求去重

```javascript
// 避免重复请求
const requestCache = new Map()

function fetchWithCache(url) {
  if (requestCache.has(url)) {
    return requestCache.get(url)
  }
  
  const promise = fetch(url).then(res => res.json())
  requestCache.set(url, promise)
  
  promise.finally(() => {
    // 请求完成后清除缓存
    setTimeout(() => requestCache.delete(url), 5000)
  })
  
  return promise
}
```

##### 4. 请求优先级

```javascript
// 使用fetch的priority选项（实验性）
fetch('/api/critical', { priority: 'high' })
fetch('/api/non-critical', { priority: 'low' })
```

##### 5. 数据获取优化

```javascript
// 使用React Query/SWR缓存和去重
import { useQuery } from 'react-query'

function Component() {
  const { data } = useQuery('user', fetchUser, {
    staleTime: 5000, // 5秒内不重新请求
    cacheTime: 10000 // 缓存10秒
  })
}
```

**扩展追问：**
- HTTP/2相比HTTP/1.1的优势？
- 如何实现请求去重？
- CDN的工作原理？

---

### 4. [高频] 打包优化和构建性能

**详细解答：**

#### 代码分割

##### 1. 路由级代码分割

```javascript
// React Router
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

// Vue Router
const routes = [
  {
    path: '/home',
    component: () => import('./pages/Home.vue')
  }
]
```

##### 2. 组件级代码分割

```javascript
// 按需加载组件
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

##### 3. 第三方库分割

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all'
        }
      }
    }
  }
}
```

#### Tree-shaking

```javascript
// 使用ES Modules
// math.js
export function add(a, b) {
  return a + b
}

export function subtract(a, b) {
  return a - b
}

// main.js
import { add } from './math'
// subtract不会被打包

// webpack配置
module.exports = {
  optimization: {
    usedExports: true, // 标记未使用的导出
    minimize: true // 删除未使用的代码
  }
}
```

#### 构建性能优化

##### 1. 使用缓存

```javascript
// webpack.config.js
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
}

// Vite自动缓存
// 无需配置，自动使用文件系统缓存
```

##### 2. 并行构建

```javascript
// 使用thread-loader
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'thread-loader',
          'babel-loader'
        ]
      }
    ]
  }
}
```

##### 3. 减少解析范围

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    modules: ['node_modules'], // 明确指定模块查找路径
    extensions: ['.js', '.json'] // 减少扩展名尝试
  }
}
```

##### 4. 使用更快的构建工具

```javascript
// Vite: 使用ESM和esbuild
// 开发服务器启动快，HMR快

// Turbopack: 使用Rust编写
// 构建速度极快（Next.js 13+）
```

#### 打包体积优化

##### 1. 分析打包体积

```javascript
// 使用webpack-bundle-analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

##### 2. 按需引入

```javascript
// ❌ 不好：全量引入
import _ from 'lodash'

// ✅ 好：按需引入
import debounce from 'lodash/debounce'

// ✅ 更好：使用babel-plugin-import
// .babelrc
{
  "plugins": [
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": true
    }]
  ]
}
```

##### 3. 压缩代码

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true // 删除console
          }
        }
      })
    ]
  }
}
```

**扩展追问：**
- 如何分析打包体积？
- Tree-shaking的原理？
- 如何优化构建速度？

---

## ⭐ 中频题（经常被问到）

### 5. [中频] Web Vitals性能指标

**详细解答：**

#### Core Web Vitals

**1. LCP (Largest Contentful Paint) - 最大内容绘制**

```javascript
import { getLCP } from 'web-vitals'

getLCP((metric) => {
  console.log('LCP:', metric.value)
  // 好的LCP: < 2.5秒
  // 需要改进: 2.5-4秒
  // 差: > 4秒
})
```

**优化方法：**
- 优化图片加载
- 预加载关键资源
- 减少服务器响应时间
- 使用CDN

**2. FID (First Input Delay) - 首次输入延迟**

```javascript
import { getFID } from 'web-vitals'

getFID((metric) => {
  console.log('FID:', metric.value)
  // 好的FID: < 100毫秒
  // 需要改进: 100-300毫秒
  // 差: > 300毫秒
})
```

**优化方法：**
- 减少JavaScript执行时间
- 代码分割
- 使用Web Workers
- 优化第三方脚本

**3. CLS (Cumulative Layout Shift) - 累积布局偏移**

```javascript
import { getCLS } from 'web-vitals'

getCLS((metric) => {
  console.log('CLS:', metric.value)
  // 好的CLS: < 0.1
  // 需要改进: 0.1-0.25
  // 差: > 0.25
})
```

**优化方法：**
- 为图片和视频设置尺寸
- 避免在现有内容上方插入内容
- 使用transform动画而不是改变布局属性

#### 其他重要指标

**1. FCP (First Contentful Paint) - 首次内容绘制**

```javascript
import { getFCP } from 'web-vitals'

getFCP((metric) => {
  console.log('FCP:', metric.value)
})
```

**2. TTFB (Time to First Byte) - 首字节时间**

```javascript
import { getTTFB } from 'web-vitals'

getTTFB((metric) => {
  console.log('TTFB:', metric.value)
})
```

**扩展追问：**
- 如何优化Web Vitals指标？
- 如何监控这些指标？

---

### 6. [中频] 内存泄漏的识别和预防

**详细解答：**

#### 常见内存泄漏场景

##### 1. 事件监听器未移除

```javascript
// ❌ 内存泄漏
function Component() {
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    // 忘记移除监听器
  }, [])
}

// ✅ 正确
function Component() {
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
}
```

##### 2. 定时器未清除

```javascript
// ❌ 内存泄漏
function Component() {
  useEffect(() => {
    setInterval(() => {
      console.log('tick')
    }, 1000)
  }, [])
}

// ✅ 正确
function Component() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('tick')
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])
}
```

##### 3. 闭包引用

```javascript
// ❌ 可能的内存泄漏
function Component() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetchData().then(result => {
      setData(result)
      // 如果组件已卸载，setData仍然会执行
    })
  }, [])
}

// ✅ 正确：使用标志位
function Component() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    let isMounted = true
    fetchData().then(result => {
      if (isMounted) {
        setData(result)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])
}
```

##### 4. DOM引用未清除

```javascript
// ❌ 内存泄漏
function Component() {
  const ref = useRef(null)
  
  useEffect(() => {
    const element = ref.current
    // 保存DOM引用
    window.myElement = element
  }, [])
}

// ✅ 正确
function Component() {
  const ref = useRef(null)
  
  useEffect(() => {
    const element = ref.current
    window.myElement = element
    return () => {
      window.myElement = null
    }
  }, [])
}
```

#### 识别内存泄漏

##### 1. 使用Chrome DevTools

```javascript
// 1. 打开Chrome DevTools
// 2. 进入Memory标签
// 3. 选择Heap Snapshot
// 4. 执行操作，再次拍摄快照
// 5. 对比快照，查找内存增长
```

##### 2. 使用Performance Monitor

```javascript
// Chrome DevTools > Performance > Memory
// 监控内存使用趋势
```

##### 3. 代码检查

```javascript
// 检查是否有未清理的资源
// - 事件监听器
// - 定时器
// - 订阅
// - DOM引用
```

**扩展追问：**
- 如何识别和修复内存泄漏？
- React组件卸载时应该清理哪些资源？

---

## 📌 低频题（偶尔问到但需要了解）

### 7. [低频] Service Worker和离线缓存

**详细解答：**

#### Service Worker基础

```javascript
// 注册Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered')
    })
}

// sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js'
      ])
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})
```

**扩展追问：**
- Service Worker的使用场景？
- 如何实现离线缓存策略？

---

## 📝 总结

### 高频题必掌握
1. 首屏优化方案
2. 渲染性能优化
3. 网络性能优化
4. 打包优化

### 中频题要熟悉
5. Web Vitals指标
6. 内存泄漏预防

### 低频题需了解
7. Service Worker

---

**建议：**
- 高频题必须能流畅回答，最好能结合实际项目经验
- 中频题要能说出核心原理和实际应用
- 低频题至少要知道基本概念，能简单说明
