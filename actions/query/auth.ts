import { useMutation } from "@tanstack/react-query"
import { signIn, signOut } from "next-auth/react"
import type { AuthFormData } from "@/types/auth"

// Auth mutation functions
async function login(credentials: Omit<AuthFormData, "action">) {
  const result = await signIn("credentials", {
    email: credentials.email,
    password: credentials.password,
    action: "login",
    redirect: false,
  })

  if (result?.error) {
    throw new Error(result.error)
  }

  return result
}

async function register(credentials: Omit<AuthFormData, "action">) {
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

  return result
}

async function logout() {
  await signOut({ callbackUrl: "/" })
}

// Auth hooks
export function useLogin() {
  return useMutation({
    mutationFn: login,
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  })
}
