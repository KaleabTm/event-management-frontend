import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "../axiosInstance"
import type { Calendar } from "@/types/calendar"

// Client-side fetch functions using axios
async function fetchCalendars(): Promise<Calendar[]> {
  const response = await axiosInstance.get("/calendars")
  return response.data
}

async function createCalendar(
  calendarData: Omit<Calendar, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Calendar> {
  const response = await axiosInstance.post("/calendars", calendarData)
  return response.data
}

async function updateCalendar(id: string, calendarData: Partial<Calendar>): Promise<Calendar> {
  const response = await axiosInstance.put(`/calendars/${id}`, calendarData)
  return response.data
}

async function deleteCalendar(id: string): Promise<{ id: string }> {
  await axiosInstance.delete(`/calendars/${id}`)
  return { id }
}

async function getCalendarById(id: string): Promise<Calendar> {
  const response = await axiosInstance.get(`/calendars/${id}`)
  return response.data
}

// Query hooks
export function useCalendars() {
  return useQuery({
    queryKey: ["calendars"],
    queryFn: fetchCalendars,
  })
}

export function useCalendar(id: string) {
  return useQuery({
    queryKey: ["calendars", id],
    queryFn: () => getCalendarById(id),
    enabled: !!id,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
      queryClient.invalidateQueries({ queryKey: ["calendars", data.id] })
    },
  })
}

export function useDeleteCalendar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCalendar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] })
      queryClient.removeQueries({ queryKey: ["calendars", data.id] })
      // Also invalidate events as they might be related to the deleted calendar
      queryClient.invalidateQueries({ queryKey: ["events"] })
    },
  })
}
