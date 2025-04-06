import { Context, Next } from 'hono'
import { CacheService } from '../services/cache'
import { Logger } from '../services/logger'

interface Env {
  CACHE: KVNamespace
}

const RATE_LIMIT = 100 // 每分钟最大请求数
const WINDOW_MS = 60 * 1000 // 1分钟窗口

export async function ddosMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const cache = new CacheService(c.env.CACHE)
  const log = Logger.getInstance()
  
  // 获取客户端 IP
  const ip = c.req.header('CF-Connecting-IP') || 
             c.req.header('X-Forwarded-For') || 
             c.req.header('X-Real-IP') ||
             'unknown'
  
  const key = `rate_limit:${ip}`
  
  try {
    // 获取当前请求计数
    const current = await cache.get<number>(key) || 0
    
    // 检查是否超过限制
    if (current >= RATE_LIMIT) {
      log.warn(`Rate limit exceeded for IP: ${ip}`)
      return c.json({ 
        error: 'Too many requests',
        retryAfter: WINDOW_MS / 1000
      }, 429)
    }
    
    // 增加计数
    await cache.set(key, current + 1, WINDOW_MS / 1000)
    
    // 添加响应头
    c.header('X-RateLimit-Limit', RATE_LIMIT.toString())
    c.header('X-RateLimit-Remaining', (RATE_LIMIT - current - 1).toString())
    c.header('X-RateLimit-Reset', (Date.now() + WINDOW_MS).toString())
    
    return next()
  } catch (error) {
    log.error('Rate limiting error:', error)
    // 发生错误时允许请求通过
    return next()
  }
} 