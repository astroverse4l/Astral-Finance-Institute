import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/admin/dashboard-header"
import { testDatabaseConnection } from "@/lib/db"
import { redisUtils } from "@/lib/redis-utils"
import { Database, RefreshCw, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

export default async function DbStatusPage() {
  const dbStatus = await testDatabaseConnection()
  const redisStatus = redisUtils.isAvailable

  return (
    <div>
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Database Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className={`${dbStatus.connected ? "gradient-card" : "bg-red-900/20 border-red-500/30"}`}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Database Connection
              </CardTitle>
              <CardDescription className="text-white/70">
                Status of your Neon PostgreSQL database connection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-full mr-3 ${dbStatus.connected ? "bg-green-500/20" : "bg-red-500/20"}`}>
                  {dbStatus.connected ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">{dbStatus.connected ? "Connected" : "Connection Failed"}</div>
                  <div className="text-sm text-white/70">{dbStatus.message}</div>
                </div>
              </div>

              <form action="/api/db-test" method="GET">
                <Button type="submit" variant="outline" className="w-full border-white/20 text-white">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className={`${redisStatus ? "gradient-card" : "bg-yellow-900/20 border-yellow-500/30"}`}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Redis Connection
              </CardTitle>
              <CardDescription className="text-white/70">Status of your Redis cache and utilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-full mr-3 ${redisStatus ? "bg-green-500/20" : "bg-yellow-500/20"}`}>
                  {redisStatus ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">{redisStatus ? "Connected" : "Not Available"}</div>
                  <div className="text-sm text-white/70">
                    {redisStatus
                      ? "Redis is connected and working properly"
                      : "Redis is not available - the app will function with reduced features"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-white">Database Operations</CardTitle>
            <CardDescription className="text-white/70">Manage your database content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-white/70 mb-2">
                Seed the database with initial data. This will create sample courses, users, and other content.
              </p>
              <form action="/api/seed" method="GET">
                <Button type="submit" className="w-full">
                  <Loader2 className="mr-2 h-4 w-4" />
                  Seed Database
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card mt-6">
          <CardHeader>
            <CardTitle className="text-white">Database Information</CardTitle>
            <CardDescription className="text-white/70">Details about your database configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Connection Details</h3>
                <div className="bg-white/5 p-4 rounded-md">
                  <p className="text-white/70">
                    <strong className="text-white">Provider:</strong> PostgreSQL (Neon)
                  </p>
                  <p className="text-white/70">
                    <strong className="text-white">Connection URL:</strong> ******** (hidden for security)
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Troubleshooting</h3>
                <div className="bg-white/5 p-4 rounded-md">
                  <p className="text-white/70">If you're experiencing database connection issues, please check:</p>
                  <ul className="list-disc list-inside text-white/70 mt-2">
                    <li>Your environment variables are correctly set</li>
                    <li>The database server is running</li>
                    <li>Your IP is allowed to access the database</li>
                    <li>The database user has the correct permissions</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
