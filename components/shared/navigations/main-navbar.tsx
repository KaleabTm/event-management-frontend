"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEvents } from "@/actions/query/events"
import { useCalendars } from "@/actions/query/calendars"
import { useLogout } from "@/actions/query/auth"
import { useCalendarVisibility } from "@/hooks/use-calendar-visibility"
import { exportCalendar, generateICSContent, downloadICSFile } from "@/lib/ics-export"
import { COMMON_BUTTONS } from "@/constants/forms"
import { Calendar, LogOut, Download, ChevronDown } from "lucide-react"

interface MainNavbarProps {
  onError?: (error: string) => void
}

export default function MainNavbar({ onError }: MainNavbarProps) {
  const { data: events = [] } = useEvents()
  const { data: calendars = [] } = useCalendars()
  const { visibleCalendarIds } = useCalendarVisibility()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handleExportAll = () => {
    const visibleEvents = events.filter((event) => visibleCalendarIds.includes(event.calendarId))
    if (visibleEvents.length === 0) {
      onError?.("No events to export.")
      return
    }
    const icsContent = generateICSContent(visibleEvents, "All Events")
    downloadICSFile(icsContent, "all_events.ics")
  }

  const handleExportByCalendar = (calendar: any) => {
    const calendarEvents = events.filter((e) => e.calendarId === calendar.id)
    if (calendarEvents.length === 0) {
      onError?.(`No events in ${calendar.name} to export.`)
      return
    }
    exportCalendar(calendarEvents, calendar.name)
  }

  return (
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
                  {COMMON_BUTTONS.EXPORT}
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
              {logoutMutation.isPending ? COMMON_BUTTONS.LOADING : COMMON_BUTTONS.LOGOUT}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
