<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>于贤秋</h3>
        <p>前端工程师</p>
        <p>热爱创造酷炫的交互体验</p>
      </div>
      <div class="footer-section">
        <h4>快速链接</h4>
        <ul>
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/about">关于我</router-link></li>
          <li><router-link to="/portfolio">作品集</router-link></li>
          <li><router-link to="/blog">博客</router-link></li>
          <li><router-link to="/contact">联系</router-link></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>联系方式</h4>
        <p>📧 {{ personalInfo.email }}</p>
        <p>📱 {{ personalInfo.phone }}</p>
        <p>📍 {{ personalInfo.location }}</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2024 于贤秋. Made with ❤️ and Vue3</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { personalInfo } from '@/config/personalInfo'
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
}
</style>
