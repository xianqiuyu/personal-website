<template>
  <div v-if="modal.isOpen" class="info-modal-overlay" @click="modal.close">
    <div class="info-modal" @click.stop>
      <button class="close-btn" @click="modal.close">×</button>

      <div class="modal-title">
        <span class="title-icon">
          <WeChatIcon v-if="modal.icon === 'wechat'" />
          <QQIcon v-else-if="modal.icon === 'qq'" />
          <span v-else>ℹ️</span>
        </span>
        <h3>{{ modal.title }}</h3>
      </div>

      <div class="info-content">
        <div class="info-value">{{ modal.content }}</div>
        <button class="copy-btn" type="button" @click="copyToClipboard">
          <span>📋</span>
          <span>{{ copyBtnText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useContactInfoModalStore } from '@/stores/contactInfoModal'
import WeChatIcon from '@/components/icons/WeChatIcon.vue'
import QQIcon from '@/components/icons/QQIcon.vue'

const modal = useContactInfoModalStore()
const copyBtnText = ref('复制')

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(modal.copyText)
    copyBtnText.value = '已复制'
    setTimeout(() => {
      copyBtnText.value = '复制'
    }, 1500)
  } catch {
    // 备用方案
    const textArea = document.createElement('textarea')
    textArea.value = modal.copyText
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)

    copyBtnText.value = '已复制'
    setTimeout(() => {
      copyBtnText.value = '复制'
    }, 1500)
  }
}
</script>

<style scoped>
.info-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2600;
  backdrop-filter: blur(6px);
}

.info-modal {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  width: min(520px, 92vw);
  position: relative;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
  animation: modalIn 0.22s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(-14px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.close-btn {
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

.close-btn:hover {
  background: var(--primary);
  color: white;
  transform: rotate(90deg);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.2rem;
}

.title-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.16), rgba(78, 205, 196, 0.16));
  border: 2px solid rgba(255, 107, 157, 0.18);
}

.modal-title h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--primary);
}

.info-content {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.info-value {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text);
  padding: 0.8rem 1rem;
  background: rgba(255, 107, 157, 0.08);
  border: 2px dashed rgba(255, 107, 157, 0.25);
  border-radius: 16px;
  flex: 1;
  min-width: 220px;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

.copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(255, 107, 157, 0.25);
}

:deep(svg) {
  width: 22px;
  height: 22px;
}

@media (max-width: 768px) {
  .info-modal {
    padding: 1.6rem 1.3rem;
  }
}
</style>

