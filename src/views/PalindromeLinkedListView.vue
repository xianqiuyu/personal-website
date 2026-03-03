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
          <span class="problem-number">#00X</span>
          <span :class="`difficulty-badge difficulty-${problem.difficulty.toLowerCase()}`">
            {{ getDifficultyText(problem.difficulty) }}
          </span>
        </div>
        <h1 class="problem-title">{{ problem.title }}</h1>
        <p class="problem-description">{{ problem.description }}</p>
        <div class="problem-tags">
          <span v-for="tag in problem.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <!-- 解题思路 -->
      <div class="visualization-section fade-in">
        <h2 class="section-title">🧠 {{ $t('palindromeLinkedList.ideaTitle') }}</h2>
        <p class="idea-text">
          {{ $t('palindromeLinkedList.idea1') }}
        </p>
        <ul class="idea-list">
          <li>{{ $t('palindromeLinkedList.ideaStep1') }}</li>
          <li>{{ $t('palindromeLinkedList.ideaStep2') }}</li>
          <li>{{ $t('palindromeLinkedList.ideaStep3') }}</li>
        </ul>
        <p class="idea-text">
          {{ $t('palindromeLinkedList.idea2') }}
        </p>
      </div>

      <!-- 动画演示（Canvas + 简化版） -->
      <div class="visualization-section fade-in">
        <h2 class="section-title">🎬 {{ $t('algorithms.animationDemo') }}</h2>

        <div class="controls">
          <button class="btn btn-primary" @click="startDemo" :disabled="isRunning && stepIndex >= 0">
            {{ stepIndex < 0 ? $t('algorithms.startDemo') : $t('algorithms.demoing') }}
          </button>
          <button class="btn btn-secondary" @click="nextStep" :disabled="!canStep">
            {{ $t('algorithms.nextStep') }}
          </button>
          <button class="btn btn-secondary" @click="resetDemo">
            {{ $t('algorithms.reset') }}
          </button>
        </div>

        <p class="idea-text step-title">
          {{ $t('palindromeLinkedList.stepTitle') }}
        </p>
        <p class="idea-text current-step" v-if="stepIndex >= 0">
          {{ currentStepText }}
        </p>

        <!-- Canvas 可视化 -->
        <div class="canvas-container">
          <canvas ref="canvasRef" class="palindrome-canvas"></canvas>
        </div>

        <!-- 简单的 DOM 可视化（保留） -->
        <div class="palindrome-visual">
          <!-- 原链表 -->
          <div class="list-row">
            <div class="list-label">head</div>
            <div class="nodes">
              <div
                v-for="(val, index) in values"
                :key="'orig-' + index"
                class="node"
                :class="{
                  'node-slow': slowIndex === index,
                  'node-fast': fastIndex === index,
                  'node-compare': leftIndex === index || rightIndex === index,
                  'node-matched': matchedIndices.includes(index),
                }"
              >
                <div class="node-value">{{ val }}</div>
                <div class="node-index">i={{ index }}</div>
              </div>
            </div>
          </div>

          <!-- 反转后的右半部分（示意） -->
          <div class="list-row reversed" v-if="stepIndex >= 4">
            <div class="list-label">{{ $t('palindromeLinkedList.tags.reverse') }}</div>
            <div class="nodes">
              <div
                v-for="(val, index) in reversedValues"
                :key="'rev-' + index"
                class="node node-reversed"
              >
                <div class="node-value">{{ val }}</div>
              </div>
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
            <p class="complexity-value">O(n)</p>
            <p class="complexity-desc">{{ $t('palindromeLinkedList.timeDesc') }}</p>
          </div>
          <div class="complexity-item">
            <h3>{{ $t('algorithms.spaceComplexity') }}</h3>
            <p class="complexity-value">O(1)</p>
            <p class="complexity-desc">{{ $t('palindromeLinkedList.spaceDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouterWithLang } from '@/composables/useRouterWithLang'

const { t } = useI18n()
const { pushWithLang } = useRouterWithLang()

interface Problem {
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
}

const problem = computed<Problem>(() => ({
  title: t('palindromeLinkedList.title'),
  description: t('palindromeLinkedList.description'),
  difficulty: 'Easy',
  tags: [
    t('palindromeLinkedList.tags.linkedList'),
    t('palindromeLinkedList.tags.twoPointers'),
    t('palindromeLinkedList.tags.reverse'),
  ],
}))

// 动画演示相关状态（使用固定示例链表 1 → 2 → 3 → 2 → 1）
const values = [1, 2, 3, 2, 1]
const reversedValues = computed(() => [...values].reverse())

const stepIndex = ref<number>(-1)
const isRunning = ref(false)

const slowIndex = ref<number | null>(null)
const fastIndex = ref<number | null>(null)
const leftIndex = ref<number | null>(null)
const rightIndex = ref<number | null>(null)
const matchedIndices = ref<number[]>([])

const totalSteps = 7

const currentStepText = computed(() => {
  if (stepIndex.value < 0) return ''
  if (stepIndex.value > totalSteps) return ''
  return t(`palindromeLinkedList.step${stepIndex.value}`)
})

const canStep = computed(() => stepIndex.value >= 0 && stepIndex.value < totalSteps)

// Canvas 相关
const canvasRef = ref<HTMLCanvasElement | null>(null)
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
const nodePositions: Array<{ x: number; y: number }> = []

const initCanvas = () => {
  if (!canvasRef.value) return

  canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  if (!ctx) return

  const container = canvas.parentElement
  if (container) {
    const dpr = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = 260 * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = canvas.height / dpr + 'px'
    ctx.scale(dpr, dpr)
  }

  calculateNodePositions()
  drawCanvas()
}

const calculateNodePositions = () => {
  nodePositions.length = 0
  if (!canvas || !ctx) return

  const dpr = window.devicePixelRatio || 1
  const canvasWidth = canvas.width / dpr

  const startX = 60
  const endX = canvasWidth - 60
  const y = 120
  const count = values.length
  const step = count > 1 ? (endX - startX) / (count - 1) : 0

  for (let i = 0; i < count; i++) {
    nodePositions.push({
      x: startX + step * i,
      y,
    })
  }
}

const drawCanvas = () => {
  if (!canvas || !ctx) return

  const dpr = window.devicePixelRatio || 1
  const canvasWidth = canvas.width / dpr
  const canvasHeight = canvas.height / dpr

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // 背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 标题
  ctx.fillStyle = '#2c3e50'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(t('palindromeLinkedList.title'), canvasWidth / 2, 30)

  // 指针说明
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#ff6b9d'
  ctx.fillText('slow', 20, canvasHeight - 50)
  ctx.fillStyle = '#4ecdc4'
  ctx.fillText('fast', 20, canvasHeight - 30)

  // 连接线
  ctx.strokeStyle = '#ccc'
  ctx.lineWidth = 2
  for (let i = 0; i < nodePositions.length - 1; i++) {
    const start = nodePositions[i]
    const end = nodePositions[i + 1]
    ctx.beginPath()
    ctx.moveTo(start.x + 30, start.y)
    ctx.lineTo(end.x - 30, end.y)
    ctx.stroke()
  }

  // 节点
  values.forEach((val, index) => {
    const pos = nodePositions[index]
    if (!pos) return
    drawNode(pos.x, pos.y, val, index)
  })

  // 指针
  drawPointers()
}

const drawNode = (x: number, y: number, val: number, index: number) => {
  if (!ctx) return

  const isSlow = slowIndex.value === index
  const isFast = fastIndex.value === index
  const isCompare = leftIndex.value === index || rightIndex.value === index
  const isMatched = matchedIndices.value.includes(index)

  if (isMatched) {
    ctx.fillStyle = '#52c41a'
  } else if (isCompare) {
    ctx.fillStyle = '#ffa502'
  } else if (isSlow || isFast) {
    ctx.fillStyle = '#ff6b9d'
  } else {
    ctx.fillStyle = '#fff'
  }

  ctx.beginPath()
  ctx.arc(x, y, 30, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = isMatched ? '#52c41a' : isCompare ? '#ffa502' : '#ddd'
  ctx.lineWidth = isMatched || isCompare || isSlow || isFast ? 3 : 2
  ctx.stroke()

  ctx.fillStyle = isMatched || isCompare || isSlow || isFast ? '#fff' : '#2c3e50'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(val), x, y)

  ctx.fillStyle = '#999'
  ctx.font = '11px sans-serif'
  ctx.fillText(`i=${index}`, x, y + 40)
}

const drawPointers = () => {
  if (!ctx) return

  ctx.strokeStyle = '#ff6b9d'
  ctx.fillStyle = '#ff6b9d'
  if (slowIndex.value !== null && slowIndex.value >= 0) {
    const pos = nodePositions[slowIndex.value]
    if (pos) {
      drawArrow(pos.x, pos.y - 50, pos.x, pos.y - 30)
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('slow', pos.x, pos.y - 60)
    }
  }

  ctx.strokeStyle = '#4ecdc4'
  ctx.fillStyle = '#4ecdc4'
  if (fastIndex.value !== null && fastIndex.value >= 0) {
    const pos = nodePositions[fastIndex.value]
    if (pos) {
      drawArrow(pos.x, pos.y - 80, pos.x, pos.y - 30)
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('fast', pos.x, pos.y - 90)
    }
  }
}

const drawArrow = (fromX: number, fromY: number, toX: number, toY: number) => {
  if (!ctx) return
  const headlen = 8
  const angle = Math.atan2(toY - fromY, toX - fromX)

  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  ctx.lineTo(toX, toY)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  )
  ctx.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  )
  ctx.closePath()
  ctx.fill()
}

const animate = () => {
  drawCanvas()
  requestAnimationFrame(animate)
}

const resetVisualState = () => {
  slowIndex.value = null
  fastIndex.value = null
  leftIndex.value = null
  rightIndex.value = null
  matchedIndices.value = []
}

const applyStep = () => {
  resetVisualState()

  switch (stepIndex.value) {
    case 0:
      // 初始化，不移动指针
      break
    case 1:
      slowIndex.value = 0
      fastIndex.value = 0
      break
    case 2:
      slowIndex.value = 1
      fastIndex.value = 2
      break
    case 3:
      slowIndex.value = 2
      fastIndex.value = 4
      break
    case 4:
      leftIndex.value = 0
      rightIndex.value = 4
      break
    case 5:
      matchedIndices.value = [0, 4]
      leftIndex.value = 1
      rightIndex.value = 3
      break
    case 6:
      matchedIndices.value = [0, 1, 3, 4]
      leftIndex.value = 2
      rightIndex.value = 2
      break
    case 7:
      matchedIndices.value = [0, 1, 2, 3, 4]
      break
    default:
      break
  }
}

const startDemo = () => {
  isRunning.value = true
  stepIndex.value = 0
  applyStep()
  if (!canvas || !ctx) {
    initCanvas()
  }
  drawCanvas()
}

const nextStep = () => {
  if (!canStep.value) return
  stepIndex.value++
  applyStep()
  if (!canvas || !ctx) {
    initCanvas()
  }
  drawCanvas()
}

const resetDemo = () => {
  isRunning.value = false
  stepIndex.value = -1
  resetVisualState()
  if (!canvas || !ctx) {
    initCanvas()
  }
  drawCanvas()
}

const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = {
    Easy: t('intersection.difficulty.easy'),
    Medium: t('intersection.difficulty.medium'),
    Hard: t('intersection.difficulty.hard'),
  }
  return map[difficulty] || difficulty
}

const goBack = () => {
  pushWithLang('/algorithms/hot100')
}

const activeTab = ref('solution')

const codeTabs = computed(() => [
  { name: 'solution', label: t('algorithms.solutionCode') },
  { name: 'explanation', label: t('algorithms.detailedExplanation') },
])

const solutionCode = `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *   this.val = (val===undefined ? 0 : val)
 *   this.next = (next===undefined ? null : next)
 * }
 */

/**
 * 快慢指针 + 反转链表
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
  if (!head || !head.next) return true;

  // 1. 快慢指针找到中点
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. 反转后半部分链表
  let prev = null;
  let curr = slow;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  // 3. 从两端向中间比较
  let p1 = head;
  let p2 = prev;
  let result = true;

  while (p2) {
    if (p1.val !== p2.val) {
      result = false;
      break;
    }
    p1 = p1.next;
    p2 = p2.next;
  }

  // （可选）4. 恢复链表结构：再反转一次后半部分
  // 这里可以根据需要选择是否恢复

  return result;
};`

const explanationCode = `/**
 * 解题思路（回文链表）：
 *
 * 1. 题目要求：
 *    - 给定一个单链表，判断它是否是回文结构
 *    - 要求时间复杂度 O(n)，空间复杂度 O(1)
 *
 * 2. 朴素思路（额外空间）：
 *    - 遍历链表，把所有值存到数组中
 *    - 然后用双指针从两端向中间比较
 *    - 时间 O(n)，空间 O(n)
 *
 * 3. 进阶思路（O(1) 空间）：
 *    - 使用快慢指针找到链表中点：
 *      - fast 每次走 2 步，slow 每次走 1 步
 *      - 当 fast 到达末尾时，slow 在中间位置
 *    - 从 slow 开始反转后半部分链表
 *    - 然后从 head 和反转后的 head2 同时向后遍历，比较每个节点的值
 *    - 如果所有对应位置相等，则是回文链表
 *
 * 4. 为什么能做到 O(1) 空间？
 *    - 我们只是在原链表上修改 next 指针，没有开辟额外的线性空间
 *    - 最后如果需要保持链表结构，还可以把后半部分再反转回来
 *
 * 5. 边界情况：
 *    - 链表为空或只有一个节点，一定是回文
 *    - 链表长度为偶数或奇数都可以正确处理
 *
 * 6. 对应 LeetCode 题目：
 *    - Palindrome Linked List
 *    - 链接：leetcode.cn/problems/palindrome-linked-list
 */`
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

.canvas-container {
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.palindrome-canvas {
  width: 100%;
  height: 260px;
  display: block;
  border-radius: 10px;
}

.controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
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

.step-title {
  margin-top: 0.5rem;
}

.current-step {
  font-weight: 600;
  color: var(--primary);
}

.palindrome-visual {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.list-label {
  font-weight: 600;
  color: var(--text);
  min-width: 60px;
}

.nodes {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.node {
  min-width: 52px;
  padding: 0.4rem 0.5rem;
  border-radius: 12px;
  background: #fff;
  border: 2px solid #ddd;
  text-align: center;
  transition: all 0.3s ease;
}

.node-value {
  font-weight: 700;
  color: var(--text);
}

.node-index {
  font-size: 0.7rem;
  color: #999;
}

.node-slow {
  border-color: #ff6b9d;
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.2);
}

.node-fast {
  border-color: #4ecdc4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.2);
}

.node-compare {
  border-color: #ffa502;
  box-shadow: 0 0 0 3px rgba(255, 165, 2, 0.2);
}

.node-matched {
  background: #52c41a;
  border-color: #52c41a;
  color: #fff;
}

.node-matched .node-value,
.node-matched .node-index {
  color: #fff;
}

.node-reversed {
  background: rgba(78, 205, 196, 0.1);
  border-color: #4ecdc4;
}

.section-title {
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.idea-text {
  font-size: 1rem;
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.idea-list {
  margin-left: 1.2rem;
  margin-bottom: 1rem;
  color: var(--text);
  line-height: 1.7;
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
}
</style>

