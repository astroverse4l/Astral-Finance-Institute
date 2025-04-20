import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { db } from "@/lib/neon-db"
import { formatDate } from "@/lib/utils"
import DashboardHeader from "@/components/admin/dashboard-header"

export default async function CoursesAdminPage() {
  const courses = await db.courses.findMany({}, { updatedAt: "desc" })

  const categoryCounts = courses.reduce(
    (acc, course) => {
      acc[course.category] = (acc[course.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const averageRating =
    courses.length > 0 ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1) : "N/A"

  return (
    <div>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Course Management</h1>
          <Button className="gradient-button" asChild>
            <Link href="/admin/courses/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Course
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Total Courses</CardTitle>
              <CardDescription className="text-white/70">All courses in the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{courses.length}</div>
            </CardContent>
          </Card>
          <Card className="gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Total Students</CardTitle>
              <CardDescription className="text-white/70">Enrolled across all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalStudents.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Average Rating</CardTitle>
              <CardDescription className="text-white/70">Across all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{averageRating} / 5.0</div>
            </CardContent>
          </Card>
        </div>

        <Card className="gradient-card mb-8">
          <CardHeader>
            <CardTitle className="text-white">Categories</CardTitle>
            <CardDescription className="text-white/70">Distribution of courses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="bg-white/5 p-3 rounded-lg text-center">
                  <div className="text-lg font-medium text-white">{count}</div>
                  <div className="text-white/70 text-sm capitalize">{category}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-white">Recent Courses</CardTitle>
            <CardDescription className="text-white/70">Recently updated courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.slice(0, 5).map((course) => (
                <div key={course.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">{course.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{course.description.substring(0, 100)}...</p>
                      <div className="flex items-center mt-2 text-sm text-white/50">
                        <span className="capitalize">{course.category}</span>
                        <span className="mx-2">•</span>
                        <span>{course.level}</span>
                        <span className="mx-2">•</span>
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/50 text-sm">Updated {formatDate(course.updatedAt)}</div>
                      <Button variant="outline" size="sm" className="mt-2 border-white/20 text-white" asChild>
                        <Link href={`/admin/courses/${course.id}`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-white/20 text-white" asChild>
              <Link href="/admin/courses/all">View All Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
