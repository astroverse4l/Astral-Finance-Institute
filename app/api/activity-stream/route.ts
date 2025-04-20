import { NextResponse } from "next/server"
import { redisUtils } from "@/lib/redis-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    // Get recent activities
    const activities = await redisUtils.activity.getRecent(20)

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error fetching activity stream:", error)
    return NextResponse.json({ error: "Failed to fetch activity stream" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { type, message, metadata } = await request.json()

    if (!type || !message) {
      return NextResponse.json({ error: "Type and message are required" }, { status: 400 })
    }

    // Get user from session
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Log activity
    await redisUtils.activity.log({
      userId,
      type,
      message,
      metadata,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging activity:", error)
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 })
  }
}
