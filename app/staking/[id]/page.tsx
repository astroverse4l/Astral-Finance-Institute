"use client"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import RealTimeStakingPool from "@/components/real-time-staking-pool"

export default function StakingPoolPage() {
  const params = useParams()
  const poolId = params.id

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button variant="outline" className="border-white/20 text-white mr-4" asChild>
          <Link href="/staking">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Pools
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-white">Staking Pool Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RealTimeStakingPool poolId={poolId} />
        </div>
        <div>
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-white">Pool Information</CardTitle>
              <CardDescription className="text-white/70">How our staking pools work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-white/70">
              <div>
                <h3 className="text-white font-medium mb-2">Trading Schedule</h3>
                <p>
                  Our pools trade 5 times daily at scheduled intervals. Each trade involves 5% of the total staked
                  amount.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Returns</h3>
                <p>
                  All pools offer a fixed 15% APY, with returns calculated and compounded daily based on trading
                  performance.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Lock Period</h3>
                <p>
                  All staked assets are locked for 30 days from the date of staking. Early withdrawals are not
                  supported.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Pool Size</h3>
                <p>
                  Smaller pools require higher minimum stakes but offer more personalized management and potentially
                  better returns.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card mt-6">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-white/70">Latest pool transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">User0x58f3...e4a2</span>
                    <span className="text-green-400">+1.25 ETH</span>
                  </div>
                  <div className="text-white/50 text-xs mt-1">5 minutes ago</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">User0x72a1...b9c7</span>
                    <span className="text-green-400">+0.75 ETH</span>
                  </div>
                  <div className="text-white/50 text-xs mt-1">12 minutes ago</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Trade Execution</span>
                    <span className="text-blue-400">5% Pool</span>
                  </div>
                  <div className="text-white/50 text-xs mt-1">25 minutes ago</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">User0x39d2...f1e8</span>
                    <span className="text-green-400">+2.50 ETH</span>
                  </div>
                  <div className="text-white/50 text-xs mt-1">42 minutes ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
