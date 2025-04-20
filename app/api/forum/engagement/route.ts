import { type NextRequest, NextResponse } from "next/server"
import { redis, incrementCounter } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const { postId, action, userId } = await request.json()

    if (!postId || !action || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let result

    switch (action) {
      case "view":
        // Increment view count
        result = await incrementCounter(`post:${postId}:views`)
        break

      case "like":
        // Check if user already liked the post
        const alreadyLiked = await redis.sismember(`post:${postId}:likes`, userId)

        if (alreadyLiked) {
          // Remove like
          await redis.srem(`post:${postId}:likes`, userId)
          // Decrement like count
          result = await redis.decr(`post:${postId}:like_count`)
        } else {
          // Add like
          await redis.sadd(`post:${postId}:likes`, userId)
          // Increment like count
          result = await incrementCounter(`post:${postId}:like_count`)
        }
        break

      case "comment":
        // Increment comment count
        result = await incrementCounter(`post:${postId}:comment_count`)
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true, count: result })
  } catch (error) {
    console.error("Error in forum engagement API:", error)
    return NextResponse.json({ error: "Failed to process engagement action" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const userId = searchParams.get("userId")

    if (!postId) {
      return NextResponse.json({ error: "Missing post ID" }, { status: 400 })
    }

    // Get engagement metrics for the post
    const [views, likeCount, commentCount, userLiked] = await Promise.all([
      redis.get(`post:${postId}:views`) || 0,
      redis.get(`post:${postId}:like_count`) || 0,
      redis.get(`post:${postId}:comment_count`) || 0,
      userId ? redis.sismember(`post:${postId}:likes`, userId) : false,
    ])

    return NextResponse.json({
      views,
      likes: likeCount,
      comments: commentCount,
      userLiked,
    })
  } catch (error) {
    console.error("Error fetching forum engagement:", error)
    return NextResponse.json({ error: "Failed to fetch engagement metrics" }, { status: 500 })
  }
}
