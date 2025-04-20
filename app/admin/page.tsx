import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-white">Database Management</CardTitle>
            <CardDescription className="text-white/70">Check and manage database connections</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 mb-4">
              Check the status of your database connection, view table statistics, and seed the database with initial
              data.
            </p>
            <Button className="w-full gradient-button" asChild>
              <Link href="/admin/db-status">Database Status</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-white">Content Management</CardTitle>
            <CardDescription className="text-white/70">Manage courses and educational content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 mb-4">
              Add, edit, or remove courses, lessons, and other educational content from the platform.
            </p>
            <Button className="w-full gradient-button" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-white">User Management</CardTitle>
            <CardDescription className="text-white/70">Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/80 mb-4">
              View and manage user accounts, roles, and permissions across the platform.
            </p>
            <Button className="w-full gradient-button" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
