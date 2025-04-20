import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/neon-db"
import { redisUtils } from "@/lib/redis-utils"

export default async function CoursesPage() {
  // Fetch courses from database with caching
  const courses = await redisUtils.cache.getCachedData(
    "courses:all",
    async () => {
      return db.courses.findMany({ published: true }, [{ featured: "desc" }, { rating: "desc" }])
    },
    3600, // Cache for 1 hour
  )

  // Group courses by category
  const coursesByCategory: Record<string, typeof courses> = {}

  courses.forEach((course) => {
    if (!coursesByCategory[course.category]) {
      coursesByCategory[course.category] = []
    }
    coursesByCategory[course.category].push(course)
  })

  // Get featured courses
  const featuredCourses = courses.filter((course) => course.featured).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Courses</h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Expand your knowledge with our comprehensive courses on cryptocurrency, forex, and web3 technologies.
        </p>
      </div>

      {featuredCourses.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="gradient-card overflow-hidden">
                <div className="h-40 bg-white/5 flex items-center justify-center">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl || "/placeholder.svg"}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-6xl text-white/20">{course.title.charAt(0)}</div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white">{course.title}</CardTitle>
                    {course.isDemo && <Badge>Free</Badge>}
                  </div>
                  <CardDescription className="text-white/70">
                    {course.category.charAt(0).toUpperCase() + course.category.slice(1)} • {course.level}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-white/70 line-clamp-2">{course.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/50 text-sm">Duration</p>
                        <p className="text-white font-medium">{course.duration}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Rating</p>
                        <p className="text-white font-medium">{course.rating.toFixed(1)}/5</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Students</p>
                        <p className="text-white font-medium">{course.students.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Price</p>
                        <p className="text-white font-medium">
                          {course.isDemo ? "Free" : `${course.price.toFixed(2)}`}
                        </p>
                      </div>
                    </div>

                    <Button className="w-full gradient-button" asChild>
                      <Link href={`/courses/${course.category}/${course.id}`}>View Course</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue={Object.keys(coursesByCategory)[0] || "forex"}>
        <TabsList className="grid grid-cols-4 mb-8">
          {Object.keys(coursesByCategory).map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(coursesByCategory).map(([category, categoryCourses]) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryCourses.map((course) => (
                <Card key={course.id} className="gradient-card overflow-hidden">
                  <div className="h-40 bg-white/5 flex items-center justify-center">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl || "/placeholder.svg"}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-6xl text-white/20">{course.title.charAt(0)}</div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white">{course.title}</CardTitle>
                      {course.isDemo && <Badge>Free</Badge>}
                    </div>
                    <CardDescription className="text-white/70">{course.level}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-white/70 line-clamp-2">{course.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-white/50 text-sm">Duration</p>
                          <p className="text-white font-medium">{course.duration}</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-sm">Rating</p>
                          <p className="text-white font-medium">{course.rating.toFixed(1)}/5</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-sm">Students</p>
                          <p className="text-white font-medium">{course.students.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-sm">Price</p>
                          <p className="text-white font-medium">
                            {course.isDemo ? "Free" : `${course.price.toFixed(2)}`}
                          </p>
                        </div>
                      </div>

                      <Button className="w-full gradient-button" asChild>
                        <Link href={`/courses/${course.category}/${course.id}`}>View Course</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
