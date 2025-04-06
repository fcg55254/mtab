import { Context, Next } from 'hono'
import { Turnstile } from '@cloudflare/workers-types'

interface Env {
  TURNSTILE: Turnstile
}

export async function turnstileMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  // 跳过不需要验证的路由
  if (c.req.path === '/' || c.req.path.startsWith('/api/health')) {
    return next()
  }

  // 获取 Turnstile token
  const token = c.req.header('CF-Turnstile-Token')
  if (!token) {
    return c.json({ error: 'Turnstile token is required' }, 403)
  }

  try {
    // 验证 token
    const { success, challenge_ts, hostname } = await c.env.TURNSTILE.verify(token)
    
    if (!success) {
      return c.json({ error: 'Invalid Turnstile token' }, 403)
    }

    // 添加验证信息到请求上下文
    c.set('turnstile', {
      success,
      challenge_ts,
      hostname
    })

    return next()
  } catch (error) {
    console.error('Turnstile verification failed:', error)
    return c.json({ error: 'Turnstile verification failed' }, 500)
  }
} 