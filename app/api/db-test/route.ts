import { NextResponse } from "next/server"
import { db, testDatabaseConnection } from "@/lib/neon-db"
import { redisUtils } from "@/lib/redis-utils"

export async function GET() {
  try {
    // Test database connection
    const dbConnectionStatus = await testDatabaseConnection()

    // Try to query the database
    const userCount = await db.users.count()
    const courseCount = await db.courses.count()
    const stakingPoolCount = await db.stakingPools.count()
    const miningRigCount = await db.miningRigs.count()

    return NextResponse.json({
      success: dbConnectionStatus.connected,
      message: dbConnectionStatus.message,
      redisAvailable: redisUtils.isAvailable,
      stats: {
        users: userCount,
        courses: courseCount,
        stakingPools: stakingPoolCount,
        miningRigs: miningRigCount,
      },
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
