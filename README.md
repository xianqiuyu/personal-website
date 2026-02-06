# 🚀 个人网站 - 卡通风个人主页

一个使用 Vue3 + TypeScript + GSAP 构建的卡通风个人网站，具有丰富的动画效果和响应式设计。

## ✨ 特性

- 🎨 **卡通风设计** - 活泼可爱的卡通风格界面
- 🎭 **丰富动画** - 使用 GSAP 实现流畅的动画效果
- 📱 **响应式设计** - 完美适配手机和电脑
- ⚡ **Vue3 + TypeScript** - 现代化的技术栈
- 🎯 **单页应用** - 流畅的滚动体验

## 🛠️ 技术栈

- Vue 3.5
- TypeScript
- GSAP (动画库)
- Vite (构建工具)
- Vue Router

## 📦 安装

```bash
# 安装依赖
npm install
```

## 🚀 开发

```bash
# 启动开发服务器
npm run dev
```

## 📝 修改个人信息

所有个人信息都在 `src/config/personalInfo.ts` 文件中，你可以直接修改：

- **个人信息**: name, title, description, avatar, education, experience, hobbies, bio, email, phone, location
- **技能**: skills 数组，可以添加或修改技能项
- **项目**: projects 数组，可以添加你的项目
- **社交链接**: socialLinks 数组，可以添加你的社交媒体链接

## 🏗️ 构建

```bash
# 构建生产版本
npm run build
```

构建后的文件在 `dist` 目录中。

## 🌐 部署

### 方式一：Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 使用 GitHub 账号登录
4. 点击 "New Project"
5. 导入你的 GitHub 仓库
6. Vercel 会自动检测到 Vite 项目并配置
7. 点击 "Deploy" 即可

项目已包含 `vercel.json` 配置文件，Vercel 会自动识别。

### 方式二：GitHub Pages

1. 安装 gh-pages: `npm install --save-dev gh-pages`
2. 在 `package.json` 中添加脚本：
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
3. 运行 `npm run deploy`
4. 在 GitHub 仓库设置中启用 GitHub Pages

### 方式三：Netlify

1. 将代码推送到 GitHub
2. 访问 [Netlify](https://www.netlify.com)
3. 使用 GitHub 账号登录
4. 点击 "New site from Git"
5. 选择你的仓库
6. 构建命令: `npm run build`
7. 发布目录: `dist`
8. 点击 "Deploy site"

## 📱 响应式断点

- 桌面: > 768px
- 移动端: ≤ 768px

## 🎨 自定义样式

主要样式在 `src/App.vue` 和 `src/views/HomeView.vue` 中，你可以修改 CSS 变量来改变主题色：

```css
:root {
  --primary: #ff6b9d;
  --secondary: #4ecdc4;
  --accent: #ffe66d;
  --purple: #a8e6cf;
  --orange: #ff8b94;
}
```

## 📄 许可证

MIT

## 🙏 致谢

感谢使用这个模板！如果对你有帮助，欢迎 Star ⭐
