"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPathRef = useRef<string | null>(null)

  useEffect(() => {
    // Only track if the path has changed
    if (pathname === lastPathRef.current) return

    lastPathRef.current = pathname

    async function trackPageView() {
      try {
        await fetch("/api/analytics/pageview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: pathname }),
        })
      } catch (error) {
        console.error("Failed to track page view:", error)
      }
    }

    trackPageView()
  }, [pathname])

  // This component doesn't render anything visible
  return null
}
