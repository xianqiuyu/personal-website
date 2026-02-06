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
          <div class="avatar-large">{{ personalInfo.avatar }}</div>
          <h2>{{ personalInfo.name }}</h2>
          <p class="title">{{ personalInfo.title }}</p>
          <p class="description">{{ personalInfo.description }}</p>
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

        <!-- 个人简介 -->
        <div class="bio-section">
          <h2>个人简介</h2>
          <p>{{ personalInfo.bio }}</p>
        </div>

        <!-- 技能展示 -->
        <div class="skills-section">
          <h2>技能树</h2>
          <div class="skills-grid">
            <div 
              v-for="(skill, index) in skills" 
              :key="index" 
              class="skill-item"
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

        <!-- 行动按钮 -->
        <div class="action-buttons">
          <router-link to="/portfolio" class="btn btn-primary">
            <span>查看作品</span>
            <span class="btn-icon">🎨</span>
          </router-link>
          <router-link to="/contact" class="btn btn-secondary">
            <span>联系我</span>
            <span class="btn-icon">💌</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { personalInfo, skills } from '@/config/personalInfo'

onMounted(() => {
  gsap.from('.intro-card', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  })

  gsap.from('.info-card', {
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 0.3
  })

  gsap.from('.skill-item', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.05,
    ease: 'power2.out',
    delay: 0.6
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
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.3rem;
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
}

.avatar-large {
  font-size: 8rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: float-avatar 3s ease-in-out infinite;
}

@keyframes float-avatar {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.intro-card h2 {
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.intro-card .title {
  font-size: 1.5rem;
  color: var(--secondary);
  margin-bottom: 1rem;
}

.intro-card .description {
  font-size: 1.2rem;
  color: var(--text);
  opacity: 0.8;
  line-height: 1.6;
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
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.info-card h3 {
  font-size: 1.5rem;
  color: var(--primary);
  margin-bottom: 1rem;
}

.info-card p {
  color: var(--text);
  line-height: 1.6;
}

.bio-section,
.skills-section {
  background: white;
  padding: 3rem;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.bio-section h2,
.skills-section h2 {
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.bio-section p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text);
  opacity: 0.8;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.skill-item {
  text-align: center;
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

.skill-item h3 {
  font-size: 1.2rem;
  color: var(--primary);
  margin-bottom: 1rem;
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

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-family: inherit;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 107, 157, 0.4);
}

.btn-secondary {
  background: white;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-secondary:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-3px);
}

.btn-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .intro-card {
    padding: 2rem;
  }

  .avatar-large {
    font-size: 5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
