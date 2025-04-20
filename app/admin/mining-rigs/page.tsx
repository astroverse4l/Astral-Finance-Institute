import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import prisma from "@/lib/prisma"
import DashboardHeader from "@/components/admin/dashboard-header"

export default async function MiningRigsAdminPage() {
  const miningRigs = await prisma.miningRig.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  })

  const locationCounts = miningRigs.reduce(
    (acc, rig) => {
      acc[rig.location] = (acc[rig.location] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const algorithmCounts = miningRigs.reduce(
    (acc, rig) => {
      acc[rig.algorithm] = (acc[rig.algorithm] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalHashrate = miningRigs.reduce((sum, rig) => sum + rig.hashrate, 0)
  const averageAvailability =
    miningRigs.length > 0
      ? Math.round(miningRigs.reduce((sum, rig) => sum + rig.availability, 0) / miningRigs.length)
      : 0

  return (
    <div>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Mining Rig Management</h1>
          <Button className="gradient-button" asChild>
            <Link href="/admin/mining-rigs/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Mining Rig
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Total Mining Rigs</CardTitle>
              <CardDescription className="text-white/70">All mining rigs in the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{miningRigs.length}</div>
            </CardContent>
          </Card>
          <Card className="gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Total Hashrate</CardTitle>
              <CardDescription className="text-white/70">Combined hashrate of all rigs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalHashrate.toLocaleString()} TH/s</div>
            </CardContent>
          </Card>
          <Card className="gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Average Availability</CardTitle>
              <CardDescription className="text-white/70">Across all mining rigs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{averageAvailability}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-white">Locations</CardTitle>
              <CardDescription className="text-white/70">Distribution of mining rigs by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(locationCounts).map(([location, count]) => (
                  <div key={location} className="bg-white/5 p-3 rounded-lg text-center">
                    <div className="text-lg font-medium text-white">{count}</div>
                    <div className="text-white/70 text-sm">{location}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-white">Algorithms</CardTitle>
              <CardDescription className="text-white/70">Distribution of mining rigs by algorithm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(algorithmCounts).map(([algorithm, count]) => (
                  <div key={algorithm} className="bg-white/5 p-3 rounded-lg text-center">
                    <div className="text-lg font-medium text-white">{count}</div>
                    <div className="text-white/70 text-sm">{algorithm}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-white">Recent Mining Rigs</CardTitle>
            <CardDescription className="text-white/70">Recently updated mining rigs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {miningRigs.slice(0, 5).map((rig) => (
                <div key={rig.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">{rig.name}</h3>
                      <div className="flex items-center mt-2 text-sm text-white/50">
                        <span>{rig.location}</span>
                        <span className="mx-2">•</span>
                        <span>{rig.algorithm}</span>
                        <span className="mx-2">•</span>
                        <span>{rig.hashrate} TH/s</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/50 text-sm">{rig.availability}% Available</div>
                      <Button variant="outline" size="sm" className="mt-2 border-white/20 text-white" asChild>
                        <Link href={`/admin/mining-rigs/${rig.id}`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-white/20 text-white" asChild>
              <Link href="/admin/mining-rigs/all">View All Mining Rigs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
