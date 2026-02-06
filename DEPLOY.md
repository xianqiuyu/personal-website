# 🚀 部署指南

本指南将帮助你将个人网站部署到免费的托管平台。

## 📋 部署前准备

1. **修改个人信息**
   - 打开 `src/config/personalInfo.ts`
   - 修改所有个人信息、技能、项目等

2. **测试本地运行**
   ```bash
   npm run dev
   ```
   确保网站正常运行

3. **构建项目**
   ```bash
   npm run build
   ```
   确保构建成功，没有错误

## 🌐 部署方式

### 方式一：Vercel（推荐 ⭐）

**优点：**
- 免费且快速
- 自动 HTTPS
- 全球 CDN
- 自动部署（Git 推送后自动更新）
- 支持自定义域名

**步骤：**

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

2. **部署到 Vercel**
   - 访问 [https://vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "Add New..." → "Project"
   - 选择你的 GitHub 仓库
   - Vercel 会自动检测到 Vite 项目
   - 点击 "Deploy" 按钮
   - 等待部署完成（通常 1-2 分钟）

3. **访问你的网站**
   - 部署完成后，Vercel 会提供一个 URL（如：`your-project.vercel.app`）
   - 你可以访问这个 URL 查看你的网站

4. **自定义域名（可选）**
   - 在 Vercel 项目设置中
   - 点击 "Domains"
   - 添加你的域名
   - 按照提示配置 DNS

**项目已包含 `vercel.json` 配置文件，无需额外配置！**

---

### 方式二：Netlify

**优点：**
- 免费
- 自动 HTTPS
- 持续部署
- 支持表单处理

**步骤：**

1. **将代码推送到 GitHub**（同上）

2. **部署到 Netlify**
   - 访问 [https://www.netlify.com](https://www.netlify.com)
   - 使用 GitHub 账号登录
   - 点击 "Add new site" → "Import an existing project"
   - 选择你的 GitHub 仓库
   - 配置构建设置：
     - Build command: `npm run build`
     - Publish directory: `dist`
   - 点击 "Deploy site"

3. **访问你的网站**
   - Netlify 会提供一个 URL（如：`your-project.netlify.app`）

---

### 方式三：GitHub Pages

**优点：**
- 完全免费
- 与 GitHub 集成
- 支持自定义域名

**步骤：**

1. **安装 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **修改 package.json**
   在 `scripts` 中添加：
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

3. **修改 vite.config.ts**
   添加 `base` 配置（如果仓库名不是 `vue-learn`，请修改）：
   ```typescript
   export default defineConfig({
     base: '/vue-learn/',
     // ... 其他配置
   })
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

5. **启用 GitHub Pages**
   - 在 GitHub 仓库中
   - 进入 Settings → Pages
   - Source 选择 `gh-pages` 分支
   - 保存

6. **访问你的网站**
   - URL: `https://你的用户名.github.io/vue-learn/`

---

### 方式四：Cloudflare Pages

**优点：**
- 免费
- 全球 CDN
- 快速部署

**步骤：**

1. **将代码推送到 GitHub**

2. **部署到 Cloudflare Pages**
   - 访问 [https://pages.cloudflare.com](https://pages.cloudflare.com)
   - 使用 GitHub 账号登录
   - 点击 "Create a project"
   - 选择你的仓库
   - 构建设置：
     - Framework preset: `Vite`
     - Build command: `npm run build`
     - Build output directory: `dist`
   - 点击 "Save and Deploy"

---

## 🔄 更新网站

### Vercel / Netlify / Cloudflare Pages
- 只需推送代码到 GitHub
- 平台会自动检测并重新部署

### GitHub Pages
- 运行 `npm run deploy` 重新部署

## 📝 注意事项

1. **环境变量**：如果使用环境变量，需要在平台设置中配置
2. **路由问题**：单页应用需要配置重定向规则（Vercel 已自动配置）
3. **构建优化**：确保 `npm run build` 成功后再部署

## 🎉 完成！

部署完成后，你的个人网站就可以通过互联网访问了！

如果遇到问题，可以查看各平台的文档或提交 Issue。
