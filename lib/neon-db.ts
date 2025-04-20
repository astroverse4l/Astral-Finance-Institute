import { neon } from "@neondatabase/serverless"

// Create a SQL client with Neon
export const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

// Define types that match our database schema
export type User = {
  id: string
  name: string
  email: string
  emailVerified?: Date | null
  image?: string | null
  password?: string | null
  role: string
  bio?: string | null
  createdAt: Date
  updatedAt: Date
}

export type Course = {
  id: string
  title: string
  description: string
  category: string
  level: string
  duration: string
  price: number
  isDemo: boolean
  instructor: string
  imageUrl?: string | null
  students: number
  rating: number
  featured: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export type StakingPool = {
  id: string
  name: string
  asset: string
  maxParticipants: number
  currentParticipants: number
  minStake: number
  maxStake: number
  apy: number
  lockPeriod: number
  totalStaked: number
  tradesPerDay: number
  percentPerTrade: number
  description?: string | null
  createdAt: Date
  updatedAt: Date
}

export type MiningRig = {
  id: string
  name: string
  location: string
  hashrate: number
  algorithm: string
  dailyReward: number
  rentalFeeHourly: number
  rentalFeeDaily: number
  rentalFeeWeekly: number
  rentalFeeMonthly: number
  availability: number
  powerConsumption: number
  imageUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

export type CourseSection = {
  id: string
  title: string
  description?: string | null
  order: number
  courseId: string
  createdAt: Date
  updatedAt: Date
}

export type Lesson = {
  id: string
  title: string
  content: string
  videoUrl?: string | null
  duration: number
  order: number
  courseSectionId: string
  createdAt: Date
  updatedAt: Date
}

export type CourseReview = {
  id: string
  userId: string
  courseId: string
  rating: number
  comment?: string | null
  createdAt: Date
  updatedAt: Date
  user?: {
    id: string
    name: string
    image?: string | null
  }
}

export type CourseEnrollment = {
  id: string
  userId: string
  courseId: string
  progress: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Database operations
export const db = {
  // User operations
  users: {
    findUnique: async (where: { id?: string; email?: string }): Promise<User | null> => {
      try {
        let query = `SELECT * FROM "User" WHERE `
        const params = []

        if (where.id) {
          query += `id = $1`
          params.push(where.id)
        } else if (where.email) {
          query += `email = $1`
          params.push(where.email)
        } else {
          throw new Error("Must provide id or email")
        }

        const results = await sql(query, params)
        return results.length ? results[0] : null
      } catch (error) {
        console.error("Error in users.findUnique:", error)
        return null
      }
    },

    findMany: async (): Promise<User[]> => {
      try {
        return await sql`SELECT * FROM "User"`
      } catch (error) {
        console.error("Error in users.findMany:", error)
        return []
      }
    },

    count: async (): Promise<number> => {
      try {
        const result = await sql`SELECT COUNT(*) as count FROM "User"`
        return Number.parseInt(result[0].count)
      } catch (error) {
        console.error("Error in users.count:", error)
        return 0
      }
    },

    create: async (data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User | null> => {
      try {
        const id = `user_${Date.now()}`
        const now = new Date()

        const result = await sql`
          INSERT INTO "User" (
            id, name, email, image, password, role, bio, "createdAt", "updatedAt"
          ) VALUES (
            ${id}, ${data.name}, ${data.email}, ${data.image}, ${data.password}, 
            ${data.role || "user"}, ${data.bio}, ${now}, ${now}
          )
          RETURNING *
        `

        return result[0]
      } catch (error) {
        console.error("Error in users.create:", error)
        return null
      }
    },

    update: async (where: { id: string }, data: Partial<User>): Promise<User | null> => {
      try {
        const setClause = Object.entries(data)
          .map(([key, _], index) => `"${key}" = $${index + 2}`)
          .join(", ")

        const values = [where.id, ...Object.values(data)]

        const query = `
          UPDATE "User" 
          SET ${setClause}, "updatedAt" = NOW() 
          WHERE id = $1 
          RETURNING *
        `

        const result = await sql(query, values)
        return result[0]
      } catch (error) {
        console.error("Error in users.update:", error)
        return null
      }
    },
  },

  // Course operations
  courses: {
    findUnique: async (where: { id: string }): Promise<Course | null> => {
      try {
        const result = await sql`
          SELECT * FROM "Course" 
          WHERE id = ${where.id}
        `

        return result.length ? result[0] : null
      } catch (error) {
        console.error("Error in courses.findUnique:", error)
        return null
      }
    },

    findUniqueWithDetails: async (where: { id: string }): Promise<
      | (Course & {
          sections?: CourseSection[]
          reviews?: CourseReview[]
        })
      | null
    > => {
      try {
        // Get the course
        const course = await db.courses.findUnique(where)
        if (!course) return null

        // Get course sections
        const sections = await db.courseSections.findMany({
          where: { courseId: where.id },
          orderBy: { order: "asc" },
        })

        // Get course reviews
        const reviews = await db.courseReviews.findMany({
          where: { courseId: where.id },
          orderBy: { createdAt: "desc" },
          take: 5,
        })

        // Add user data to reviews
        for (const review of reviews) {
          const user = await db.users.findUnique({ id: review.userId })
          if (user) {
            review.user = {
              id: user.id,
              name: user.name,
              image: user.image,
            }
          }
        }

        // Get lessons for each section
        for (const section of sections) {
          const lessons = await db.lessons.findMany({
            where: { courseSectionId: section.id },
            orderBy: { order: "asc" },
          })
          section.lessons = lessons
        }

        return {
          ...course,
          sections,
          reviews,
        }
      } catch (error) {
        console.error("Error in courses.findUniqueWithDetails:", error)
        return null
      }
    },

    findMany: async (
      where?: {
        category?: string
        featured?: boolean
        isDemo?: boolean
        published?: boolean
      },
      orderBy?: any,
    ): Promise<Course[]> => {
      try {
        let query = `SELECT * FROM "Course"`
        const params = []
        let paramIndex = 1

        // Build WHERE clause if needed
        if (where && Object.keys(where).length > 0) {
          const whereConditions = []

          if (where.category) {
            whereConditions.push(`category = $${paramIndex++}`)
            params.push(where.category)
          }

          if (where.featured !== undefined) {
            whereConditions.push(`featured = $${paramIndex++}`)
            params.push(where.featured)
          }

          if (where.isDemo !== undefined) {
            whereConditions.push(`"isDemo" = $${paramIndex++}`)
            params.push(where.isDemo)
          }

          if (where.published !== undefined) {
            whereConditions.push(`published = $${paramIndex++}`)
            params.push(where.published)
          }

          if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(" AND ")}`
          }
        }

        // Add ORDER BY clause
        if (orderBy) {
          if (Array.isArray(orderBy)) {
            // Handle array of order by clauses
            const orderClauses = orderBy.map((order) => {
              const [field, direction] = Object.entries(order)[0]
              return `"${field}" ${direction === "desc" ? "DESC" : "ASC"}`
            })
            query += ` ORDER BY ${orderClauses.join(", ")}`
          } else {
            // Handle single order by clause
            const [field, direction] = Object.entries(orderBy)[0]
            query += ` ORDER BY "${field}" ${direction === "desc" ? "DESC" : "ASC"}`
          }
        }

        const results = await sql(query, params)
        return results
      } catch (error) {
        console.error("Error in courses.findMany:", error)
        return []
      }
    },

    count: async (where?: { category?: string }): Promise<number> => {
      try {
        let query = `SELECT COUNT(*) as count FROM "Course"`
        const params = []

        if (where?.category) {
          query += ` WHERE category = $1`
          params.push(where.category)
        }

        const result = await sql(query, params)
        return Number.parseInt(result[0].count)
      } catch (error) {
        console.error("Error in courses.count:", error)
        return 0
      }
    },

    create: async (data: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<Course | null> => {
      try {
        const id = `course_${Date.now()}`
        const now = new Date()

        const result = await sql`
          INSERT INTO "Course" (
            id, title, description, category, level, duration, price, 
            "isDemo", instructor, "imageUrl", students, rating, featured, 
            published, "createdAt", "updatedAt"
          ) VALUES (
            ${id}, ${data.title}, ${data.description}, ${data.category}, 
            ${data.level}, ${data.duration}, ${data.price}, ${data.isDemo}, 
            ${data.instructor}, ${data.imageUrl}, ${data.students}, 
            ${data.rating}, ${data.featured}, ${data.published}, ${now}, ${now}
          )
          RETURNING *
        `

        return result[0]
      } catch (error) {
        console.error("Error in courses.create:", error)
        return null
      }
    },

    update: async (where: { id: string }, data: Partial<Course>): Promise<Course | null> => {
      try {
        const setClause = Object.entries(data)
          .map(([key, _], index) => `"${key}" = $${index + 2}`)
          .join(", ")

        const values = [where.id, ...Object.values(data)]

        const query = `
          UPDATE "Course" 
          SET ${setClause}, "updatedAt" = NOW() 
          WHERE id = $1 
          RETURNING *
        `

        const result = await sql(query, values)
        return result[0]
      } catch (error) {
        console.error("Error in courses.update:", error)
        return null
      }
    },

    delete: async (where: { id: string }): Promise<boolean> => {
      try {
        await sql`DELETE FROM "Course" WHERE id = ${where.id}`
        return true
      } catch (error) {
        console.error("Error in courses.delete:", error)
        return false
      }
    },
  },

  // CourseSection operations
  courseSections: {
    findMany: async (
      {
        where: { courseId },
      }: {
        where: { courseId: string }
      },
      orderBy?: { order: "asc" | "desc" },
    ): Promise<CourseSection[]> => {
      try {
        let query = `SELECT * FROM "CourseSection" WHERE "courseId" = $1`

        if (orderBy) {
          query += ` ORDER BY "order" ${orderBy.order.toUpperCase()}`
        }

        return await sql(query, [courseId])
      } catch (error) {
        console.error("Error in courseSections.findMany:", error)
        return []
      }
    },
  },

  // Lesson operations
  lessons: {
    findMany: async (
      {
        where: { courseSectionId },
      }: {
        where: { courseSectionId: string }
      },
      orderBy?: { order: "asc" | "desc" },
    ): Promise<Lesson[]> => {
      try {
        let query = `SELECT * FROM "Lesson" WHERE "courseSectionId" = $1`

        if (orderBy) {
          query += ` ORDER BY "order" ${orderBy.order.toUpperCase()}`
        }

        return await sql(query, [courseSectionId])
      } catch (error) {
        console.error("Error in lessons.findMany:", error)
        return []
      }
    },
  },

  // CourseReview operations
  courseReviews: {
    findMany: async ({
      where: { courseId },
      orderBy,
      take,
    }: {
      where: { courseId: string }
      orderBy?: { createdAt: "desc" | "asc" }
      take?: number
    }): Promise<CourseReview[]> => {
      try {
        let query = `SELECT * FROM "CourseReview" WHERE "courseId" = $1`

        if (orderBy) {
          query += ` ORDER BY "${Object.keys(orderBy)[0]}" ${Object.values(orderBy)[0].toUpperCase()}`
        }

        if (take) {
          query += ` LIMIT ${take}`
        }

        return await sql(query, [courseId])
      } catch (error) {
        console.error("Error in courseReviews.findMany:", error)
        return []
      }
    },
  },

  // CourseEnrollment operations
  courseEnrollments: {
    findFirst: async ({
      where: { userId, courseId },
    }: {
      where: { userId: string; courseId: string }
    }): Promise<CourseEnrollment | null> => {
      try {
        const result = await sql`
          SELECT * FROM "CourseEnrollment" 
          WHERE "userId" = ${userId} AND "courseId" = ${courseId}
          LIMIT 1
        `

        return result.length ? result[0] : null
      } catch (error) {
        console.error("Error in courseEnrollments.findFirst:", error)
        return null
      }
    },
  },

  // StakingPool operations
  stakingPools: {
    findUnique: async (where: { id: string }): Promise<StakingPool | null> => {
      try {
        const result = await sql`
          SELECT * FROM "StakingPool" 
          WHERE id = ${where.id}
        `

        return result.length ? result[0] : null
      } catch (error) {
        console.error("Error in stakingPools.findUnique:", error)
        return null
      }
    },

    findMany: async (where?: { asset?: string }): Promise<StakingPool[]> => {
      try {
        if (where?.asset) {
          return await sql`
            SELECT * FROM "StakingPool" 
            WHERE asset = ${where.asset}
          `
        }

        return await sql`SELECT * FROM "StakingPool"`
      } catch (error) {
        console.error("Error in stakingPools.findMany:", error)
        return []
      }
    },

    count: async (): Promise<number> => {
      try {
        const result = await sql`SELECT COUNT(*) as count FROM "StakingPool"`
        return Number.parseInt(result[0].count)
      } catch (error) {
        console.error("Error in stakingPools.count:", error)
        return 0
      }
    },

    update: async (where: { id: string }, data: Partial<StakingPool>): Promise<StakingPool | null> => {
      try {
        const setClause = Object.entries(data)
          .map(([key, _], index) => `"${key}" = $${index + 2}`)
          .join(", ")

        const values = [where.id, ...Object.values(data)]

        const query = `
          UPDATE "StakingPool" 
          SET ${setClause}, "updatedAt" = NOW() 
          WHERE id = $1 
          RETURNING *
        `

        const result = await sql(query, values)
        return result[0]
      } catch (error) {
        console.error("Error in stakingPools.update:", error)
        return null
      }
    },
  },

  // MiningRig operations
  miningRigs: {
    findUnique: async (where: { id: string }): Promise<MiningRig | null> => {
      try {
        const result = await sql`
          SELECT * FROM "MiningRig" 
          WHERE id = ${where.id}
        `

        return result.length ? result[0] : null
      } catch (error) {
        console.error("Error in miningRigs.findUnique:", error)
        return null
      }
    },

    findMany: async (where?: { location?: string }): Promise<MiningRig[]> => {
      try {
        if (where?.location) {
          return await sql`
            SELECT * FROM "MiningRig" 
            WHERE location = ${where.location}
          `
        }

        return await sql`SELECT * FROM "MiningRig"`
      } catch (error) {
        console.error("Error in miningRigs.findMany:", error)
        return []
      }
    },

    count: async (): Promise<number> => {
      try {
        const result = await sql`SELECT COUNT(*) as count FROM "MiningRig"`
        return Number.parseInt(result[0].count)
      } catch (error) {
        console.error("Error in miningRigs.count:", error)
        return 0
      }
    },
  },

  // StakingPoolUser operations
  stakingPoolUsers: {
    create: async (data: {
      userId: string
      poolId: string
      amount: number
      endDate: Date
      active: boolean
    }): Promise<any> => {
      try {
        const id = `staking_${Date.now()}`
        const now = new Date()

        return await sql`
          INSERT INTO "StakingPoolUser" (
            id, "userId", "poolId", amount, "startDate", "endDate", active, "createdAt", "updatedAt"
          ) VALUES (
            ${id}, ${data.userId}, ${data.poolId}, ${data.amount}, ${now},
            ${data.endDate}, ${data.active}, ${now}, ${now}
          )
          RETURNING *
        `
      } catch (error) {
        console.error("Error in stakingPoolUsers.create:", error)
        return null
      }
    },
  },

  // Analytics operations
  analytics: {
    create: async (data: {
      event: string
      category: string
      value?: number
      metadata?: any
    }): Promise<any> => {
      try {
        const id = `analytics_${Date.now()}`
        const now = new Date()
        const metadata = data.metadata ? JSON.stringify(data.metadata) : null

        return await sql`
          INSERT INTO "Analytics" (
            id, event, category, value, metadata, "createdAt"
          ) VALUES (
            ${id}, ${data.event}, ${data.category}, ${data.value}, ${metadata}, ${now}
          )
          RETURNING *
        `
      } catch (error) {
        console.error("Error in analytics.create:", error)
        return null
      }
    },
  },
}

// Helper function to test database connection
export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 as connected`
    return {
      connected: result[0]?.connected === 1,
      message: "Successfully connected to Neon PostgreSQL database.",
    }
  } catch (error) {
    console.error("Database connection error:", error)
    return {
      connected: false,
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

// For direct SQL queries
export async function executeQuery(query: string, params: any[] = []) {
  try {
    return await sql(query, params)
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  }
}
