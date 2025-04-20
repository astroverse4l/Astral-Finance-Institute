import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCachedData } from "@/lib/redis"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    // Use Redis cache for common searches
    const cacheKey = `search:${query.toLowerCase()}`

    const results = await getCachedData(
      cacheKey,
      async () => {
        // Search courses
        const courses = await prisma.course.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
            ],
            published: true,
          },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
          },
          take: 5,
        })

        // Search forum posts
        const forumPosts = await prisma.forumPost.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            title: true,
            content: true,
            category: true,
          },
          take: 3,
        })

        // Format results
        const formattedCourses = courses.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description.substring(0, 100) + "...",
          category: course.category,
          type: "course",
          url: `/courses/${course.category}/${course.id}`,
        }))

        const formattedPosts = forumPosts.map((post) => ({
          id: post.id,
          title: post.title,
          description: post.content.substring(0, 100) + "...",
          category: post.category,
          type: "forum",
          url: `/forum/post/${post.id}`,
        }))

        return [...formattedCourses, ...formattedPosts]
      },
      300, // Cache for 5 minutes
    )

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "An error occurred during search" }, { status: 500 })
  }
}
