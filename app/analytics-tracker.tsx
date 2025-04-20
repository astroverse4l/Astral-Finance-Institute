"use client"

import { usePageViewTracking } from "@/hooks/use-analytics"

export default function AnalyticsTracker() {
  // This component doesn't render anything, just tracks page views
  usePageViewTracking()
  return null
}
