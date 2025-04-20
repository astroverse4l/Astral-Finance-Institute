import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { query } = await req.json()

    if (!query || typeof query !== "string" || query.length < 2) {
      return NextResponse.json({ error: "Invalid search query" }, { status: 400 })
    }

    // Save search history
    await prisma.searchHistory.create({
      data: {
        userId,
        query,
      },
    })

    return NextResponse.json({ message: "Search history saved" })
  } catch (error) {
    console.error("Error saving search history:", error)
    return NextResponse.json({ error: "An error occurred while saving search history" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get search history
    const searchHistory = await prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json(searchHistory)
  } catch (error) {
    console.error("Error fetching search history:", error)
    return NextResponse.json({ error: "An error occurred while fetching search history" }, { status: 500 })
  }
}
