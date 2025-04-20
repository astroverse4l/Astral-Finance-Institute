import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { seedExpandedDatabase } from "@/lib/seed-expanded-db"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await seedExpandedDatabase()

    if (result.success) {
      return NextResponse.json({ message: "Database seeded successfully with expanded content" })
    } else {
      return NextResponse.json({ error: "Failed to seed database", details: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error seeding expanded database:", error)
    return NextResponse.json({ error: "An error occurred while seeding the database" }, { status: 500 })
  }
}
