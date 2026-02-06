<template>
  <div class="portfolio-page">
    <div class="page-header">
      <h1 class="page-title">我的作品集</h1>
      <p class="page-subtitle">展示我的项目作品</p>
    </div>

    <div class="container">
      <div class="projects-grid">
        <div 
          v-for="(project, index) in projects" 
          :key="index" 
          class="project-card"
          @mouseenter="onProjectHover(index)"
          @mouseleave="onProjectLeave(index)"
        >
          <div class="project-image">
            <div class="project-placeholder">{{ project.icon }}</div>
            <div class="project-overlay">
              <div class="project-links-overlay">
                <a v-if="project.demo" :href="project.demo" target="_blank" class="project-link-btn">
                  预览 🔗
                </a>
                <a v-if="project.github" :href="project.github" target="_blank" class="project-link-btn">
                  代码 💻
                </a>
              </div>
            </div>
          </div>
          <div class="project-content">
            <h3>{{ project.name }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '@/config/personalInfo'

gsap.registerPlugin(ScrollTrigger)

const onProjectHover = (index: number) => {
  gsap.to(`.project-card:nth-child(${index + 1})`, {
    scale: 1.05,
    y: -10,
    duration: 0.3,
    ease: 'power2.out'
  })
}

const onProjectLeave = (index: number) => {
  gsap.to(`.project-card:nth-child(${index + 1})`, {
    scale: 1,
    y: 0,
    duration: 0.3,
    ease: 'power2.out'
  })
}

onMounted(() => {
  gsap.utils.toArray('.project-card').forEach((el: any) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    })
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.project-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.project-image {
  height: 250px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.project-placeholder {
  font-size: 6rem;
  z-index: 1;
  transition: transform 0.3s ease;
}

.project-card:hover .project-placeholder {
  transform: scale(1.2) rotate(10deg);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-links-overlay {
  display: flex;
  gap: 1rem;
}

.project-link-btn {
  padding: 0.8rem 1.5rem;
  background: white;
  color: var(--primary);
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.project-link-btn:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-3px);
}

.project-content {
  padding: 2rem;
}

.project-content h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.project-content p {
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 1rem;
  opacity: 0.8;
  font-size: 1.1rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.4rem 1rem;
  background: rgba(255, 107, 157, 0.1);
  color: var(--primary);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-image {
    height: 200px;
  }

  .project-placeholder {
    font-size: 4rem;
  }
}
</style>
