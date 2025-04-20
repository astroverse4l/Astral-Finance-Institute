"use client"

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  const user = session?.user

  const signIn = async (email: string, password: string) => {
    return nextAuthSignIn("credentials", { email, password })
  }

  const signOut = async () => {
    return nextAuthSignOut()
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
  }
}
