import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { BookOpen, CheckCircle } from "lucide-react"

interface Activity {
  id: string
  completed: boolean
  lastAccessedAt: Date
  lesson: {
    id: string
    title: string
    courseSection: {
      course: {
        id: string
        title: string
        category: string
      }
    }
  }
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-white/70">Your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-white/70">No recent activity found.</p>
          <p className="text-sm text-white/50 mt-1">Start learning to see your activity here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription className="text-white/70">Your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start p-3 bg-white/5 rounded-lg">
              <div className="bg-white/10 p-2 rounded-full mr-3">
                {activity.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <BookOpen className="h-5 w-5 text-blue-400" />
                )}
              </div>
              <div>
                <div className="font-medium text-white">
                  {activity.completed ? "Completed" : "Accessed"} lesson: {activity.lesson.title}
                </div>
                <div className="text-sm text-white/70 mt-1">Course: {activity.lesson.courseSection.course.title}</div>
                <div className="text-xs text-white/50 mt-1">
                  {formatDistanceToNow(new Date(activity.lastAccessedAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
