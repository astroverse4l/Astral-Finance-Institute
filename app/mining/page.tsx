import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { getCachedData } from "@/lib/redis"

export default async function MiningPage() {
  // Fetch mining rigs from database with caching
  const miningRigs = await getCachedData(
    "mining:rigs",
    async () => {
      return prisma.miningRig.findMany({
        orderBy: [{ availability: "desc" }, { hashrate: "desc" }],
      })
    },
    3600, // Cache for 1 hour
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Cloud Mining</h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Rent mining rigs and earn cryptocurrency without the hassle of hardware maintenance, electricity costs, or
          technical setup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-white">No Hardware Required</CardTitle>
            <CardDescription className="text-white/70">Mine without physical equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/70">
              Skip the expensive hardware purchases and mine cryptocurrency using our state-of-the-art mining rigs
              hosted in secure facilities.
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-white">Flexible Contracts</CardTitle>
            <CardDescription className="text-white/70">Choose your mining duration</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/70">
              Select from hourly, daily, weekly, or monthly contracts to match your investment strategy and mining
              goals.
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-white">Multiple Algorithms</CardTitle>
            <CardDescription className="text-white/70">Mine different cryptocurrencies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/70">
              Choose from various mining algorithms including SHA-256 (Bitcoin), Ethash (Ethereum), Scrypt, and more.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-3xl font-bold text-white mb-6">Available Mining Rigs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {miningRigs.map((rig) => (
          <Card key={rig.id} className="gradient-card overflow-hidden">
            <div className="h-40 bg-white/5 flex items-center justify-center">
              {rig.imageUrl ? (
                <img src={rig.imageUrl || "/placeholder.svg"} alt={rig.name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-6xl text-white/20">{rig.algorithm.charAt(0)}</div>
              )}
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-white">{rig.name}</CardTitle>
                <Badge variant={rig.availability > 50 ? "default" : "destructive"}>{rig.availability}% Available</Badge>
              </div>
              <CardDescription className="text-white/70">
                {rig.location} • {rig.algorithm}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-sm">Hashrate</p>
                    <p className="text-white font-medium">{rig.hashrate} TH/s</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Daily Reward</p>
                    <p className="text-white font-medium">${rig.dailyReward.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Power</p>
                    <p className="text-white font-medium">{rig.powerConsumption}W</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Daily Fee</p>
                    <p className="text-white font-medium">${rig.rentalFeeDaily.toFixed(2)}</p>
                  </div>
                </div>

                <Button className="w-full gradient-button" asChild>
                  <Link href={`/mining/${rig.id}`}>Rent This Rig</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
