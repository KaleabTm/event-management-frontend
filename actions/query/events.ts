import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../axiosInstance"
import type { Event } from "@/types/event"

// Client-side fetch functions using axios
async function fetchEvents(): Promise<Event[]> {
  const response = await axiosInstance.get("/events")
  return response.data
}

async function createEvent(eventData: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Event> {
  const response = await axiosInstance.post("/events", eventData)
  return response.data
}

async function updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
  const response = await axiosInstance.put(`/events/${id}`, eventData)
  return response.data
}

async function deleteEvent(id: string): Promise<{ id: string }> {
  await axiosInstance.delete(`/events/${id}`)
  return { id }
}

async function getEventById(id: string): Promise<Event> {
  const response = await axiosInstance.get(`/events/${id}`)
  return response.data
}

// Query hooks
export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => getEventById(id),
    enabled: !!id,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
      queryClient.invalidateQueries({ queryKey: ["events", data.id] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events"] })
      queryClient.removeQueries({ queryKey: ["events", data.id] })
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
