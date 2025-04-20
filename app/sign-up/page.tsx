"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { Apple, User, Mail, Lock, AlertCircle } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { FaMicrosoft } from "react-icons/fa"
import { BsFacebook } from "react-icons/bs"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { signIn } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate inputs
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Please fill in all fields")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (!agreedToTerms) {
        throw new Error("You must agree to the terms and conditions")
      }

      // Simulate email sign up
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll use the provider sign in method
      await signIn("email")

      toast({
        title: "Account created successfully",
        description: "Welcome to Astral Institute!",
      })

      router.push("/")
    } catch (err: any) {
      setError(err.message || "Failed to create account")
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: err.message || "An error occurred during sign up",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSignUp = async (provider: string) => {
    setIsLoading(true)
    setError("")

    try {
      await signIn(provider)

      toast({
        title: "Account created successfully",
        description: `Welcome to Astral Institute!`,
      })

      router.push("/")
    } catch (err: any) {
      setError(err.message || "Failed to create account")
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: err.message || "An error occurred during sign up",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <Card className="w-full max-w-md gradient-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">Create an Account</CardTitle>
          <CardDescription className="text-white/70">Choose your preferred sign up method</CardDescription>
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
                  onClick={() => handleProviderSignUp("google")}
                  disabled={isLoading}
                >
                  <FcGoogle className="mr-2 h-5 w-5" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="bg-black text-white hover:bg-gray-900 border-none"
                  onClick={() => handleProviderSignUp("apple")}
                  disabled={isLoading}
                >
                  <Apple className="mr-2 h-5 w-5" />
                  Apple
                </Button>
                <Button
                  variant="outline"
                  className="bg-[#0078d4] text-white hover:bg-[#106ebe] border-none"
                  onClick={() => handleProviderSignUp("microsoft")}
                  disabled={isLoading}
                >
                  <FaMicrosoft className="mr-2 h-5 w-5" />
                  Microsoft
                </Button>
                <Button
                  variant="outline"
                  className="bg-[#1877f2] text-white hover:bg-[#166fe5] border-none"
                  onClick={() => handleProviderSignUp("meta")}
                  disabled={isLoading}
                >
                  <BsFacebook className="mr-2 h-5 w-5" />
                  Meta
                </Button>
              </div>
            </CardContent>
          </TabsContent>
          <TabsContent value="credentials">
            <CardContent className="py-4">
              <form onSubmit={handleEmailSignUp}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-white">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10 bg-white/10 border-white/20 text-white"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
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
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
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
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-white/10 border-white/20 text-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      disabled={isLoading}
                      className="data-[state=checked]:bg-blue-600 border-white/20"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-white/70 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                        terms and conditions
                      </Link>
                    </label>
                  </div>
                  {error && (
                    <div className="bg-red-500/20 text-red-200 p-3 rounded-md flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <Button type="submit" className="gradient-button w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex flex-col space-y-4 mt-4">
          <div className="text-center text-white/70 text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
