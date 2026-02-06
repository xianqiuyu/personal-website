# Vercel 手动部署最新代码指南

当 GitHub 代码已更新，但 Vercel 没有自动部署时，可以使用以下方法手动触发部署。

## 方法一：在 Vercel Dashboard 手动重新部署（推荐）

### 步骤：

1. **访问 Vercel Dashboard**
   - 打开 [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - 登录你的账号

2. **选择项目**
   - 找到你的项目 `personal-website`
   - 点击进入项目详情页

3. **查看部署列表**
   - 在 **Deployments** 标签页
   - 找到最新的部署记录

4. **手动重新部署**
   - 点击最新部署右侧的 **"..."** 菜单
   - 选择 **"Redeploy"**
   - 确认重新部署

5. **或者部署特定提交**
   - 在部署列表中，找到你想要部署的提交
   - 点击该部署右侧的 **"..."** 菜单
   - 选择 **"Redeploy"**

## 方法二：创建空提交触发自动部署

如果自动部署配置正常，可以通过创建一个空提交来触发：

```bash
# 创建一个空提交
git commit --allow-empty -m "chore: 触发 Vercel 重新部署"

# 推送到 GitHub
git push origin main
```

推送后，Vercel 应该会自动检测并开始部署。

## 方法三：使用 Vercel CLI 部署

### 安装 Vercel CLI

```bash
npm install -g vercel
```

### 登录 Vercel

```bash
vercel login
```

### 部署项目

```bash
# 在项目根目录执行
vercel --prod
```

这会直接将最新代码部署到生产环境。

## 方法四：检查并修复自动部署配置

### 检查 GitHub 集成

1. 在 Vercel Dashboard 中，进入项目设置
2. 点击 **Git** 标签
3. 确认：
   - ✅ GitHub 仓库已连接
   - ✅ 正确的分支（main）
   - ✅ 自动部署已启用

### 重新连接 GitHub

如果连接有问题：

1. 进入项目设置 → **Git**
2. 点击 **Disconnect** 断开连接
3. 点击 **Connect Git Repository**
4. 重新选择你的 GitHub 仓库
5. 确认配置并保存

## 方法五：通过 GitHub Webhook 触发

### 检查 Webhook 配置

1. 在 GitHub 仓库中，进入 **Settings** → **Webhooks**
2. 确认是否有 Vercel 的 webhook
3. 如果没有，Vercel 会在你重新连接仓库时自动创建

### 手动触发 Webhook

1. 在 GitHub Webhooks 页面
2. 找到 Vercel 的 webhook
3. 点击 **Recent Deliveries**
4. 查看最近的请求记录
5. 如果有失败的请求，可以点击 **Redeliver** 重新发送

## 排查步骤

### 1. 检查部署日志

在 Vercel Dashboard 中：
- 进入项目的 **Deployments** 页面
- 查看最新的部署状态
- 如果有失败的部署，查看错误日志

### 2. 检查构建配置

确认 `vercel.json` 配置正确：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 3. 检查分支配置

确认 Vercel 监听的是正确的分支：
- Production 分支：`main`
- Preview 分支：所有其他分支

## 快速解决方案

**最快的方法**：

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击 **Deployments** 标签
4. 找到最新的部署，点击 **"..."** → **"Redeploy"**

这样会立即使用最新的 GitHub 代码重新部署。

## 预防措施

为了避免以后出现这个问题：

1. **确保自动部署已启用**
   - 项目设置 → Git → Production Branch → 确认已启用

2. **监控部署状态**
   - 在 Vercel Dashboard 中设置通知
   - 部署失败时会收到邮件通知

3. **使用 Vercel CLI 验证**
   ```bash
   vercel --prod
   ```
   这样可以确保本地构建正常

## 常见问题

### Q: 为什么自动部署没有触发？
A: 可能的原因：
- GitHub webhook 配置问题
- Vercel 和 GitHub 连接断开
- 部署配置错误

### Q: 重新部署需要多长时间？
A: 通常 1-3 分钟，取决于项目大小和构建复杂度。

### Q: 重新部署会影响网站访问吗？
A: 不会，Vercel 使用零停机部署，用户不会感受到影响。

## 总结

**推荐操作流程**：

1. ✅ 首先尝试：在 Vercel Dashboard 手动重新部署
2. ✅ 如果不行：检查 GitHub 集成配置
3. ✅ 最后手段：使用 Vercel CLI 直接部署

大多数情况下，方法一（手动重新部署）就能解决问题！
