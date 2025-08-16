"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setError("Email and password are required")
      setLoading(false)
      return
    }

    try {
      const credentials = JSON.parse(localStorage.getItem("credentials") || "{}")
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      if (credentials[email] !== password) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }

      const user = users.find((u: any) => u.email === email)
      if (!user) {
        setError("User not found")
        setLoading(false)
        return
      }

      // Set current session
      localStorage.setItem("currentUser", JSON.stringify(user))

      router.push("/patients")
    } catch (error) {
      setError("Sign in failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="Enter your email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required placeholder="Enter your password" />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link href="/auth/sign-up" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </div>
    </form>
  )
}
