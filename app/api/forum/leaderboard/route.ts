import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getLeaderboard, addToLeaderboard } from "@/lib/redis"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    // Get leaderboard from Redis
    const leaderboard = (await getLeaderboard("forum:leaderboard", 0, limit - 1, true)) as Array<{
      member: string
      score: number
    }>

    // If we have results from Redis, fetch user details
    if (leaderboard.length > 0) {
      const userIds = leaderboard.map((entry) => entry.member)

      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      })

      // Map user details to leaderboard entries
      const leaderboardWithDetails = leaderboard.map((entry) => {
        const user = users.find((u) => u.id === entry.member)
        return {
          userId: entry.member,
          score: entry.score,
          name: user?.name || "Unknown User",
          image: user?.image || null,
        }
      })

      return NextResponse.json(leaderboardWithDetails)
    }

    // If Redis leaderboard is empty, generate it from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        forumPosts: {
          select: {
            id: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
      },
    })

    // Calculate scores and update Redis leaderboard
    const leaderboardData = users.map((user) => {
      // Calculate score: posts worth 10 points, comments worth 2 points
      const score = user.forumPosts.length * 10 + user.comments.length * 2

      // Add to Redis leaderboard
      addToLeaderboard("forum:leaderboard", user.id, score).catch((err) =>
        console.error(`Error adding ${user.id} to leaderboard:`, err),
      )

      return {
        userId: user.id,
        score,
        name: user.name,
        image: user.image,
      }
    })

    // Sort by score descending and limit
    const sortedLeaderboard = leaderboardData.sort((a, b) => b.score - a.score).slice(0, limit)

    return NextResponse.json(sortedLeaderboard)
  } catch (error) {
    console.error("Error fetching forum leaderboard:", error)
    return NextResponse.json({ error: "An error occurred while fetching the leaderboard" }, { status: 500 })
  }
}

// Update leaderboard when users interact with the forum
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, action } = body

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate points based on action
    let points = 0
    switch (action) {
      case "post":
        points = 10
        break
      case "comment":
        points = 2
        break
      case "like_received":
        points = 1
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // Update leaderboard
    await addToLeaderboard("forum:leaderboard", userId, points)

    return NextResponse.json({ message: "Leaderboard updated successfully" })
  } catch (error) {
    console.error("Error updating forum leaderboard:", error)
    return NextResponse.json({ error: "An error occurred while updating the leaderboard" }, { status: 500 })
  }
}
