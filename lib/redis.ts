import { Redis } from "@upstash/redis"

// Create Redis client
export const redis = Redis.fromEnv()

// Check if Redis is available
let redisAvailable = false
try {
  await redis.ping()
  redisAvailable = true
  console.log("Redis connection successful")
} catch (error) {
  console.warn("Redis connection failed:", error)
}

// Helper functions for common operations
// Function to add a notification to a user's notification list
export async function addNotification(userId: string, notification: any) {
  try {
    const notificationWithTimestamp = {
      ...notification,
      timestamp: Date.now(),
      read: false,
      id: `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    }

    // Add to the user's notification list (limited to 50 notifications)
    await redis.lpush(`user:${userId}:notifications`, JSON.stringify(notificationWithTimestamp))
    await redis.ltrim(`user:${userId}:notifications`, 0, 49)

    return notificationWithTimestamp
  } catch (error) {
    console.error("Error adding notification:", error)
    throw error
  }
}

// Function to get a user's notifications
export async function getUserNotifications(userId: string, limit = 10) {
  try {
    const notifications = await redis.lrange(`user:${userId}:notifications`, 0, limit - 1)
    return notifications.map((notification) => JSON.parse(notification))
  } catch (error) {
    console.error("Error getting notifications:", error)
    return []
  }
}

// Function to get notifications (alias for getUserNotifications for backward compatibility)
export async function getNotifications(userId: string, limit = 10) {
  return getUserNotifications(userId, limit)
}

// Function to set user session
export async function setUserSession(sessionId: string, userData: any, expirationInSeconds = 3600) {
  if (!redisAvailable || !sessionId) return false

  try {
    const key = `session:${sessionId}`
    await redis.set(key, JSON.stringify(userData), { ex: expirationInSeconds })
    return true
  } catch (error) {
    console.error(`Error setting user session for ${sessionId}:`, error)
    return false
  }
}

// Function to get user session
export async function getUserSession<T>(sessionId: string): Promise<T | null> {
  if (!redisAvailable || !sessionId) return null

  try {
    const key = `session:${sessionId}`
    const session = await redis.get(key)
    return session ? JSON.parse(session as string) : null
  } catch (error) {
    console.error(`Error getting user session for ${sessionId}:`, error)
    return null
  }
}

// Function to increment a counter
export async function incrementCounter(key: string, amount = 1): Promise<number> {
  if (!redisAvailable) return 0

  try {
    if (amount === 1) {
      return await redis.incr(key)
    } else {
      return await redis.incrby(key, amount)
    }
  } catch (error) {
    console.error(`Error incrementing counter ${key}:`, error)
    return 0
  }
}

// Track online users
export async function trackOnlineUser(userId: string, expirationInSeconds = 60): Promise<void> {
  if (!redisAvailable || !userId) return

  try {
    const key = "online_users"
    await redis.set(`${key}:${userId}`, Date.now(), { ex: expirationInSeconds })
  } catch (error) {
    console.error(`Error tracking online user ${userId}:`, error)
  }
}

// Get online users
export async function getOnlineUsers(maxAgeInSeconds = 60): Promise<string[]> {
  if (!redisAvailable) return []

  try {
    const keys = await redis.keys("online_users:*")
    return keys.map((key) => key.replace("online_users:", ""))
  } catch (error) {
    console.error("Error getting online users:", error)
    return []
  }
}

// Track page view
export async function trackPageView(path: string): Promise<void> {
  if (!redisAvailable) return

  try {
    const dayKey = `pageviews:day:${new Date().toISOString().split("T")[0]}`
    const totalKey = "pageviews:total"
    const pathKey = `pageviews:path:${path}`

    await redis.incr(dayKey)
    await redis.incr(totalKey)
    await redis.incr(pathKey)
  } catch (error) {
    console.error(`Error tracking page view for ${path}:`, error)
  }
}

// Get page views stats
export async function getPageViewStats(): Promise<{
  today: number
  total: number
  topPages: { path: string; views: number }[]
}> {
  if (!redisAvailable) {
    return { today: 0, total: 0, topPages: [] }
  }

  try {
    const today = new Date().toISOString().split("T")[0]
    const dayKey = `pageviews:day:${today}`
    const totalKey = "pageviews:total"

    // Get today's and total views
    const [todayViews, totalViews] = await Promise.all([
      redis.get<number>(dayKey) || 0,
      redis.get<number>(totalKey) || 0,
    ])

    return {
      today: todayViews,
      total: totalViews,
      topPages: [], // TODO: Implement top pages
    }
  } catch (error) {
    console.error("Error getting page view stats:", error)
    return { today: 0, total: 0, topPages: [] }
  }
}

// Function to get cached data
export async function getCachedData<T>(cacheKey: string, fetchData: () => Promise<T>, cacheTTL: number): Promise<T> {
  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return JSON.parse(cached as string) as T
    }

    const data = await fetchData()
    await redis.set(cacheKey, JSON.stringify(data), { ex: cacheTTL })
    return data
  } catch (error) {
    console.error("Error getting cached data:", error)
    throw error
  }
}

// Function to get leaderboard data
export async function getLeaderboard(
  leaderboardKey: string,
  start: number,
  stop: number,
  withScores: boolean,
): Promise<any> {
  try {
    if (withScores) {
      return await redis.zrevrange(leaderboardKey, start, stop, { withScores: true })
    } else {
      return await redis.zrevrange(leaderboardKey, start, stop)
    }
  } catch (error) {
    console.error("Error getting leaderboard:", error)
    return []
  }
}

// Function to mark a notification as read
export async function markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
  try {
    const notifications = await getUserNotifications(userId)
    const notificationIndex = notifications.findIndex((n) => n.id === notificationId)

    if (notificationIndex !== -1) {
      notifications[notificationIndex].read = true
      await redis.set(`user:${userId}:notifications`, JSON.stringify(notifications))
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

// Function to add a member to a sorted set (leaderboard)
export async function addToLeaderboard(leaderboardKey: string, member: string, score: number): Promise<void> {
  try {
    await redis.zadd(leaderboardKey, { score, member })
  } catch (error) {
    console.error("Error adding to leaderboard:", error)
    throw error
  }
}

export default redis
