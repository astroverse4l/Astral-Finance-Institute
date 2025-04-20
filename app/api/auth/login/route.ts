import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { setUserSession } from "@/lib/redis"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json()

    if (!user || !user.id) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
    }

    // Generate a session ID
    const sessionId = crypto.randomBytes(32).toString("hex")

    // Store session in Redis (24 hour expiry)
    await setUserSession(sessionId, user, 86400)

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400,
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
