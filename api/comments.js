import { neon } from '@neondatabase/serverless'

const MAX_NAME_LEN = 20
const MAX_CONTENT_LEN = 800
const MAX_PAGE_LEN = 64

function json(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

function getClientIp(req) {
  const xf = req.headers['x-forwarded-for']
  if (typeof xf === 'string' && xf.length > 0) return xf.split(',')[0].trim()
  return req.socket?.remoteAddress || ''
}

export default async function handler(req, res) {
  try {
    const databaseUrl =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.NEON_DATABASE_URL
    if (!databaseUrl) {
      return json(res, 500, {
        ok: false,
        error: '数据库连接未配置（请在 Vercel 环境变量中设置 DATABASE_URL 或 POSTGRES_URL 等）',
      })
    }

    const sql = neon(databaseUrl)

    // 确保表存在（首次请求自动创建）
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

    if (req.method === 'GET') {
      const url = new URL(req.url, `http://${req.headers.host}`)
      const page = (url.searchParams.get('page') || '').trim()
      if (!page || page.length > MAX_PAGE_LEN) {
        return json(res, 400, { ok: false, error: 'page 参数缺失或过长' })
      }

      const rows = await sql`
        SELECT id, page, name, content, created_at
        FROM public_comments
        WHERE page = ${page}
        ORDER BY created_at DESC
        LIMIT 50;
      `
      return json(res, 200, { ok: true, comments: rows })
    }

    if (req.method === 'POST') {
      let body = ''
      req.on('data', chunk => {
        body += chunk
        if (body.length > 1024 * 1024) {
          req.destroy()
        }
      })
      req.on('end', async () => {
        let data
        try {
          data = JSON.parse(body || '{}')
        } catch {
          return json(res, 400, { ok: false, error: 'JSON 格式不正确' })
        }

        const page = String(data.page || '').trim()
        const name = String(data.name || '匿名').trim()
        const content = String(data.content || '').trim()

        if (!page || page.length > MAX_PAGE_LEN) {
          return json(res, 400, { ok: false, error: 'page 参数缺失或过长' })
        }
        if (!content) {
          return json(res, 400, { ok: false, error: '评论内容不能为空' })
        }
        if (name.length === 0 || name.length > MAX_NAME_LEN) {
          return json(res, 400, { ok: false, error: `昵称长度需 1-${MAX_NAME_LEN}` })
        }
        if (content.length > MAX_CONTENT_LEN) {
          return json(res, 400, { ok: false, error: `评论内容最多 ${MAX_CONTENT_LEN} 字` })
        }

        const ip = getClientIp(req)
        const userAgent = String(req.headers['user-agent'] || '')

        const inserted = await sql`
          INSERT INTO public_comments (page, name, content, ip, user_agent)
          VALUES (${page}, ${name}, ${content}, ${ip}, ${userAgent})
          RETURNING id, page, name, content, created_at;
        `

        return json(res, 200, { ok: true, comment: inserted[0] })
      })
      return
    }

    res.setHeader('Allow', 'GET, POST')
    return json(res, 405, { ok: false, error: 'Method Not Allowed' })
  } catch (e) {
    return json(res, 500, { ok: false, error: '服务异常' })
  }
}

