import { db as neonDb } from "./neon-db"
import { mockDb } from "./mock-db"

// Check if we're in a real environment with database access
const hasDatabase = process.env.NEON_NEON_DATABASE_URL || process.env.DATABASE_URL

// Export the appropriate database interface
export const db = hasDatabase
  ? neonDb
  : {
      // User functions
      users: {
        findUnique: async (where: { id?: string; email?: string }) => {
          if (where.id) return mockDb.getUser(where.id)
          return mockDb.getUsers().find((user) => user.email === where.email) || null
        },
        findMany: async () => mockDb.getUsers(),
        count: async () => mockDb.getUsers().length,
        create: async (data: any) => mockDb.createUser(data),
        update: async (where: { id: string }, data: any) => {
          const user = mockDb.getUser(where.id)
          if (!user) return null

          Object.assign(user, data)
          return user
        },
      },

      // Course functions
      courses: {
        findUnique: async (where: { id: string }) => mockDb.getCourse(where.id),
        findUniqueWithDetails: async (where: { id: string }) => {
          const course = mockDb.getCourse(where.id)
          if (!course) return null

          // Return a simplified version with empty sections and reviews
          return {
            ...course,
            sections: [],
            reviews: [],
          }
        },
        findMany: async (where?: any, orderBy?: any) => {
          let courses = [...mockDb.getCourses()]

          // Apply filters if provided
          if (where?.category) {
            courses = courses.filter((course) => course.category === where.category)
          }

          if (where?.isDemo !== undefined) {
            courses = courses.filter((course) => course.isDemo === where.isDemo)
          }

          if (where?.featured !== undefined) {
            courses = courses.filter((course) => course.featured === where.featured)
          }

          // Handle simple ordering
          if (orderBy) {
            // This is simplified - would need more complex logic for multiple order fields
            courses.sort((a, b) => {
              const key = Object.keys(orderBy)[0]
              const direction = orderBy[key] === "desc" ? -1 : 1

              return a[key] > b[key] ? direction : -direction
            })
          }

          return courses
        },
        count: async (where?: { category?: string }) => {
          if (where?.category) {
            return mockDb.getCourses(where.category).length
          }
          return mockDb.getCourses().length
        },
        create: async (data: any) => {
          const course = {
            id: `course-${Date.now()}`,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          mockDb.courses.push(course)
          return course
        },
        update: async (where: { id: string }, data: any) => {
          const course = mockDb.getCourse(where.id)
          if (!course) return null

          Object.assign(course, data)
          return course
        },
        delete: async (where: { id: string }) => {
          const index = mockDb.courses.findIndex((c) => c.id === where.id)
          if (index === -1) return false

          mockDb.courses.splice(index, 1)
          return true
        },
      },

      // Staking pool functions
      stakingPools: {
        findUnique: async (where: { id: string }) => mockDb.getStakingPool(where.id),
        findMany: async (where?: { asset?: string }) => mockDb.getStakingPools(where?.asset),
        count: async () => mockDb.getStakingPools().length,
        update: async (where: { id: string }, data: any) => {
          const pool = mockDb.getStakingPool(where.id)
          if (!pool) return null

          Object.assign(pool, data)
          return pool
        },
      },

      // Mining rig functions
      miningRigs: {
        findUnique: async (where: { id: string }) => mockDb.getMiningRig(where.id),
        findMany: async (where?: { location?: string }) => mockDb.getMiningRigs(where?.location),
        count: async () => mockDb.getMiningRigs().length,
      },
    }

// Database connection testing
export async function testDatabaseConnection() {
  try {
    if (hasDatabase) {
      // If we have a real database, use neon's test function
      return await neonDb.testDatabaseConnection()
    } else {
      // For mock database, always return success
      return {
        connected: true,
        message: "Using mock database for development.",
      }
    }
  } catch (error) {
    console.error("Error testing database connection:", error)
    return {
      connected: false,
      message: error instanceof Error ? error.message : String(error),
    }
  }
}
