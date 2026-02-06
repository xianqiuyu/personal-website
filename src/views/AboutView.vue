<template>
  <div class="about-page">
    <div class="page-header">
      <h1 class="page-title">关于我</h1>
      <p class="page-subtitle">了解更多关于我的信息</p>
    </div>

    <div class="container">
      <div class="about-content">
        <!-- 个人简介卡片 -->
        <div class="intro-card">
          <div class="avatar-large">
            <div class="avatar">{{ personalInfo.avatar }}</div>
          </div>
          <h2>{{ personalInfo.name }}</h2>
          <p class="title">{{ personalInfo.title }}</p>
          <p class="description">{{ personalInfo.bio }}</p>
        </div>

        <!-- 详细信息 -->
        <div class="info-grid">
          <div class="info-card">
            <div class="card-icon">🎓</div>
            <h3>教育背景</h3>
            <p>{{ personalInfo.education }}</p>
          </div>

          <div class="info-card">
            <div class="card-icon">💼</div>
            <h3>工作经验</h3>
            <p>{{ personalInfo.experience }}</p>
          </div>

          <div class="info-card">
            <div class="card-icon">📍</div>
            <h3>所在地</h3>
            <p>{{ personalInfo.location }}</p>
          </div>

          <div class="info-card">
            <div class="card-icon">🎯</div>
            <h3>兴趣爱好</h3>
            <p>{{ personalInfo.hobbies }}</p>
          </div>
        </div>

        <!-- 技能展示 -->
        <div class="skills-section">
          <h2 class="section-title">我的技能</h2>
          <div class="skills-grid">
            <div 
              v-for="(skill, index) in skills" 
              :key="index" 
              class="skill-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="skill-icon">{{ skill.icon }}</div>
              <h3>{{ skill.name }}</h3>
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: skill.level + '%' }"></div>
              </div>
              <p class="skill-level">{{ skill.level }}%</p>
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
import { personalInfo, skills } from '@/config/personalInfo'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  gsap.utils.toArray('.info-card, .skill-card').forEach((el: any) => {
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

  gsap.utils.toArray('.skill-progress').forEach((el: any) => {
    const width = el.style.width
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      width: 0,
      duration: 1.5,
      ease: 'power2.out'
    })
  })
})
</script>

<style scoped>
.about-page {
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

.about-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.intro-card {
  background: white;
  padding: 3rem;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.avatar-large {
  margin-bottom: 2rem;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  border: 8px solid white;
  animation: float-avatar 3s ease-in-out infinite;
}

@keyframes float-avatar {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.intro-card h2 {
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.intro-card .title {
  font-size: 1.5rem;
  color: var(--secondary);
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.intro-card .description {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text);
  opacity: 0.8;
  max-width: 800px;
  margin: 0 auto;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: bounce 2s infinite;
}

.info-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.info-card p {
  color: var(--text);
  line-height: 1.6;
  font-size: 1.1rem;
}

.skills-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.skill-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-align: center;
}

.skill-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.skill-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.skill-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.skill-bar {
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 1rem 0;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 10px;
  transition: width 1.5s ease;
}

.skill-level {
  font-weight: 600;
  color: var(--text);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .page-subtitle {
    font-size: 1.2rem;
  }

  .intro-card {
    padding: 2rem 1.5rem;
  }

  .avatar {
    width: 120px;
    height: 120px;
    font-size: 4rem;
  }

  .info-grid,
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
