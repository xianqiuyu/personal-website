<template>
  <div class="portfolio-page">
    <div class="page-header">
      <h1 class="page-title">我的作品集</h1>
      <p class="page-subtitle">暂未公开 · 敬请期待</p>
    </div>

    <div class="container">
      <div class="hidden-wrap">
        <div class="hidden-card">
          <div class="hidden-badge">🔒</div>
          <h2 class="hidden-title">作品集内容已暂时隐藏</h2>
          <p class="hidden-desc">
            目前处于整理与优化阶段，后续会逐步公开更完整、更酷炫的项目展示。
          </p>
          <div class="hidden-actions">
            <router-link class="hidden-btn" to="/contact">联系我</router-link>
            <router-link class="hidden-btn ghost" to="/">返回首页</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'

onMounted(() => {
  gsap.from('.hidden-card', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  })

  gsap.from('.hidden-badge', {
    scale: 0,
    rotation: -180,
    duration: 1,
    ease: 'back.out(1.7)',
    delay: 0.1
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

.hidden-wrap {
  display: flex;
  justify-content: center;
}

.hidden-card {
  width: min(760px, 100%);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 28px;
  padding: 3rem 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  border: 2px dashed rgba(255, 107, 157, 0.35);
  position: relative;
  overflow: hidden;
}

.hidden-card::before {
  content: '';
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 107, 157, 0.22), transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(78, 205, 196, 0.22), transparent 55%);
  transform: rotate(8deg);
  pointer-events: none;
}

.hidden-badge {
  width: 86px;
  height: 86px;
  border-radius: 26px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: grid;
  place-items: center;
  font-size: 2.6rem;
  box-shadow: 0 14px 30px rgba(255, 107, 157, 0.25);
  position: relative;
  z-index: 1;
  margin: 0 auto 1.4rem;
}

.hidden-title {
  position: relative;
  z-index: 1;
  text-align: center;
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 0.8rem;
}

.hidden-desc {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--text);
  opacity: 0.8;
  font-size: 1.1rem;
  line-height: 1.8;
  margin: 0 auto 1.8rem;
  max-width: 40rem;
}

.hidden-actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hidden-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 1.6rem;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 12px 25px rgba(255, 107, 157, 0.22);
}

.hidden-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 35px rgba(255, 107, 157, 0.26);
}

.hidden-btn.ghost {
  background: rgba(255, 255, 255, 0.6);
  color: var(--primary);
  border: 2px solid rgba(255, 107, 157, 0.35);
  box-shadow: none;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .hidden-card {
    padding: 2.2rem 1.6rem;
  }

  .hidden-title {
    font-size: 1.6rem;
  }
}
</style>
