import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redisUtils } from "@/lib/redis-utils"

export async function GET() {
  try {
    // Check authorization - only allow admins
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get page view stats
    const stats = await redisUtils.analytics.getPageViewStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching analytics stats:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
