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
                <span>转发到微信</span>
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

      <!-- 微信分享弹窗（二维码） -->
      <div v-if="showWeChatShare" class="wechat-share-overlay" @click="closeWeChatShare">
        <div class="wechat-share-modal" @click.stop>
          <button class="wechat-close" @click="closeWeChatShare">×</button>
          <h3 class="wechat-title">微信扫码转发</h3>
          <p class="wechat-subtitle">打开微信扫一扫，把当前页面分享给好友/朋友圈</p>

          <div class="wechat-qr">
            <div v-if="isGeneratingQr" class="wechat-qr-loading">
              <div class="spinner"></div>
              <span>生成二维码中...</span>
            </div>
            <img v-else-if="qrDataUrl" :src="qrDataUrl" alt="微信分享二维码" />
            <div v-else class="wechat-qr-error">
              <p>二维码生成失败</p>
              <button class="share-btn" @click="generateQrCode">
                <span>🔁</span>
                <span>重试</span>
              </button>
            </div>
          </div>

          <div class="wechat-actions">
            <button class="share-btn" @click="copyLink">
              <span>🔗</span>
              <span>复制链接</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from 'gsap'
import QRCode from 'qrcode'
import { getPostById, type BlogPost } from '@/config/blogPosts'

const route = useRoute()
const router = useRouter()
const post = ref<BlogPost | undefined>(undefined)

const showWeChatShare = ref(false)
const isGeneratingQr = ref(false)
const qrDataUrl = ref<string>('')

const closeWeChatShare = () => {
  showWeChatShare.value = false
}

const generateQrCode = async () => {
  isGeneratingQr.value = true
  qrDataUrl.value = ''

  try {
    qrDataUrl.value = await QRCode.toDataURL(window.location.href, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
  } catch (e) {
    qrDataUrl.value = ''
  } finally {
    isGeneratingQr.value = false
  }
}

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
    // 链接（简单支持 [text](url)）
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
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

const shareToWeChat = async () => {
  const url = window.location.href
  const title = post.value?.title ?? '分享一篇文章'

  // 优先使用系统分享（支持的浏览器会弹出分享面板，移动端体验最好）
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: '我在个人网站看到一篇不错的文章，分享给你～',
        url
      })
      return
    } catch {
      // 用户取消分享等情况，继续走二维码兜底
    }
  }

  // 兜底：展示二维码（微信扫一扫即可转发）
  showWeChatShare.value = true
  if (!qrDataUrl.value) {
    await generateQrCode()
  }
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

.wechat-share-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2500;
  backdrop-filter: blur(6px);
}

.wechat-share-modal {
  width: min(520px, 92vw);
  background: white;
  border-radius: 28px;
  padding: 2.2rem 2rem 2rem;
  position: relative;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
  animation: modalIn 0.25s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(-16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.wechat-close {
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  color: var(--text);
  font-size: 1.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
}

.wechat-close:hover {
  background: var(--primary);
  color: white;
  transform: rotate(90deg);
}

.wechat-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary);
  text-align: center;
  margin-bottom: 0.4rem;
}

.wechat-subtitle {
  text-align: center;
  color: var(--text);
  opacity: 0.75;
  margin-bottom: 1.5rem;
}

.wechat-qr {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.08), rgba(78, 205, 196, 0.08));
  border: 2px dashed rgba(255, 107, 157, 0.35);
  min-height: 280px;
}

.wechat-qr img {
  width: 260px;
  height: 260px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.wechat-qr-loading {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
  color: var(--text);
  opacity: 0.85;
  font-weight: 600;
}

.spinner {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 4px solid rgba(255, 107, 157, 0.2);
  border-top-color: var(--primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.wechat-qr-error {
  text-align: center;
  color: var(--text);
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.wechat-actions {
  margin-top: 1.4rem;
  display: flex;
  justify-content: center;
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

  .wechat-share-modal {
    padding: 1.8rem 1.4rem 1.6rem;
  }

  .wechat-qr img {
    width: 240px;
    height: 240px;
  }
}
</style>
