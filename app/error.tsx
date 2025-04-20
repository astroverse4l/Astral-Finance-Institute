"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white mb-6">Something went wrong</h1>
      <p className="text-xl text-white/80 mb-8">{error.message || "An unexpected error occurred"}</p>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium transition"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
