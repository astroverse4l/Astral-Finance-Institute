"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function PresenceTracker() {
  const { data: session } = useSession()

  useEffect(() => {
    // Only track presence if user is logged in
    if (!session?.user?.id) return

    async function trackPresence() {
      try {
        await fetch("/api/presence", { method: "POST" })
      } catch (error) {
        console.error("Failed to update presence:", error)
      }
    }

    // Track presence immediately
    trackPresence()

    // Then set up interval to keep updating presence
    const interval = setInterval(trackPresence, 60000) // Every minute

    return () => clearInterval(interval)
  }, [session?.user?.id])

  // This component doesn't render anything visible
  return null
}
