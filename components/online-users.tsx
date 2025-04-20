"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OnlineUsers() {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function trackPresence() {
      try {
        // Send heartbeat to track user presence
        await fetch("/api/presence", { method: "POST" })
      } catch (error) {
        console.error("Failed to track presence:", error)
      }
    }

    async function fetchOnlineUsers() {
      try {
        setLoading(true)
        const res = await fetch("/api/presence")
        if (res.ok) {
          const data = await res.json()
          setCount(data.count)
        }
      } catch (error) {
        console.error("Failed to fetch online users:", error)
      } finally {
        setLoading(false)
      }
    }

    // Initial calls
    trackPresence()
    fetchOnlineUsers()

    // Set up intervals
    const presenceInterval = setInterval(trackPresence, 60000) // every minute
    const fetchInterval = setInterval(fetchOnlineUsers, 30000) // every 30 seconds

    return () => {
      clearInterval(presenceInterval)
      clearInterval(fetchInterval)
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Online Users</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="text-center text-2xl font-bold">
            {count} {count === 1 ? "user" : "users"} online
          </div>
        )}
      </CardContent>
    </Card>
  )
}
