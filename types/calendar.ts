export interface Calendar {
  id: string
  name: string
  description?: string
  color: string
  isVisible: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CalendarFormData {
  name: string
  description?: string
  color: string
  isVisible: boolean
}
