import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Calendar } from "@/types/calendar"

// Fetch all calendars
export function useCalendars() {
  return useQuery({
    queryKey: ["calendars"],
    queryFn: async () => {
      const response = await fetch("/api/calendars")
      if (!response.ok) {
        throw new Error("Failed to fetch calendars")
      }
      return response.json() as Promise<Calendar[]>
    },
  })
}

// Create a new calendar
export function useCreateCalendar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (calendarData: Omit<Calendar, "id" | "userId" | "createdAt" | "updatedAt">) => {
      const response = await fetch("/api/calendars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(calendarData),
      })

      if (!response.ok) {
        throw new Error("Failed to create calendar")
      }

      return response.json() as Promise<Calendar>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
    },
  })
}

// Update an existing calendar
export function useUpdateCalendar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, calendarData }: { id: string; calendarData: Partial<Calendar> }) => {
      const response = await fetch(`/api/calendars/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(calendarData),
      })

      if (!response.ok) {
        throw new Error("Failed to update calendar")
      }

      return response.json() as Promise<Calendar>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
    },
  })
}

// Delete a calendar
export function useDeleteCalendar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/calendars/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete calendar")
      }

      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
      // Also invalidate events as they might be related to the deleted calendar
      queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })
}
