<template>
  <div class="portfolio-page">
    <div class="page-header">
      <h1 class="page-title">{{ $t('portfolio.title') }}</h1>
      <p class="page-subtitle">{{ $t('portfolio.subtitle') }}</p>
    </div>

    <div class="container">
      <div class="portfolio-toolbar">
        <div class="toolbar-left">
          <div class="hint">
            <span class="hint-icon">💡</span>
            <span class="hint-text">{{ $t('portfolio.hint') }}</span>
          </div>
        </div>
        <div class="toolbar-right">
          <button
            v-for="c in categories"
            :key="c"
            class="chip"
            :class="{ active: selectedCategory === c }"
            type="button"
            @click="selectedCategory = c"
          >
            {{ getCategoryDisplayName(c) }}
          </button>
        </div>
      </div>

      <div class="project-grid">
        <article v-for="p in filteredProjects" :key="p.name" class="project-card">
          <div class="project-head">
            <div class="project-icon">{{ p.icon }}</div>
            <div class="project-title">
              <h2 class="name">{{ p.name }}</h2>
              <div class="badges">
                <span v-if="p.category" class="badge">{{ getCategoryDisplayName(p.category) }}</span>
              </div>
            </div>
          </div>

          <p class="desc">{{ getProjectDescription(p.name) }}</p>

          <ul v-if="getProjectHighlights(p.name)?.length" class="highlights">
            <li v-for="h in getProjectHighlights(p.name)" :key="h">{{ h }}</li>
          </ul>

          <div class="tags">
            <span v-for="tag in p.tags" :key="tag" class="tag">{{ getTagDisplayName(tag) }}</span>
          </div>

          <div class="actions">
            <button
              v-if="p.github"
              class="btn"
              type="button"
              @click="openUrl(p.github)"
            >
              <span>{{ $t('portfolio.github') }}</span>
              <span class="btn-icon">🐙</span>
            </button>
            <button
              v-if="p.demo"
              class="btn ghost"
              type="button"
              @click="openUrl(p.demo)"
            >
              <span>{{ $t('portfolio.demo') }}</span>
              <span class="btn-icon">🔗</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { getProjects, type Project } from '@/config/personalInfo'

const { t } = useI18n()
const selectedCategory = ref<string>('__all__')

// 使用 computed 让 projects 响应语言变化
const projects = computed(() => getProjects())

const categories = computed(() => {
  const set = new Set<string>()
  projects.value.forEach(p => {
    if (p.category) set.add(p.category)
  })
  return ['__all__', ...Array.from(set)]
})

const getCategoryDisplayName = (category: string) => {
  if (category === '__all__') {
    return t('portfolio.all')
  }
  return t(`portfolio.categories.${category}`, category)
}

const getProjectDescription = (projectName: string) => {
  const project = projects.value.find(p => p.name === projectName)
  return project?.description || ''
}

const getProjectHighlights = (projectName: string) => {
  const project = projects.value.find(p => p.name === projectName)
  return project?.highlights || []
}

const getTagDisplayName = (tag: string) => {
  return t(`tags.${tag}`, tag)
}

const filteredProjects = computed<Project[]>(() => {
  if (selectedCategory.value === '__all__') return projects.value
  return projects.value.filter(p => p.category === selectedCategory.value)
})

const openUrl = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

onMounted(() => {
  gsap.from('.project-card', {
    y: 18,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.06
  })
})
</script>

<style scoped>
.portfolio-page {
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(135deg, #fef5e7 0%, #ffeaa7 50%, #fab1a0 100%);
}

.page-header {
  text-align: center;
  padding: 4rem 2rem 2rem;
}

.page-title {
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.5rem;
  color: var(--text);
  opacity: 0.8;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.portfolio-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.hint {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 107, 157, 0.25);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  color: var(--text);
}

.hint-icon {
  font-size: 1.2rem;
}

.hint-text {
  opacity: 0.85;
  font-weight: 600;
}

.toolbar-right {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.6rem;
}

.chip {
  border: 2px solid rgba(255, 107, 157, 0.3);
  background: rgba(255, 255, 255, 0.65);
  color: var(--primary);
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 800;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
}

.chip:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 107, 157, 0.5);
  background: rgba(255, 255, 255, 0.85);
}

.chip.active {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-color: transparent;
  color: white;
  box-shadow: 0 14px 30px rgba(255, 107, 157, 0.22);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  padding: 1.8rem 1.6rem 1.5rem;
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 107, 157, 0.18);
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.project-card::before {
  content: '';
  position: absolute;
  inset: -45%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 107, 157, 0.18), transparent 55%),
    radial-gradient(circle at 70% 70%, rgba(78, 205, 196, 0.16), transparent 55%);
  transform: rotate(10deg);
  pointer-events: none;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.14);
}

.project-head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.project-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: grid;
  place-items: center;
  font-size: 1.9rem;
  box-shadow: 0 14px 30px rgba(255, 107, 157, 0.18);
  flex: 0 0 auto;
}

.project-title .name {
  font-size: 1.5rem;
  color: var(--primary);
  margin: 0 0 0.35rem;
  line-height: 1.2;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  background: rgba(78, 205, 196, 0.16);
  color: #0f766e;
  font-weight: 800;
  font-size: 0.9rem;
}

.desc {
  position: relative;
  z-index: 1;
  color: var(--text);
  opacity: 0.85;
  line-height: 1.75;
  margin-bottom: 0.9rem;
}

.highlights {
  position: relative;
  z-index: 1;
  margin: 0 0 1rem;
  padding-left: 1.1rem;
  color: var(--text);
  opacity: 0.85;
  display: grid;
  gap: 0.35rem;
}

.highlights li {
  line-height: 1.55;
}

.tags {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.1rem;
}

.tag {
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 107, 157, 0.1);
  color: var(--primary);
  font-weight: 700;
  font-size: 0.9rem;
}

.actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.1rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 800;
  font-family: inherit;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  box-shadow: 0 14px 30px rgba(255, 107, 157, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(255, 107, 157, 0.22);
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.75);
  color: var(--primary);
  border: 2px solid rgba(255, 107, 157, 0.35);
  box-shadow: none;
}

.btn.ghost:hover {
  background: rgba(255, 255, 255, 0.9);
}

.btn-icon {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .portfolio-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-right {
    justify-content: flex-start;
  }
}
</style>
