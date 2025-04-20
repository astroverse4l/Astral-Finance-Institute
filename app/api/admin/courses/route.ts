import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/neon-db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  level: z.string().min(1, "Level is required"),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().min(0, "Price must be a positive number"),
  isDemo: z.boolean().default(false),
  instructor: z.string().min(1, "Instructor is required"),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const result = courseSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 })
    }

    // Create course
    const course = await db.courses.create({
      ...result.data,
      students: 0,
      rating: 0,
      published: true,
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "An error occurred while creating the course" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const isDemo = searchParams.get("isDemo")

    // Build query
    const whereClause: any = {}

    if (category) {
      whereClause.category = category
    }

    if (featured === "true") {
      whereClause.featured = true
    }

    if (isDemo === "true") {
      whereClause.isDemo = true
    }

    // Get courses
    const courses = await db.courses.findMany(Object.keys(whereClause).length > 0 ? whereClause : undefined, {
      updatedAt: "desc",
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "An error occurred while fetching courses" }, { status: 500 })
  }
}
