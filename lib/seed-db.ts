import prisma from "./prisma"
import { mockDb } from "./mock-db"

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Check if database already has data
    const userCount = await prisma.user.count()
    const courseCount = await prisma.course.count()
    const stakingPoolCount = await prisma.stakingPool.count()
    const miningRigCount = await prisma.miningRig.count()

    if (userCount > 0 && courseCount > 0 && stakingPoolCount > 0 && miningRigCount > 0) {
      console.log("Database already seeded. Skipping...")
      return
    }

    // Seed users
    console.log("Seeding users...")
    const users = mockDb.getUsers()
    for (const user of users) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      })
    }

    // Seed courses
    console.log("Seeding courses...")
    const courses = mockDb.getCourses()
    for (const course of courses) {
      await prisma.course.upsert({
        where: { id: course.id },
        update: {},
        create: {
          id: course.id,
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
        },
      })
    }

    // Seed staking pools
    console.log("Seeding staking pools...")
    const stakingPools = mockDb.getStakingPools()
    for (const pool of stakingPools) {
      await prisma.stakingPool.upsert({
        where: { id: pool.id },
        update: {},
        create: {
          id: pool.id,
          name: pool.name,
          asset: pool.asset,
          maxParticipants: pool.maxParticipants,
          currentParticipants: pool.currentParticipants,
          minStake: pool.minStake,
          maxStake: pool.maxStake,
          apy: pool.apy,
          lockPeriod: pool.lockPeriod,
          totalStaked: pool.totalStaked,
          tradesPerDay: pool.tradesPerDay,
          percentPerTrade: pool.percentPerTrade,
          description: pool.description,
        },
      })
    }

    // Seed mining rigs
    console.log("Seeding mining rigs...")
    const miningRigs = mockDb.getMiningRigs()
    for (const rig of miningRigs) {
      await prisma.miningRig.upsert({
        where: { id: rig.id },
        update: {},
        create: {
          id: rig.id,
          name: rig.name,
          location: rig.location,
          hashrate: rig.hashrate,
          algorithm: rig.algorithm,
          dailyReward: rig.dailyReward,
          rentalFeeHourly: rig.rentalFeeHourly,
          rentalFeeDaily: rig.rentalFeeDaily,
          rentalFeeWeekly: rig.rentalFeeWeekly,
          rentalFeeMonthly: rig.rentalFeeMonthly,
          availability: rig.availability,
          powerConsumption: rig.powerConsumption,
          imageUrl: rig.imageUrl,
        },
      })
    }

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}
