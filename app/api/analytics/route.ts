import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  trackPageView,
  trackUserAction,
  getPageViewStats,
  getActiveUserStats,
  getPopularActions,
} from "@/lib/redis-analytics"

// Track analytics events
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { event, page, action } = await req.json()

    if (event === "pageview" && page) {
      await trackPageView(page)

      // If user is authenticated, track them as active
      if (session?.user?.id) {
        await trackUserAction(session.user.id, "view")
      }

      return NextResponse.json({ success: true })
    }

    if (event === "action" && action) {
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Authentication required for tracking actions" }, { status: 401 })
      }

      await trackUserAction(session.user.id, action)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid event type" }, { status: 400 })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json({ error: "Failed to track analytics" }, { status: 500 })
  }
}

// Get analytics data (admin only)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const page = searchParams.get("page")
    const days = Number.parseInt(searchParams.get("days") || "7", 10)

    if (type === "pageviews" && page) {
      const stats = await getPageViewStats(page, days)
      return NextResponse.json(stats)
    }

    if (type === "users") {
      const stats = await getActiveUserStats()
      return NextResponse.json(stats)
    }

    if (type === "actions") {
      const stats = await getPopularActions(days)
      return NextResponse.json(stats)
    }

    return NextResponse.json({ error: "Invalid analytics type" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
