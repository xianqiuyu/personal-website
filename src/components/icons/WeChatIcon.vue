<template>
  <img
    :src="wechatIconUrl"
    alt="微信"
    class="wechat-icon"
    @error="handleImageError"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const imageError = ref(false)

// 使用多个备用URL，确保图标能正常显示
const wechatIconUrl = ref('https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png')

const handleImageError = () => {
  // 如果第一个URL失败，尝试备用URL
  if (!imageError.value) {
    imageError.value = true
    wechatIconUrl.value = 'https://www.wechat.com/favicon.ico'
  }
}
</script>

<style scoped>
.wechat-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}
</style>
