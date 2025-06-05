export interface Event {
  id: string
  title: string
  description?: string
  start: string
  end: string
  allDay: boolean
  color: string
  calendarId: string
  userId: string
  recurrence: {
    type: "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom"
    interval: number
    weekdays: number[]
    monthlyType: "date" | "weekday"
    weekdayOrdinal: number
    endDate?: string
    endAfter: number
  }
  createdAt: string
  updatedAt: string
}

export interface EventFormData {
  title: string
  description?: string
  start: string
  end: string
  allDay: boolean
  color: string
  calendarId: string
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
