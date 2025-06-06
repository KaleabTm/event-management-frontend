"use client"

import { useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Card, CardContent } from "@/components/ui/card"
import { useEvents } from "@/actions/query/events"
import { useCalendars } from "@/actions/query/calendars"
import { useCalendarVisibility } from "@/hooks/use-calendar-visibility"
import LoadingSpinner from "./shared/ui/loading-spinner"

// Remove all these CSS import lines:
// import "@fullcalendar/common/main.css"
// import "@fullcalendar/daygrid/main.css"
// import "@fullcalendar/timegrid/main.css"

interface CalendarViewProps {
  onEditEvent: (event: any) => void
}

export default function CalendarView({ onEditEvent }: CalendarViewProps) {
  const calendarRef = useRef<FullCalendar>(null)
  const { data: events = [], isLoading: eventsLoading } = useEvents()
  const { data: calendars = [], isLoading: calendarsLoading } = useCalendars()
  const { visibleCalendarIds } = useCalendarVisibility()

  const isLoading = eventsLoading || calendarsLoading

  // Filter visible events
  const visibleEvents = events.filter((event) => visibleCalendarIds.includes(event.calendarId))

  // Convert events to FullCalendar format
  const calendarEvents = visibleEvents.map((event) => {
    const calendar = calendars.find((c) => c.id === event.calendarId)
    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      backgroundColor: calendar?.color || event.color,
      borderColor: calendar?.color || event.color,
      extendedProps: {
        description: event.description,
        recurrence: event.recurrence,
        calendarId: event.calendarId,
      },
    }
  })

  const handleEventClick = (info: any) => {
    const event = visibleEvents.find((e) => e.id === info.event.id)
    if (event) {
      onEditEvent(event)
    }
  }

  const handleDateSelect = (selectInfo: any) => {
    // Get the first visible calendar as default
    const defaultCalendar = calendars.find((c) => visibleCalendarIds.includes(c.id))

    // Create new event with selected date/time
    const newEvent = {
      start: selectInfo.start.toISOString(),
      end: selectInfo.end.toISOString(),
      allDay: selectInfo.allDay,
      calendarId: defaultCalendar?.id || calendars[0]?.id || "",
    }
    onEditEvent(newEvent)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <LoadingSpinner text="Loading calendar..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          selectable={true}
          selectMirror={true}
          select={handleDateSelect}
          dayMaxEvents={true}
          weekends={true}
          height="auto"
          eventDisplay="block"
          displayEventTime={true}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }}
          nowIndicator={true}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: "09:00",
            endTime: "17:00",
          }}
          eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
        />
      </CardContent>
    </Card>
  )
}
