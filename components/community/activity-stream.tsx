"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, MessageSquare, ThumbsUp, BookOpen, Award, User } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ActivityItem {
  id: string
  userId: string
  userName: string
  userImage: string | null
  type: string
  content: string
  target: string
  createdAt: string
}

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "post":
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case "like":
      return <ThumbsUp className="h-4 w-4 text-pink-500" />
    case "enroll":
      return <BookOpen className="h-4 w-4 text-green-500" />
    case "achievement":
      return <Award className="h-4 w-4 text-yellow-500" />
    case "join":
      return <User className="h-4 w-4 text-purple-500" />
    default:
      return <Activity className="h-4 w-4 text-gray-500" />
  }
}

export function ActivityStream() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/activity-stream")

        if (response.ok) {
          const data = await response.json()
          setActivities(data)
        }
      } catch (error) {
        console.error("Failed to fetch activity stream:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchActivities()

    // Set up interval for periodic updates
    const interval = setInterval(fetchActivities, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return `${diffSecs}s ago`
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-t-2 border-blue-500 rounded-full"></div>
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    {activity.userImage ? (
                      <img src={activity.userImage || "/placeholder.svg"} alt={activity.userName} />
                    ) : (
                      <div className="bg-blue-500 h-full w-full flex items-center justify-center text-white">
                        {activity.userName.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">{activity.userName}</p>
                    <Badge variant="outline" className="ml-2 flex items-center space-x-1 px-1.5 py-0">
                      <ActivityIcon type={activity.type} />
                      <span className="text-xs">{activity.type}</span>
                    </Badge>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatRelativeTime(activity.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
        )}
      </CardContent>
    </Card>
  )
}
