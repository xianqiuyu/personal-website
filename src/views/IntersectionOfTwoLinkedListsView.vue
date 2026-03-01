<template>
  <div class="algorithm-detail">
    <div class="container">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="goBack">
        ← {{ $t('algorithms.backToHot100') }}
      </button>

      <!-- 题目信息 -->
      <div class="problem-header fade-in">
        <div class="problem-meta">
          <span class="problem-number">#001</span>
          <span :class="`difficulty-badge difficulty-${problem.difficulty.toLowerCase()}`">
            {{ getDifficultyText(problem.difficulty) }}
          </span>
        </div>
        <h1 class="problem-title">{{ $t('intersection.title') }}</h1>
        <p class="problem-description">{{ $t('intersection.description') }}</p>
        <div class="problem-tags">
          <span v-for="tag in problem.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <!-- 算法可视化区域 -->
      <div class="visualization-section fade-in">
        <h2 class="section-title">🎬 {{ $t('algorithms.animationDemo') }}</h2>

        <!-- 控制面板 -->
        <div class="controls">
          <button class="btn btn-primary" @click="initDemo" :disabled="isAnimating">
            {{ isAnimating ? $t('algorithms.demoing') : $t('algorithms.startDemo') }}
          </button>
          <button class="btn btn-secondary" @click="resetDemo" :disabled="isAnimating">
            {{ $t('algorithms.reset') }}
          </button>
          <button class="btn btn-secondary" @click="stepForward" :disabled="currentStep >= steps.length - 1">
            {{ $t('algorithms.nextStep') }}
          </button>
          <div class="speed-control">
            <label>{{ $t('algorithms.speed') }}：</label>
            <input type="range" v-model="animationSpeed" min="500" max="2000" step="100" />
            <span>{{ animationSpeed }}ms</span>
          </div>
        </div>

        <!-- Canvas 链表可视化 -->
        <div class="canvas-container">
          <canvas ref="canvasRef" class="linked-list-canvas"></canvas>
        </div>

        <!-- 指针状态显示 -->
        <div class="pointer-status">
          <div class="status-item">
            <span class="status-label">{{ $t('intersection.pointerA') }}:</span>
            <span class="status-value">
              {{ currentNodeA >= 0 ? `${$t('intersection.node')} ${currentNodeA} (${$t('intersection.value')}: ${listA[currentNodeA]?.val})` : $t('intersection.notStarted') }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">{{ $t('intersection.pointerB') }}:</span>
            <span class="status-value">
              {{ currentNodeB >= 0 ? `${$t('intersection.node')} ${currentNodeB} (${$t('intersection.value')}: ${listB[currentNodeB]?.val})` : $t('intersection.notStarted') }}
            </span>
          </div>
          <div class="status-item" v-if="intersectionNode">
            <span class="status-label result">🎯 {{ $t('intersection.intersectionNode') }}:</span>
            <span class="status-value result">{{ intersectionNode.val }}</span>
          </div>
        </div>

        <!-- 步骤说明 -->
        <div class="steps-explanation">
          <h3 class="steps-title">{{ $t('algorithms.executionSteps') }}</h3>
          <div class="steps-list">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="step-item"
              :class="{
                'step-active': index === currentStep,
                'step-completed': index < currentStep
              }"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-content">{{ step.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 代码实现 -->
      <div class="code-section fade-in">
        <h2 class="section-title">💻 {{ $t('algorithms.codeImplementation') }}</h2>

        <div class="code-tabs">
          <button
            v-for="tab in codeTabs"
            :key="tab.name"
            class="code-tab"
            :class="{ active: activeTab === tab.name }"
            @click="activeTab = tab.name"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="code-content">
          <pre v-if="activeTab === 'solution'"><code>{{ solutionCode }}</code></pre>
          <pre v-if="activeTab === 'explanation'"><code>{{ explanationCode }}</code></pre>
        </div>
      </div>

      <!-- 复杂度分析 -->
      <div class="complexity-section fade-in">
        <h2 class="section-title">📊 {{ $t('algorithms.complexityAnalysis') }}</h2>
        <div class="complexity-grid">
          <div class="complexity-item">
            <h3>{{ $t('algorithms.timeComplexity') }}</h3>
            <p class="complexity-value">O(m + n)</p>
            <p class="complexity-desc">{{ $t('algorithms.complexityDesc1') }}</p>
          </div>
          <div class="complexity-item">
            <h3>{{ $t('algorithms.spaceComplexity') }}</h3>
            <p class="complexity-value">O(1)</p>
            <p class="complexity-desc">{{ $t('algorithms.complexityDesc2') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouterWithLang } from '@/composables/useRouterWithLang'

const { pushWithLang } = useRouterWithLang()
const { t } = useI18n()
const canvasRef = ref<HTMLCanvasElement | null>(null)

interface ListNode {
  val: number
  next: ListNode | null
}

const problem = computed(() => ({
  title: t('intersection.title'),
  description: t('intersection.description'),
  difficulty: 'Easy' as const,
  tags: [t('intersection.tags.linkedList'), t('intersection.tags.twoPointers'), t('intersection.tags.hashTable')],
}))

// 演示数据：创建两个相交的链表
// 链表 A: 4 -> 1 -> 8 -> 4 -> 5
// 链表 B: 5 -> 6 -> 1 -> 8 -> 4 -> 5
// 相交节点：值为 8 的节点
const createIntersectingLists = () => {
  // 相交部分
  const node8: ListNode = { val: 8, next: null }
  const node4: ListNode = { val: 4, next: null }
  const node5: ListNode = { val: 5, next: null }

  node8.next = node4
  node4.next = node5

  // 链表 A: 4 -> 1 -> (指向 node8)
  const nodeA1: ListNode = { val: 1, next: node8 }
  const nodeA4: ListNode = { val: 4, next: nodeA1 }

  // 链表 B: 5 -> 6 -> 1 -> (指向 node8)
  const nodeB1: ListNode = { val: 1, next: node8 }
  const nodeB6: ListNode = { val: 6, next: nodeB1 }
  const nodeB5: ListNode = { val: 5, next: nodeB6 }

  return {
    headA: nodeA4,
    headB: nodeB5,
    intersection: node8,
  }
}

const { headA, headB, intersection } = createIntersectingLists()

// 将链表转换为数组用于可视化
const listToArray = (head: ListNode | null): ListNode[] => {
  const arr: ListNode[] = []
  let current = head
  while (current) {
    arr.push(current)
    current = current.next
  }
  return arr
}

const listA = ref(listToArray(headA))
const listB = ref(listToArray(headB))
const intersectionNode = ref<ListNode | null>(null)

const currentNodeA = ref(-1)
const currentNodeB = ref(-1)
const visitedNodesA = reactive(new Set<number>())
const visitedNodesB = reactive(new Set<number>())
const isAnimating = ref(false)
const currentStep = ref(-1)
const animationSpeed = ref(1000)

// Canvas 动画相关
let animationFrameId: number | null = null
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
const nodePositionsA: Array<{ x: number; y: number }> = []
const nodePositionsB: Array<{ x: number; y: number }> = []
const pointerAPos = ref({ x: 0, y: 0, targetX: 0, targetY: 0 })
const pointerBPos = ref({ x: 0, y: 0, targetX: 0, targetY: 0 })
const isPointerAMoving = ref(false)
const isPointerBMoving = ref(false)

interface Step {
  description: string
  action: () => void
}

const steps = ref<Step[]>([])

  // 找到两个链表的长度

// 初始化演示 - 使用双指针法（优雅解法）
const initDemo = async () => {
  resetDemo()
  isAnimating.value = true

  // 确保 listA 和 listB 是数组，并保存引用
  const arrA = Array.isArray(listA.value) ? listA.value : listToArray(headA)
  const arrB = Array.isArray(listB.value) ? listB.value : listToArray(headB)

  // 如果 listA 或 listB 不是数组，重新初始化
  if (!Array.isArray(listA.value)) {
    listA.value = arrA
  }
  if (!Array.isArray(listB.value)) {
    listB.value = arrB
  }

  const stepList: Step[] = []

  // 初始化步骤
  stepList.push({
    description: t('intersection.steps.init', { valA: arrA[0]?.val || 4, valB: arrB[0]?.val || 5 }),
    action: () => {
      currentNodeA.value = 0
      currentNodeB.value = 0
      if (nodePositionsA[0]) {
        const targetX = nodePositionsA[0].x - 60
        const targetY = nodePositionsA[0].y
        pointerAPos.value.x = targetX
        pointerAPos.value.y = targetY
        pointerAPos.value.targetX = targetX
        pointerAPos.value.targetY = targetY
        isPointerAMoving.value = false // 初始化时不需要移动动画
      }
      if (nodePositionsB[0]) {
        const targetX = nodePositionsB[0].x + 60
        const targetY = nodePositionsB[0].y
        pointerBPos.value.x = targetX
        pointerBPos.value.y = targetY
        pointerBPos.value.targetX = targetX
        pointerBPos.value.targetY = targetY
        isPointerBMoving.value = false // 初始化时不需要移动动画
      }
    },
  })

  // 模拟双指针算法：让两个指针分别遍历两个链表
  // 当到达末尾时，切换到另一个链表的头部
  let ptrA: ListNode | null = headA
  let ptrB: ListNode | null = headB

  // 找到当前指针在数组中的位置（使用保存的数组引用）
  const getIndexInA = (node: ListNode | null) => {
    if (!node) return -1
    return arrA.findIndex(n => n === node)
  }

  const getIndexInB = (node: ListNode | null) => {
    if (!node) return -1
    return arrB.findIndex(n => n === node)
  }

  let count = 0
  const maxIterations = 12

  while (ptrA !== ptrB && count < maxIterations) {
    const valA = ptrA ? ptrA.val : 'null'
    const valB = ptrB ? ptrB.val : 'null'
    const indexA = getIndexInA(ptrA)
    const indexB = getIndexInB(ptrB)

    // 如果指针在链表 A 中但不在数组里，说明已经切换到 B 了
    const inListA = ptrA && arrA.includes(ptrA)
    const inListB = ptrB && arrB.includes(ptrB)

    if (!inListA && ptrA && inListB) {
      // 指针 A 已经切换到链表 B
      stepList.push({
        description: t('intersection.steps.switchA', { val: ptrA.val }),
        action: () => {
          currentNodeA.value = -1 // 标记在链表 B 中
          if (arrA.length > 0) {
            visitedNodesA.add(arrA.length - 1)
          }
          // 更新指针位置到链表 B
          const indexB = getIndexInB(ptrA)
          if (indexB >= 0 && nodePositionsB[indexB]) {
            pointerAPos.value.targetX = nodePositionsB[indexB].x - 60
            pointerAPos.value.targetY = nodePositionsB[indexB].y
            isPointerAMoving.value = true
          }
        },
      })
    } else if (!inListB && ptrB && inListA) {
      // 指针 B 已经切换到链表 A
      stepList.push({
        description: t('intersection.steps.switchB', { val: ptrB.val }),
        action: () => {
          currentNodeB.value = -1 // 标记在链表 A 中
          if (arrB.length > 0) {
            visitedNodesB.add(arrB.length - 1)
          }
          // 更新指针位置到链表 A
          const indexA = getIndexInA(ptrB)
          if (indexA >= 0 && nodePositionsA[indexA]) {
            pointerBPos.value.targetX = nodePositionsA[indexA].x + 60
            pointerBPos.value.targetY = nodePositionsA[indexA].y
            isPointerBMoving.value = true
          }
        },
      })
    } else {
      // 正常移动
      const posA = indexA >= 0 ? `A[${indexA}]` : t('intersection.position.inB')
      const posB = indexB >= 0 ? `B[${indexB}]` : t('intersection.position.inA')

      stepList.push({
        description: t('intersection.steps.move', { valA, posA, valB, posB }),
        action: () => {
          if (indexA >= 0) {
            visitedNodesA.add(indexA)
            const nextIndexA = indexA + 1
            currentNodeA.value = nextIndexA < arrA.length ? nextIndexA : -1

            // 更新指针 A 位置
            if (nextIndexA < arrA.length && nodePositionsA[nextIndexA]) {
              pointerAPos.value.targetX = nodePositionsA[nextIndexA].x - 60
              pointerAPos.value.targetY = nodePositionsA[nextIndexA].y
              isPointerAMoving.value = true
            } else if (nextIndexA >= arrA.length) {
              // 切换到链表 B
              const indexB = getIndexInB(ptrA?.next || headB)
              if (indexB >= 0 && nodePositionsB[indexB]) {
                pointerAPos.value.targetX = nodePositionsB[indexB].x - 60
                pointerAPos.value.targetY = nodePositionsB[indexB].y
                isPointerAMoving.value = true
              }
            }
          } else {
            currentNodeA.value = -1
          }

          if (indexB >= 0) {
            visitedNodesB.add(indexB)
            const nextIndexB = indexB + 1
            currentNodeB.value = nextIndexB < arrB.length ? nextIndexB : -1

            // 更新指针 B 位置
            if (nextIndexB < arrB.length && nodePositionsB[nextIndexB]) {
              pointerBPos.value.targetX = nodePositionsB[nextIndexB].x + 60
              pointerBPos.value.targetY = nodePositionsB[nextIndexB].y
              isPointerBMoving.value = true
            } else if (nextIndexB >= arrB.length) {
              // 切换到链表 A
              const indexA = getIndexInA(ptrB?.next || headA)
              if (indexA >= 0 && nodePositionsA[indexA]) {
                pointerBPos.value.targetX = nodePositionsA[indexA].x + 60
                pointerBPos.value.targetY = nodePositionsA[indexA].y
                isPointerBMoving.value = true
              }
            }
          } else {
            currentNodeB.value = -1
          }
        },
      })
    }

    // 实际移动指针
    ptrA = ptrA ? ptrA.next : headB
    ptrB = ptrB ? ptrB.next : headA

    count++
  }

  // 检查是否找到相交节点
  if (ptrA === ptrB && ptrA) {
    const intersectionIndexA = getIndexInA(ptrA)
    const intersectionIndexB = getIndexInB(ptrA)

    stepList.push({
      description: t('intersection.steps.found', { val: ptrA.val, indexA: intersectionIndexA, indexB: intersectionIndexB }),
      action: () => {
        intersectionNode.value = ptrA
        if (intersectionIndexA >= 0) {
          currentNodeA.value = intersectionIndexA
          if (nodePositionsA[intersectionIndexA]) {
            pointerAPos.value.targetX = nodePositionsA[intersectionIndexA].x - 60
            pointerAPos.value.targetY = nodePositionsA[intersectionIndexA].y
            isPointerAMoving.value = true
          }
        }
        if (intersectionIndexB >= 0) {
          currentNodeB.value = intersectionIndexB
          if (nodePositionsB[intersectionIndexB]) {
            pointerBPos.value.targetX = nodePositionsB[intersectionIndexB].x + 60
            pointerBPos.value.targetY = nodePositionsB[intersectionIndexB].y
            isPointerBMoving.value = true
          }
        }
      },
    })
  } else {
    stepList.push({
      description: t('intersection.steps.notFound'),
      action: () => {},
    })
  }

  steps.value = stepList

  // 执行动画
  for (let i = 0; i < steps.value.length; i++) {
    currentStep.value = i
    steps.value[i].action()
    await new Promise(resolve => setTimeout(resolve, animationSpeed.value))
  }

  isAnimating.value = false
}

const stepForward = async () => {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
    steps.value[currentStep.value].action()
  }
}

const resetDemo = () => {
  currentNodeA.value = -1
  currentNodeB.value = -1
  visitedNodesA.clear()
  visitedNodesB.clear()
  currentStep.value = -1
  intersectionNode.value = null
  isAnimating.value = false
  steps.value = []
  isPointerAMoving.value = false
  isPointerBMoving.value = false
  pointerAPos.value = { x: 0, y: 0, targetX: 0, targetY: 0 }
  pointerBPos.value = { x: 0, y: 0, targetX: 0, targetY: 0 }
  calculateNodePositions()
  drawCanvas()
}

const goBack = () => {
  pushWithLang('/algorithms/hot100')
}

const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = {
    Easy: t('intersection.difficulty.easy'),
    Medium: t('intersection.difficulty.medium'),
    Hard: t('intersection.difficulty.hard'),
  }
  return map[difficulty] || difficulty
}

// 代码内容
const activeTab = ref('solution')

const codeTabs = computed(() => [
  { name: 'solution', label: t('algorithms.solutionCode') },
  { name: 'explanation', label: t('algorithms.detailedExplanation') },
])

const solutionCode = `/**
 * 双指针法 - 优雅解法
 * 时间复杂度: O(m + n)
 * 空间复杂度: O(1)
 */
function getIntersectionNode(headA, headB) {
  if (!headA || !headB) return null;

  let ptrA = headA;
  let ptrB = headB;

  // 关键思想：让两个指针分别遍历两个链表
  // 当到达末尾时，切换到另一个链表的头部
  // 这样两个指针会在相交节点相遇（如果存在）
  while (ptrA !== ptrB) {
    // 如果 ptrA 到达末尾，切换到链表 B
    ptrA = ptrA ? ptrA.next : headB;
    // 如果 ptrB 到达末尾，切换到链表 A
    ptrB = ptrB ? ptrB.next : headA;
  }

  // 如果相交，返回相交节点；如果不相交，两个指针都会是 null
  return ptrA;
}

// 示例用法
const result = getIntersectionNode(headA, headB);
console.log('相交节点:', result);`

const explanationCode = `/**
 * 算法思路详解：
 *
 * 1. 问题分析：
 *    - 两个链表可能长度不同
 *    - 相交节点之后的节点是共享的
 *    - 需要找到第一个相交的节点
 *
 * 2. 核心思想：
 *    让两个指针分别遍历两个链表，当到达末尾时切换到另一个链表。
 *    这样两个指针走过的总长度相等，会在相交节点相遇。
 *
 * 3. 为什么这样能工作？
 *    - 假设链表 A 长度为 a，链表 B 长度为 b，相交部分长度为 c
 *    - 指针 A 走过的路径：a + (b - c)
 *    - 指针 B 走过的路径：b + (a - c)
 *    - 两者相等：a + b - c = b + a - c
 *    - 因此两个指针会在相交节点相遇
 *
 * 4. 边界情况：
 *    - 如果两个链表不相交，两个指针最终都会是 null
 *    - 如果其中一个链表为空，直接返回 null
 *
 * 5. 时间复杂度：
 *    - 最多遍历 m + n 个节点，其中 m 和 n 是两个链表的长度
 *    - 时间复杂度为 O(m + n)
 *
 * 6. 空间复杂度：
 *    - 只使用了两个指针变量
 *    - 空间复杂度为 O(1)
 */`

// Canvas 绘制函数
const initCanvas = () => {
  if (!canvasRef.value) return

  canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置 Canvas 尺寸（考虑设备像素比以获得清晰显示）
  const container = canvas.parentElement
  if (container) {
    const dpr = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = Math.max(600, rect.height || 600) * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = (canvas.height / dpr) + 'px'

    // 缩放上下文以匹配设备像素比
    ctx.scale(dpr, dpr)
  }

  // 计算节点位置
  calculateNodePositions()
  drawCanvas()
}

const calculateNodePositions = () => {
  const arrA = listA.value
  const arrB = listB.value

  nodePositionsA.length = 0
  nodePositionsB.length = 0

  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  const canvasWidth = canvas.width / dpr
  const canvasHeight = canvas.height / dpr

  // 布局参数：根据链表最长长度动态计算纵向间距，避免节点被裁剪
  const marginTop = 110
  const marginBottom = 80
  const maxLen = Math.max(arrA.length, arrB.length, 1)
  const availableHeight = Math.max(100, canvasHeight - marginTop - marginBottom)
  const nodeSpacing =
    maxLen > 1 ? Math.min(110, availableHeight / (maxLen - 1)) : 0
  const startY = marginTop
  const listAStartX = canvasWidth * 0.25
  const listBStartX = canvasWidth * 0.75

  // 计算链表 A 的位置
  arrA.forEach((_, index) => {
    nodePositionsA.push({
      x: listAStartX,
      y: startY + index * nodeSpacing,
    })
  })

  // 计算链表 B 的位置
  arrB.forEach((_, index) => {
    nodePositionsB.push({
      x: listBStartX,
      y: startY + index * nodeSpacing,
    })
  })

  // 找到相交节点，调整位置使其对齐
  const intersectionIndexA = arrA.findIndex(n => n === intersection)
  const intersectionIndexB = arrB.findIndex(n => n === intersection)

  if (intersectionIndexA >= 0 && intersectionIndexB >= 0) {
    // 让相交节点对齐
    const offsetY = nodePositionsA[intersectionIndexA].y - nodePositionsB[intersectionIndexB].y
    nodePositionsB.forEach(pos => {
      pos.y += offsetY
    })
  }
}

const drawCanvas = () => {
  if (!ctx || !canvas) return

  const dpr = window.devicePixelRatio || 1
  const canvasWidth = canvas.width / dpr
  const canvasHeight = canvas.height / dpr

  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  const arrA = listA.value
  const arrB = listB.value

  // 绘制背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 绘制标题
  ctx.fillStyle = '#2c3e50'
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(t('algorithms.listA'), canvasWidth * 0.25, 50)
  ctx.fillText(t('algorithms.listB'), canvasWidth * 0.75, 50)

  // 绘制连接线
  drawConnections()

  // 绘制节点
  arrA.forEach((node, index) => {
    const pos = nodePositionsA[index]
    if (pos) {
      drawNode(pos.x, pos.y, node.val, index, 'A')
    }
  })

  arrB.forEach((node, index) => {
    const pos = nodePositionsB[index]
    if (pos) {
      drawNode(pos.x, pos.y, node.val, index, 'B')
    }
  })
}

const drawConnections = () => {
  if (!ctx) return

  const arrA = listA.value
  const arrB = listB.value

  ctx.strokeStyle = '#ccc'
  ctx.lineWidth = 2

  // 绘制链表 A 的连接线
  for (let i = 0; i < arrA.length - 1; i++) {
    const start = nodePositionsA[i]
    const end = nodePositionsA[i + 1]
    if (start && end) {
      ctx.beginPath()
      ctx.moveTo(start.x, start.y + 30)
      ctx.lineTo(end.x, end.y - 30)
      ctx.stroke()

      // 绘制箭头
      const angle = Math.atan2(end.y - start.y, end.x - start.x)
      const arrowLength = 10
      const arrowAngle = Math.PI / 6
      ctx.beginPath()
      ctx.moveTo(end.x, end.y - 30)
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle - arrowAngle),
        end.y - 30 - arrowLength * Math.sin(angle - arrowAngle)
      )
      ctx.moveTo(end.x, end.y - 30)
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle + arrowAngle),
        end.y - 30 - arrowLength * Math.sin(angle + arrowAngle)
      )
      ctx.stroke()
    }
  }

  // 绘制链表 B 的连接线
  for (let i = 0; i < arrB.length - 1; i++) {
    const start = nodePositionsB[i]
    const end = nodePositionsB[i + 1]
    if (start && end) {
      ctx.beginPath()
      ctx.moveTo(start.x, start.y + 30)
      ctx.lineTo(end.x, end.y - 30)
      ctx.stroke()

      // 绘制箭头
      const angle = Math.atan2(end.y - start.y, end.x - start.x)
      const arrowLength = 10
      const arrowAngle = Math.PI / 6
      ctx.beginPath()
      ctx.moveTo(end.x, end.y - 30)
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle - arrowAngle),
        end.y - 30 - arrowLength * Math.sin(angle - arrowAngle)
      )
      ctx.moveTo(end.x, end.y - 30)
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle + arrowAngle),
        end.y - 30 - arrowLength * Math.sin(angle + arrowAngle)
      )
      ctx.stroke()
    }
  }

  // 绘制相交部分的连接（如果有）
  const intersectionIndexA = listA.value.findIndex(n => n === intersection)
  const intersectionIndexB = listB.value.findIndex(n => n === intersection)
  if (intersectionIndexA >= 0 && intersectionIndexB >= 0) {
    const posA = nodePositionsA[intersectionIndexA]
    const posB = nodePositionsB[intersectionIndexB]
    if (posA && posB) {
      ctx.strokeStyle = '#52c41a'
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(posA.x + 30, posA.y)
      ctx.lineTo(posB.x - 30, posB.y)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }
}

const drawNode = (x: number, y: number, val: number, index: number, listType: 'A' | 'B') => {
  if (!ctx) return

  const isActiveA = listType === 'A' && currentNodeA.value === index
  const isActiveB = listType === 'B' && currentNodeB.value === index
  const isVisitedA = listType === 'A' && visitedNodesA.has(index)
  const isVisitedB = listType === 'B' && visitedNodesB.has(index)
  const node = listType === 'A' ? listA.value[index] : listB.value[index]
  const isIntersection = intersectionNode.value && node === intersectionNode.value

  // 节点背景
  if (isIntersection) {
    ctx.fillStyle = '#52c41a'
  } else if (isActiveA || isActiveB) {
    ctx.fillStyle = '#ff6b9d'
  } else if (isVisitedA || isVisitedB) {
    ctx.fillStyle = '#4ecdc4'
  } else {
    ctx.fillStyle = '#fff'
  }

  ctx.beginPath()
  ctx.arc(x, y, 30, 0, Math.PI * 2)
  ctx.fill()

  // 节点边框
  ctx.strokeStyle = isActiveA || isActiveB ? '#ff6b9d' : isIntersection ? '#52c41a' : '#ddd'
  ctx.lineWidth = isActiveA || isActiveB || isIntersection ? 3 : 2
  ctx.stroke()

  // 节点值
  ctx.fillStyle = isActiveA || isActiveB || isIntersection ? '#fff' : '#2c3e50'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(val), x, y)
}


const animate = () => {
  if (!ctx || !canvas) return

  // 平滑移动指针
  const speed = 0.15

  if (isPointerAMoving.value) {
    const dx = pointerAPos.value.targetX - pointerAPos.value.x
    const dy = pointerAPos.value.targetY - pointerAPos.value.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 0.5) {
      pointerAPos.value.x += dx * speed
      pointerAPos.value.y += dy * speed
    } else {
      // 到达目标位置，精确设置
      pointerAPos.value.x = pointerAPos.value.targetX
      pointerAPos.value.y = pointerAPos.value.targetY
      isPointerAMoving.value = false
    }
  }

  if (isPointerBMoving.value) {
    const dx = pointerBPos.value.targetX - pointerBPos.value.x
    const dy = pointerBPos.value.targetY - pointerBPos.value.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 0.5) {
      pointerBPos.value.x += dx * speed
      pointerBPos.value.y += dy * speed
    } else {
      // 到达目标位置，精确设置
      pointerBPos.value.x = pointerBPos.value.targetX
      pointerBPos.value.y = pointerBPos.value.targetY
      isPointerBMoving.value = false
    }
  }

  // 持续重绘，确保指针始终显示
  drawCanvas()

  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  nextTick(() => {
    initCanvas()
    animate()

    // 监听窗口大小变化
    window.addEventListener('resize', initCanvas)
  })
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', initCanvas)
})
</script>

<style scoped>
.algorithm-detail {
  min-height: 100vh;
  padding-top: 100px;
  padding: 100px 1rem 2rem;
  background: linear-gradient(135deg, #fef5e7 0%, #ffeaa7 50%, #fab1a0 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  background: white;
  border: 2px solid var(--primary);
  color: var(--primary);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.back-btn:hover {
  background: var(--primary);
  color: white;
  transform: translateX(-5px);
}

.problem-header {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.problem-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.problem-number {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
}

.difficulty-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.difficulty-easy {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.problem-title {
  font-size: 2.5rem;
  color: var(--text);
  margin-bottom: 1rem;
  font-weight: 700;
}

.problem-description {
  font-size: 1.1rem;
  color: var(--text);
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.problem-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.5rem 1rem;
  background: rgba(255, 107, 157, 0.1);
  color: var(--primary);
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
}

.visualization-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 15px;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 157, 0.3);
}

.btn-secondary {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--primary);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.speed-control input[type="range"] {
  width: 150px;
}

.canvas-container {
  width: 100%;
  margin-bottom: 2rem;
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.linked-list-canvas {
  width: 100%;
  height: 600px;
  display: block;
  border-radius: 10px;
}

.pointer-status {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
}

.status-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.status-label {
  font-weight: 600;
  color: var(--text);
  min-width: 100px;
}

.status-value {
  color: var(--primary);
  font-weight: 600;
}

.status-value.result {
  color: #52c41a;
  font-size: 1.2rem;
}

.steps-explanation {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
}

.steps-title {
  font-size: 1.5rem;
  color: var(--text);
  margin-bottom: 1rem;
  font-weight: 700;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.step-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.step-item.step-active {
  border-color: var(--primary);
  background: rgba(255, 107, 157, 0.1);
  transform: translateX(5px);
}

.step-item.step-completed {
  opacity: 0.7;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.step-item.step-active .step-number {
  background: var(--secondary);
  animation: pulse 1s infinite;
}

.step-content {
  flex: 1;
  color: var(--text);
  line-height: 1.6;
}

.code-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.code-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.code-tab {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.code-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.code-content {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 1.5rem;
  overflow-x: auto;
}

.code-content pre {
  margin: 0;
  color: #d4d4d4;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.code-content code {
  color: #d4d4d4;
}

.complexity-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.complexity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.complexity-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
}

.complexity-item h3 {
  color: var(--text);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.complexity-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.complexity-desc {
  color: var(--text);
  opacity: 0.7;
  line-height: 1.6;
}

.fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .problem-title {
    font-size: 1.8rem;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .speed-control {
    margin-left: 0;
  }

  .linked-list-canvas {
    height: 500px;
  }
}
</style>
