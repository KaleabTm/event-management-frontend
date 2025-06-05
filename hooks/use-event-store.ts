import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { Event } from "@/types/event"
import type { Calendar } from "@/types/calendar"

interface EventStore {
  events: Event[]
  calendars: Calendar[]
  isLoading: boolean
  error: string | null

  // Event Actions
  fetchEvents: () => Promise<void>
  addEvent: (event: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>

  // Calendar Actions
  fetchCalendars: () => Promise<void>
  addCalendar: (calendar: Omit<Calendar, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
  updateCalendar: (id: string, calendar: Partial<Calendar>) => Promise<void>
  deleteCalendar: (id: string) => Promise<void>
  toggleCalendarVisibility: (id: string) => void

  // Utility
  setError: (error: string | null) => void
  getVisibleEvents: () => Event[]
  getEventsByCalendar: (calendarId: string) => Event[]
}

export const useEventStore = create<EventStore>()(
  devtools(
    (set, get) => ({
      events: [],
      calendars: [],
      isLoading: false,
      error: null,

      fetchEvents: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/events")
          if (!response.ok) throw new Error("Failed to fetch events")

          const events = await response.json()
          set({ events, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch events",
            isLoading: false,
          })
        }
      },

      addEvent: async (eventData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
          })

          if (!response.ok) throw new Error("Failed to create event")

          const newEvent = await response.json()
          set((state) => ({
            events: [...state.events, newEvent],
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create event",
            isLoading: false,
          })
        }
      },

      updateEvent: async (id, eventData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/events/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
          })

          if (!response.ok) throw new Error("Failed to update event")

          const updatedEvent = await response.json()
          set((state) => ({
            events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update event",
            isLoading: false,
          })
        }
      },

      deleteEvent: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/events/${id}`, {
            method: "DELETE",
          })

          if (!response.ok) throw new Error("Failed to delete event")

          set((state) => ({
            events: state.events.filter((e) => e.id !== id),
            isLoading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to delete event",
            isLoading: false,
          })
        }
      },

      fetchCalendars: async () => {
        try {
          const response = await fetch("/api/calendars")
          if (!response.ok) throw new Error("Failed to fetch calendars")

          const calendars = await response.json()
          set({ calendars })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch calendars",
          })
        }
      },

      addCalendar: async (calendarData) => {
        try {
          const response = await fetch("/api/calendars", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(calendarData),
          })

          if (!response.ok) throw new Error("Failed to create calendar")

          const newCalendar = await response.json()
          set((state) => ({
            calendars: [...state.calendars, newCalendar],
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create calendar",
          })
        }
      },

      updateCalendar: async (id, calendarData) => {
        try {
          const response = await fetch(`/api/calendars/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(calendarData),
          })

          if (!response.ok) throw new Error("Failed to update calendar")

          const updatedCalendar = await response.json()
          set((state) => ({
            calendars: state.calendars.map((c) => (c.id === id ? updatedCalendar : c)),
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to update calendar",
          })
        }
      },

      deleteCalendar: async (id) => {
        try {
          const response = await fetch(`/api/calendars/${id}`, {
            method: "DELETE",
          })

          if (!response.ok) throw new Error("Failed to delete calendar")

          set((state) => ({
            calendars: state.calendars.filter((c) => c.id !== id),
            events: state.events.filter((e) => e.calendarId !== id),
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to delete calendar",
          })
        }
      },

      toggleCalendarVisibility: (id) => {
        set((state) => ({
          calendars: state.calendars.map((c) => (c.id === id ? { ...c, isVisible: !c.isVisible } : c)),
        }))
      },

      getVisibleEvents: () => {
        const { events, calendars } = get()
        const visibleCalendarIds = calendars.filter((c) => c.isVisible).map((c) => c.id)
        return events.filter((event) => visibleCalendarIds.includes(event.calendarId))
      },

      getEventsByCalendar: (calendarId) => {
        const { events } = get()
        return events.filter((event) => event.calendarId === calendarId)
      },

      setError: (error) => set({ error }),
    }),
    { name: "event-store" },
  ),
)
