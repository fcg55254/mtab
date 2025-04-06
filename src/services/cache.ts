import { KVNamespace } from '@cloudflare/workers-types'

export class CacheService {
  constructor(private kv: KVNamespace) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.kv.get(key, 'json')
    return cached as T | null
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.kv.put(key, JSON.stringify(value), { expirationTtl: ttl })
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(key)
  }

  // 批量获取缓存
  async getMany<T>(keys: string[]): Promise<Map<string, T>> {
    const results = new Map<string, T>()
    for (const key of keys) {
      const value = await this.get<T>(key)
      if (value) {
        results.set(key, value)
      }
    }
    return results
  }

  // 批量设置缓存
  async setMany(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<void> {
    for (const { key, value, ttl } of entries) {
      await this.set(key, value, ttl)
    }
  }
} 