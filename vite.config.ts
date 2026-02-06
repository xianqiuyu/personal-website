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
          const middleware = (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse, next: () => void) => {
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
                  user_agent TEXT,
                  anon_user_id VARCHAR(64)
                );
              `
              await sql`ALTER TABLE public_comments ADD COLUMN IF NOT EXISTS anon_user_id VARCHAR(64);`
              await sql`CREATE INDEX IF NOT EXISTS idx_public_comments_page_created ON public_comments(page, created_at DESC);`
            }

            const run = async () => {
              await ensureTable()

              const url = new URL(req.url || '/api/comments', 'http://localhost')
              const pathname = url.pathname || '/api/comments'
              const idMatch = pathname.match(/^\/api\/comments\/(\d+)/)
              const commentId = idMatch ? Number(idMatch[1]) : null

              if (req.method === 'GET') {
                const page = (url.searchParams.get('page') || '').trim()
                const anonUserId = (url.searchParams.get('anonUserId') || '').trim()
                if (!page || page.length > 64) return send(400, { ok: false, error: 'page 参数缺失或过长' })

                const rows = await sql`
                  SELECT
                    id,
                    page,
                    name,
                    content,
                    created_at,
                    CASE WHEN anon_user_id = ${anonUserId} THEN true ELSE false END AS "isMine"
                  FROM public_comments
                  WHERE page = ${page}
                  ORDER BY created_at DESC
                  LIMIT 50;
                `
                return send(200, { ok: true, comments: rows })
              }

              const collectBody = () =>
                new Promise<Record<string, unknown>>((resolve, reject) => {
                  let body = ''
                  req.on('data', (chunk: Buffer) => {
                    body += chunk
                    if (body.length > 1024 * 1024) {
                      req.destroy()
                      reject(new Error('请求体过大'))
                    }
                  })
                  req.on('end', () => {
                    try {
                      resolve(JSON.parse(body || '{}'))
                    } catch {
                      reject(new Error('JSON 格式不正确'))
                    }
                  })
                  req.on('error', reject)
                })

              if (req.method === 'POST') {
                try {
                  const data = await collectBody()
                  const page = String(data.page || '').trim()
                  const name = String(data.name || '匿名').trim()
                  const content = String(data.content || '').trim()
                  const anonUserId = String(data.anonUserId || '').trim()

                  if (!page || page.length > 64) return send(400, { ok: false, error: 'page 参数缺失或过长' })
                  if (!content) return send(400, { ok: false, error: '评论内容不能为空' })
                  if (name.length === 0 || name.length > 20)
                    return send(400, { ok: false, error: '昵称长度需 1-20' })
                  if (content.length > 800) return send(400, { ok: false, error: '评论内容最多 800 字' })
                  if (!anonUserId || anonUserId.length > 64)
                    return send(400, { ok: false, error: '访客标识异常，请刷新页面重试' })

                  const userAgent = String(req.headers['user-agent'] || '')

                  const inserted = await sql`
                    INSERT INTO public_comments (page, name, content, user_agent, anon_user_id)
                    VALUES (${page}, ${name}, ${content}, ${userAgent}, ${anonUserId})
                    RETURNING id, page, name, content, created_at;
                  `
                  return send(200, { ok: true, comment: inserted[0] })
                } catch (e) {
                  const err = e instanceof Error ? e : new Error(String(e))
                  return send(400, { ok: false, error: err.message || '请求体解析失败' })
                }
              }

              if (req.method === 'PUT') {
                if (!commentId) return send(400, { ok: false, error: '缺少评论 ID' })
                try {
                  const data = await collectBody()
                  const content = String(data.content || '').trim()
                  const anonUserId = String(data.anonUserId || '').trim()

                  if (!content) return send(400, { ok: false, error: '评论内容不能为空' })
                  if (content.length > 800) return send(400, { ok: false, error: '评论内容最多 800 字' })
                  if (!anonUserId || anonUserId.length > 64)
                    return send(400, { ok: false, error: '访客标识异常，请刷新页面重试' })

                  const updated = await sql`
                    UPDATE public_comments
                    SET content = ${content}
                    WHERE id = ${commentId} AND anon_user_id = ${anonUserId}
                    RETURNING id, page, name, content, created_at;
                  `
                  if (updated.length === 0)
                    return send(403, { ok: false, error: '无权限修改此评论或评论不存在' })

                  return send(200, { ok: true, comment: updated[0] })
                } catch (e) {
                  const err = e instanceof Error ? e : new Error(String(e))
                  return send(400, { ok: false, error: err.message || '请求体解析失败' })
                }
              }

              if (req.method === 'DELETE') {
                if (!commentId) return send(400, { ok: false, error: '缺少评论 ID' })
                try {
                  const data = await collectBody()
                  const anonUserId = String(data.anonUserId || '').trim()
                  if (!anonUserId || anonUserId.length > 64)
                    return send(400, { ok: false, error: '访客标识异常，请刷新页面重试' })

                  const deleted = await sql`
                    DELETE FROM public_comments
                    WHERE id = ${commentId} AND anon_user_id = ${anonUserId}
                    RETURNING id;
                  `
                  if (deleted.length === 0)
                    return send(403, { ok: false, error: '无权限删除此评论或评论不存在' })

                  return send(200, { ok: true })
                } catch (e) {
                  const err = e instanceof Error ? e : new Error(String(e))
                  return send(400, { ok: false, error: err.message || '请求体解析失败' })
                }
              }

              res.setHeader('Allow', 'GET, POST, PUT, DELETE')
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
