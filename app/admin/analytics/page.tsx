import { SimpleAnalytics } from "@/components/simple-analytics"
import { PageViewStats } from "@/components/admin/page-view-stats"

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Real-time Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PageViewStats />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SimpleAnalytics />
      </div>
    </div>
  )
}
