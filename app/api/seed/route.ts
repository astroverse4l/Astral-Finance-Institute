import { NextResponse } from "next/server"
import { db } from "@/lib/neon-db"
import { mockDb } from "@/lib/mock-db"

async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Check if database already has data
    const userCount = await db.users.count()
    const courseCount = await db.courses.count()
    const stakingPoolCount = await db.stakingPools.count()

    if (userCount > 0 && courseCount > 0 && stakingPoolCount > 0) {
      console.log("Database already seeded. Skipping...")
      return
    }

    // Seed users
    console.log("Seeding users...")
    const users = mockDb.getUsers()
    for (const user of users) {
      await db.users.create({
        name: user.name,
        email: user.email,
        role: "user",
      })
    }

    // Seed courses
    console.log("Seeding courses...")
    const courses = mockDb.getCourses()
    for (const course of courses) {
      await db.courses.create({
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        duration: course.duration,
        price: course.price,
        isDemo: course.isDemo,
        instructor: course.instructor,
        imageUrl: course.imageUrl,
        students: course.students,
        rating: course.rating,
        featured: false,
        published: true,
      })
    }

    // Seed staking pools
    console.log("Seeding staking pools...")
    const stakingPools = mockDb.getStakingPools()
    for (const pool of stakingPools) {
      // Create a SQL query to insert staking pool
      await db.executeQuery(
        `
        INSERT INTO "StakingPool" (
          id, name, asset, "maxParticipants", "currentParticipants", 
          "minStake", "maxStake", apy, "lockPeriod", "totalStaked",
          "tradesPerDay", "percentPerTrade", description, "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `,
        [
          pool.id,
          pool.name,
          pool.asset,
          pool.maxParticipants,
          pool.currentParticipants,
          pool.minStake,
          pool.maxStake,
          pool.apy,
          pool.lockPeriod,
          pool.totalStaked,
          pool.tradesPerDay,
          pool.percentPerTrade,
          pool.description,
        ],
      )
    }

    // Seed mining rigs
    console.log("Seeding mining rigs...")
    const miningRigs = mockDb.getMiningRigs()
    for (const rig of miningRigs) {
      // Create a SQL query to insert mining rig
      await db.executeQuery(
        `
        INSERT INTO "MiningRig" (
          id, name, location, hashrate, algorithm, 
          "dailyReward", "rentalFeeHourly", "rentalFeeDaily", "rentalFeeWeekly", "rentalFeeMonthly",
          availability, "powerConsumption", "imageUrl", "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `,
        [
          rig.id,
          rig.name,
          rig.location,
          rig.hashrate,
          rig.algorithm,
          rig.dailyReward,
          rig.rentalFeeHourly,
          rig.rentalFeeDaily,
          rig.rentalFeeWeekly,
          rig.rentalFeeMonthly,
          rig.availability,
          rig.powerConsumption,
          rig.imageUrl,
        ],
      )
    }

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

export async function GET() {
  try {
    // Only allow seeding in development or with a special key
    if (process.env.NODE_ENV !== "production" || process.env.SEED_KEY === "allow_seeding") {
      await seedDatabase()
      return NextResponse.json({ success: true, message: "Database seeded successfully" })
    } else {
      return NextResponse.json({ error: "Seeding not allowed in production" }, { status: 403 })
    }
  } catch (error) {
    console.error("Error in seed API:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
