import { kv } from "@vercel/kv"
import { redis } from "./redis"

const PRESENCE_KEY = "online-users"
const PRESENCE_EXPIRY = 60 // seconds

// Track user presence
export async function trackUserPresence(userId: string): Promise<void> {
  const client = redis || kv
  const now = Date.now()

  // Add user to sorted set with current timestamp
  await client.zadd(PRESENCE_KEY, { score: now, member: userId })

  // Set expiry on the key to auto-cleanup
  await client.expire(PRESENCE_KEY, PRESENCE_EXPIRY * 2)
}

// Get online users
export async function getOnlineUsers(limit = 100): Promise<string[]> {
  const client = redis || kv
  const now = Date.now()
  const cutoff = now - PRESENCE_EXPIRY * 1000

  // Remove users who haven't been active recently
  await client.zremrangebyscore(PRESENCE_KEY, 0, cutoff)

  // Get the most recently active users
  const onlineUsers = await client.zrevrange(PRESENCE_KEY, 0, limit - 1)

  return onlineUsers
}

// Check if a specific user is online
export async function isUserOnline(userId: string): Promise<boolean> {
  const client = redis || kv
  const now = Date.now()
  const cutoff = now - PRESENCE_EXPIRY * 1000

  // Get user's last activity timestamp
  const score = await client.zscore(PRESENCE_KEY, userId)

  if (!score) return false

  return Number(score) > cutoff
}

// Get user's last active time
export async function getUserLastActive(userId: string): Promise<number | null> {
  const client = redis || kv

  // Get user's last activity timestamp
  const score = await client.zscore(PRESENCE_KEY, userId)

  return score ? Number(score) : null
}

// Get count of online users
export async function getOnlineUserCount(): Promise<number> {
  const client = redis || kv
  const now = Date.now()
  const cutoff = now - PRESENCE_EXPIRY * 1000

  // Remove users who haven't been active recently
  await client.zremrangebyscore(PRESENCE_KEY, 0, cutoff)

  // Count remaining users
  return client.zcard(PRESENCE_KEY)
}
