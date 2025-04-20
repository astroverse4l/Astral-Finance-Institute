import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { redis } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const { userId, poolId, amount } = await request.json()

    if (!userId || !poolId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the staking pool
    const pool = await prisma.stakingPool.findUnique({
      where: { id: poolId },
      include: {
        users: true,
      },
    })

    if (!pool) {
      return NextResponse.json({ error: "Staking pool not found" }, { status: 404 })
    }

    // Check if pool is full
    if (pool.users.length >= pool.maxParticipants) {
      return NextResponse.json({ error: "Staking pool is full" }, { status: 400 })
    }

    // Check if amount is within limits
    if (amount < pool.minStake || amount > pool.maxStake) {
      return NextResponse.json(
        { error: `Stake amount must be between ${pool.minStake} and ${pool.maxStake}` },
        { status: 400 },
      )
    }

    // Calculate lock period end date
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + pool.lockPeriod)

    // Create staking pool user entry
    const stakingPoolUser = await prisma.stakingPoolUser.create({
      data: {
        userId,
        poolId,
        amount,
        endDate,
        active: true,
      },
    })

    // Update total staked amount in pool
    await prisma.stakingPool.update({
      where: { id: poolId },
      data: {
        totalStaked: { increment: amount },
      },
    })

    // Publish real-time update to Redis
    await redis.publish(
      "staking-pool-updates",
      JSON.stringify({
        type: "JOIN",
        poolId,
        userId,
        amount,
        timestamp: new Date().toISOString(),
      }),
    )

    return NextResponse.json({
      success: true,
      data: stakingPoolUser,
    })
  } catch (error) {
    console.error("Error joining staking pool:", error)
    return NextResponse.json({ error: "Failed to join staking pool" }, { status: 500 })
  }
}
