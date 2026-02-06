<template>
  <div id="app">
    <NavBar />
    <RouterView />
    <ContactInfoModal />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import ContactInfoModal from './components/ContactInfoModal.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #ff6b9d;
  --secondary: #4ecdc4;
  --accent: #ffe66d;
  --purple: #a8e6cf;
  --orange: #ff8b94;
  --bg: #fef5e7;
  --text: #2c3e50;
  --white: #ffffff;
}

body {
  font-family: 'Fredoka', 'Microsoft YaHei', sans-serif;
  background: linear-gradient(135deg, #fef5e7 0%, #ffeaa7 50%, #fab1a0 100%);
  min-height: 100vh;
  color: var(--text);
  overflow-x: hidden;
  position: relative;
}

#app {
  min-height: 100vh;
  position: relative;
}

/* 背景动画粒子 */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 107, 157, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 20%, rgba(255, 230, 109, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--bg);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--primary), var(--secondary));
  border-radius: 10px;
  border: 2px solid var(--bg);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--secondary), var(--primary));
}

/* 全局动画类 */
.fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 响应式 */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}
</style>
