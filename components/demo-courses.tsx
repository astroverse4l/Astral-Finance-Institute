"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star, Users, Clock, Play } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/db"

export default function DemoCourses() {
  const [demoCourses, setDemoCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchDemoCourses = async () => {
      setIsLoading(true)
      try {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Get demo courses from our mock database
        const courses = db.getDemoCourses()

        // Add progress for logged in users
        const coursesWithProgress = courses.map((course) => ({
          ...course,
          progress: user ? Math.floor(Math.random() * 100) : undefined,
        }))

        setDemoCourses(coursesWithProgress)
      } catch (error) {
        console.error("Error fetching demo courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDemoCourses()
  }, [user])

  const formatStudentCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Free Demo Courses</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-[360px] rounded-lg animate-pulse bg-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoCourses.map((course) => (
            <Link href={`/courses/${course.category}/${course.id}`} key={course.id} className="block h-full">
              <Card className="course-card h-full flex flex-col">
                <div className="relative">
                  <img
                    src={course.imageUrl || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 right-3 bg-green-600">Free</Badge>
                  <Badge className="absolute top-3 left-3 bg-blue-600">{course.category}</Badge>
                </div>
                <CardContent className="flex-grow p-4">
                  <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{course.description}</p>
                  <p className="text-white/80 text-sm">Instructor: {course.instructor}</p>

                  {course.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-white/70 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
                <div className="p-4 pt-0 border-t border-white/10 mt-auto">
                  <div className="flex justify-between items-center w-full text-sm text-white/70">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{formatStudentCount(course.students)}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" /> Start Learning
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
