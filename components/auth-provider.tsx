"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { useSession } from "next-auth/react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

// Add the useAuth hook
export function useAuth() {
  const session = useSession()

  return {
    session: session.data,
    status: session.status,
    isAuthenticated: session.status === "authenticated",
    isLoading: session.status === "loading",
    user: session.data?.user,
  }
}
