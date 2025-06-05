import axiosInstance from "../axiosInstance"
import type { Calendar } from "@/types/calendar"

export async function fetchCalendarsAction(): Promise<Calendar[]> {
  try {
    const response = await axiosInstance.get("/calendars")
    return response.data
  } catch (error: any) {
    console.error("Fetch calendars error:", error)
    throw new Error(error.response?.data?.message || "Failed to fetch calendars")
  }
}

export async function createCalendarAction(
  calendarData: Omit<Calendar, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Calendar> {
  try {
    const response = await axiosInstance.post("/calendars", calendarData)
    return response.data
  } catch (error: any) {
    console.error("Create calendar error:", error)
    throw new Error(error.response?.data?.message || "Failed to create calendar")
  }
}

export async function updateCalendarAction(id: string, calendarData: Partial<Calendar>): Promise<Calendar> {
  try {
    const response = await axiosInstance.put(`/calendars/${id}`, calendarData)
    return response.data
  } catch (error: any) {
    console.error("Update calendar error:", error)
    throw new Error(error.response?.data?.message || "Failed to update calendar")
  }
}

export async function deleteCalendarAction(id: string): Promise<{ id: string }> {
  try {
    await axiosInstance.delete(`/calendars/${id}`)
    return { id }
  } catch (error: any) {
    console.error("Delete calendar error:", error)
    throw new Error(error.response?.data?.message || "Failed to delete calendar")
  }
}

export async function getCalendarByIdAction(id: string): Promise<Calendar> {
  try {
    const response = await axiosInstance.get(`/calendars/${id}`)
    return response.data
  } catch (error: any) {
    console.error("Get calendar error:", error)
    throw new Error(error.response?.data?.message || "Failed to fetch calendar")
  }
}
