"use server"

import { signIn, signOut } from "next-auth/react"
import type { AuthFormData } from "@/types/auth"

export async function loginAction(credentials: Omit<AuthFormData, "action">) {
  try {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      action: "login",
      redirect: false,
    })

    if (result?.error) {
      throw new Error(result.error)
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Login error:", error)
    throw new Error(error instanceof Error ? error.message : "Login failed")
  }
}

export async function registerAction(credentials: Omit<AuthFormData, "action">) {
  try {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      action: "register",
      redirect: false,
    })

    if (result?.error) {
      throw new Error(result.error)
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Registration error:", error)
    throw new Error(error instanceof Error ? error.message : "Registration failed")
  }
}

export async function logoutAction() {
  try {
    await signOut({ callbackUrl: "/" })
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    throw new Error("Logout failed")
  }
}
