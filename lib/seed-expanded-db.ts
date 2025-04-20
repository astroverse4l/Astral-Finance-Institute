import prisma from "./prisma"
import { hashPassword } from "./auth"

export async function seedExpandedDatabase() {
  console.log("Starting expanded database seeding...")

  try {
    // Create admin user if it doesn't exist
    const adminEmail = "admin@astralfinance.com"
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (!existingAdmin) {
      const hashedPassword = await hashPassword("admin123")
      await prisma.user.create({
        data: {
          name: "Admin User",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
        },
      })
      console.log("Admin user created")
    }

    // Create achievements
    const achievements = [
      {
        name: "First Steps",
        description: "Complete your first course",
        points: 10,
        imageUrl: null,
      },
      {
        name: "Knowledge Seeker",
        description: "Enroll in 5 different courses",
        points: 25,
        imageUrl: null,
      },
      {
        name: "Crypto Expert",
        description: "Complete all crypto courses",
        points: 50,
        imageUrl: null,
      },
      {
        name: "Forex Master",
        description: "Complete all forex courses",
        points: 50,
        imageUrl: null,
      },
      {
        name: "Web3 Pioneer",
        description: "Complete all web3 courses",
        points: 50,
        imageUrl: null,
      },
    ]

    for (const achievement of achievements) {
      const existingAchievement = await prisma.achievement.findUnique({
        where: { name: achievement.name },
      })

      if (!existingAchievement) {
        await prisma.achievement.create({
          data: achievement,
        })
      }
    }
    console.log("Achievements created")

    // Create expanded courses (15 per category)
    const categories = ["forex", "crypto", "web3", "stocks"]
    const levels = ["Beginner", "Intermediate", "Advanced"]

    for (const category of categories) {
      for (let i = 1; i <= 15; i++) {
        const level = levels[Math.floor(Math.random() * levels.length)]
        const price = Math.floor(Math.random() * 150) + 50
        const isDemo = i <= 3 // Make the first 3 courses in each category demos
        const rating = Math.random() * 2 + 3 // Random rating between 3 and 5
        const students = Math.floor(Math.random() * 1000) + 100

        const courseTitle = `${category.charAt(0).toUpperCase() + category.slice(1)} Mastery ${i}`

        // Check if course already exists
        const existingCourse = await prisma.course.findFirst({
          where: { title: courseTitle },
        })

        if (!existingCourse) {
          await prisma.course.create({
            data: {
              title: courseTitle,
              description: `A comprehensive course on ${category} trading and investment strategies. This course covers everything from basic concepts to advanced techniques for ${level.toLowerCase()} traders.`,
              category,
              level,
              duration: `${Math.floor(Math.random() * 20) + 5} hours`,
              price,
              isDemo,
              instructor: `Dr. ${["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"][Math.floor(Math.random() * 8)]}`,
              imageUrl: null,
              students,
              rating,
              featured: i === 1, // Make the first course in each category featured
            },
          })
        }
      }
    }
    console.log("Expanded courses created")

    // Create 15 mining rigs
    const algorithms = ["SHA-256", "Ethash", "Scrypt", "X11", "Equihash"]
    const locations = ["USA", "Canada", "Iceland", "Russia", "China", "Norway"]

    for (let i = 1; i <= 15; i++) {
      const algorithm = algorithms[Math.floor(Math.random() * algorithms.length)]
      const location = locations[Math.floor(Math.random() * locations.length)]
      const hashrate = Math.floor(Math.random() * 500) + 100
      const powerConsumption = Math.floor(Math.random() * 2000) + 1000
      const availability = Math.floor(Math.random() * 30) + 70 // 70-100%

      const rigName = `Mining Rig ${i} - ${algorithm}`

      // Check if rig already exists
      const existingRig = await prisma.miningRig.findFirst({
        where: { name: rigName },
      })

      if (!existingRig) {
        await prisma.miningRig.create({
          data: {
            name: rigName,
            location,
            hashrate,
            algorithm,
            dailyReward: Math.random() * 0.05 + 0.01,
            rentalFeeHourly: Math.random() * 2 + 0.5,
            rentalFeeDaily: Math.random() * 40 + 10,
            rentalFeeWeekly: Math.random() * 250 + 50,
            rentalFeeMonthly: Math.random() * 900 + 100,
            availability,
            powerConsumption,
            imageUrl: null,
          },
        })
      }
    }
    console.log("Expanded mining rigs created")

    // Create staking pools
    const assets = ["BTC", "ETH", "SOL", "ADA", "DOT", "AVAX", "MATIC"]

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i]
      const poolName = `${asset} Staking Pool`

      // Check if pool already exists
      const existingPool = await prisma.stakingPool.findFirst({
        where: { name: poolName },
      })

      if (!existingPool) {
        await prisma.stakingPool.create({
          data: {
            name: poolName,
            asset,
            maxParticipants: 100,
            currentParticipants: Math.floor(Math.random() * 50),
            minStake: 0.1,
            maxStake: 100,
            apy: Math.random() * 15 + 5, // 5-20% APY
            lockPeriod: [30, 60, 90, 180, 365][Math.floor(Math.random() * 5)],
            totalStaked: Math.random() * 1000 + 100,
            tradesPerDay: Math.floor(Math.random() * 10) + 5,
            percentPerTrade: Math.random() * 0.5 + 0.1,
            description: `Stake your ${asset} and earn passive income with our secure staking pool.`,
          },
        })
      }
    }
    console.log("Staking pools created")

    console.log("Database seeding completed successfully!")
    return { success: true }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error }
  }
}
