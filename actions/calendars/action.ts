"use server"

import type { Calendar } from "@/types/calendar"

export async function fetchCalendarsAction(): Promise<Calendar[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/calendars`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch calendars")
    }

    return await response.json()
  } catch (error) {
    console.error("Fetch calendars error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch calendars")
  }
}

export async function createCalendarAction(
  calendarData: Omit<Calendar, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Calendar> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/calendars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendarData),
    })

    if (!response.ok) {
      throw new Error("Failed to create calendar")
    }

    return await response.json()
  } catch (error) {
    console.error("Create calendar error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to create calendar")
  }
}

export async function updateCalendarAction(id: string, calendarData: Partial<Calendar>): Promise<Calendar> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/calendars/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(calendarData),
    })

    if (!response.ok) {
      throw new Error("Failed to update calendar")
    }

    return await response.json()
  } catch (error) {
    console.error("Update calendar error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to update calendar")
  }
}

export async function deleteCalendarAction(id: string): Promise<{ id: string }> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/calendars/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete calendar")
    }

    return { id }
  } catch (error) {
    console.error("Delete calendar error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to delete calendar")
  }
}
