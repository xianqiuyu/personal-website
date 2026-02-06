import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { neon } from '@neondatabase/serverless'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 让本地 dev server 也能读到 DATABASE_URL（从 .env/.env.local 等加载）
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }

  return {
    plugins: [
      // 本地开发：拦截 /api/comments，返回 JSON（否则会被 Vite 当成静态模块文件）
      {
        name: 'local-comments-api',
        configureServer(server) {
          const middleware = (req: any, res: any, next: any) => {
            if (!req.url || !req.url.startsWith('/api/comments')) return next()

            const databaseUrl =
              process.env.DATABASE_URL ||
              process.env.POSTGRES_URL ||
              process.env.POSTGRES_PRISMA_URL ||
              process.env.POSTGRES_URL_NON_POOLING ||
              process.env.NEON_DATABASE_URL

            const send = (status: number, body: unknown) => {
              res.statusCode = status
              res.setHeader('Content-Type', 'application/json; charset=utf-8')
              res.end(JSON.stringify(body))
            }

            if (!databaseUrl) {
              return send(500, { ok: false, error: '本地未配置 DATABASE_URL（请在 .env.local 写入 Neon 连接串）' })
            }

            const sql = neon(databaseUrl)

            const ensureTable = async () => {
              await sql`
                CREATE TABLE IF NOT EXISTS public_comments (
                  id BIGSERIAL PRIMARY KEY,
                  page VARCHAR(64) NOT NULL,
                  name VARCHAR(20) NOT NULL,
                  content TEXT NOT NULL,
                  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                  ip TEXT,
                  user_agent TEXT
                );
              `
              await sql`CREATE INDEX IF NOT EXISTS idx_public_comments_page_created ON public_comments(page, created_at DESC);`
            }

            const run = async () => {
              await ensureTable()

              if (req.method === 'GET') {
                const url = new URL(req.url, 'http://localhost')
                const page = (url.searchParams.get('page') || '').trim()
                if (!page || page.length > 64) return send(400, { ok: false, error: 'page 参数缺失或过长' })

                const rows = await sql`
                  SELECT id, page, name, content, created_at
                  FROM public_comments
                  WHERE page = ${page}
                  ORDER BY created_at DESC
                  LIMIT 50;
                `
                return send(200, { ok: true, comments: rows })
              }

              if (req.method === 'POST') {
                let body = ''
                req.on('data', (chunk: any) => {
                  body += chunk
                  if (body.length > 1024 * 1024) req.destroy()
                })
                req.on('end', async () => {
                  let data
                  try {
                    data = JSON.parse(body || '{}')
                  } catch {
                    return send(400, { ok: false, error: 'JSON 格式不正确' })
                  }

                  const page = String(data.page || '').trim()
                  const name = String(data.name || '匿名').trim()
                  const content = String(data.content || '').trim()

                  if (!page || page.length > 64) return send(400, { ok: false, error: 'page 参数缺失或过长' })
                  if (!content) return send(400, { ok: false, error: '评论内容不能为空' })
                  if (name.length === 0 || name.length > 20) return send(400, { ok: false, error: '昵称长度需 1-20' })
                  if (content.length > 800) return send(400, { ok: false, error: '评论内容最多 800 字' })

                  const userAgent = String(req.headers['user-agent'] || '')

                  const inserted = await sql`
                    INSERT INTO public_comments (page, name, content, user_agent)
                    VALUES (${page}, ${name}, ${content}, ${userAgent})
                    RETURNING id, page, name, content, created_at;
                  `
                  return send(200, { ok: true, comment: inserted[0] })
                })
                return
              }

              res.setHeader('Allow', 'GET, POST')
              return send(405, { ok: false, error: 'Method Not Allowed' })
            }

            run().catch(() => send(500, { ok: false, error: '本地 API 异常' }))
          }

          // 插到最前，确保先于静态资源命中
          server.middlewares.stack.unshift({ route: '', handle: middleware })
        },
      },
      vue(),
      vueJsx(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
