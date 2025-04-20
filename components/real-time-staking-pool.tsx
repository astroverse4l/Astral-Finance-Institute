"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Percent, Clock, DollarSign, AlertCircle } from "lucide-react"
import { db } from "@/lib/db"

export default function RealTimeStakingPool({ poolId }) {
  const [pool, setPool] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stakeAmount, setStakeAmount] = useState("")
  const [isJoining, setIsJoining] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchStakingPool = async () => {
      setIsLoading(true)
      try {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get staking pool from our mock database
        const stakingPool = db.getStakingPool(poolId)

        if (!stakingPool) {
          throw new Error("Staking pool not found")
        }

        // Format the pool data for our component
        const formattedPool = {
          id: stakingPool.id,
          name: stakingPool.name,
          asset: stakingPool.asset,
          participants: {
            current: stakingPool.currentParticipants,
            max: stakingPool.maxParticipants,
          },
          minStake: stakingPool.minStake,
          maxStake: stakingPool.maxStake,
          apy: stakingPool.apy,
          lockPeriod: stakingPool.lockPeriod,
          totalStaked: stakingPool.totalStaked,
          nextTradeTime: getRandomNextTradeTime(),
          trades: {
            daily: stakingPool.tradesPerDay,
            percentPerTrade: stakingPool.percentPerTrade,
          },
          description: stakingPool.description,
        }

        setPool(formattedPool)
      } catch (error) {
        console.error("Error fetching staking pool:", error)
        toast({
          title: "Error",
          description: "Failed to load staking pool data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStakingPool()

    // Set up real-time updates
    const setupRealTimeUpdates = () => {
      // Simulate real-time updates with setInterval
      const interval = setInterval(() => {
        setPool((currentPool) => {
          if (!currentPool) return null

          // Randomly decide if we should update the pool
          if (Math.random() > 0.7) {
            // Simulate a new user joining or leaving
            const participantChange = Math.random() > 0.7 ? -1 : 1
            const newParticipants = Math.max(
              1,
              Math.min(currentPool.participants.current + participantChange, currentPool.participants.max),
            )

            // Simulate stake amount change
            const stakeChange = (Math.random() * 2 - 1) * currentPool.maxStake
            const newTotalStaked = Math.max(0, currentPool.totalStaked + stakeChange)

            // Show toast for the update
            if (participantChange > 0) {
              toast({
                title: "New Participant",
                description: `A new user has joined the ${currentPool.asset} staking pool with ${stakeChange.toFixed(2)} ${currentPool.asset}`,
              })
            }

            return {
              ...currentPool,
              participants: {
                ...currentPool.participants,
                current: newParticipants,
              },
              totalStaked: newTotalStaked,
              nextTradeTime: getRandomNextTradeTime(),
            }
          }

          return currentPool
        })
      }, 10000) // Check for updates every 10 seconds

      return () => clearInterval(interval)
    }

    const cleanup = setupRealTimeUpdates()
    return () => {
      if (typeof cleanup === "function") {
        cleanup()
      }
    }
  }, [poolId, toast])

  const getRandomNextTradeTime = () => {
    const hours = Math.floor(Math.random() * 4)
    const minutes = Math.floor(Math.random() * 60)
    return `${hours}h ${minutes}m`
  }

  const getParticipationPercentage = (current, max) => {
    return (current / max) * 100
  }

  const handleJoinPool = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join staking pools",
        variant: "destructive",
      })
      return
    }

    if (!pool) return

    if (!stakeAmount || isNaN(Number.parseFloat(stakeAmount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid stake amount",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(stakeAmount)

    if (amount < pool.minStake || amount > pool.maxStake) {
      toast({
        title: "Invalid Amount",
        description: `Stake amount must be between ${pool.minStake} and ${pool.maxStake} ${pool.asset}`,
        variant: "destructive",
      })
      return
    }

    setIsJoining(true)
    try {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update the pool in our mock database
      const updatedPool = db.joinStakingPool(pool.id, user.id, amount)

      if (!updatedPool) {
        throw new Error("Failed to join staking pool")
      }

      // Update local state
      setPool((currentPool) => {
        if (!currentPool) return null

        return {
          ...currentPool,
          participants: {
            ...currentPool.participants,
            current: Math.min(currentPool.participants.current + 1, currentPool.participants.max),
          },
          totalStaked: currentPool.totalStaked + amount,
        }
      })

      toast({
        title: "Success",
        description: `You have successfully joined the ${pool.asset} staking pool with ${amount} ${pool.asset}`,
      })

      // Reset stake amount
      setStakeAmount("")
    } catch (error) {
      console.error("Error joining staking pool:", error)
      toast({
        title: "Error",
        description: "Failed to join staking pool",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  if (isLoading || !pool) {
    return (
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-white">Staking Pool</CardTitle>
          <CardDescription className="text-white/70">Loading pool data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gradient-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">{pool.name}</CardTitle>
            <CardDescription className="text-white/70">{pool.description}</CardDescription>
          </div>
          <Badge className="bg-blue-600">{pool.asset}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white/70 text-sm">Participants</span>
              <span className="text-white/70 text-sm">
                {pool.participants.current}/{pool.participants.max}
              </span>
            </div>
            <Progress
              value={getParticipationPercentage(pool.participants.current, pool.participants.max)}
              className="h-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="text-white/70 text-sm mb-1">Min Stake</div>
              <div className="text-white font-medium">
                {pool.minStake} {pool.asset}
              </div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="text-white/70 text-sm mb-1">Max Stake</div>
              <div className="text-white font-medium">
                {pool.maxStake} {pool.asset}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <div className="text-white/70 text-sm mb-1">APY</div>
              <div className="flex items-center text-green-400 font-medium">
                <Percent className="h-4 w-4 mr-1" />
                {pool.apy}%
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white/70 text-sm mb-1">Lock Period</div>
              <div className="flex items-center text-white font-medium">
                <Clock className="h-4 w-4 mr-1" />
                {pool.lockPeriod} days
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white/70 text-sm mb-1">Total Staked</div>
              <div className="flex items-center text-white font-medium">
                <DollarSign className="h-4 w-4 mr-1" />
                {pool.totalStaked.toFixed(2)} {pool.asset}
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium">Next Trade</h3>
              <div className="flex items-center text-white/70 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>{pool.nextTradeTime}</span>
              </div>
            </div>
            <div className="text-white/70 text-sm">
              <p>
                This pool trades {pool.trades.daily}x daily, with {pool.trades.percentPerTrade}% of the total staked
                amount per trade.
              </p>
            </div>
          </div>

          {user ? (
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-3">Join Pool</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-grow">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder={`Enter amount (${pool.minStake}-${pool.maxStake})`}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/50"
                      min={pool.minStake}
                      max={pool.maxStake}
                      step="0.01"
                    />
                    <span className="absolute right-3 top-2 text-white/70">{pool.asset}</span>
                  </div>
                  <Button
                    className="gradient-button"
                    onClick={handleJoinPool}
                    disabled={isJoining || pool.participants.current >= pool.participants.max}
                  >
                    {isJoining ? "Joining..." : "Join"}
                  </Button>
                </div>
              </div>

              {pool.participants.current >= pool.participants.max && (
                <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                  <p className="text-white/80 text-sm">This pool is currently full. Please check back later.</p>
                </div>
              )}
            </div>
          ) : (
            <Button className="w-full gradient-button" asChild>
              <a href="/sign-in">Sign In to Join</a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
