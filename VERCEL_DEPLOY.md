# Vercel 自动部署配置指南

本指南将帮助你配置 Vercel，实现 GitHub 推送代码后自动部署。

## 📋 前置条件

1. ✅ 代码已推送到 GitHub（已完成）
2. ✅ 项目已包含 `vercel.json` 配置文件（已完成）
3. ⏳ 需要 Vercel 账号

## 🚀 配置步骤

### 第一步：注册/登录 Vercel

1. 访问 [https://vercel.com](https://vercel.com)
2. 点击右上角的 **Sign Up** 或 **Log In**
3. 选择 **Continue with GitHub**（推荐，方便授权）

### 第二步：导入项目

1. 登录后，点击右上角的 **Add New...** → **Project**
2. 在 **Import Git Repository** 中，找到你的仓库 `xianqiuyu/personal-website`
3. 如果看不到仓库，点击 **Adjust GitHub App Permissions** 授权访问

### 第三步：配置项目

Vercel 会自动检测到这是一个 Vite 项目，配置如下：

#### 项目设置
- **Framework Preset**: Vite（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（自动检测）
- **Output Directory**: `dist`（自动检测）
- **Install Command**: `npm install`（自动检测）

#### 环境变量（如果需要）
- 如果有环境变量，在 **Environment Variables** 中添加
- 本项目暂时不需要环境变量

### 第四步：部署

1. 点击 **Deploy** 按钮
2. 等待部署完成（通常 1-2 分钟）
3. 部署成功后，Vercel 会提供一个 URL，例如：`your-project.vercel.app`

## ✅ 自动部署已配置

配置完成后，Vercel 会自动：

1. **监听 GitHub 推送**：每次你推送代码到 GitHub，Vercel 会自动检测
2. **自动构建**：运行 `npm run build` 构建项目
3. **自动部署**：将构建结果部署到生产环境
4. **生成预览**：每次 Pull Request 也会生成预览链接

## 🔍 验证自动部署

### 测试自动部署

1. 修改项目中的任意文件（比如修改 `README.md`）
2. 提交并推送到 GitHub：
   ```bash
   git add .
   git commit -m "test: 测试自动部署"
   git push origin main
   ```
3. 访问 Vercel Dashboard，你应该能看到新的部署正在运行
4. 等待部署完成，网站会自动更新

## 📊 查看部署状态

### Vercel Dashboard

1. 访问 [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. 点击你的项目
3. 在 **Deployments** 标签页可以看到所有部署记录
4. 每个部署都有：
   - 部署状态（Building、Ready、Error）
   - 部署时间
   - 关联的 Git commit
   - 预览链接

## 🎯 部署类型

### Production 部署
- 推送到 `main` 分支 → 自动部署到生产环境
- URL: `your-project.vercel.app`

### Preview 部署
- 创建 Pull Request → 自动生成预览链接
- URL: `your-project-git-branch-username.vercel.app`

## 🔧 高级配置

### 自定义域名

1. 在 Vercel Dashboard 中，进入项目设置
2. 点击 **Domains** 标签
3. 添加你的域名（如 `www.yourname.com`）
4. 按照提示配置 DNS 记录
5. 等待 DNS 生效（通常几分钟到几小时）

### 环境变量

如果需要添加环境变量：

1. 进入项目设置 → **Environment Variables**
2. 添加变量（如 `VITE_API_KEY`）
3. 选择环境（Production、Preview、Development）
4. 重新部署以应用更改

### 构建配置

如果需要自定义构建配置，可以修改 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## 📝 注意事项

1. **免费额度**：
   - 每月 100GB 带宽
   - 无限部署次数
   - 对于个人项目完全够用

2. **构建时间**：
   - 首次部署可能需要 2-3 分钟
   - 后续部署通常 1-2 分钟

3. **自动 HTTPS**：
   - Vercel 自动为所有域名配置 HTTPS
   - 无需额外配置

4. **缓存**：
   - Vercel 会自动缓存构建结果
   - 如果依赖没有变化，构建会更快

## 🐛 常见问题

### 部署失败

1. **检查构建日志**：
   - 在 Vercel Dashboard 中查看部署日志
   - 查找错误信息

2. **常见原因**：
   - 依赖安装失败 → 检查 `package.json`
   - 构建错误 → 检查代码是否有语法错误
   - 环境变量缺失 → 检查是否需要配置环境变量

### 网站没有更新

1. **清除缓存**：
   - 在浏览器中强制刷新（Ctrl+F5 或 Cmd+Shift+R）
   - 或者等待几分钟让 CDN 缓存更新

2. **检查部署状态**：
   - 确认部署已成功完成
   - 检查是否部署到了正确的分支

## 🎉 完成！

配置完成后，你的工作流程将是：

1. 本地修改代码
2. `git push` 推送到 GitHub
3. Vercel 自动检测并部署
4. 网站自动更新（1-2 分钟）

无需手动操作，完全自动化！🚀

## 📚 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#vercel)
- [GitHub Actions 集成](https://vercel.com/docs/concepts/git/github)
