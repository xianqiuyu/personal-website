# 本地评论功能数据库配置（Neon）

本项目的评论接口在生产环境运行于 Vercel 的 Serverless Functions：`/api/comments`。

在本地使用 `npm run dev` 时，`vite dev server` 会通过中间件模拟该接口，但需要你在本地提供数据库连接串。

## 1. 创建本地环境变量文件

在项目根目录新建文件：`.env.local`（不要提交到 Git）。

写入：

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

其中 `DATABASE_URL` 直接使用 Neon 控制台提供的 **Recommended for most uses** 连接串即可。

## 2. 重启本地开发服务

```bash
npm run dev
```

然后打开：`http://localhost:5173/footprints` 测试评论读取/写入。

## 3. 常见问题

- 如果控制台出现 `Unexpected end of JSON input` 或类似 JSON 解析错误：通常是 `vite dev` 还在返回静态文件而不是接口响应，请确保你已经拉取最新代码并重启了 dev 服务。
- 如果页面提示 `本地未配置 DATABASE_URL`：说明 `.env.local` 未创建或未正确填写。

