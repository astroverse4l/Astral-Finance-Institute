// Mock database using in-memory storage for development
// This is used when the real database connections are not available

// Types
export type User = {
  id: string
  name: string
  email: string
  image?: string
  createdAt: Date
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
  imageUrl?: string
  students: number
  rating: number
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
  description?: string
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
  imageUrl?: string
}

// Mock data
const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date(),
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: new Date(),
  },
]

const courses: Course[] = [
  {
    id: "demo-forex-1",
    title: "Introduction to Forex Trading",
    description: "Learn the basics of forex markets, currency pairs, and fundamental analysis.",
    category: "forex",
    level: "Beginner",
    duration: "2 hours",
    price: 0,
    isDemo: true,
    instructor: "Sarah Johnson",
    imageUrl: "/placeholder.svg?height=200&width=350&text=Introduction+to+Forex",
    students: 15420,
    rating: 4.7,
  },
  {
    id: "demo-crypto-1",
    title: "Cryptocurrency Fundamentals",
    description: "Understand blockchain technology, major cryptocurrencies, and wallet security.",
    category: "crypto",
    level: "Beginner",
    duration: "3 hours",
    price: 0,
    isDemo: true,
    instructor: "Michael Chen",
    imageUrl: "/placeholder.svg?height=200&width=350&text=Crypto+Fundamentals",
    students: 22150,
    rating: 4.8,
  },
  {
    id: "course-forex-1",
    title: "Advanced Forex Trading Strategies",
    description: "Master advanced forex trading techniques used by professional traders.",
    category: "forex",
    level: "Advanced",
    duration: "8 hours",
    price: 99.99,
    isDemo: false,
    instructor: "Sarah Johnson",
    imageUrl: "/placeholder.svg?height=200&width=350&text=Advanced+Forex+Trading",
    students: 8320,
    rating: 4.9,
  },
]

const stakingPools: StakingPool[] = [
  {
    id: "pool1",
    name: "ETH Staking Pool (20)",
    asset: "ETH",
    maxParticipants: 20,
    currentParticipants: 12,
    minStake: 0.5,
    maxStake: 5,
    apy: 15,
    lockPeriod: 30,
    totalStaked: 35.75,
    tradesPerDay: 5,
    percentPerTrade: 5,
    description: "Join our ETH staking pool with up to 20 participants. Earn 15% APY with daily trading opportunities.",
  },
  {
    id: "pool2",
    name: "BTC Staking Pool (10)",
    asset: "BTC",
    maxParticipants: 10,
    currentParticipants: 7,
    minStake: 0.01,
    maxStake: 0.5,
    apy: 15,
    lockPeriod: 30,
    totalStaked: 2.35,
    tradesPerDay: 5,
    percentPerTrade: 5,
    description: "Join our BTC staking pool with up to 10 participants. Earn 15% APY with daily trading opportunities.",
  },
]

const miningRigs: MiningRig[] = [
  {
    id: "rig1",
    name: "AstralMiner Pro 1",
    location: "China",
    hashrate: 250,
    algorithm: "SHA-256",
    dailyReward: 0.0025,
    rentalFeeHourly: 3.75,
    rentalFeeDaily: 82.5,
    rentalFeeWeekly: 536.25,
    rentalFeeMonthly: 2062.5,
    availability: 98,
    powerConsumption: 2500,
    imageUrl: "/placeholder.svg?height=200&width=350&text=Mining+Rig",
  },
  {
    id: "rig2",
    name: "CryptoForge X1",
    location: "Kenya",
    hashrate: 180,
    algorithm: "Ethash",
    dailyReward: 0.0018,
    rentalFeeHourly: 2.7,
    rentalFeeDaily: 59.4,
    rentalFeeWeekly: 386.1,
    rentalFeeMonthly: 1485,
    availability: 95,
    powerConsumption: 1800,
    imageUrl: "/placeholder.svg?height=200&width=350&text=Mining+Rig",
  },
]

// Mock database functions
export const mockDb = {
  // User functions
  getUser: (id: string) => users.find((user) => user.id === id) || null,
  getUsers: () => [...users],
  createUser: (user: Omit<User, "id" | "createdAt">) => {
    const newUser = {
      ...user,
      id: `user${users.length + 1}`,
      createdAt: new Date(),
    }
    users.push(newUser)
    return newUser
  },

  // Course functions
  getCourse: (id: string) => courses.find((course) => course.id === id) || null,
  getCourses: (category?: string) =>
    category ? courses.filter((course) => course.category === category) : [...courses],
  getDemoCourses: () => courses.filter((course) => course.isDemo),

  // Staking pool functions
  getStakingPool: (id: string) => stakingPools.find((pool) => pool.id === id) || null,
  getStakingPools: (asset?: string) =>
    asset ? stakingPools.filter((pool) => pool.asset === asset) : [...stakingPools],
  joinStakingPool: (poolId: string, userId: string, amount: number) => {
    const pool = stakingPools.find((p) => p.id === poolId)
    if (!pool) return null
    if (pool.currentParticipants >= pool.maxParticipants) return null
    if (amount < pool.minStake || amount > pool.maxStake) return null

    pool.currentParticipants += 1
    pool.totalStaked += amount
    return pool
  },

  // Mining rig functions
  getMiningRig: (id: string) => miningRigs.find((rig) => rig.id === id) || null,
  getMiningRigs: (location?: string) =>
    location ? miningRigs.filter((rig) => rig.location === location) : [...miningRigs],
}
