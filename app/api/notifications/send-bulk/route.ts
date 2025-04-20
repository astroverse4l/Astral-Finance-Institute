import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { addNotification } from "@/lib/redis"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { userIds, notification } = body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !notification) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Verify notification has required fields
    if (!notification.title || !notification.message) {
      return NextResponse.json({ error: "Notification missing required fields" }, { status: 400 })
    }

    // Get valid users
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
      },
    })

    const validUserIds = users.map((user) => user.id)

    // Send notifications to all valid users
    const notificationPromises = validUserIds.map((userId) => {
      // Add to Redis for real-time notifications
      const redisPromise = addNotification(userId, notification)

      // Store in database for persistence
      const dbPromise = prisma.notification.create({
        data: {
          userId,
          title: notification.title,
          message: notification.message,
          type: notification.type || "info",
          link: notification.link,
        },
      })

      return Promise.all([redisPromise, dbPromise])
    })

    await Promise.all(notificationPromises)

    return NextResponse.json({
      message: `Notifications sent to ${validUserIds.length} users`,
      sentTo: validUserIds,
    })
  } catch (error) {
    console.error("Error sending bulk notifications:", error)
    return NextResponse.json({ error: "An error occurred while sending notifications" }, { status: 500 })
  }
}
