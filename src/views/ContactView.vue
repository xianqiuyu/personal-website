<template>
  <div class="contact-page">
    <div class="page-header">
      <h1 class="page-title">联系我</h1>
      <p class="page-subtitle">让我们一起创造美好的事物</p>
    </div>

    <div class="container">
      <div class="contact-content">
        <!-- 联系信息 -->
        <div class="contact-info-section">
          <h2 class="section-title">联系方式</h2>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <div class="contact-details">
                <h3>邮箱</h3>
                <a :href="`mailto:${personalInfo.email}`">{{ personalInfo.email }}</a>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📱</span>
              <div class="contact-details">
                <h3>电话</h3>
                <a :href="`tel:${personalInfo.phone}`">{{ personalInfo.phone }}</a>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <div class="contact-details">
                <h3>地址</h3>
                <p>{{ personalInfo.location }}</p>
              </div>
            </div>
          </div>

          <!-- 社交链接 -->
          <div class="social-section">
            <h2 class="section-title">社交媒体</h2>
            <div class="social-links">
              <div 
                v-for="(link, index) in socialLinks" 
                :key="index"
                class="social-link"
                :style="{ animationDelay: `${index * 0.1}s` }"
                @click="handleSocialClick(link)"
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
          
          <!-- 信息提示弹窗 -->
          <div v-if="showInfoModal" class="info-modal-overlay" @click="closeInfoModal">
            <div class="info-modal" @click.stop>
              <button class="close-btn" @click="closeInfoModal">×</button>
              <h3>{{ infoModalTitle }}</h3>
              <div class="info-content">
                <div class="info-value">{{ infoModalContent }}</div>
                <button class="copy-btn" @click="copyToClipboard">
                  <span>📋</span>
                  <span>复制</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系表单 -->
        <div class="contact-form-section">
          <h2 class="section-title">发送消息</h2>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label for="name">姓名</label>
              <input 
                type="text" 
                id="name" 
                v-model="form.name" 
                required
                placeholder="请输入您的姓名"
              />
            </div>
            <div class="form-group">
              <label for="email">邮箱</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                required
                placeholder="请输入您的邮箱"
              />
            </div>
            <div class="form-group">
              <label for="subject">主题</label>
              <input 
                type="text" 
                id="subject" 
                v-model="form.subject" 
                required
                placeholder="请输入消息主题"
              />
            </div>
            <div class="form-group">
              <label for="message">消息</label>
              <textarea 
                id="message" 
                v-model="form.message" 
                required
                rows="6"
                placeholder="请输入您的消息..."
              ></textarea>
            </div>
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              <span v-if="!isSubmitting">发送消息</span>
              <span v-else>发送中...</span>
              <span class="btn-icon" v-if="!isSubmitting">📨</span>
              <span class="btn-icon" v-else>⏳</span>
            </button>
            <div v-if="submitMessage" class="submit-message" :class="{ success: isSuccess, error: !isSuccess }">
              {{ submitMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import emailjs from '@emailjs/browser'
import { personalInfo, socialLinks } from '@/config/personalInfo'
import WeChatIcon from '@/components/icons/WeChatIcon.vue'
import QQIcon from '@/components/icons/QQIcon.vue'

gsap.registerPlugin(ScrollTrigger)

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const isSuccess = ref(false)

// 信息弹窗
const showInfoModal = ref(false)
const infoModalTitle = ref('')
const infoModalContent = ref('')
const currentCopyText = ref('')

// EmailJS 配置
// 注意：需要在 https://www.emailjs.com/ 注册并获取以下配置
// 1. 创建服务（Service）并获取 SERVICE_ID
// 2. 创建邮件模板（Template）并获取 TEMPLATE_ID
// 3. 获取 Public Key (PUBLIC_KEY)
// 然后将这些值替换到下面的配置中

const EMAILJS_CONFIG = {
  serviceId: 'service_default', // 替换为你的 Service ID
  templateId: 'template_default', // 替换为你的 Template ID
  publicKey: 'your_public_key' // 替换为你的 Public Key
}

// 初始化 EmailJS（如果已配置 publicKey）
onMounted(() => {
  if (EMAILJS_CONFIG.publicKey !== 'your_public_key') {
    emailjs.init(EMAILJS_CONFIG.publicKey)
  }
})

const handleSubmit = async () => {
  // 验证表单
  if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
    submitMessage.value = '请填写所有必填字段'
    isSuccess.value = false
    setTimeout(() => {
      submitMessage.value = ''
    }, 3000)
    return
  }

  isSubmitting.value = true
  submitMessage.value = ''

  try {
    // 如果 EmailJS 已配置，使用 EmailJS 发送
    if (EMAILJS_CONFIG.publicKey !== 'your_public_key') {
      const templateParams = {
        from_name: form.value.name,
        from_email: form.value.email,
        subject: form.value.subject,
        message: form.value.message,
        to_email: personalInfo.email, // 接收邮件的地址
        reply_to: form.value.email
      }

      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      )

      submitMessage.value = '消息发送成功！我会尽快回复您。'
      isSuccess.value = true
    } else {
      // 如果未配置 EmailJS，使用 mailto 作为备用方案
      const mailtoLink = `mailto:${personalInfo.email}?subject=${encodeURIComponent(form.value.subject)}&body=${encodeURIComponent(`姓名: ${form.value.name}\n邮箱: ${form.value.email}\n\n${form.value.message}`)}`
      window.location.href = mailtoLink
      
      submitMessage.value = '正在打开邮件客户端...'
      isSuccess.value = true
    }

    // 重置表单
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    // 3秒后清除成功消息
    setTimeout(() => {
      submitMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error('发送邮件失败:', error)
    submitMessage.value = '发送失败，请稍后重试或直接发送邮件到 ' + personalInfo.email
    isSuccess.value = false
    
    // 5秒后清除错误消息
    setTimeout(() => {
      submitMessage.value = ''
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}

// 处理社交链接点击
const handleSocialClick = (link: any) => {
  if (link.name === '微信') {
    infoModalTitle.value = '微信号'
    infoModalContent.value = 'yuxianqiu1995'
    currentCopyText.value = 'yuxianqiu1995'
    showInfoModal.value = true
  } else if (link.name === 'QQ') {
    infoModalTitle.value = 'QQ号'
    infoModalContent.value = '2535462360'
    currentCopyText.value = '2535462360'
    showInfoModal.value = true
  } else if (link.url && link.url !== '#') {
    window.open(link.url, '_blank')
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(currentCopyText.value)
    // 临时修改按钮文本
    const copyBtn = document.querySelector('.copy-btn')
    if (copyBtn) {
      const originalText = copyBtn.innerHTML
      copyBtn.innerHTML = '<span>✓</span><span>已复制</span>'
      setTimeout(() => {
        copyBtn.innerHTML = originalText
      }, 2000)
    }
  } catch (error) {
    console.error('复制失败:', error)
    // 备用方案
    const textArea = document.createElement('textarea')
    textArea.value = currentCopyText.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    const copyBtn = document.querySelector('.copy-btn')
    if (copyBtn) {
      const originalText = copyBtn.innerHTML
      copyBtn.innerHTML = '<span>✓</span><span>已复制</span>'
      setTimeout(() => {
        copyBtn.innerHTML = originalText
      }, 2000)
    }
  }
}

// 关闭信息弹窗
const closeInfoModal = () => {
  showInfoModal.value = false
  infoModalTitle.value = ''
  infoModalContent.value = ''
  currentCopyText.value = ''
}

onMounted(() => {
  gsap.utils.toArray('.contact-item, .social-link').forEach((el: any) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      x: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    })
  })
})
</script>

<style scoped>
.contact-page {
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

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--primary);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateX(10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.contact-details h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.contact-details a,
.contact-details p {
  color: var(--text);
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.contact-details a:hover {
  color: var(--primary);
}

.social-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.social-icon-wrapper {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon {
  font-size: 2.5rem;
}

.social-name {
  font-weight: 600;
}

.contact-form-section {
  background: white;
  padding: 2.5rem;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--text);
  font-size: 1rem;
}

.form-group input,
.form-group textarea {
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
}

.submit-btn {
  padding: 1.2rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
  transition: all 0.3s ease;
  font-family: inherit;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 107, 157, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.2rem;
}

.submit-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}

.submit-message.success {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border: 2px solid #4caf50;
}

.submit-message.error {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 2px solid #f44336;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 信息弹窗样式 */
.info-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(5px);
}

.info-modal {
  background: white;
  border-radius: 30px;
  padding: 2.5rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 35px;
  height: 35px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
  transition: all 0.3s ease;
  line-height: 1;
}

.close-btn:hover {
  background: var(--primary);
  color: white;
  transform: rotate(90deg);
}

.info-modal h3 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--primary);
  text-align: center;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.info-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(78, 205, 196, 0.1));
  border-radius: 15px;
  border: 2px dashed var(--primary);
  word-break: break-all;
  text-align: center;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.copy-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 107, 157, 0.3);
}

.copy-btn span:first-child {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .contact-content {
    grid-template-columns: 1fr;
  }

  .social-links {
    grid-template-columns: 1fr;
  }
}
</style>
