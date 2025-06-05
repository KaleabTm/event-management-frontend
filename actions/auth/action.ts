import axiosInstance from "../axiosInstance"
import type { AuthFormData } from "@/types/auth"

export async function loginAction(credentials: Omit<AuthFormData, "action">) {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Login error:", error)
    throw new Error(error.response?.data?.message || "Login failed")
  }
}

export async function registerAction(credentials: Omit<AuthFormData, "action">) {
  try {
    const response = await axiosInstance.post("/auth/register", {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
    })

    return { success: true, data: response.data }
  } catch (error: any) {
    console.error("Registration error:", error)
    throw new Error(error.response?.data?.message || "Registration failed")
  }
}

export async function logoutAction() {
  try {
    await axiosInstance.post("/auth/logout")
    return { success: true }
  } catch (error: any) {
    console.error("Logout error:", error)
    throw new Error(error.response?.data?.message || "Logout failed")
  }
}

export async function get_session() {
  try {
    const response = await axiosInstance.get("/auth/session")
    return response.data
  } catch (error: any) {
    console.error("Get session error:", error)
    return null
  }
}
