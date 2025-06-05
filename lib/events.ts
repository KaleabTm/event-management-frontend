// In a real app, this would use a database like Prisma with PostgreSQL
interface Event {
  id: string
  title: string
  description?: string
  start: string
  end: string
  allDay: boolean
  color: string
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

// Simple in-memory storage (replace with database in production)
const events = new Map<string, Event[]>()

export async function getEvents(userId: string): Promise<Event[]> {
  return events.get(userId) || []
}

export async function createEvent(
  userId: string,
  eventData: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt">,
): Promise<Event> {
  const event: Event = {
    ...eventData,
    id: Date.now().toString(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const userEvents = events.get(userId) || []
  userEvents.push(event)
  events.set(userId, userEvents)

  return event
}

export async function updateEvent(
  eventId: string,
  userId: string,
  eventData: Partial<Omit<Event, "id" | "userId" | "createdAt">>,
): Promise<Event> {
  const userEvents = events.get(userId) || []
  const eventIndex = userEvents.findIndex((e) => e.id === eventId)

  if (eventIndex === -1) {
    throw new Error("Event not found")
  }

  const updatedEvent = {
    ...userEvents[eventIndex],
    ...eventData,
    updatedAt: new Date().toISOString(),
  }

  userEvents[eventIndex] = updatedEvent
  events.set(userId, userEvents)

  return updatedEvent
}

export async function deleteEvent(eventId: string, userId: string): Promise<void> {
  const userEvents = events.get(userId) || []
  const filteredEvents = userEvents.filter((e) => e.id !== eventId)

  if (filteredEvents.length === userEvents.length) {
    throw new Error("Event not found")
  }

  events.set(userId, filteredEvents)
}
