import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { UserAchievements } from "@/components/profile/user-achievements"
import { EnrolledCourses } from "@/components/profile/enrolled-courses"
import { ActivityFeed } from "@/components/profile/activity-feed"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/sign-in?callbackUrl=/profile")
  }

  const userId = session.user.id

  // Get user data with enrollments and progress
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          course: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
      achievements: {
        include: {
          achievement: true,
        },
        orderBy: {
          awardedAt: "desc",
        },
      },
    },
  })

  if (!user) {
    redirect("/sign-in")
  }

  // Calculate overall progress
  const totalCourses = user.enrollments.length
  const completedCourses = user.enrollments.filter((enrollment) => enrollment.progress === 100).length
  const overallProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0

  // Get recent activity
  const recentActivity = await prisma.courseProgress.findMany({
    where: { userId },
    include: {
      lesson: {
        include: {
          courseSection: {
            include: {
              course: true,
            },
          },
        },
      },
    },
    orderBy: {
      lastAccessedAt: "desc",
    },
    take: 5,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-white">Profile</CardTitle>
              <CardDescription className="text-white/70">Your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-white/10 mb-4">
                  {user.image ? (
                    <img
                      src={user.image || "/placeholder.svg"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                <p className="text-white/70 mt-1">{user.email}</p>
                <div className="mt-4 w-full">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70">Member since</span>
                    <span className="text-white">{formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70">Role</span>
                    <Badge variant="outline" className="text-white border-white/20">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card mt-6">
            <CardHeader>
              <CardTitle className="text-white">Learning Progress</CardTitle>
              <CardDescription className="text-white/70">Your overall course progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Overall Progress</span>
                    <span className="text-white">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totalCourses}</div>
                    <div className="text-white/70 text-sm">Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{completedCourses}</div>
                    <div className="text-white/70 text-sm">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.achievements.length}</div>
                    <div className="text-white/70 text-sm">Achievements</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <UserAchievements achievements={user.achievements.map((ua) => ua.achievement)} />
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <EnrolledCourses enrollments={user.enrollments} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityFeed activities={recentActivity} />
            </TabsContent>

            <TabsContent value="settings">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Account Settings</CardTitle>
                  <CardDescription className="text-white/70">Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70">Account settings will be implemented in a future update.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
