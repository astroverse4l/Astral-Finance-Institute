import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface Course {
  id: string
  title: string
  category: string
  level: string
  imageUrl: string | null
}

interface Enrollment {
  id: string
  progress: number
  course: Course
}

interface EnrolledCoursesProps {
  enrollments: Enrollment[]
}

export function EnrolledCourses({ enrollments }: EnrolledCoursesProps) {
  if (enrollments.length === 0) {
    return (
      <Card className="gradient-card">
        <CardContent className="pt-6 text-center">
          <p className="text-white/70 mb-4">You haven't enrolled in any courses yet.</p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {enrollments.map((enrollment) => (
        <Card key={enrollment.id} className="gradient-card overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 h-40 md:h-auto bg-white/5">
              {enrollment.course.imageUrl ? (
                <img
                  src={enrollment.course.imageUrl || "/placeholder.svg"}
                  alt={enrollment.course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/10">
                  <span className="text-white/50">No Image</span>
                </div>
              )}
            </div>
            <div className="p-4 flex-1">
              <h3 className="text-xl font-bold text-white">{enrollment.course.title}</h3>
              <div className="flex items-center mt-2 text-sm text-white/50">
                <span className="capitalize">{enrollment.course.category}</span>
                <span className="mx-2">•</span>
                <span>{enrollment.course.level}</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Progress</span>
                  <span className="text-white">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-2" />
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="border-white/20 text-white" asChild>
                  <Link href={`/courses/${enrollment.course.category}/${enrollment.course.id}`}>
                    Continue Learning
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
