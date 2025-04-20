import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/neon-db"

async function createTables() {
  try {
    // Create User table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" TIMESTAMP,
        image TEXT,
        password TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        bio TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    // Create Course table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "Course" (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        level TEXT NOT NULL,
        duration TEXT NOT NULL,
        price DECIMAL NOT NULL,
        "isDemo" BOOLEAN NOT NULL DEFAULT false,
        instructor TEXT NOT NULL,
        "imageUrl" TEXT,
        students INTEGER NOT NULL DEFAULT 0,
        rating DECIMAL NOT NULL DEFAULT 0,
        featured BOOLEAN NOT NULL DEFAULT false,
        published BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    // Create CourseSection table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "CourseSection" (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        "order" INTEGER NOT NULL,
        "courseId" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("courseId") REFERENCES "Course" (id) ON DELETE CASCADE
      )
    `)

    // Create Lesson table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "Lesson" (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        "videoUrl" TEXT,
        duration INTEGER NOT NULL,
        "order" INTEGER NOT NULL,
        "courseSectionId" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("courseSectionId") REFERENCES "CourseSection" (id) ON DELETE CASCADE
      )
    `)

    // Create CourseReview table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "CourseReview" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        rating DECIMAL NOT NULL,
        comment TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("courseId") REFERENCES "Course" (id) ON DELETE CASCADE,
        UNIQUE ("userId", "courseId")
      )
    `)

    // Create CourseEnrollment table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "CourseEnrollment" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "courseId" TEXT NOT NULL,
        progress DECIMAL NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE ("userId", "courseId")
      )
    `)

    // Create StakingPool table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "StakingPool" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        asset TEXT NOT NULL,
        "maxParticipants" INTEGER NOT NULL,
        "currentParticipants" INTEGER NOT NULL DEFAULT 0,
        "minStake" DECIMAL NOT NULL,
        "maxStake" DECIMAL NOT NULL,
        apy DECIMAL NOT NULL,
        "lockPeriod" INTEGER NOT NULL,
        "totalStaked" DECIMAL NOT NULL DEFAULT 0,
        "tradesPerDay" INTEGER NOT NULL,
        "percentPerTrade" DECIMAL NOT NULL,
        description TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    // Create StakingPoolUser table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "StakingPoolUser" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "poolId" TEXT NOT NULL,
        amount DECIMAL NOT NULL,
        "startDate" TIMESTAMP NOT NULL DEFAULT NOW(),
        "endDate" TIMESTAMP NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("poolId") REFERENCES "StakingPool" (id) ON DELETE CASCADE
      )
    `)

    // Create MiningRig table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "MiningRig" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        hashrate DECIMAL NOT NULL,
        algorithm TEXT NOT NULL,
        "dailyReward" DECIMAL NOT NULL,
        "rentalFeeHourly" DECIMAL NOT NULL,
        "rentalFeeDaily" DECIMAL NOT NULL,
        "rentalFeeWeekly" DECIMAL NOT NULL,
        "rentalFeeMonthly" DECIMAL NOT NULL,
        availability INTEGER NOT NULL,
        "powerConsumption" INTEGER NOT NULL,
        "imageUrl" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    // Create Analytics table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS "Analytics" (
        id TEXT PRIMARY KEY,
        event TEXT NOT NULL,
        category TEXT NOT NULL,
        value INTEGER,
        metadata JSONB,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    return { success: true, message: "Database tables created successfully" }
  } catch (error) {
    console.error("Error creating database tables:", error)
    throw error
  }
}

export async function GET() {
  try {
    // Only allow initialization in development or with a special key
    if (process.env.NODE_ENV !== "production" || process.env.SEED_KEY === "allow_seeding") {
      const result = await createTables()
      return NextResponse.json(result)
    } else {
      return NextResponse.json({ error: "Database initialization not allowed in production" }, { status: 403 })
    }
  } catch (error) {
    console.error("Error in initialize-db API:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
