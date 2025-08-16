export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// localStorage-based authentication system
export const auth = {
  // Register a new user
  register: async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ user: User | null; error: string | null }> => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
      const userExists = existingUsers.find((u: User) => u.email === email)

      if (userExists) {
        return { user: null, error: "User already exists with this email" }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      }

      // Store user credentials (in real app, password would be hashed)
      const credentials = JSON.parse(localStorage.getItem("credentials") || "{}")
      credentials[email] = password
      localStorage.setItem("credentials", JSON.stringify(credentials))

      // Store user data
      existingUsers.push(newUser)
      localStorage.setItem("users", JSON.stringify(existingUsers))

      // Set current session
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      return { user: newUser, error: null }
    } catch (error) {
      return { user: null, error: "Registration failed" }
    }
  },

  // Sign in existing user
  signIn: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
    try {
      const credentials = JSON.parse(localStorage.getItem("credentials") || "{}")
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      if (credentials[email] !== password) {
        return { user: null, error: "Invalid email or password" }
      }

      const user = users.find((u: User) => u.email === email)
      if (!user) {
        return { user: null, error: "User not found" }
      }

      // Set current session
      localStorage.setItem("currentUser", JSON.stringify(user))

      return { user, error: null }
    } catch (error) {
      return { user: null, error: "Sign in failed" }
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem("currentUser")
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },

  // Sign out
  signOut: () => {
    localStorage.removeItem("currentUser")
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("currentUser")
  },
}
