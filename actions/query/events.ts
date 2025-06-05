import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Event } from "@/types/event"

// Client-side fetch functions
async function fetchEvents(): Promise<Event[]> {
  const response = await fetch("/api/events")
  if (!response.ok) {
    throw new Error("Failed to fetch events")
  }
  return response.json()
}

async function createEvent(eventData: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Event> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  })

  if (!response.ok) {
    throw new Error("Failed to create event")
  }

  return response.json()
}

async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
  const response = await fetch(`/api/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  })

  if (!response.ok) {
    throw new Error("Failed to update event")
  }

  return response.json()
}

async function deleteEvent(id: string): Promise<{ id: string }> {
  const response = await fetch(`/api/events/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete event")
  }

  return { id }
}

// Query hooks
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, eventData }: { id: string; eventData: Partial<Event> }) => updateEvent(id, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })
}

// Utility hooks
export function useEventsByCalendar(calendarId: string) {
  const { data: events = [] } = useEvents()
  return events.filter((event) => event.calendarId === calendarId)
}

export function useVisibleEvents(visibleCalendarIds: string[]) {
  const { data: events = [] } = useEvents()
  return events.filter((event) => visibleCalendarIds.includes(event.calendarId))
}
