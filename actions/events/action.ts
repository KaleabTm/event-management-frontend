"use server"

import type { Event } from "@/types/event"

export async function fetchEventsAction(): Promise<Event[]> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch events")
    }

    return await response.json()
  } catch (error) {
    console.error("Fetch events error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to fetch events")
  }
}

export async function createEventAction(
  eventData: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Event> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      throw new Error("Failed to create event")
    }

    return await response.json()
  } catch (error) {
    console.error("Create event error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to create event")
  }
}

export async function updateEventAction(id: string, eventData: Partial<Event>): Promise<Event> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      throw new Error("Failed to update event")
    }

    return await response.json()
  } catch (error) {
    console.error("Update event error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to update event")
  }
}

export async function deleteEventAction(id: string): Promise<{ id: string }> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/events/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete event")
    }

    return { id }
  } catch (error) {
    console.error("Delete event error:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to delete event")
  }
}
