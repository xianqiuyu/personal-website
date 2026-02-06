<template>
  <div class="blog-page">
    <div class="page-header">
      <h1 class="page-title">我的博客</h1>
      <p class="page-subtitle">分享技术心得与生活感悟</p>
    </div>

    <div class="container">
      <div class="blog-grid">
        <article 
          v-for="(post, index) in blogPosts" 
          :key="index" 
          class="blog-card"
          @click="viewPost(post)"
        >
          <div class="blog-image">
            <div class="blog-icon">{{ post.icon }}</div>
          </div>
          <div class="blog-content">
            <div class="blog-meta">
              <span class="blog-date">{{ post.date }}</span>
              <span class="blog-category">{{ post.category }}</span>
            </div>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <div class="blog-footer">
              <span class="read-more">阅读更多 →</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getAllPosts, type BlogPost } from '@/config/blogPosts'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const blogPosts = ref<BlogPost[]>(getAllPosts())

const viewPost = (post: BlogPost) => {
  router.push(`/blog/${post.id}`)
}

onMounted(() => {
  gsap.utils.toArray('.blog-card').forEach((el: any) => {
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
.blog-page {
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

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.blog-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.blog-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.blog-image {
  height: 200px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.blog-icon {
  font-size: 5rem;
  z-index: 1;
  transition: transform 0.3s ease;
}

.blog-card:hover .blog-icon {
  transform: scale(1.2) rotate(10deg);
}

.blog-content {
  padding: 2rem;
}

.blog-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.blog-date {
  color: var(--text);
  opacity: 0.6;
}

.blog-category {
  padding: 0.3rem 0.8rem;
  background: rgba(255, 107, 157, 0.1);
  color: var(--primary);
  border-radius: 15px;
  font-weight: 500;
}

.blog-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
  line-height: 1.4;
}

.blog-content p {
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.blog-footer {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  color: var(--primary);
  font-weight: 600;
  transition: transform 0.3s ease;
}

.blog-card:hover .read-more {
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
