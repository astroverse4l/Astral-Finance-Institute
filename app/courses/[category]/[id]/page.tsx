import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { notFound } from "next/navigation"
import { db } from "@/lib/neon-db"
import { redisUtils } from "@/lib/redis-utils"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function CourseDetailPage({
  params,
}: {
  params: { category: string; id: string }
}) {
  // Get user session
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  // Fetch course data with caching
  const course = await redisUtils.cache.getCachedData(
    `course:${params.id}`,
    async () => {
      return db.courses.findUniqueWithDetails({ id: params.id })
    },
    3600, // Cache for 1 hour
  )

  if (!course) {
    notFound()
  }

  // Check if user is enrolled
  let enrollment = null
  if (userId) {
    enrollment = await db.courseEnrollments.findFirst({
      where: { userId, courseId: course.id },
    })
  }

  // Calculate total lessons
  const totalLessons = course.sections
    ? course.sections.reduce((total, section) => total + (section.lessons?.length || 0), 0)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">{course.title}</h1>
            <div className="flex items-center mt-2">
              <Badge className="mr-2 capitalize">{course.category}</Badge>
              <Badge variant="outline" className="border-white/20 text-white">
                {course.level}
              </Badge>
              {course.isDemo && (
                <Badge variant="secondary" className="ml-2">
                  Free
                </Badge>
              )}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg overflow-hidden mb-8">
            <div className="h-64 bg-white/10 flex items-center justify-center">
              {course.imageUrl ? (
                <img
                  src={course.imageUrl || "/placeholder.svg"}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-9xl text-white/20">{course.title.charAt(0)}</div>
              )}
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Course Overview</CardTitle>
                  <CardDescription className="text-white/70">What you'll learn in this course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/70">{course.description}</p>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-white/50 text-sm">Duration</div>
                      <div className="text-white text-xl font-medium">{course.duration}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-white/50 text-sm">Level</div>
                      <div className="text-white text-xl font-medium">{course.level}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-white/50 text-sm">Students</div>
                      <div className="text-white text-xl font-medium">{course.students.toLocaleString()}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg">
                      <div className="text-white/50 text-sm">Rating</div>
                      <div className="text-white text-xl font-medium">★ {course.rating.toFixed(1)}/5</div>
                    </div>
                  </div>

                  <div className="bg-white/5 p-4 rounded-lg mt-4">
                    <h3 className="text-white font-medium mb-2">What you'll learn</h3>
                    <ul className="space-y-2 text-white/70">
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Understand the fundamentals of {course.category} trading</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Learn advanced {course.category} analysis techniques</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Develop your own {course.category} trading strategy</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        <span>Manage risk effectively in {course.category} markets</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="curriculum" className="space-y-4">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Course Curriculum</CardTitle>
                  <CardDescription className="text-white/70">
                    {course.sections?.length || 0} sections • {totalLessons} lessons • {course.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.sections?.map((section, index) => (
                    <div key={section.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-medium">
                          Section {index + 1}: {section.title}
                        </h3>
                        <span className="text-white/50 text-sm">{section.lessons?.length || 0} lessons</span>
                      </div>
                      <div className="space-y-2 pl-4 border-l border-white/10">
                        {section.lessons?.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                              <span className="text-white/50 mr-2">
                                {index + 1}.{lessonIndex + 1}
                              </span>
                              <span className="text-white">{lesson.title}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-white/50 text-sm">{lesson.duration} min</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-4">
              <Card className="gradient-card">
                <CardHeader>
                  <CardTitle className="text-white">Meet Your Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-bold">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{course.instructor}</h3>
                      <p className="text-white/50 text-sm">
                        {course.category.charAt(0).toUpperCase() + course.category.slice(1)} Expert
                      </p>
                      <p className="text-white/70 mt-2">
                        Professional trader and educator with over 10 years of experience in {course.category} markets.
                        Specializes in technical analysis and risk management strategies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card className="gradient-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">Student Reviews</CardTitle>
                      <CardDescription className="text-white/70">
                        {course.reviews?.length || 0} reviews for this course
                      </CardDescription>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{course.rating.toFixed(1)}</div>
                      <div className="text-yellow-400">★★★★★</div>
                      <div className="text-white/50 text-sm">{course.students} students</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {course.reviews && course.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {course.reviews.map((review) => (
                        <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                          <div className="flex items-center mb-2">
                            <div className="h-8 w-8 rounded-full bg-white/10 mr-2 flex items-center justify-center">
                              {review.user?.image ? (
                                <img
                                  src={review.user.image || "/placeholder.svg"}
                                  alt={review.user.name}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <span className="text-white text-xs">{review.user?.name.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <div className="text-white font-medium">{review.user?.name}</div>
                              <div className="flex items-center">
                                <div className="text-yellow-400 text-sm">
                                  {"★".repeat(Math.floor(review.rating))}
                                  {"☆".repeat(5 - Math.floor(review.rating))}
                                </div>
                                <span className="text-white/50 text-xs ml-2">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-white/70">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/50 text-center py-4">No reviews yet for this course.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="gradient-card sticky top-20">
            <CardHeader>
              <CardTitle className="text-white">
                {course.isDemo ? "Enroll for Free" : `${course.price.toFixed(2)}`}
              </CardTitle>
              <CardDescription className="text-white/70">
                {course.isDemo ? "Start learning today" : "One-time payment, lifetime access"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {enrollment ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-white/70">Your progress</span>
                      <span className="text-white">{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                  </div>
                  <Button className="w-full gradient-button">Continue Learning</Button>
                </div>
              ) : (
                <Button className="w-full gradient-button">
                  {course.isDemo ? "Enroll Now - Free" : `Enroll Now - ${course.price.toFixed(2)}`}
                </Button>
              )}

              <div className="space-y-2 pt-4">
                <div className="flex items-start">
                  <span className="text-white/70 mr-2">✓</span>
                  <span className="text-white/70">{course.duration} of content</span>
                </div>
                <div className="flex items-start">
                  <span className="text-white/70 mr-2">✓</span>
                  <span className="text-white/70">{totalLessons} lessons</span>
                </div>
                <div className="flex items-start">
                  <span className="text-white/70 mr-2">✓</span>
                  <span className="text-white/70">Access on all devices</span>
                </div>
                <div className="flex items-start">
                  <span className="text-white/70 mr-2">✓</span>
                  <span className="text-white/70">Certificate of completion</span>
                </div>
                {course.isDemo ? null : (
                  <div className="flex items-start">
                    <span className="text-white/70 mr-2">✓</span>
                    <span className="text-white/70">30-day money-back guarantee</span>
                  </div>
                )}
              </div>

              <div className="pt-4 text-center">
                <p className="text-white/50 text-sm">
                  {course.isDemo ? "Start learning now - no payment required" : "Secure payment powered by Stripe"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card mt-6">
            <CardHeader>
              <CardTitle className="text-white">Share This Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="icon" className="rounded-full border-white/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-white/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-white/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
