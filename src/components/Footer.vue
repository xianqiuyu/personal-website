<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>{{ displayName }}</h3>
        <p>{{ $t('personal.title') }}</p>
        <p>{{ $t('personal.description') }}</p>
      </div>
      <div class="footer-section">
        <h4>{{ $t('footer.quickLinks') }}</h4>
        <ul>
          <li><router-link to="/">{{ $t('nav.home') }}</router-link></li>
          <li><router-link to="/about">{{ $t('nav.about') }}</router-link></li>
          <li><router-link to="/portfolio">{{ $t('nav.portfolio') }}</router-link></li>
          <li><router-link to="/blog">{{ $t('nav.blog') }}</router-link></li>
          <li><router-link to="/contact">{{ $t('nav.contact') }}</router-link></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>{{ $t('footer.contactInfo') }}</h4>
        <p>📧 {{ personalInfo.email }}</p>
        <p>📱 {{ personalInfo.phone }}</p>
        <p>📍 {{ $t('personal.location') }}</p>
        <button class="wechat-share-btn" type="button" @click="shareToWeChat">
          <span>💬</span>
          <span>{{ $t('footer.shareToWeChat') }}</span>
        </button>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© {{ new Date().getFullYear() }} {{ displayName }}. {{ $t('footer.madeWith') }}</p>
    </div>

    <!-- 微信分享弹窗（二维码） -->
    <div v-if="showWeChatShare" class="wechat-share-overlay" @click="closeWeChatShare">
      <div class="wechat-share-modal" @click.stop>
        <button class="wechat-close" @click="closeWeChatShare">×</button>
        <h3 class="wechat-title">{{ $t('footer.wechatShareTitle') }}</h3>
        <p class="wechat-subtitle">{{ $t('footer.wechatShareSubtitle') }}</p>

        <div class="wechat-qr">
          <div v-if="isGeneratingQr" class="wechat-qr-loading">
            <div class="spinner"></div>
            <span>{{ $t('footer.generatingQr') }}</span>
          </div>
          <img v-else-if="qrDataUrl" :src="qrDataUrl" :alt="$t('blog.wechatQrAlt')" />
          <div v-else class="wechat-qr-error">
            <p>{{ $t('footer.qrGenerateFailed') }}</p>
            <button class="wechat-share-btn" type="button" @click="generateQrCode">{{ $t('footer.retry') }}</button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'
import { personalInfo } from '@/config/personalInfo'

const { t, locale } = useI18n()

const showWeChatShare = ref(false)
const isGeneratingQr = ref(false)
const qrDataUrl = ref<string>('')

const displayName = computed(() => {
  if (locale.value === 'zh') {
    return personalInfo.nickname ? `${personalInfo.nickname}（${personalInfo.name}）` : personalInfo.name
  } else {
    return personalInfo.nickname || personalInfo.name
  }
})

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
      width: 280,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
  } catch {
    qrDataUrl.value = ''
  } finally {
    isGeneratingQr.value = false
  }
}

const shareToWeChat = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title || t('blog.shareArticle'),
        text: t('blog.shareText'),
        url: window.location.href
      })
      return
    } catch {
      // ignore
    }
  }

  showWeChatShare.value = true
  if (!qrDataUrl.value) {
    await generateQrCode()
  }
}
</script>

<style scoped>
.footer {
  background: var(--text);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: var(--primary);
}

.footer-section p {
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.wechat-share-btn {
  margin-top: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  font-family: inherit;
}

.wechat-share-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 107, 157, 0.6);
}

.wechat-share-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
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
  color: #111827;
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
  color: #111827;
  opacity: 0.75;
  margin-bottom: 1.2rem;
}

.wechat-qr {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.08), rgba(78, 205, 196, 0.08));
  border: 2px dashed rgba(255, 107, 157, 0.35);
  min-height: 260px;
}

.wechat-qr img {
  width: 240px;
  height: 240px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.wechat-qr-loading {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
  color: #111827;
  opacity: 0.85;
  font-weight: 700;
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
  color: #111827;
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: white;
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.footer-section ul li a:hover {
  opacity: 1;
  color: var(--primary);
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }

  .wechat-share-modal {
    padding: 1.8rem 1.4rem 1.6rem;
  }
}
</style>
