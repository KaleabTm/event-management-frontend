import type { AxiosInstance } from "axios"
import axios from "axios"
import { getSession } from "next-auth/react"

axios.defaults.withCredentials = true

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api", // Default baseURL for API requests
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to handle session-based authorization
axiosInstance.interceptors.request.use(
  async (config) => {
    // Handle session authorization
    if (config.data instanceof FormData) {
      // Let Axios handle Content-Type for FormData
      delete config.headers["Content-Type"]
    }

    // Skip auth for login/register endpoints
    if (
      !config.url?.includes("auth/login") &&
      !config.url?.includes("auth/register") &&
      !config.url?.includes("auth/forgot-password") &&
      !config.url?.includes("auth/verify-otp") &&
      !config.url?.includes("auth/reset-password")
    ) {
      try {
        const session = await getSession()
        if (session?.user?.email) {
          config.headers.Authorization = `Bearer ${session.user.email}`
        }
      } catch (error) {
        console.error("Error getting session:", error)
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access - redirecting to login")
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
