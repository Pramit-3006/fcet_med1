"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, UserPlus, Save, History } from "lucide-react"
import { signUp } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-[#2b725e] hover:bg-[#235e4c] text-white py-6 text-lg font-medium rounded-lg h-[60px]"
    >
      {pending ? (
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
  )
}

export default function SignUpForm() {
  const [state, formAction] = useActionState(signUp, null)

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

      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">{state.error}</div>
        )}

        {state?.success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded">
            {state.success}
          </div>
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

        <SubmitButton />

        <div className="text-center text-gray-400 text-sm">
          By registering, you can save and access your medical analysis files anytime
        </div>
      </form>
    </div>
  )
}
