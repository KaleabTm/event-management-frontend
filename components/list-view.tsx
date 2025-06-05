"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEvents, useDeleteEvent } from "@/hooks/use-events"
import { useCalendars } from "@/hooks/use-calendars"
import { useCalendarVisibility } from "@/hooks/use-calendar-visibility"
import { Calendar, Clock, Edit, Trash2, Repeat, Download } from "lucide-react"
import { exportSingleEvent } from "@/lib/ics-export"

interface ListViewProps {
  onEditEvent: (event: any) => void
}

export default function ListView({ onEditEvent }: ListViewProps) {
  const { data: events = [], isLoading: eventsLoading } = useEvents()
  const { data: calendars = [], isLoading: calendarsLoading } = useCalendars()
  const { visibleCalendarIds } = useCalendarVisibility()
  const deleteEventMutation = useDeleteEvent()

  const isLoading = eventsLoading || calendarsLoading || deleteEventMutation.isPending

  // Filter visible events
  const visibleEvents = events.filter((event) => visibleCalendarIds.includes(event.calendarId))

  // Sort events by start date
  const sortedEvents = [...visibleEvents].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  // Filter upcoming events
  const upcomingEvents = sortedEvents.filter((event) => new Date(event.start) >= new Date()).slice(0, 20)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getRecurrenceText = (recurrence: any) => {
    switch (recurrence.type) {
      case "daily":
        return recurrence.interval === 1 ? "Daily" : `Every ${recurrence.interval} days`
      case "weekly":
        return recurrence.interval === 1 ? "Weekly" : `Every ${recurrence.interval} weeks`
      case "monthly":
        return recurrence.interval === 1 ? "Monthly" : `Every ${recurrence.interval} months`
      case "yearly":
        return "Yearly"
      case "custom":
        return "Custom"
      default:
        return null
    }
  }

  const handleDelete = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate(eventId)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading events...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (upcomingEvents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
          <p className="text-gray-500 text-center">
            Create your first event to get started with managing your schedule.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Events ({upcomingEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    {(() => {
                      const calendar = calendars.find((c) => c.id === event.calendarId)
                      return calendar ? (
                        <Badge variant="outline" className="text-xs flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: calendar.color }} />
                          <span>{calendar.name}</span>
                        </Badge>
                      ) : null
                    })()}
                  </div>
                  <div className="w-3 h-3 rounded-full ml-2 mt-1" style={{ backgroundColor: event.color }} />
                </div>

                {event.description && <p className="text-sm text-gray-600 mb-2">{event.description}</p>}

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(event.start)}
                  </div>
                  {!event.allDay && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </div>
                  )}
                  {event.recurrence.type !== "none" && (
                    <div className="flex items-center">
                      <Repeat className="h-4 w-4 mr-1" />
                      <Badge variant="secondary" className="text-xs">
                        {getRecurrenceText(event.recurrence)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => exportSingleEvent(event)} title="Export event">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEditEvent(event)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                  disabled={deleteEventMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
