import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Event } from "@/types/event"

// Fetch all events
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await fetch("/api/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      return response.json() as Promise<Event[]>
    },
  })
}

// Create a new event
export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (eventData: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">) => {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      return response.json() as Promise<Event>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })
}

// Update an existing event
export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, eventData }: { id: string; eventData: Partial<Event> }) => {
      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }

      return response.json() as Promise<Event>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })
}

// Delete an event
export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })
}

// Get events for a specific calendar
export function useEventsByCalendar(calendarId: string) {
  const { data: events = [] } = useEvents()
  return events.filter((event) => event.calendarId === calendarId)
}

// Get visible events (based on visible calendars)
export function useVisibleEvents(visibleCalendarIds: string[]) {
  const { data: events = [] } = useEvents()
  return events.filter((event) => visibleCalendarIds.includes(event.calendarId))
}
