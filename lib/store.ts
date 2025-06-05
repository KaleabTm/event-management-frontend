import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface Event {
  id: string
  title: string
  description?: string
  start: string
  end: string
  allDay: boolean
  color: string
  recurrence: {
    type: "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom"
    interval: number
    weekdays: number[]
    monthlyType: "date" | "weekday"
    weekdayOrdinal: number
    endDate?: string
    endAfter: number
  }
}

interface EventStore {
  events: Event[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchEvents: () => Promise<void>
  addEvent: (event: Omit<Event, "id">) => Promise<void>
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  setError: (error: string | null) => void
}

export const useEventStore = create<EventStore>()(
  devtools(
    (set, get) => ({
      events: [],
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

      setError: (error) => set({ error }),
    }),
    { name: "event-store" },
  ),
)
