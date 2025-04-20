import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Search</h1>
        <Card className="gradient-card">
          <CardContent className="pt-6 text-center">
            <p className="text-white/70">Please enter a search query to find courses and forum posts.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Search courses
  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ],
      published: true,
    },
    take: 20,
  })

  // Search forum posts
  const forumPosts = await prisma.forumPost.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: { comments: true },
      },
    },
    take: 20,
  })

  // Save search history if user is logged in
  // This would be done client-side after the search

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
      <p className="text-white/70 mb-8">
        Found {courses.length + forumPosts.length} results for "{query}"
      </p>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="all">All Results ({courses.length + forumPosts.length})</TabsTrigger>
          <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
          <TabsTrigger value="forum">Forum Posts ({forumPosts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {courses.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.slice(0, 3).map((course) => (
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
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="capitalize">{course.category}</Badge>
                        {course.isDemo && <Badge variant="secondary">Free</Badge>}
                      </div>
                      <Link
                        href={`/courses/${course.category}/${course.id}`}
                        className="text-lg font-medium text-white hover:underline"
                      >
                        {course.title}
                      </Link>
                      <p className="text-white/70 text-sm mt-2 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between mt-4 text-sm text-white/50">
                        <span>{course.level}</span>
                        <span>{course.duration}</span>
                        <span>★ {course.rating.toFixed(1)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {courses.length > 3 && (
                <div className="mt-4 text-center">
                  <Link href={`/search?q=${query}&type=courses`} className="text-white hover:underline">
                    View all {courses.length} courses
                  </Link>
                </div>
              )}
            </div>
          )}

          {forumPosts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-white mb-4">Forum Posts</h2>
              <div className="space-y-4">
                {forumPosts.slice(0, 5).map((post) => (
                  <Card key={post.id} className="gradient-card">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                          {post.author.image ? (
                            <img
                              src={post.author.image || "/placeholder.svg"}
                              alt={post.author.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-white text-sm font-bold">
                              {post.author.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/community/post/${post.id}`}
                            className="text-lg font-medium text-white hover:underline"
                          >
                            {post.title}
                          </Link>
                          <p className="text-white/70 text-sm mt-1 line-clamp-2">{post.content}</p>
                          <div className="flex items-center mt-2 text-xs text-white/50">
                            <span>{post.author.name}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span className="mx-2">•</span>
                            <span>{post._count.comments} comments</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {forumPosts.length > 5 && (
                <div className="mt-4 text-center">
                  <Link href={`/search?q=${query}&type=forum`} className="text-white hover:underline">
                    View all {forumPosts.length} forum posts
                  </Link>
                </div>
              )}
            </div>
          )}

          {courses.length === 0 && forumPosts.length === 0 && (
            <Card className="gradient-card">
              <CardContent className="pt-6 text-center">
                <p className="text-white/70">No results found for "{query}".</p>
                <p className="text-white/50 text-sm mt-2">Try different keywords or check your spelling.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="courses">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
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
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="capitalize">{course.category}</Badge>
                      {course.isDemo && <Badge variant="secondary">Free</Badge>}
                    </div>
                    <Link
                      href={`/courses/${course.category}/${course.id}`}
                      className="text-lg font-medium text-white hover:underline"
                    >
                      {course.title}
                    </Link>
                    <p className="text-white/70 text-sm mt-2">{course.description}</p>
                    <div className="flex items-center justify-between mt-4 text-sm text-white/50">
                      <span>{course.level}</span>
                      <span>{course.duration}</span>
                      <span>★ {course.rating.toFixed(1)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="gradient-card">
              <CardContent className="pt-6 text-center">
                <p className="text-white/70">No courses found for "{query}".</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="forum">
          {forumPosts.length > 0 ? (
            <div className="space-y-4">
              {forumPosts.map((post) => (
                <Card key={post.id} className="gradient-card">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                        {post.author.image ? (
                          <img
                            src={post.author.image || "/placeholder.svg"}
                            alt={post.author.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white text-sm font-bold">
                            {post.author.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/community/post/${post.id}`}
                          className="text-lg font-medium text-white hover:underline"
                        >
                          {post.title}
                        </Link>
                        <p className="text-white/70 text-sm mt-1">{post.content}</p>
                        <div className="flex items-center mt-2 text-xs text-white/50">
                          <span>{post.author.name}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>{post._count.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="gradient-card">
              <CardContent className="pt-6 text-center">
                <p className="text-white/70">No forum posts found for "{query}".</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
