import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
            <p className="text-slate-600 mt-2">Access your medical analysis dashboard</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
