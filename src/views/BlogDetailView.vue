<template>
  <div class="blog-detail-page">
    <div class="container">
      <router-link to="/blog" class="back-link">
        <span class="back-icon">←</span>
        <span>返回博客列表</span>
      </router-link>

      <article v-if="post" class="blog-article">
        <!-- 文章头部 -->
        <header class="article-header">
          <div class="article-meta">
            <span class="article-category">{{ post.category }}</span>
            <span class="article-date">{{ formatDate(post.date) }}</span>
            <span class="article-read-time">{{ post.readTime }}</span>
          </div>
          <h1 class="article-title">{{ post.title }}</h1>
          <div class="article-author">
            <span class="author-icon">👤</span>
            <span>{{ post.author }}</span>
          </div>
        </header>

        <!-- 文章图标 -->
        <div class="article-icon">
          <div class="icon-wrapper">{{ post.icon }}</div>
        </div>

        <!-- 文章标签 -->
        <div class="article-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <!-- 文章内容 -->
        <div class="article-content" v-html="formatContent(post.content)"></div>

        <!-- 文章底部 -->
        <footer class="article-footer">
          <div class="share-section">
            <h3>分享这篇文章</h3>
            <div class="share-buttons">
              <button class="share-btn" @click="shareToWeChat">
                <span>💬</span>
                <span>微信</span>
              </button>
              <button class="share-btn" @click="copyLink">
                <span>🔗</span>
                <span>复制链接</span>
              </button>
            </div>
          </div>
        </footer>
      </article>

      <div v-else class="not-found">
        <h2>文章未找到</h2>
        <router-link to="/blog" class="back-to-blog">返回博客列表</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { getPostById, type BlogPost } from '@/config/blogPosts'

const route = useRoute()
const router = useRouter()
const post = ref<BlogPost | undefined>(undefined)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatContent = (content: string) => {
  // 将 Markdown 格式转换为 HTML
  let html = content
    // 代码块
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`
    })
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 标题
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 列表
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    // 段落
    .split('\n\n')
    .map(para => {
      if (para.trim() && !para.match(/^<[h|u|o|l|p]/)) {
        return `<p>${para.trim()}</p>`
      }
      return para
    })
    .join('')
    // 列表包装
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

  return html
}

const escapeHtml = (text: string) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const shareToWeChat = () => {
  alert('请使用微信扫一扫分享')
}

const copyLink = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    alert('链接已复制到剪贴板！')
  })
}

onMounted(() => {
  const postId = route.params.id as string
  post.value = getPostById(postId)

  if (!post.value) {
    // 如果文章不存在，3秒后跳转回博客列表
    setTimeout(() => {
      router.push('/blog')
    }, 3000)
    return
  }

  // 动画效果
  gsap.from('.article-header', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  })

  gsap.from('.article-icon', {
    scale: 0,
    rotation: -180,
    duration: 1,
    ease: 'back.out(1.7)',
    delay: 0.2
  })

  gsap.from('.article-content', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    delay: 0.4
  })

  // 代码高亮（可以集成 highlight.js）
  highlightCode()
})

const highlightCode = () => {
  // 简单的代码高亮处理
  const codeBlocks = document.querySelectorAll('pre code')
  codeBlocks.forEach(block => {
    block.classList.add('code-block')
  })
}
</script>

<style scoped>
.blog-detail-page {
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 4rem;
  background: linear-gradient(135deg, #fef5e7 0%, #ffeaa7 50%, #fab1a0 100%);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 2rem;
  transition: transform 0.3s ease;
}

.back-link:hover {
  transform: translateX(-5px);
}

.back-icon {
  font-size: 1.5rem;
}

.blog-article {
  background: white;
  border-radius: 30px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.article-header {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.article-category {
  padding: 0.4rem 1rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.article-date,
.article-read-time {
  color: var(--text);
  opacity: 0.6;
  font-size: 0.9rem;
}

.article-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 1.5rem 0;
  line-height: 1.2;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
  opacity: 0.7;
  font-size: 1.1rem;
}

.author-icon {
  font-size: 1.5rem;
}

.article-icon {
  text-align: center;
  margin: 2rem 0;
}

.icon-wrapper {
  display: inline-block;
  font-size: 6rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  animation: float-icon 3s ease-in-out infinite;
}

@keyframes float-icon {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.4rem 1rem;
  background: rgba(255, 107, 157, 0.1);
  color: var(--primary);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text);
}

.article-content :deep(h1) {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  color: var(--primary);
}

.article-content :deep(h2) {
  font-size: 2rem;
  font-weight: 700;
  margin: 1.5rem 0 1rem;
  color: var(--primary);
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.article-content :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
  color: var(--secondary);
}

.article-content :deep(p) {
  margin-bottom: 1.5rem;
  text-align: justify;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin: 1.5rem 0;
  padding-left: 2rem;
}

.article-content :deep(li) {
  margin-bottom: 0.8rem;
  line-height: 1.6;
}

.article-content :deep(code) {
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  color: var(--primary);
}

.article-content :deep(pre) {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1.5rem;
  border-radius: 10px;
  overflow-x: auto;
  margin: 2rem 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
  font-size: 0.9rem;
  line-height: 1.6;
}

.article-content :deep(strong) {
  font-weight: 700;
  color: var(--primary);
}

.article-content :deep(blockquote) {
  border-left: 4px solid var(--primary);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--text);
  opacity: 0.8;
}

.article-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.share-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.share-buttons {
  display: flex;
  gap: 1rem;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: white;
  border: 2px solid var(--primary);
  border-radius: 25px;
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-size: 1rem;
}

.share-btn:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 107, 157, 0.3);
}

.share-btn span:first-child {
  font-size: 1.2rem;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.not-found h2 {
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 2rem;
}

.back-to-blog {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.back-to-blog:hover {
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .blog-detail-page {
    padding-top: 80px;
  }

  .blog-article {
    padding: 2rem 1.5rem;
  }

  .article-title {
    font-size: 2rem;
  }

  .article-content {
    font-size: 1rem;
  }

  .article-content :deep(h1) {
    font-size: 1.8rem;
  }

  .article-content :deep(h2) {
    font-size: 1.5rem;
  }

  .article-content :deep(h3) {
    font-size: 1.2rem;
  }

  .icon-wrapper {
    font-size: 4rem;
    padding: 1.5rem;
  }

  .share-buttons {
    flex-direction: column;
  }
}
</style>
