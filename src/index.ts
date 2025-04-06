import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { D1Database, KVNamespace, Turnstile } from '@cloudflare/workers-types'
import { CacheService } from './services/cache'
import { Logger } from './services/logger'
import { turnstileMiddleware } from './middleware/turnstile'
import { ddosMiddleware } from './middleware/ddos'

interface Env {
  DB: D1Database
  CACHE: KVNamespace
  TURNSTILE: Turnstile
}

const app = new Hono<{ Bindings: Env }>()
const log = Logger.getInstance()

// 基础中间件
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors())

// 安全中间件
app.use('*', ddosMiddleware)
app.use('*', turnstileMiddleware)

// 性能监控中间件
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  log.performance(`${c.req.method} ${c.req.path}`, duration)
})

// 健康检查路由
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

// 路由
app.get('/', (c) => {
  return c.json({ message: 'Welcome to mTab API' })
})

// 书签相关路由
app.get('/api/bookmarks', async (c) => {
  const cache = new CacheService(c.env.CACHE)
  const cacheKey = 'bookmarks:all'
  
  // 尝试从缓存获取
  const cached = await cache.get(cacheKey)
  if (cached) {
    log.info('Cache hit for bookmarks')
    return c.json(cached)
  }
  
  // 从数据库获取
  const start = Date.now()
  const { results } = await c.env.DB.prepare('SELECT * FROM bookmarks').all()
  const duration = Date.now() - start
  
  // 记录性能
  log.performance('Database query: get all bookmarks', duration)
  
  // 设置缓存
  await cache.set(cacheKey, results, 300) // 缓存5分钟
  
  return c.json(results)
})

app.post('/api/bookmarks', async (c) => {
  const cache = new CacheService(c.env.CACHE)
  const data = await c.req.json()
  const { title, url, icon, category } = data
  
  const start = Date.now()
  const result = await c.env.DB.prepare(
    'INSERT INTO bookmarks (title, url, icon, category) VALUES (?, ?, ?, ?)'
  ).bind(title, url, icon, category).run()
  const duration = Date.now() - start
  
  // 记录性能
  log.performance('Database query: insert bookmark', duration)
  
  // 清除相关缓存
  await cache.delete('bookmarks:all')
  
  return c.json({ success: true, id: result.meta.last_row_id })
})

// 笔记相关路由
app.get('/api/notes', async (c) => {
  const cache = new CacheService(c.env.CACHE)
  const cacheKey = 'notes:all'
  
  // 尝试从缓存获取
  const cached = await cache.get(cacheKey)
  if (cached) {
    log.info('Cache hit for notes')
    return c.json(cached)
  }
  
  // 从数据库获取
  const start = Date.now()
  const { results } = await c.env.DB.prepare('SELECT * FROM notes').all()
  const duration = Date.now() - start
  
  // 记录性能
  log.performance('Database query: get all notes', duration)
  
  // 设置缓存
  await cache.set(cacheKey, results, 300) // 缓存5分钟
  
  return c.json(results)
})

app.post('/api/notes', async (c) => {
  const cache = new CacheService(c.env.CACHE)
  const data = await c.req.json()
  const { title, content } = data
  
  const start = Date.now()
  const result = await c.env.DB.prepare(
    'INSERT INTO notes (title, content) VALUES (?, ?)'
  ).bind(title, content).run()
  const duration = Date.now() - start
  
  // 记录性能
  log.performance('Database query: insert note', duration)
  
  // 清除相关缓存
  await cache.delete('notes:all')
  
  return c.json({ success: true, id: result.meta.last_row_id })
})

export default app 