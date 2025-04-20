import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redisUtils } from "@/lib/redis-utils"

export async function GET() {
  try {
    // Get online users
    const onlineUsers = await redisUtils.presence.getOnlineUsers(60) // Last 60 seconds

    return NextResponse.json({
      count: onlineUsers.length,
    })
  } catch (error) {
    console.error("Error fetching online users:", error)
    return NextResponse.json({ error: "Failed to fetch online users" }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Get current user session
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Track user presence
    await redisUtils.presence.trackUser(session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking user presence:", error)
    return NextResponse.json({ error: "Failed to track presence" }, { status: 500 })
  }
}
