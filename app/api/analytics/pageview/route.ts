import { NextResponse } from "next/server"
import { redisUtils } from "@/lib/redis-utils"

export async function POST(request: Request) {
  try {
    const { path } = await request.json()

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 })
    }

    // Track page view
    await redisUtils.analytics.trackPageView(path)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json({ error: "Failed to track page view" }, { status: 500 })
  }
}
