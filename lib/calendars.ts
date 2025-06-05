// Calendar management functions
interface Calendar {
  id: string
  name: string
  description?: string
  color: string
  isVisible: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

// Simple in-memory storage (replace with database in production)
const calendars = new Map<string, Calendar[]>()

// Default calendars for new users
const defaultCalendars = [
  { name: "Personal", color: "#3B82F6", description: "Personal events and appointments" },
  { name: "Work", color: "#EF4444", description: "Work-related events and meetings" },
  { name: "Family", color: "#10B981", description: "Family events and activities" },
]

export async function getCalendars(userId: string): Promise<Calendar[]> {
  let userCalendars = calendars.get(userId)

  // Create default calendars if none exist
  if (!userCalendars || userCalendars.length === 0) {
    userCalendars = defaultCalendars.map((cal, index) => ({
      id: `${Date.now()}-${index}`,
      ...cal,
      isVisible: true,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    calendars.set(userId, userCalendars)
  }

  return userCalendars
}

export async function createCalendar(
  userId: string,
  calendarData: Omit<Calendar, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Calendar> {
  const calendar: Calendar = {
    ...calendarData,
    id: Date.now().toString(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const userCalendars = calendars.get(userId) || []
  userCalendars.push(calendar)
  calendars.set(userId, userCalendars)

  return calendar
}

export async function updateCalendar(
  calendarId: string,
  userId: string,
  calendarData: Partial<Omit<Calendar, "id" | "userId" | "createdAt">>,
): Promise<Calendar> {
  const userCalendars = calendars.get(userId) || []
  const calendarIndex = userCalendars.findIndex((c) => c.id === calendarId)

  if (calendarIndex === -1) {
    throw new Error("Calendar not found")
  }

  const updatedCalendar = {
    ...userCalendars[calendarIndex],
    ...calendarData,
    updatedAt: new Date().toISOString(),
  }

  userCalendars[calendarIndex] = updatedCalendar
  calendars.set(userId, userCalendars)

  return updatedCalendar
}

export async function deleteCalendar(calendarId: string, userId: string): Promise<void> {
  const userCalendars = calendars.get(userId) || []
  const filteredCalendars = userCalendars.filter((c) => c.id !== calendarId)

  if (filteredCalendars.length === userCalendars.length) {
    throw new Error("Calendar not found")
  }

  calendars.set(userId, filteredCalendars)
}
