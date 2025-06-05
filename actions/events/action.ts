import axiosInstance from "../axiosInstance"
import type { Event } from "@/types/event"

export async function fetchEventsAction(): Promise<Event[]> {
  try {
    const response = await axiosInstance.get("/events")
    return response.data
  } catch (error: any) {
    console.error("Fetch events error:", error)
    throw new Error(error.response?.data?.message || "Failed to fetch events")
  }
}

export async function createEventAction(
  eventData: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Event> {
  try {
    const response = await axiosInstance.post("/events", eventData)
    return response.data
  } catch (error: any) {
    console.error("Create event error:", error)
    throw new Error(error.response?.data?.message || "Failed to create event")
  }
}

export async function updateEventAction(id: string, eventData: Partial<Event>): Promise<Event> {
  try {
    const response = await axiosInstance.put(`/events/${id}`, eventData)
    return response.data
  } catch (error: any) {
    console.error("Update event error:", error)
    throw new Error(error.response?.data?.message || "Failed to update event")
  }
}

export async function deleteEventAction(id: string): Promise<{ id: string }> {
  try {
    await axiosInstance.delete(`/events/${id}`)
    return { id }
  } catch (error: any) {
    console.error("Delete event error:", error)
    throw new Error(error.response?.data?.message || "Failed to delete event")
  }
}

export async function getEventByIdAction(id: string): Promise<Event> {
  try {
    const response = await axiosInstance.get(`/events/${id}`)
    return response.data
  } catch (error: any) {
    console.error("Get event error:", error)
    throw new Error(error.response?.data?.message || "Failed to fetch event")
  }
}
