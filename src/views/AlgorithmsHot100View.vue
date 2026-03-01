<template>
  <div class="algorithms-hot100">
    <div class="container">
      <div class="header fade-in">
        <h1 class="title">🔥 {{ $t('algorithms.hot100') }}</h1>
        <p class="subtitle">{{ $t('algorithms.subtitle') }}</p>
      </div>

      <div class="problems-grid fade-in">
        <div
          v-for="(problem, index) in problems"
          :key="problem.id"
          class="problem-card"
          @click="goToProblem(problem.id)"
        >
          <div class="problem-number">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="problem-content">
            <h3 class="problem-title">{{ problem.title }}</h3>
            <p class="problem-desc">{{ problem.description }}</p>
            <div class="problem-tags">
              <span
                v-for="tag in problem.tags"
                :key="tag"
                class="tag"
                :class="`tag-${tag.toLowerCase()}`"
              >
                {{ tag }}
              </span>
            </div>
            <div class="problem-difficulty">
              <span :class="`difficulty-${problem.difficulty.toLowerCase()}`">
                {{ getDifficultyText(problem.difficulty) }}
              </span>
            </div>
          </div>
          <div class="problem-arrow">→</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouterWithLang } from '@/composables/useRouterWithLang'

const { pushWithLang } = useRouterWithLang()
const { t } = useI18n()

interface Problem {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  route: string
}

const problems = computed(() => [
  {
    id: 'intersection-of-two-linked-lists',
    title: t('intersection.title'),
    description: t('intersection.description'),
    difficulty: 'Easy' as const,
    tags: [t('intersection.tags.linkedList'), t('intersection.tags.twoPointers')],
    route: '/algorithms/hot100/intersection-of-two-linked-lists',
  },
  {
    id: 'lowest-common-ancestor-of-a-binary-tree',
    title: t('lca.title'),
    description: t('lca.description'),
    difficulty: 'Medium' as const,
    tags: [t('lca.tags.binaryTree'), t('lca.tags.dfs'), t('lca.tags.recursion')],
    route: '/algorithms/hot100/lowest-common-ancestor-of-a-binary-tree',
  },
  // 可以继续添加更多题目
])

const goToProblem = (id: string) => {
  const problem = problems.value.find(p => p.id === id)
  if (problem) {
    pushWithLang(problem.route)
  }
}

const getDifficultyText = (difficulty: string) => {
  const map: Record<string, string> = {
    Easy: t('intersection.difficulty.easy'),
    Medium: t('intersection.difficulty.medium'),
    Hard: t('intersection.difficulty.hard'),
  }
  return map[difficulty] || difficulty
}
</script>

<style scoped>
.algorithms-hot100 {
  min-height: 100vh;
  padding-top: 100px;
  padding: 100px 1rem 2rem;
  background: linear-gradient(135deg, #fef5e7 0%, #ffeaa7 50%, #fab1a0 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 1rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text);
  opacity: 0.8;
}

.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.problem-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.problem-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--primary), var(--secondary));
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.problem-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--primary);
}

.problem-card:hover::before {
  transform: scaleY(1);
}

.problem-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  opacity: 0.6;
  flex-shrink: 0;
}

.problem-content {
  flex: 1;
}

.problem-title {
  font-size: 1.3rem;
  color: var(--text);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.problem-desc {
  font-size: 0.9rem;
  color: var(--text);
  opacity: 0.7;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.problem-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 107, 157, 0.1);
  color: var(--primary);
}

.tag-linkedlist {
  background: rgba(78, 205, 196, 0.1);
  color: var(--secondary);
}

.tag-双指针 {
  background: rgba(255, 230, 109, 0.2);
  color: #d4a017;
}

.tag-二叉树 {
  background: rgba(78, 205, 196, 0.1);
  color: var(--secondary);
}

.tag-深度优先搜索,
.tag-递归 {
  background: rgba(168, 230, 207, 0.2);
  color: #2d8659;
}

.problem-difficulty {
  margin-top: 0.5rem;
}

.difficulty-easy {
  color: #52c41a;
  font-weight: 600;
}

.difficulty-medium {
  color: #faad14;
  font-weight: 600;
}

.difficulty-hard {
  color: #ff4d4f;
  font-weight: 600;
}

.problem-arrow {
  font-size: 1.5rem;
  color: var(--primary);
  opacity: 0.5;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.problem-card:hover .problem-arrow {
  opacity: 1;
  transform: translateX(5px);
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
  .title {
    font-size: 2rem;
  }

  .problems-grid {
    grid-template-columns: 1fr;
  }
}
</style>
