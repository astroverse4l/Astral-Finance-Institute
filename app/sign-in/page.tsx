"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { signIn } = useAuth()
  const router = useRouter()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Please enter both email and password")
      }

      // Simulate email sign in
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll use the provider sign in method
      await signIn("email")

      router.push("/")
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSignIn = async (provider: string) => {
    setIsLoading(true)
    setError("")

    try {
      await signIn(provider)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <Card className="w-full max-w-md gradient-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
          <CardDescription className="text-white/70">Choose your preferred sign in method</CardDescription>
        </CardHeader>
        <Tabs defaultValue="providers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/20">
            <TabsTrigger value="providers" className="data-[state=active]:bg-blue-600">
              Providers
            </TabsTrigger>
            <TabsTrigger value="credentials" className="data-[state=active]:bg-blue-600">
              Email & Password
            </TabsTrigger>
          </TabsList>
          <TabsContent value="providers">
            <CardContent className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-100 border-none"
                  onClick={() => handleProviderSignIn("google")}
                  disabled={isLoading}
                >
                  <span className="mr-2">G</span>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="bg-black text-white hover:bg-gray-900 border-none"
                  onClick={() => handleProviderSignIn("apple")}
                  disabled={isLoading}
                >
                  <span className="mr-2">A</span>
                  Apple
                </Button>
                <Button
                  variant="outline"
                  className="bg-[#0078d4] text-white hover:bg-[#106ebe] border-none"
                  onClick={() => handleProviderSignIn("microsoft")}
                  disabled={isLoading}
                >
                  <span className="mr-2">M</span>
                  Microsoft
                </Button>
                <Button
                  variant="outline"
                  className="bg-[#1877f2] text-white hover:bg-[#166fe5] border-none"
                  onClick={() => handleProviderSignIn("meta")}
                  disabled={isLoading}
                >
                  <span className="mr-2">F</span>
                  Meta
                </Button>
              </div>
            </CardContent>
          </TabsContent>
          <TabsContent value="credentials">
            <CardContent className="py-4">
              <form onSubmit={handleEmailSignIn}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-white/50">📧</span>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 bg-white/10 border-white/20 text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white">
                        Password
                      </Label>
                      <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-white/50">🔒</span>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-white/10 border-white/20 text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="bg-red-500/20 text-red-200 p-3 rounded-md flex items-start">
                      <span>⚠️</span>
                      <span className="ml-2">{error}</span>
                    </div>
                  )}
                  <Button type="submit" className="gradient-button w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex flex-col space-y-4 mt-4">
          <div className="text-center text-white/70 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
