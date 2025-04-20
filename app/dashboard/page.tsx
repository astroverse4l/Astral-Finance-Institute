import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, BookOpen, GraduationCap, TrendingUp, Users } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/dashboard")
  }

  const userId = session.user.id

  // Fetch user data with enrollments and progress
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
        take: 4,
      },
      achievements: {
        include: {
          achievement: true,
        },
        take: 3,
        orderBy: {
          awardedAt: "desc",
        },
      },
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

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

  // Get forum activity
  const forumActivity = await prisma.forumPost.findMany({
    where: { authorId: userId },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  })

  // Calculate overall progress
  const totalCourses = user.enrollments.length
  const completedCourses = user.enrollments.filter((e) => e.progress === 100).length
  const overallProgress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/70">Welcome back, {user.name}</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button asChild variant="outline" className="border-white/20 text-white">
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild>
            <Link href="/profile">View Profile</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="gradient-card">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="bg-white/10 p-2 rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Enrolled Courses</p>
              <p className="text-2xl font-bold text-white">{totalCourses}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="bg-white/10 p-2 rounded-full">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{completedCourses}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="bg-white/10 p-2 rounded-full">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Overall Progress</p>
              <p className="text-2xl font-bold text-white">{overallProgress}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="bg-white/10 p-2 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Forum Posts</p>
              <p className="text-2xl font-bold text-white">{forumActivity.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="forum">Forum Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <Card className="gradient-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Your Courses</CardTitle>
                    <Button variant="outline" className="border-white/20 text-white" asChild>
                      <Link href="/profile">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {user.enrollments.length > 0 ? (
                    <div className="space-y-4">
                      {user.enrollments.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="flex flex-col md:flex-row items-start md:items-center gap-4 p-3 bg-white/5 rounded-lg"
                        >
                          <div className="h-12 w-12 bg-white/10 rounded flex-shrink-0 flex items-center justify-center">
                            {enrollment.course.imageUrl ? (
                              <img
                                src={enrollment.course.imageUrl || "/placeholder.svg"}
                                alt={enrollment.course.title}
                                className="h-full w-full object-cover rounded"
                              />
                            ) : (
                              <span className="text-white text-lg">{enrollment.course.title.charAt(0)}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <h4 className="text-white font-medium truncate">{enrollment.course.title}</h4>
                              <span className="text-white/50 text-sm">{enrollment.progress}% complete</span>
                            </div>
                            <Progress value={enrollment.progress} className="h-1.5" />
                          </div>
                          <Button size="sm" className="mt-2 md:mt-0" asChild>
                            <Link href={`/courses/${enrollment.course.category}/${enrollment.course.id}`}>
                              Continue
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/70 mb-4">You haven't enrolled in any courses yet.</p>
                      <Button asChild>
                        <Link href="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start p-3 bg-white/5 rounded-lg">
                          <div className="bg-white/10 p-2 rounded-full mr-3">
                            {activity.completed ? (
                              <GraduationCap className="h-5 w-5 text-green-400" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-blue-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {activity.completed ? "Completed" : "Accessed"} lesson: {activity.lesson.title}
                            </div>
                            <div className="text-sm text-white/70 mt-1">
                              Course: {activity.lesson.courseSection.course.title}
                            </div>
                            <div className="text-xs text-white/50 mt-1">
                              {new Date(activity.lastAccessedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/70">No recent activity found.</p>
                      <p className="text-sm text-white/50 mt-1">Start learning to see your activity here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forum">
              <Card className="gradient-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Your Forum Activity</CardTitle>
                    <Button variant="outline" className="border-white/20 text-white" asChild>
                      <Link href="/community">Go to Forum</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {forumActivity.length > 0 ? (
                    <div className="space-y-4">
                      {forumActivity.map((post) => (
                        <div key={post.id} className="p-3 bg-white/5 rounded-lg">
                          <Link href={`/community/post/${post.id}`} className="font-medium text-white hover:underline">
                            {post.title}
                          </Link>
                          <p className="text-white/70 text-sm mt-1 line-clamp-2">{post.content}</p>
                          <div className="text-xs text-white/50 mt-2">
                            Posted on {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/70">You haven't posted in the forum yet.</p>
                      <Button className="mt-4" asChild>
                        <Link href="/community/new-post">Create a Post</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-white">Your Achievements</CardTitle>
              <CardDescription className="text-white/70">Badges and rewards you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              {user.achievements.length > 0 ? (
                <div className="space-y-3">
                  {user.achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center p-3 bg-white/5 rounded-lg">
                      <div className="bg-white/10 p-2 rounded-full mr-3">
                        {achievement.achievement.imageUrl ? (
                          <img
                            src={achievement.achievement.imageUrl || "/placeholder.svg"}
                            alt={achievement.achievement.name}
                            className="h-6 w-6"
                          />
                        ) : (
                          <GraduationCap className="h-6 w-6 text-yellow-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">{achievement.achievement.name}</div>
                        <div className="text-sm text-white/70">{achievement.achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-white/50">
                  <GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No achievements yet</p>
                  <p className="text-sm mt-1">Complete courses to earn achievements</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="gradient-card">
            <CardHeader>
              <CardTitle className="text-white">Recommended Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-white/5 rounded-lg">
                  <div className="h-10 w-10 bg-white/10 rounded flex-shrink-0 flex items-center justify-center mr-3">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Link
                      href="/courses/forex/advanced-forex-trading"
                      className="font-medium text-white hover:underline"
                    >
                      Advanced Forex Trading
                    </Link>
                    <div className="text-sm text-white/70">Based on your interests</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white/5 rounded-lg">
                  <div className="h-10 w-10 bg-white/10 rounded flex-shrink-0 flex items-center justify-center mr-3">
                    <BarChart className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Link href="/courses/crypto/defi-fundamentals" className="font-medium text-white hover:underline">
                      DeFi Fundamentals
                    </Link>
                    <div className="text-sm text-white/70">Popular in your category</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-white/5 rounded-lg">
                  <div className="h-10 w-10 bg-white/10 rounded flex-shrink-0 flex items-center justify-center mr-3">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <Link href="/courses/stocks/technical-analysis" className="font-medium text-white hover:underline">
                      Technical Analysis for Stocks
                    </Link>
                    <div className="text-sm text-white/70">Trending now</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
