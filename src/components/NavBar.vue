<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <span class="logo-icon">🚀</span>
        <span class="logo-text">于贤秋的个人网站</span>
      </router-link>
      <ul class="nav-menu" :class="{ active: menuOpen }">
        <li><router-link to="/" @click="closeMenu">首页</router-link></li>
        <li><router-link to="/about" @click="closeMenu">关于我</router-link></li>
        <li><router-link to="/portfolio" @click="closeMenu">作品集</router-link></li>
        <li><router-link to="/blog" @click="closeMenu">博客</router-link></li>
        <li><router-link to="/contact" @click="closeMenu">联系</router-link></li>
      </ul>
      <button class="menu-toggle" @click="menuOpen = !menuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const menuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const closeMenu = () => {
  menuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  background: rgba(254, 245, 231, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar.scrolled {
  padding: 0.5rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  transition: transform 0.3s ease;
  text-decoration: none;
}

.logo:hover {
  transform: scale(1.1) rotate(-5deg);
}

.logo-icon {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--primary);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: var(--primary);
}

.nav-menu a:hover::after,
.nav-menu a.router-link-active::after {
  width: 100%;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: var(--primary);
  border-radius: 3px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 70px);
    background: rgba(254, 245, 231, 0.98);
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 2rem;
    transition: left 0.3s ease;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  .nav-menu.active {
    left: 0;
  }

  .menu-toggle {
    display: flex;
  }
}
</style>
