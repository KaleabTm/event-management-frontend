import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CalendarVisibilityState {
  visibleCalendarIds: string[]
  toggleCalendarVisibility: (id: string) => void
  setCalendarVisibility: (id: string, isVisible: boolean) => void
  setInitialCalendars: (calendarIds: string[]) => void
}

export const useCalendarVisibility = create<CalendarVisibilityState>()(
  persist(
    (set) => ({
      visibleCalendarIds: [],
      toggleCalendarVisibility: (id) =>
        set((state) => ({
          visibleCalendarIds: state.visibleCalendarIds.includes(id)
            ? state.visibleCalendarIds.filter((calId) => calId !== id)
            : [...state.visibleCalendarIds, id],
        })),
      setCalendarVisibility: (id, isVisible) =>
        set((state) => ({
          visibleCalendarIds: isVisible
            ? [...new Set([...state.visibleCalendarIds, id])]
            : state.visibleCalendarIds.filter((calId) => calId !== id),
        })),
      setInitialCalendars: (calendarIds) => set({ visibleCalendarIds: calendarIds }),
    }),
    {
      name: "calendar-visibility",
    },
  ),
)
