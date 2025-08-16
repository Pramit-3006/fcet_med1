import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export const supabase = (() => {
  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signUp: () => Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
        signInWithPassword: () =>
          Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
      }),
    }
  }

  try {
    return createClientComponentClient()
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: { message: "Network error" } }),
        getSession: () => Promise.resolve({ data: { session: null }, error: { message: "Network error" } }),
        signUp: () => Promise.resolve({ data: { user: null }, error: { message: "Network error" } }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: "Network error" } }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: { message: "Network error" } }),
        insert: () => Promise.resolve({ data: null, error: { message: "Network error" } }),
        update: () => Promise.resolve({ data: null, error: { message: "Network error" } }),
        delete: () => Promise.resolve({ data: null, error: { message: "Network error" } }),
      }),
    }
  }
})()

export function createClient() {
  return supabase
}
