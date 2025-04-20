"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// Hook to track page views
export function usePageViewTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    // Only track if pathname changes (not just search params)
    if (prevPathRef.current === pathname) return

    // Track page view
    const trackView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "pageview",
            page: pathname,
          }),
        })
      } catch (error) {
        // Silent fail for analytics
        console.error("Failed to track page view:", error)
      }
    }

    trackView()
    prevPathRef.current = pathname
  }, [pathname, searchParams])
}

// Hook to track user actions
export function useActionTracking() {
  const trackAction = async (action: string) => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "action",
          action,
        }),
      })
    } catch (error) {
      // Silent fail for analytics
      console.error("Failed to track action:", error)
    }
  }

  return { trackAction }
}
