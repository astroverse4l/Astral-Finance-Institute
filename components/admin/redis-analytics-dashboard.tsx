"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { PieChart, Pie, Cell, Legend } from "recharts"
import { Users, View, ThumbsUp, MessageSquare, Share2, BookOpen } from "lucide-react"

interface PageViewStats {
  total: number
  [date: string]: number
}

interface UserStats {
  dau: number
  mau: number
  dauYesterday: number
  dauChange: number
}

interface ActionStats {
  view: number
  like: number
  comment: number
  share: number
  post: number
  enrollment: number
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F"]

export function RedisAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [pageViewStats, setPageViewStats] = useState<PageViewStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [actionStats, setActionStats] = useState<ActionStats | null>(null)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setIsLoading(true)

    try {
      // Fetch user stats
      const userResponse = await fetch("/api/analytics?type=users")
      if (userResponse.ok) {
        const data = await userResponse.json()
        setUserStats(data)
      }

      // Fetch action stats
      const actionResponse = await fetch("/api/analytics?type=actions")
      if (actionResponse.ok) {
        const data = await actionResponse.json()
        setActionStats(data)
      }

      // Fetch page view stats for home page
      const pageResponse = await fetch("/api/analytics?type=pageviews&page=/&days=7")
      if (pageResponse.ok) {
        const data = await pageResponse.json()
        setPageViewStats(data)
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Format page view data for chart
  const formatPageViewData = () => {
    if (!pageViewStats) return []

    return Object.entries(pageViewStats)
      .filter(([key]) => key !== "total")
      .map(([date, views]) => ({
        date: date.substring(5), // MM-DD format
        views,
      }))
      .reverse() // Show oldest to newest
  }

  // Format action data for pie chart
  const formatActionData = () => {
    if (!actionStats) return []

    return [
      { name: "Views", value: actionStats.view, icon: <View size={16} /> },
      { name: "Likes", value: actionStats.like, icon: <ThumbsUp size={16} /> },
      { name: "Comments", value: actionStats.comment, icon: <MessageSquare size={16} /> },
      { name: "Shares", value: actionStats.share, icon: <Share2 size={16} /> },
      { name: "Posts", value: actionStats.post, icon: <MessageSquare size={16} /> },
      { name: "Enrollments", value: actionStats.enrollment, icon: <BookOpen size={16} /> },
    ]
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Stats Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                  Active Users
                </CardTitle>
                <CardDescription>Daily and monthly active users</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
                  </div>
                ) : userStats ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold">{userStats.dau}</div>
                      <div className="text-sm text-muted-foreground">Daily Active Users</div>
                      <div className={`text-xs mt-1 ${userStats.dauChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {userStats.dauChange >= 0 ? "↑" : "↓"} {Math.abs(Math.round(userStats.dauChange))}% from
                        yesterday
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{userStats.mau}</div>
                      <div className="text-sm text-muted-foreground">Monthly Active Users</div>
                      <div className="text-xs mt-1 text-muted-foreground">
                        DAU/MAU Ratio: {userStats.mau ? Math.round((userStats.dau / userStats.mau) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">No data available</div>
                )}
              </CardContent>
            </Card>

            {/* Page Views Card */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <View className="mr-2 h-5 w-5 text-muted-foreground" />
                  Page Views
                </CardTitle>
                <CardDescription>Homepage views over last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {isLoading ? (
                  <div className="flex justify-center h-full items-center">
                    <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
                  </div>
                ) : pageViewStats ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formatPageViewData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" name="Views" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-6 text-muted-foreground h-full flex items-center justify-center">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Detailed analytics about user engagement</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              {isLoading ? (
                <div className="flex justify-center h-full items-center">
                  <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
                </div>
              ) : actionStats ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formatActionData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {formatActionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} actions`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-6 text-muted-foreground h-full flex items-center justify-center">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>Engagement metrics for your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">Coming soon!</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
