import { kv } from "@vercel/kv"
import { redis } from "./redis"

// Rate limit by IP address
export async function ipRateLimit(
  ip: string,
  endpoint: string,
  max = 60,
  windowSizeInSeconds = 60,
): Promise<{ success: boolean; remaining: number; resetIn: number }> {
  const key = `rate-limit:${ip}:${endpoint}`
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - windowSizeInSeconds

  // Use Redis to implement sliding window rate limiting
  const client = redis || kv

  // Create a transaction
  const multi = client.multi()

  // Remove counts older than the window
  multi.zremrangebyscore(key, 0, windowStart)

  // Add current request with current timestamp
  multi.zadd(key, { score: now, member: `${now}-${Math.random().toString(36).substring(2, 10)}` })

  // Count requests in current window
  multi.zcard(key)

  // Set expiration on the key
  multi.expire(key, windowSizeInSeconds * 2)

  // Execute transaction
  const [, , currentCount] = await multi.exec()

  // Calculate remaining requests and reset time
  const remaining = Math.max(0, max - (currentCount as number))
  const resetIn = windowSizeInSeconds - (now % windowSizeInSeconds)

  return {
    success: (currentCount as number) <= max,
    remaining,
    resetIn,
  }
}

// Rate limit by user ID
export async function userRateLimit(
  userId: string,
  action: string,
  max = 60,
  windowSizeInSeconds = 60,
): Promise<{ success: boolean; remaining: number; resetIn: number }> {
  const key = `rate-limit:user:${userId}:${action}`
  return ipRateLimit(userId, action, max, windowSizeInSeconds)
}
