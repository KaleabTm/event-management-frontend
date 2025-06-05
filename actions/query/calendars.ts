import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Calendar } from "@/types/calendar"

// Client-side fetch functions
async function fetchCalendars(): Promise<Calendar[]> {
  const response = await fetch("/api/calendars")
  if (!response.ok) {
    throw new Error("Failed to fetch calendars")
  }
  return response.json()
}

async function createCalendar(
  calendarData: Omit<Calendar, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Calendar> {
  const response = await fetch("/api/calendars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(calendarData),
  })

  if (!response.ok) {
    throw new Error("Failed to create calendar")
  }

  return response.json()
}

async function updateCalendar(id: string, calendarData: Partial<Calendar>): Promise<Calendar> {
  const response = await fetch(`/api/calendars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(calendarData),
  })

  if (!response.ok) {
    throw new Error("Failed to update calendar")
  }

  return response.json()
}

async function deleteCalendar(id: string): Promise<{ id: string }> {
  const response = await fetch(`/api/calendars/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete calendar")
  }

  return { id }
}

// Query hooks
export function useCalendars() {
  return useQuery({
    queryKey: ["calendars"],
    queryFn: fetchCalendars,
  })
}

export function useCreateCalendar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
    },
  })
}

export function useUpdateCalendar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, calendarData }: { id: string; calendarData: Partial<Calendar> }) =>
      updateCalendar(id, calendarData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
    },
  })
}

export function useDeleteCalendar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
      // Also invalidate events as they might be related to the deleted calendar
      queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })
}
