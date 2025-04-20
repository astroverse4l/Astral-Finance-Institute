"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface User {
  id: string
  name: string
  image: string | null
  role: string
}

export function OnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Update user presence
    const updatePresence = async () => {
      try {
        await fetch("/api/presence", {
          method: "POST",
        })
      } catch (error) {
        console.error("Failed to update presence:", error)
      }
    }

    // Fetch online users
    const fetchOnlineUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/presence?limit=10")

        if (response.ok) {
          const users = await response.json()
          setOnlineUsers(users)
          setCount(users.length)
        }
      } catch (error) {
        console.error("Failed to fetch online users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    updatePresence()
    fetchOnlineUsers()

    // Set up intervals for periodic updates
    const presenceInterval = setInterval(updatePresence, 30000) // Every 30 seconds
    const fetchInterval = setInterval(fetchOnlineUsers, 60000) // Every minute

    return () => {
      clearInterval(presenceInterval)
      clearInterval(fetchInterval)
    }
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-green-500" />
          Online Members
          <Badge variant="outline" className="ml-2">
            {isLoading ? "..." : count}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-t-2 border-blue-500 rounded-full"></div>
          </div>
        ) : onlineUsers.length > 0 ? (
          <div className="space-y-3">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    {user.image ? (
                      <img src={user.image || "/placeholder.svg"} alt={user.name} />
                    ) : (
                      <div className="bg-blue-500 h-full w-full flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                </div>
                {user.role === "admin" && (
                  <Badge variant="secondary" className="text-xs">
                    Admin
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No users online</p>
        )}
      </CardContent>
    </Card>
  )
}
