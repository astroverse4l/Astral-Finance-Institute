import { kv } from "@vercel/kv"
import { redis } from "./redis"

const getClient = () => redis || kv

// Track page view
export async function trackPageView(page: string): Promise<void> {
  const client = getClient()
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

  // Increment daily counter
  await client.hincrby(`pageviews:${page}`, today, 1)

  // Set expiry (keep data for 90 days)
  await client.expire(`pageviews:${page}`, 60 * 60 * 24 * 90)
}

// Track user action
export async function trackUserAction(userId: string, action: string): Promise<void> {
  const client = getClient()
  const now = Date.now()
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

  // Record user as active today
  await client.sadd(`active:${today}`, userId)
  await client.expire(`active:${today}`, 60 * 60 * 24 * 30) // Keep for 30 days

  // Record user as active this month
  const month = today.substring(0, 7) // YYYY-MM
  await client.sadd(`active:${month}`, userId)
  await client.expire(`active:${month}`, 60 * 60 * 24 * 90) // Keep for 90 days

  // Increment action counter
  await client.hincrby("user:actions", action, 1)
  await client.expire("user:actions", 60 * 60 * 24 * 90) // Keep for 90 days

  // Record user's last activity time
  await client.hset(`user:${userId}:activity`, {
    lastActive: now,
    lastAction: action,
  })
  await client.expire(`user:${userId}:activity`, 60 * 60 * 24 * 30) // Keep for 30 days
}

// Get page view stats
export async function getPageViewStats(page: string, days = 7): Promise<Record<string, number>> {
  const client = getClient()

  // Get all daily counts
  const allStats = (await client.hgetall(`pageviews:${page}`)) as Record<string, string>

  if (!allStats) return { total: 0 }

  // Filter to requested number of days
  const dates = Object.keys(allStats).sort().slice(-days)

  const result: Record<string, number> = { total: 0 }

  for (const date of dates) {
    const views = Number.parseInt(allStats[date] || "0", 10)
    result[date] = views
    result.total += views
  }

  return result
}

// Get active user stats
export async function getActiveUserStats(): Promise<{
  dau: number
  mau: number
  dauYesterday: number
  dauChange: number
}> {
  const client = getClient()

  // Get today and yesterday dates
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
  const month = today.substring(0, 7) // YYYY-MM

  // Get counts
  const [dauToday, dauYesterday, mau] = await Promise.all([
    client.scard(`active:${today}`),
    client.scard(`active:${yesterday}`),
    client.scard(`active:${month}`),
  ])

  // Calculate change percentage
  const dauChange = dauYesterday > 0 ? ((dauToday - dauYesterday) / dauYesterday) * 100 : 0

  return {
    dau: dauToday,
    mau,
    dauYesterday,
    dauChange,
  }
}

// Get popular actions
export async function getPopularActions(days = 7): Promise<Record<string, number>> {
  const client = getClient()

  // Get all action counts
  const actions = (await client.hgetall("user:actions")) as Record<string, string>

  if (!actions) return {}

  // Convert string values to numbers
  const result: Record<string, number> = {}

  for (const [action, count] of Object.entries(actions)) {
    result[action] = Number.parseInt(count, 10)
  }

  return result
}
