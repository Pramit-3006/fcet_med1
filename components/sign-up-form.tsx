"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, UserPlus, Save, History } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setError("Email and password are required")
      setLoading(false)
      return
    }

    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const userExists = existingUsers.find((u: any) => u.email === email)

      if (userExists) {
        setError("User already exists with this email")
        setLoading(false)
        return
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        createdAt: new Date().toISOString(),
      }

      // Store user credentials
      const credentials = JSON.parse(localStorage.getItem("credentials") || "{}")
      credentials[email] = password
      localStorage.setItem("credentials", JSON.stringify(credentials))

      // Store user data
      existingUsers.push(newUser)
      localStorage.setItem("users", JSON.stringify(existingUsers))

      // Set current session
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      setSuccess("Account created successfully!")
      setTimeout(() => {
        router.push("/patients")
      }, 1000)
    } catch (error) {
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white">Create Your Account</h1>
        <p className="text-lg text-gray-400">Register to save and access your medical files</p>
      </div>

      <div className="bg-[#1c1c1c] border border-gray-800 rounded-lg p-4 space-y-3">
        <h3 className="text-white font-medium">Benefits of Registration:</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex items-center">
            <Save className="h-4 w-4 mr-2 text-green-400" />
            Save your medical image analysis results
          </div>
          <div className="flex items-center">
            <History className="h-4 w-4 mr-2 text-blue-400" />
            Access your analysis history anytime
          </div>
          <div className="flex items-center">
            <UserPlus className="h-4 w-4 mr-2 text-violet-400" />
            Manage patient records securely
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">{error}</div>}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded">{success}</div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="bg-[#1c1c1c] border-gray-800 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-[#1c1c1c] border-gray-800 text-white"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2b725e] hover:bg-[#235e4c] text-white py-6 text-lg font-medium rounded-lg h-[60px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Register & Save Files
            </>
          )}
        </Button>

        <div className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-400 hover:underline">
            Sign in here
          </Link>
        </div>
      </form>
    </div>
  )
}
