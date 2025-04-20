"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PageViewStats {
  total: number
  today: number
}

export function PageViewStats() {
  const [stats, setStats] = useState<PageViewStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const res = await fetch("/api/analytics/stats")
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch analytics stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh stats periodically
    const interval = setInterval(fetchStats, 60000) // every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Views</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading stats...</div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm">Today</p>
              <p className="text-2xl font-bold">{stats.today}</p>
            </div>
            <div>
              <p className="text-sm">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        ) : (
          <div>No stats available</div>
        )}
      </CardContent>
    </Card>
  )
}
