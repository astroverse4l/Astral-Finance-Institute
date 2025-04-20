"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import { getLeaderboard } from "@/lib/redis"

interface LeaderboardEntry {
  member: string
  score: number
  name?: string
  avatar?: string
}

export function ForumLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true)
      try {
        const data = (await getLeaderboard("forum:leaderboard", 0, 9, true)) as Array<{ member: string; score: number }>

        // In a real app, you would fetch user details for each member
        // For this demo, we'll create mock user data
        const leaderboardWithDetails = data.map((entry, index) => {
          // Extract user ID from member string
          const userId = entry.member

          // Create mock user data
          return {
            ...entry,
            name: `User ${index + 1}`,
            avatar: `/placeholder.svg?height=40&width=40&text=U${index + 1}`,
          }
        })

        setLeaderboard(leaderboardWithDetails)
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()

    // Refresh leaderboard every 60 seconds
    const intervalId = setInterval(fetchLeaderboard, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const getLeaderIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-400" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-300" />
      case 2:
        return <Award className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="text-white">Top Contributors</CardTitle>
        <CardDescription className="text-white/70">Most active forum members</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.member}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index < 3 ? "bg-white/10" : "bg-white/5"
                } hover:bg-white/15 transition-colors`}
              >
                <div className="flex items-center">
                  <div className="w-8 text-center font-bold text-white/70">
                    {getLeaderIcon(index) || `#${index + 1}`}
                  </div>
                  <div className="h-8 w-8 rounded-full overflow-hidden ml-2 mr-3">
                    <img
                      src={entry.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={entry.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="font-medium text-white">{entry.name || entry.member}</div>
                </div>
                <div className="text-white/70 font-medium">{Math.round(entry.score)} pts</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/50">No data available</div>
        )}
      </CardContent>
    </Card>
  )
}
