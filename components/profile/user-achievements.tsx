import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  imageUrl?: string | null
  points: number
}

interface UserAchievementsProps {
  achievements: Achievement[]
}

export function UserAchievements({ achievements }: UserAchievementsProps) {
  return (
    <Card className="gradient-card mt-6">
      <CardHeader>
        <CardTitle className="text-white">Achievements</CardTitle>
        <CardDescription className="text-white/70">Your earned achievements</CardDescription>
      </CardHeader>
      <CardContent>
        {achievements.length > 0 ? (
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center p-3 bg-white/5 rounded-lg">
                <div className="bg-white/10 p-2 rounded-full mr-3">
                  {achievement.imageUrl ? (
                    <img src={achievement.imageUrl || "/placeholder.svg"} alt={achievement.name} className="h-6 w-6" />
                  ) : (
                    <Award className="h-6 w-6 text-yellow-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">{achievement.name}</div>
                  <div className="text-sm text-white/70">{achievement.description}</div>
                </div>
                <div className="ml-auto text-sm font-medium text-white/70">{achievement.points} pts</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-white/50">
            <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No achievements yet</p>
            <p className="text-sm mt-1">Complete courses to earn achievements</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
