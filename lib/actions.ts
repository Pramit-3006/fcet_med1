"use server"

import { redirect } from "next/navigation"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  // Since server actions can't access localStorage, we'll return success
  // and handle the actual authentication on the client side
  return { success: true, email: email.toString() }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  // Since server actions can't access localStorage, we'll return success
  // and handle the actual registration on the client side
  return { success: true, email: email.toString() }
}

export async function signOut() {
  redirect("/")
}
