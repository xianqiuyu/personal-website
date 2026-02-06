<template>
  <div class="footprints-page">
    <div class="page-header">
      <h1 class="page-title">足迹</h1>
      <p class="page-subtitle">记录我走过的路、做过的事、一些瞬间</p>
    </div>

    <div class="container">
      <section class="timeline">
        <div class="timeline-item" v-for="(it, idx) in footprints" :key="idx">
          <div class="dot"></div>
          <div class="card">
            <div class="meta">
              <span class="tag">{{ it.tag }}</span>
              <span class="date">{{ it.date }}</span>
            </div>
            <h3 class="title">{{ it.title }}</h3>
            <p class="desc">{{ it.desc }}</p>
          </div>
        </div>
      </section>

      <CommentsSection page="footprints" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import CommentsSection from '@/components/comments/CommentsSection.vue'

const footprints = [
  { date: '2026-02', tag: '学习', title: '把个人站从 0 到 1 做上线', desc: '从动画、路由到部署，把体验打磨得更顺滑，也把内容体系搭起来。' },
  { date: '2025-12', tag: '成长', title: '重构一个老项目的前端架构', desc: '把边界拆清楚：组件/状态/接口，配上自动化检查与更稳的发布流程。' },
  { date: '2025-08', tag: '生活', title: '一次旅行带来的灵感', desc: '看见真实世界的色彩和节奏，回到代码里更愿意做“有温度”的交互。' },
]

onMounted(() => {
  gsap.from('.timeline-item', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out',
  })
})
</script>

<style scoped>
.footprints-page {
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
  max-width: 980px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.timeline {
  position: relative;
  margin-top: 0.5rem;
  padding-left: 1.2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0.25rem;
  top: 0;
  bottom: 0;
  width: 6px;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--primary), var(--secondary));
  opacity: 0.45;
}

.timeline-item {
  position: relative;
  padding: 0.8rem 0 0.8rem 1.6rem;
}

.dot {
  position: absolute;
  left: 0.05rem;
  top: 1.2rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  box-shadow: 0 10px 25px rgba(255, 107, 157, 0.25);
}

.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 22px;
  padding: 1.4rem 1.5rem;
  border: 2px solid rgba(255, 107, 157, 0.12);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.6rem;
}

.tag {
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 107, 157, 0.12);
  color: var(--primary);
  font-weight: 800;
  font-size: 0.9rem;
}

.date {
  opacity: 0.7;
  font-weight: 700;
}

.title {
  margin: 0 0 0.5rem;
  color: var(--text);
  font-size: 1.35rem;
}

.desc {
  margin: 0;
  opacity: 0.82;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.6rem;
  }
  .container {
    padding: 0 1.4rem 3rem;
  }
}
</style>

