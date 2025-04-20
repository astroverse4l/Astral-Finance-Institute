"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, BookOpen, Clock, Award } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

type CourseProgressProps = {
  courseId: string
}

type LessonStatus = {
  id: string
  title: string
  completed: boolean
  duration: number
}

type SectionStatus = {
  id: string
  title: string
  lessons: LessonStatus[]
  progress: number
}

export default function CourseProgress({ courseId }: CourseProgressProps) {
  const [sections, setSections] = useState<SectionStatus[]>([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchCourseProgress = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate it with a timeout
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock course sections and lessons
        const mockSections: SectionStatus[] = [
          {
            id: "section-1",
            title: "Getting Started",
            progress: 100,
            lessons: [
              {
                id: "lesson-1-1",
                title: "Introduction to the Course",
                completed: true,
                duration: 10,
              },
              {
                id: "lesson-1-2",
                title: "Setting Up Your Environment",
                completed: true,
                duration: 15,
              },
              {
                id: "lesson-1-3",
                title: "Basic Terminology",
                completed: true,
                duration: 20,
              },
            ],
          },
          {
            id: "section-2",
            title: "Fundamental Concepts",
            progress: 66,
            lessons: [
              {
                id: "lesson-2-1",
                title: "Market Structure",
                completed: true,
                duration: 25,
              },
              {
                id: "lesson-2-2",
                title: "Supply and Demand",
                completed: true,
                duration: 30,
              },
              {
                id: "lesson-2-3",
                title: "Risk Management",
                completed: false,
                duration: 35,
              },
            ],
          },
          {
            id: "section-3",
            title: "Advanced Strategies",
            progress: 0,
            lessons: [
              {
                id: "lesson-3-1",
                title: "Technical Analysis",
                completed: false,
                duration: 40,
              },
              {
                id: "lesson-3-2",
                title: "Fundamental Analysis",
                completed: false,
                duration: 45,
              },
              {
                id: "lesson-3-3",
                title: "Creating a Trading Plan",
                completed: false,
                duration: 50,
              },
            ],
          },
        ]

        setSections(mockSections)

        // Calculate overall progress
        const totalLessons = mockSections.reduce((acc, section) => acc + section.lessons.length, 0)
        const completedLessons = mockSections.reduce(
          (acc, section) => acc + section.lessons.filter((lesson) => lesson.completed).length,
          0,
        )
        setOverallProgress(Math.round((completedLessons / totalLessons) * 100))
      } catch (error) {
        console.error("Error fetching course progress:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseProgress()
  }, [courseId, user])

  const toggleLessonStatus = async (sectionId: string, lessonId: string) => {
    if (!user) return

    // Update local state
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          const updatedLessons = section.lessons.map((lesson) => {
            if (lesson.id === lessonId) {
              return { ...lesson, completed: !lesson.completed }
            }
            return lesson
          })

          const completedLessons = updatedLessons.filter((lesson) => lesson.completed).length
          const progress = Math.round((completedLessons / updatedLessons.length) * 100)

          return {
            ...section,
            lessons: updatedLessons,
            progress,
          }
        }
        return section
      }),
    )

    // Recalculate overall progress
    setTimeout(() => {
      const totalLessons = sections.reduce((acc, section) => acc + section.lessons.length, 0)
      const completedLessons = sections.reduce(
        (acc, section) => acc + section.lessons.filter((lesson) => lesson.completed).length,
        0,
      )
      setOverallProgress(Math.round((completedLessons / totalLessons) * 100))
    }, 0)

    // In a real app, you would make an API call to update the database
    // await fetch(`/api/courses/${courseId}/progress`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ sectionId, lessonId, completed: !lesson.completed }),
    // })
  }

  if (!user) {
    return (
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-white">Course Progress</CardTitle>
          <CardDescription className="text-white/70">
            Sign in to track your progress through this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full gradient-button">
            <a href="/sign-in">Sign In</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-white">Course Progress</CardTitle>
          <CardDescription className="text-white/70">Loading your progress...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gradient-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">Course Progress</CardTitle>
            <CardDescription className="text-white/70">Track your learning journey</CardDescription>
          </div>
          <Badge className={overallProgress === 100 ? "bg-green-600" : "bg-blue-600"}>
            {overallProgress}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Progress value={overallProgress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-white/70">
            <span>
              <BookOpen className="h-4 w-4 inline mr-1" />{" "}
              {sections.reduce((acc, section) => acc + section.lessons.length, 0)} Lessons
            </span>
            <span>
              <Clock className="h-4 w-4 inline mr-1" />{" "}
              {sections.reduce(
                (acc, section) => acc + section.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
                0,
              )}{" "}
              Minutes
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white/5 rounded-lg p-4">
              <div className="mb-3">
                <h3 className="text-lg font-medium text-white">{section.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <Progress value={section.progress} className="h-1.5 flex-grow mr-3" />
                  <span className="text-sm text-white/70">{section.progress}%</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleLessonStatus(section.id, lesson.id)}
                        className="mr-3 text-white/80 hover:text-white"
                      >
                        {lesson.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </button>
                      <span className={`${lesson.completed ? "text-white" : "text-white/70"}`}>{lesson.title}</span>
                    </div>
                    <span className="text-sm text-white/50">{lesson.duration} min</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {overallProgress === 100 && (
          <div className="mt-6 bg-green-600/20 border border-green-600/30 rounded-lg p-4 flex items-center">
            <Award className="h-6 w-6 text-green-400 mr-3" />
            <div>
              <h4 className="font-medium text-white">Congratulations!</h4>
              <p className="text-white/70 text-sm">You've completed this course. Keep up the great work!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
