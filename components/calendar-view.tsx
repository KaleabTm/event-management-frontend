"use client"

import { useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Card, CardContent } from "@/components/ui/card"
import { useEventStore } from "@/lib/store"

// Import FullCalendar CSS
import "@fullcalendar/common/main.css"
import "@fullcalendar/daygrid/main.css"
import "@fullcalendar/timegrid/main.css"

interface CalendarViewProps {
  onEditEvent: (event: any) => void
}

export default function CalendarView({ onEditEvent }: CalendarViewProps) {
  const calendarRef = useRef<FullCalendar>(null)
  const { events, isLoading } = useEventStore()

  // Convert events to FullCalendar format
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    backgroundColor: event.color,
    borderColor: event.color,
    extendedProps: {
      description: event.description,
      recurrence: event.recurrence,
    },
  }))

  const handleEventClick = (info: any) => {
    const event = events.find((e) => e.id === info.event.id)
    if (event) {
      onEditEvent(event)
    }
  }

  const handleDateSelect = (selectInfo: any) => {
    // Create new event with selected date/time
    const newEvent = {
      start: selectInfo.start.toISOString(),
      end: selectInfo.end.toISOString(),
      allDay: selectInfo.allDay,
    }
    onEditEvent(newEvent)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading calendar...</p>
          </div>
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
