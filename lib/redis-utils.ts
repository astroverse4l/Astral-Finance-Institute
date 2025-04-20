import { kv } from "@vercel/kv"

// Check if Redis is available
export const isRedisAvailable = !!process.env.KV_URL || !!process.env.REDIS_URL

// Simple rate limiter
export async function rateLimit(ip: string, route: string): Promise<boolean> {
  if (!isRedisAvailable) return true

  try {
    const key = `ratelimit:${ip}:${route}`
    const limit = 100
    const window = 60 // 60 seconds window

    const count = await kv.incr(key)
    if (count === 1) {
      await kv.expire(key, window)
    }

    return count <= limit
  } catch (error) {
    console.error("Rate limit error:", error)
    return true // Allow the request if there's an error
  }
}

// Track online users
export async function trackOnlineUser(userId: string): Promise<void> {
  if (!isRedisAvailable) return

  try {
    const key = `online:${userId}`
    await kv.set(key, Date.now(), { ex: 300 }) // 5 minute expiration
  } catch (error) {
    console.error("Track online user error:", error)
  }
}

// Get all online users - returns user IDs
export async function getOnlineUsers(): Promise<string[]> {
  if (!isRedisAvailable) return []

  try {
    const keys = await kv.keys("online:*")
    return keys.map((key) => key.replace("online:", ""))
  } catch (error) {
    console.error("Get online users error:", error)
    return []
  }
}

// Track page views
export async function trackPageView(page: string, userId?: string): Promise<void> {
  if (!isRedisAvailable) return

  try {
    const date = new Date().toISOString().split("T")[0] // YYYY-MM-DD
    const pageKey = `pageview:${page}:${date}`
    const totalKey = `pageview:total:${date}`

    await kv.incr(pageKey)
    await kv.incr(totalKey)

    if (userId) {
      const userKey = `pageview:user:${userId}:${date}`
      await kv.incr(userKey)
    }
  } catch (error) {
    console.error("Track page view error:", error)
  }
}

// Get page view stats
export async function getPageViewStats(days = 7): Promise<any> {
  if (!isRedisAvailable) return { total: 0, pages: {} }

  try {
    const stats = { total: 0, pages: {} }
    const today = new Date()

    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const totalKey = `pageview:total:${dateStr}`
      const totalViews = (await kv.get<number>(totalKey)) || 0
      stats.total += totalViews

      const pageKeys = await kv.keys(`pageview:*:${dateStr}`)
      for (const key of pageKeys) {
        if (key === totalKey) continue

        const page = key.split(":")[1]
        if (!page || page === "total" || page === "user") continue

        const views = (await kv.get<number>(key)) || 0
        if (!stats.pages[page]) {
          stats.pages[page] = 0
        }
        stats.pages[page] += views
      }
    }

    return stats
  } catch (error) {
    console.error("Get page view stats error:", error)
    return { total: 0, pages: {} }
  }
}

// Log activity
export async function logActivity(userId: string, action: string, details?: any): Promise<void> {
  if (!isRedisAvailable) return

  try {
    const timestamp = Date.now()
    const activity = {
      userId,
      action,
      details: details || {},
      timestamp,
    }

    await kv.lpush("activities", JSON.stringify(activity))
    await kv.ltrim("activities", 0, 99) // Keep only the 100 most recent activities
  } catch (error) {
    console.error("Log activity error:", error)
  }
}

// Get recent activities
export async function getRecentActivities(limit = 20): Promise<any[]> {
  if (!isRedisAvailable) return []

  try {
    const activities = await kv.lrange("activities", 0, limit - 1)
    return activities
      .map((activity) => {
        try {
          return JSON.parse(activity)
        } catch {
          return null
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error("Get recent activities error:", error)
    return []
  }
}

// Simple cache mechanism
export async function cacheData(key: string, data: any, ttl = 3600): Promise<void> {
  if (!isRedisAvailable) return

  try {
    await kv.set(`cache:${key}`, JSON.stringify(data), { ex: ttl })
  } catch (error) {
    console.error("Cache data error:", error)
  }
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  if (!isRedisAvailable) return null

  try {
    const data = await kv.get(`cache:${key}`)
    return data ? JSON.parse(data as string) : null
  } catch (error) {
    console.error("Get cached data error:", error)
    return null
  }
}

// Get notifications
export async function getNotifications(userId: string, limit = 10): Promise<any[]> {
  if (!isRedisAvailable) return []

  try {
    const notifications = await kv.lrange(`notifications:${userId}`, 0, limit - 1)
    return notifications
      .map((notification) => {
        try {
          return JSON.parse(notification)
        } catch {
          return null
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error("Get notifications error:", error)
    return []
  }
}

// Set user session
export async function setUserSession(sessionId: string, userData: any, ttl = 3600): Promise<void> {
  if (!isRedisAvailable) return

  try {
    await kv.set(`session:${sessionId}`, JSON.stringify(userData), { ex: ttl })
  } catch (error) {
    console.error("Set user session error:", error)
  }
}

// Get user session
export async function getUserSession<T>(sessionId: string): Promise<T | null> {
  if (!isRedisAvailable) return null

  try {
    const data = await kv.get(`session:${sessionId}`)
    return data ? JSON.parse(data as string) : null
  } catch (error) {
    console.error("Get user session error:", error)
    return null
  }
}

// Increment counter
export async function incrementCounter(key: string, amount = 1): Promise<number> {
  if (!isRedisAvailable) return 0

  try {
    return await kv.incrby(`counter:${key}`, amount)
  } catch (error) {
    console.error("Increment counter error:", error)
    return 0
  }
}

// Export Redis client for direct access
export const redis = kv

// Export a simplified interface for the Redis utilities
export const redisUtils = {
  client: kv,

  cache: {
    get: getCachedData,
    set: cacheData,
    delete: async (key: string): Promise<void> => {
      if (!isRedisAvailable) return
      try {
        await kv.del(`cache:${key}`)
      } catch (error) {
        console.error("Delete cache error:", error)
      }
    },
    getCachedData,
  },

  rateLimit,

  presence: {
    trackUser: trackOnlineUser,
    getOnlineUsers,
  },

  analytics: {
    trackPageView,
    getPageViewStats,
  },

  activity: {
    log: logActivity,
    getRecent: getRecentActivities,
  },

  isAvailable: isRedisAvailable,
}

export default redisUtils
