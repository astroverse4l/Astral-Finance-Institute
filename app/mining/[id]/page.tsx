import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { getCachedData } from "@/lib/redis"

export default async function MiningRigPage({ params }: { params: { id: string } }) {
  // Fetch mining rig data with caching
  const miningRig = await getCachedData(
    `mining:rig:${params.id}`,
    async () => {
      return prisma.miningRig.findUnique({
        where: { id: params.id },
      })
    },
    3600, // Cache for 1 hour
  )

  if (!miningRig) {
    notFound()
  }

  // Calculate monthly profit
  const monthlyReward = miningRig.dailyReward * 30
  const monthlyFee = miningRig.rentalFeeMonthly
  const monthlyProfit = monthlyReward - monthlyFee

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">{miningRig.name}</h1>
            <div className="flex items-center mt-2">
              <Badge className="mr-2">{miningRig.algorithm}</Badge>
              <Badge variant="outline" className="border-white/20 text-white">
                {miningRig.location}
              </Badge>
              <Badge variant={miningRig.availability > 50 ? "default" : "destructive"} className="ml-2">
                {miningRig.availability}% Available
              </Badge>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg overflow-hidden mb-8">
            <div className="h-64 bg-white/10 flex items-center justify-center">
              {miningRig.imageUrl ? (
                <img
                  src={miningRig.imageUrl || "/placeholder.svg"}
                  alt={miningRig.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-9xl text-white/20">{miningRig.algorithm.charAt(0)}</div>
              )}
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Mining Rig Overview</CardTitle>
                  <CardDescription className="text-white/70">Key information about this mining rig</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/70">
                    This mining rig is optimized for {miningRig.algorithm} mining, located in our secure facility in{" "}
                    {miningRig.location}. With a hashrate of {miningRig.hashrate} TH/s, it provides excellent mining
                    performance for cryptocurrencies that use the {miningRig.algorithm} algorithm.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-white/50 text-sm">Hashrate</div>
                      <div className="text-white text-xl font-medium">{miningRig.hashrate} TH/s</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-white/50 text-sm">Power Consumption</div>
                      <div className="text-white text-xl font-medium">{miningRig.powerConsumption}W</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-white/50 text-sm">Daily Reward</div>
                      <div className="text-white text-xl font-medium">${miningRig.dailyReward.toFixed(4)}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-white/50 text-sm">Availability</div>
                      <div className="text-white text-xl font-medium">{miningRig.availability}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="space-y-4">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Technical Specifications</CardTitle>
                  <CardDescription className="text-white/70">
                    Detailed specifications of the mining hardware
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-white/50 text-sm">Algorithm</div>
                        <div className="text-white font-medium">{miningRig.algorithm}</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-white/50 text-sm">Hashrate</div>
                        <div className="text-white font-medium">{miningRig.hashrate} TH/s</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-white/50 text-sm">Power Consumption</div>
                        <div className="text-white font-medium">{miningRig.powerConsumption}W</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-white/50 text-sm">Efficiency</div>
                        <div className="text-white font-medium">
                          {(miningRig.powerConsumption / miningRig.hashrate).toFixed(2)} W/TH
                        </div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-white/50 text-sm">Location</div>
                        <div className="text-white font-medium">{miningRig.location}</div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <div className="text-white/50 text-sm">Cooling</div>
                        <div className="text-white font-medium">Liquid Cooling</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                  <CardDescription className="text-white/70">Historical performance and profitability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Estimated Rewards</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-white/50 text-sm">Daily</div>
                          <div className="text-white font-medium">${miningRig.dailyReward.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-sm">Weekly</div>
                          <div className="text-white font-medium">${(miningRig.dailyReward * 7).toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-sm">Monthly</div>
                          <div className="text-white font-medium">${monthlyReward.toFixed(4)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg">
                      <h3 className="text-white font-medium mb-2">Uptime Statistics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-white/50 text-sm">Last 24h</div>
                          <div className="text-white font-medium">99.8%</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-sm">Last 7 days</div>
                          <div className="text-white font-medium">99.5%</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-sm">Last 30 days</div>
                          <div className="text-white font-medium">99.2%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="gradient-card sticky top-20">
            <CardHeader>
              <CardTitle className="text-white">Rental Options</CardTitle>
              <CardDescription className="text-white/70">Choose your preferred rental period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">Hourly</div>
                      <div className="text-white/50 text-sm">Short-term rental</div>
                    </div>
                    <div className="text-white font-bold">${miningRig.rentalFeeHourly.toFixed(2)}</div>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">Daily</div>
                      <div className="text-white/50 text-sm">24-hour rental</div>
                    </div>
                    <div className="text-white font-bold">${miningRig.rentalFeeDaily.toFixed(2)}</div>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">Weekly</div>
                      <div className="text-white/50 text-sm">7-day rental</div>
                    </div>
                    <div className="text-white font-bold">${miningRig.rentalFeeWeekly.toFixed(2)}</div>
                  </div>
                </div>

                <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">Monthly</div>
                      <div className="text-white/50 text-sm">30-day rental</div>
                    </div>
                    <div className="text-white font-bold">${miningRig.rentalFeeMonthly.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70">Monthly Reward</span>
                  <span className="text-white">${monthlyReward.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70">Monthly Fee</span>
                  <span className="text-white">-${monthlyFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-white">Estimated Profit</span>
                  <span className={monthlyProfit > 0 ? "text-green-400" : "text-red-400"}>
                    ${monthlyProfit.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button className="w-full gradient-button">Rent Now</Button>

              <p className="text-xs text-white/50 text-center">
                Rental fees are charged upfront. Mining rewards are paid daily to your wallet.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card mt-6">
            <CardHeader>
              <CardTitle className="text-white">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">Have questions about mining or need assistance with your rental?</p>
              <Button variant="outline" className="w-full border-white/20 text-white">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
