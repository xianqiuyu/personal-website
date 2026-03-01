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
          <span class="problem-number">#002</span>
          <span :class="`difficulty-badge difficulty-${problem.difficulty.toLowerCase()}`">
            {{ getDifficultyText(problem.difficulty) }}
          </span>
        </div>
        <h1 class="problem-title">{{ $t('lca.title') }}</h1>
        <p class="problem-description">{{ $t('lca.description') }}</p>
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
          <button class="btn btn-secondary" @click="stepForward" :disabled="!isAnimating || currentStep >= steps.length">
            {{ $t('algorithms.nextStep') }}
          </button>
          <div class="speed-control">
            <label>{{ $t('algorithms.speed') }}：</label>
            <input type="range" v-model="animationSpeed" min="500" max="2000" step="100" />
            <span>{{ animationSpeed }}ms</span>
          </div>
        </div>

        <!-- Canvas 二叉树可视化 -->
        <div class="canvas-container">
          <canvas ref="canvasRef" class="binary-tree-canvas"></canvas>
        </div>

        <!-- 节点状态显示 -->
        <div class="node-status">
          <div class="status-item">
            <span class="status-label">{{ $t('lca.targetP') }}:</span>
            <span class="status-value">{{ targetP ? `${$t('intersection.value')} ${targetP.val}` : $t('lca.notSet') }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">{{ $t('lca.targetQ') }}:</span>
            <span class="status-value">{{ targetQ ? `${$t('intersection.value')} ${targetQ.val}` : $t('lca.notSet') }}</span>
          </div>
          <div class="status-item" v-if="lcaNode">
            <span class="status-label result">🎯 {{ $t('lca.lca') }}:</span>
            <span class="status-value result">{{ lcaNode.val }}</span>
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
            <p class="complexity-value">O(n)</p>
            <p class="complexity-desc">{{ $t('algorithms.complexityDesc3') }}</p>
          </div>
          <div class="complexity-item">
            <h3>{{ $t('algorithms.spaceComplexity') }}</h3>
            <p class="complexity-value">O(h)</p>
            <p class="complexity-desc">{{ $t('algorithms.complexityDesc4') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
const canvasRef = ref<HTMLCanvasElement | null>(null)

interface TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
}

const problem = computed(() => ({
  title: t('lca.title'),
  description: t('lca.description'),
  difficulty: 'Medium' as const,
  tags: [t('lca.tags.binaryTree'), t('lca.tags.dfs'), t('lca.tags.recursion')],
}))

// 创建示例二叉树
//       3
//      / \
//     5   1
//    / \ / \
//   6  2 0  8
//     / \
//    7   4
const createTree = (): TreeNode => {
  const node7: TreeNode = { val: 7, left: null, right: null }
  const node4: TreeNode = { val: 4, left: null, right: null }
  const node6: TreeNode = { val: 6, left: null, right: null }
  const node2: TreeNode = { val: 2, left: node7, right: node4 }
  const node0: TreeNode = { val: 0, left: null, right: null }
  const node8: TreeNode = { val: 8, left: null, right: null }
  const node5: TreeNode = { val: 5, left: node6, right: node2 }
  const node1: TreeNode = { val: 1, left: node0, right: node8 }
  const root: TreeNode = { val: 3, left: node5, right: node1 }

  return root
}

const root = createTree()
const targetP = ref<TreeNode | null>(null)
const targetQ = ref<TreeNode | null>(null)
const lcaNode = ref<TreeNode | null>(null)

// 默认设置 p=5, q=1
targetP.value = root.left!
targetQ.value = root.right!

// Canvas 相关
let animationFrameId: number | null = null
let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
const nodePositions = new Map<TreeNode, { x: number; y: number }>()
const visitedNodes = reactive(new Set<TreeNode>())
const currentPath = reactive<TreeNode[]>([])
const isAnimating = ref(false)
const currentStep = ref(-1)
const animationSpeed = ref(1000)

interface Step {
  description: string
  action: () => void
}

const steps = ref<Step[]>([])

// 计算二叉树节点位置
const calculateNodePositions = () => {
  nodePositions.clear()

  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  const canvasWidth = canvas.width / dpr
  const canvasHeight = canvas.height / dpr

  const nodeRadius = 25
  const levelHeight = 100
  const startY = 80

  // 计算树的深度
  const getDepth = (node: TreeNode | null): number => {
    if (!node) return 0
    return 1 + Math.max(getDepth(node.left), getDepth(node.right))
  }

  const depth = getDepth(root)

  // 递归计算节点位置
  const calculatePos = (node: TreeNode | null, level: number, leftBound: number, rightBound: number) => {
    if (!node) return

    const x = (leftBound + rightBound) / 2
    const y = startY + level * levelHeight

    nodePositions.set(node, { x, y })

    if (node.left) {
      calculatePos(node.left, level + 1, leftBound, x)
    }
    if (node.right) {
      calculatePos(node.right, level + 1, x, rightBound)
    }
  }

  calculatePos(root, 0, 50, canvasWidth - 50)
}

// 初始化 Canvas
const initCanvas = () => {
  if (!canvasRef.value) return

  canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  if (!ctx) return

  const container = canvas.parentElement
  if (container) {
    const dpr = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()
    canvas.width = 500 * dpr
    canvas.height = 500 * dpr
    canvas.style.width = '500px'
    canvas.style.height = '500px'

    ctx.scale(dpr, dpr)
  }

  calculateNodePositions()
  drawCanvas()
}

// 绘制 Canvas
const drawCanvas = () => {
  if (!ctx || !canvas) return

  const dpr = window.devicePixelRatio || 1
  const canvasWidth = canvas.width / dpr
  const canvasHeight = canvas.height / dpr

  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  // 绘制背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 绘制连接线
  drawConnections()

  // 绘制节点
  nodePositions.forEach((pos, node) => {
    drawNode(pos.x, pos.y, node)
  })
}

// 绘制连接线
const drawConnections = () => {
  if (!ctx) return

  const drawConnection = (parent: TreeNode, child: TreeNode | null) => {
    if (!child) return

    const parentPos = nodePositions.get(parent)
    const childPos = nodePositions.get(child)

    if (!parentPos || !childPos) return

    ctx.strokeStyle = '#ccc'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(parentPos.x, parentPos.y + 25)
    ctx.lineTo(childPos.x, childPos.y - 25)
    ctx.stroke()
  }

  const traverse = (node: TreeNode | null) => {
    if (!node) return
    drawConnection(node, node.left)
    drawConnection(node, node.right)
    traverse(node.left)
    traverse(node.right)
  }

  traverse(root)
}

// 绘制节点
const drawNode = (x: number, y: number, node: TreeNode) => {
  if (!ctx) return

  const isVisited = visitedNodes.has(node)
  const isInPath = currentPath.includes(node)
  const isTargetP = targetP.value === node
  const isTargetQ = targetQ.value === node
  const isLCA = lcaNode.value === node

  // 节点背景
  if (isLCA) {
    ctx.fillStyle = '#52c41a'
  } else if (isTargetP || isTargetQ) {
    ctx.fillStyle = '#ff6b9d'
  } else if (isInPath) {
    ctx.fillStyle = '#4ecdc4'
  } else if (isVisited) {
    ctx.fillStyle = '#ffe66d'
  } else {
    ctx.fillStyle = '#fff'
  }

  ctx.beginPath()
  ctx.arc(x, y, 25, 0, Math.PI * 2)
  ctx.fill()

  // 节点边框
  ctx.strokeStyle = isLCA ? '#52c41a' : isTargetP || isTargetQ ? '#ff6b9d' : isInPath ? '#4ecdc4' : '#ddd'
  ctx.lineWidth = isLCA || isTargetP || isTargetQ ? 3 : 2
  ctx.stroke()

  // 节点值
  ctx.fillStyle = isLCA || isTargetP || isTargetQ ? '#fff' : '#2c3e50'
  ctx.font = 'bold 16px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(node.val), x, y)
}

// 动画循环
const animate = () => {
  drawCanvas()
  animationFrameId = requestAnimationFrame(animate)
}

// 初始化演示
const initDemo = async () => {
  resetDemo()
  isAnimating.value = true

  const stepList: Step[] = []

  // 递归查找 LCA
  const findLCA = (node: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null => {
    if (!node) {
      stepList.push({
        description: t('lca.steps.null'),
        action: () => {},
      })
      return null
    }

    stepList.push({
      description: t('lca.steps.visit', { val: node.val }),
      action: () => {
        visitedNodes.add(node)
        currentPath.push(node)
      },
    })

    // 如果当前节点是 p 或 q，返回当前节点
    if (node === p || node === q) {
      stepList.push({
        description: t('lca.steps.isTarget', { val: node.val }),
        action: () => {
          if (node === p) {
            targetP.value = node
          }
          if (node === q) {
            targetQ.value = node
          }
        },
      })
      return node
    }

    // 递归查找左右子树
    stepList.push({
      description: t('lca.steps.searchLeft'),
      action: () => {},
    })
    const left = findLCA(node.left, p, q)

    stepList.push({
      description: t('lca.steps.searchRight'),
      action: () => {},
    })
    const right = findLCA(node.right, p, q)

    // 如果左右子树都找到了，当前节点就是 LCA
    if (left && right) {
      stepList.push({
        description: t('lca.steps.foundLCA', { val: node.val }),
        action: () => {
          lcaNode.value = node
          currentPath.pop()
        },
      })
      return node
    }

    // 如果只有一边找到了，返回找到的那一边
    if (left) {
      stepList.push({
        description: t('lca.steps.returnLeft', { val: left.val }),
        action: () => {
          currentPath.pop()
        },
      })
      return left
    }

    if (right) {
      stepList.push({
        description: t('lca.steps.returnRight', { val: right.val }),
        action: () => {
          currentPath.pop()
        },
      })
      return right
    }

    stepList.push({
      description: t('lca.steps.notFound', { val: node.val }),
      action: () => {
        currentPath.pop()
      },
    })
    return null
  }

  stepList.push({
    description: t('lca.steps.start', { p: targetP.value?.val || '', q: targetQ.value?.val || '' }),
    action: () => {},
  })

  const result = findLCA(root, targetP.value!, targetQ.value!)

  if (result) {
    stepList.push({
      description: t('lca.steps.result', { val: result.val }),
      action: () => {
        lcaNode.value = result
      },
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
  visitedNodes.clear()
  currentPath.length = 0
  currentStep.value = -1
  lcaNode.value = null
  isAnimating.value = false
  steps.value = []
  targetP.value = root.left!
  targetQ.value = root.right!
  calculateNodePositions()
  drawCanvas()
}

const goBack = () => {
  router.push('/algorithms/hot100')
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
 * 递归解法
 * 时间复杂度: O(n)
 * 空间复杂度: O(h)，h 为树的高度
 */
function lowestCommonAncestor(root, p, q) {
  // 如果当前节点为 null 或者是目标节点之一，直接返回
  if (!root || root === p || root === q) {
    return root;
  }

  // 递归查找左子树和右子树
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  // 如果左右子树都找到了，说明当前节点就是 LCA
  if (left && right) {
    return root;
  }

  // 否则返回找到的那一边（如果都没找到则返回 null）
  return left || right;
}`

const explanationCode = `/**
 * 算法思路详解：
 *
 * 1. 核心思想：
 *    利用递归自底向上查找，如果当前节点的左右子树分别包含 p 和 q，
 *    那么当前节点就是最近公共祖先。
 *
 * 2. 递归终止条件：
 *    - 当前节点为 null，返回 null
 *    - 当前节点是 p 或 q 之一，返回当前节点
 *
 * 3. 递归过程：
 *    - 在左子树中查找 p 和 q
 *    - 在右子树中查找 p 和 q
 *
 * 4. 结果判断：
 *    - 如果左右子树都找到了（left && right），
 *      说明 p 和 q 分别在左右子树中，当前节点就是 LCA
 *    - 如果只有一边找到了，返回找到的那一边
 *    - 如果都没找到，返回 null
 *
 * 5. 时间复杂度：
 *    - 最坏情况下需要遍历所有节点，O(n)
 *
 * 6. 空间复杂度：
 *    - 递归调用栈的深度为树的高度，O(h)
 *    - 最坏情况下（树退化为链表）为 O(n)
 */`

onMounted(() => {
  nextTick(() => {
    initCanvas()
    animate()
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

.difficulty-medium {
  background: rgba(250, 173, 20, 0.1);
  color: #faad14;
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
  max-width: 520px;
  margin: 0 auto 2rem;
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.binary-tree-canvas {
  width: 500px;
  height: 500px;
  max-width: 100%;
  display: block;
  border-radius: 10px;
}

.node-status {
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
  min-width: 120px;
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

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
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

  .binary-tree-canvas {
    height: 400px;
  }
}
</style>
