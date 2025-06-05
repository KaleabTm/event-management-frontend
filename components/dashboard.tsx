"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEvents } from "@/actions/query/events"
import { useCalendars } from "@/actions/query/calendars"
import { useLogout } from "@/actions/query/auth"
import { useCalendarVisibility } from "@/hooks/use-calendar-visibility"
import { exportCalendar, generateICSContent, downloadICSFile } from "@/lib/ics-export"
import { BUTTON_LABELS } from "@/constants/forms"
import CalendarView from "./calendar-view"
import ListView from "./list-view"
import EventModal from "./event-modal"
import CalendarSidebar from "./calendar-sidebar"
import { Plus, LogOut, Calendar, List, Download, ChevronDown } from "lucide-react"

export default function Dashboard() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [error, setError] = useState<string | null>(null)

  const { data: events = [] } = useEvents()
  const { data: calendars = [] } = useCalendars()
  const { visibleCalendarIds } = useCalendarVisibility()
  const logoutMutation = useLogout()

  const handleCreateEvent = () => {
    setEditingEvent(null)
    setIsEventModalOpen(true)
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setIsEventModalOpen(true)
  }

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handleExportAll = () => {
    const visibleEvents = events.filter((event) => visibleCalendarIds.includes(event.calendarId))
    if (visibleEvents.length === 0) {
      setError("No events to export.")
      return
    }
    const icsContent = generateICSContent(visibleEvents, "All Events")
    downloadICSFile(icsContent, "all_events.ics")
  }

  const handleExportByCalendar = (calendar: any) => {
    const calendarEvents = events.filter((e) => e.calendarId === calendar.id)
    if (calendarEvents.length === 0) {
      setError(`No events in ${calendar.name} to export.`)
      return
    }
    exportCalendar(calendarEvents, calendar.name)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Event Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    {BUTTON_LABELS.EXPORT}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportAll}>Export All Events</DropdownMenuItem>
                  {calendars.map((calendar) => (
                    <DropdownMenuItem key={calendar.id} onClick={() => handleExportByCalendar(calendar)}>
                      Export {calendar.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {logoutMutation.isPending ? BUTTON_LABELS.LOADING : BUTTON_LABELS.LOGOUT}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex justify-between items-center">
              {error}
              <Button variant="outline" size="sm" onClick={() => setError(null)}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-6">
          {/* Calendar Sidebar */}
          <CalendarSidebar />

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Events</h2>
              <Button onClick={handleCreateEvent} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            <Tabs defaultValue="calendar" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="calendar" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center">
                  <List className="h-4 w-4 mr-2" />
                  List
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar">
                <CalendarView onEditEvent={handleEditEvent} />
              </TabsContent>

              <TabsContent value="list">
                <ListView onEditEvent={handleEditEvent} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Event Modal */}
      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} event={editingEvent} />
    </div>
  )
}
