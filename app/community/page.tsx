import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OnlineUsers } from "@/components/online-users"
import { getOnlineUsers } from "@/lib/redis"
import prisma from "@/lib/prisma"

// Update the default function to be async and fetch online users
export default async function CommunityPage() {
  // Fetch forum categories and recent posts
  const categories = await prisma.forumCategory.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
  })

  const recentPosts = await prisma.forumPost.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
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
  })

  // Get online user count
  const onlineUserIds = await getOnlineUsers()
  const onlineUserCount = onlineUserIds.length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Community Forum</h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Connect with other traders, share insights, and learn from the community.
        </p>
        <div className="mt-4 text-white/80">
          <span className="inline-flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            {onlineUserCount} {onlineUserCount === 1 ? "user" : "users"} online now
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <OnlineUsers />
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Community Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Coming soon!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
