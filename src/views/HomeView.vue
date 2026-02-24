<template>
  <div class="home">
    <!-- Hero 区域 -->
    <section id="home" class="hero" ref="heroRef">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title" ref="titleRef">
            <span class="title-line">你好，我是</span>
            <span class="title-name">{{ personalInfo.name || '你的名字' }}</span>
          </h1>
          <p class="hero-subtitle" ref="subtitleRef">
            {{ personalInfo.title || '前端工程师' }}
          </p>
          <p class="hero-description" ref="descriptionRef">
            {{ personalInfo.description || '热爱创造酷炫的交互体验，用代码让世界更美好 ✨' }}
          </p>
          <div class="hero-buttons" ref="buttonsRef">
            <router-link to="/contact" class="btn btn-primary">
              <span>联系我</span>
              <span class="btn-icon">💌</span>
            </router-link>
            <router-link to="/portfolio" class="btn btn-secondary">
              <span>查看作品</span>
              <span class="btn-icon">🎨</span>
            </router-link>
          </div>
        </div>
        <div class="hero-image" ref="imageRef">
          <div class="floating-shapes">
            <div class="shape shape-1">⭐</div>
            <div class="shape shape-2">💫</div>
            <div class="shape shape-3">✨</div>
            <div class="shape shape-4">🌟</div>
            <div class="shape shape-5">🎯</div>
          </div>
          <div class="avatar-container">
            <div class="avatar">{{ personalInfo.avatar || '👨‍💻' }}</div>
          </div>
        </div>
      </div>
      <router-link to="/about" class="scroll-indicator">
        <span>了解更多</span>
        <div class="mouse"></div>
      </router-link>
    </section>

    <!-- 关于我 -->
    <section id="about" class="about" ref="aboutRef">
      <div class="container">
        <h2 class="section-title">关于我</h2>
        <div class="about-content">
          <div class="about-card">
            <div class="card-icon">🎓</div>
            <h3>教育背景</h3>
            <p>{{ personalInfo.education || '计算机科学专业' }}</p>
          </div>
          <div class="about-card">
            <div class="card-icon">💼</div>
            <h3>工作经验</h3>
            <p>{{ personalInfo.experience || '3年+ 前端开发经验' }}</p>
          </div>
          <div class="about-card">
            <div class="card-icon">🎯</div>
            <h3>兴趣爱好</h3>
            <p>{{ personalInfo.hobbies || '编程、设计、音乐、旅行' }}</p>
          </div>
        </div>
        <div class="about-text">
          <p>{{ personalInfo.bio || '我是一名充满热情的前端工程师，专注于创造美观且功能强大的用户界面。我喜欢学习新技术，探索创新的解决方案，并将想法转化为现实。' }}</p>
        </div>
      </div>
    </section>

    <!-- 技能 -->
    <section id="skills" class="skills" ref="skillsRef">
      <div class="container">
        <h2 class="section-title">技能树</h2>
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
    </section>

    <!-- 联系方式 -->
    <section id="contact" class="contact" ref="contactRef">
      <div class="container">
        <h2 class="section-title">联系我</h2>
        <div class="contact-content">
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <a :href="`mailto:${personalInfo.email || 'your.email@example.com'}`">
                {{ personalInfo.email || 'your.email@example.com' }}
              </a>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📱</span>
              <span>{{ personalInfo.phone || '138-0000-0000' }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <span>{{ personalInfo.location || '中国' }}</span>
            </div>
          </div>
          <div class="social-links">
            <div
              v-for="(link, index) in socialLinks"
              :key="index"
              class="social-link"
              :style="{ animationDelay: `${index * 0.1}s` }"
              role="button"
              tabindex="0"
              @click="handleSocialClick(link)"
              @keydown.enter.prevent="handleSocialClick(link)"
              @keydown.space.prevent="handleSocialClick(link)"
            >
              <div class="social-icon-wrapper">
                <WeChatIcon v-if="link.icon === 'wechat'" />
                <QQIcon v-else-if="link.icon === 'qq'" />
                <span v-else class="social-icon">{{ link.icon }}</span>
              </div>
              <span class="social-name">{{ link.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2024 {{ personalInfo.name || '你的名字' }}. Made with ❤️ and Vue3</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { personalInfo as personalInfoConfig, skills as skillsConfig, socialLinks as socialLinksConfig } from '@/config/personalInfo'
import WeChatIcon from '@/components/icons/WeChatIcon.vue'
import QQIcon from '@/components/icons/QQIcon.vue'
import { useContactInfoModalStore } from '@/stores/contactInfoModal'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()

// 个人信息（从配置文件导入，可在 src/config/personalInfo.ts 中修改）
const personalInfo = ref(personalInfoConfig)
const skills = ref(skillsConfig)
const socialLinks = ref(socialLinksConfig)
const contactModal = useContactInfoModalStore()

// Refs
const heroRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const descriptionRef = ref<HTMLElement>()
const buttonsRef = ref<HTMLElement>()
const imageRef = ref<HTMLElement>()
const aboutRef = ref<HTMLElement>()
const skillsRef = ref<HTMLElement>()
const contactRef = ref<HTMLElement>()

// 滚动到指定区域（保留用于首页内部锚点）
const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleSocialClick = (link: any) => {
  if (link.name === '微信') {
    contactModal.openWeChat('yuxianqiu1995')
    return
  }
  if (link.name === 'QQ') {
    contactModal.openQQ('2535462360')
    return
  }
  if (link.url && link.url !== '#') {
    window.open(link.url, '_blank')
  }
}

// 初始化动画
onMounted(() => {

  // Hero 区域动画
  if (titleRef.value && subtitleRef.value && descriptionRef.value && buttonsRef.value && imageRef.value) {
    const tl = gsap.timeline()
    
    tl.from(titleRef.value.children, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    })
    .from(subtitleRef.value, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4')
    .from(descriptionRef.value, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    .from(buttonsRef.value.children, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.3')
    .from(imageRef.value, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)'
    }, '-=0.8')
  }

  // 浮动形状动画
  gsap.to('.shape', {
    y: 'random(-30, 30)',
    x: 'random(-30, 30)',
    rotation: 'random(-180, 180)',
    duration: 'random(2, 4)',
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.2
  })

  // 滚动触发动画
  gsap.utils.toArray('.about-card, .skill-card').forEach((el: any) => {
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

  // 技能条动画
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

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
.home {
  position: relative;
  z-index: 1;
}


/* Hero 区域 */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 2rem 2rem;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.title-line {
  display: block;
  color: var(--text);
  font-size: 2rem;
}

.title-name {
  display: block;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 4.5rem;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(20deg); }
}

.hero-subtitle {
  font-size: 2rem;
  color: var(--secondary);
  margin-bottom: 1rem;
  font-weight: 600;
}

.hero-description {
  font-size: 1.2rem;
  color: var(--text);
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.8;
}

.hero-buttons {
  display: flex;
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
  position: relative;
  overflow: hidden;
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

.hero-image {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  font-size: 3rem;
  opacity: 0.6;
}

.shape-1 { top: 10%; left: 10%; }
.shape-2 { top: 20%; right: 20%; }
.shape-3 { bottom: 30%; left: 20%; }
.shape-4 { bottom: 20%; right: 10%; }
.shape-5 { top: 50%; left: 50%; }

.avatar-container {
  position: relative;
  z-index: 1;
}

.avatar {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: float-avatar 3s ease-in-out infinite;
  border: 10px solid white;
}

@keyframes float-avatar {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text);
  opacity: 0.7;
  transition: opacity 0.3s ease;
  animation: bounce 2s infinite;
  text-decoration: none;
}

.scroll-indicator:hover {
  opacity: 1;
}

.mouse {
  width: 30px;
  height: 50px;
  border: 2px solid var(--primary);
  border-radius: 15px;
  position: relative;
}

.mouse::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 10px;
  background: var(--primary);
  border-radius: 2px;
  animation: scroll-mouse 2s infinite;
}

@keyframes scroll-mouse {
  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(15px); }
}

/* 通用容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 章节标题 */
.section-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 5px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 3px;
}

/* 关于我 */
.about {
  padding: 100px 0;
  background: rgba(255, 255, 255, 0.5);
}

.about-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.about-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.about-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 107, 157, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.5s ease;
}

.about-card:hover::before {
  animation: shine 0.5s ease;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.about-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: bounce 2s infinite;
}

.about-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.about-card p {
  color: var(--text);
  line-height: 1.6;
}

.about-text {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text);
  opacity: 0.8;
}

/* 技能 */
.skills {
  padding: 100px 0;
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

/* 联系方式 */
.contact {
  padding: 100px 0;
}

.contact-content {
  max-width: 800px;
  margin: 0 auto;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  padding: 1rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateX(10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  font-size: 2rem;
}

.contact-item a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-item a:hover {
  color: var(--secondary);
}

.social-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 20px;
  text-decoration: none;
  color: var(--text);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-link:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
}

.social-icon {
  font-size: 2.5rem;
}

.social-icon-wrapper {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
}

.social-icon-wrapper :deep(svg) {
  width: 32px;
  height: 32px;
}

.social-name {
  font-weight: 600;
}

/* 页脚 */
.footer {
  background: var(--text);
  color: white;
  text-align: center;
  padding: 2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .title-line {
    font-size: 1.5rem;
  }

  .title-name {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .avatar {
    width: 200px;
    height: 200px;
    font-size: 5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .about-content,
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .social-links {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
