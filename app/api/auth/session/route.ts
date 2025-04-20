import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserSession } from "@/lib/redis"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("session_id")?.value

    if (!sessionId) {
      return NextResponse.json({ user: null })
    }

    const user = await getUserSession(sessionId)

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}
