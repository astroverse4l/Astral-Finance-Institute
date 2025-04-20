import { kv } from "@vercel/kv"
import { redis } from "./redis"

// Default cache expiration time (in seconds)
const DEFAULT_CACHE_TTL = 60 * 60 // 1 hour

// Cache item with metadata
interface CacheItem<T> {
  data: T
  createdAt: number
  expiresAt: number
  tags?: string[]
}

// Get the Redis client
const getClient = () => redis || kv

// Set cache with optional tags
export async function setCache<T>(
  key: string,
  data: T,
  ttl: number = DEFAULT_CACHE_TTL,
  tags: string[] = [],
): Promise<void> {
  const client = getClient()
  const now = Date.now()

  const cacheItem: CacheItem<T> = {
    data,
    createdAt: now,
    expiresAt: now + ttl * 1000,
    tags: tags.length > 0 ? tags : undefined,
  }

  // Store the cache item
  await client.set(key, JSON.stringify(cacheItem), { ex: ttl })

  // If tags are provided, add this key to tag sets
  if (tags.length > 0) {
    const multi = client.multi()

    for (const tag of tags) {
      multi.sadd(`tag:${tag}`, key)
      multi.expire(`tag:${tag}`, ttl * 2) // Set expiry on tag sets
    }

    await multi.exec()
  }
}

// Get cache with optional background refresh
export async function getCache<T>(
  key: string,
  refreshFn?: () => Promise<T>,
  refreshThreshold = 0.8, // Refresh when 80% of TTL has passed
): Promise<T | null> {
  const client = getClient()
  const cachedData = (await client.get(key)) as string | null

  if (!cachedData) {
    // Cache miss
    if (refreshFn) {
      // If refresh function provided, fetch new data
      const newData = await refreshFn()
      await setCache(key, newData)
      return newData
    }
    return null
  }

  try {
    const cacheItem = JSON.parse(cachedData) as CacheItem<T>
    const now = Date.now()

    // Check if we should refresh in the background
    if (refreshFn && cacheItem.expiresAt) {
      const totalTtl = cacheItem.expiresAt - cacheItem.createdAt
      const elapsed = now - cacheItem.createdAt
      const ttlPercentUsed = elapsed / totalTtl

      if (ttlPercentUsed > refreshThreshold) {
        // Refresh in background without blocking the response
        refreshFn()
          .then((newData) => {
            setCache(key, newData, Math.floor((cacheItem.expiresAt - cacheItem.createdAt) / 1000), cacheItem.tags)
          })
          .catch((err) => {
            console.error(`Background cache refresh failed for ${key}:`, err)
          })
      }
    }

    return cacheItem.data
  } catch (error) {
    console.error(`Error parsing cached data for ${key}:`, error)
    return null
  }
}

// Invalidate cache by key
export async function invalidateCache(key: string): Promise<void> {
  const client = getClient()
  await client.del(key)
}

// Invalidate cache by tag
export async function invalidateCacheByTag(tag: string): Promise<void> {
  const client = getClient()

  // Get all keys with this tag
  const keys = (await client.smembers(`tag:${tag}`)) as string[]

  if (keys.length > 0) {
    // Delete all keys
    const multi = client.multi()
    for (const key of keys) {
      multi.del(key)
    }
    // Delete the tag set itself
    multi.del(`tag:${tag}`)

    await multi.exec()
  }
}
