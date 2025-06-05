"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useEvents } from "@/actions/query/events"
import { useCalendars } from "@/actions/query/calendars"
import { useLogout } from "@/actions/query/auth"
import { useCalendarVisibility } from "@/hooks/use-calendar-visibility"
import { exportCalendar, generateICSContent, downloadICSFile } from "@/lib/ics-export"
import { COMMON_BUTTONS } from "@/constants/forms"
import { Calendar, LogOut, Download, ChevronDown, Settings } from "lucide-react"

interface MainNavbarProps {
  onError?: (error: string) => void
}

export default function MainNavbar({ onError }: MainNavbarProps) {
  const { toast } = useToast()
  const { data: events = [] } = useEvents()
  const { data: calendars = [] } = useCalendars()
  const { visibleCalendarIds } = useCalendarVisibility()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        })
      },
      onError: () => {
        toast({
          title: "Logout failed",
          description: "There was an error logging you out. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  const handleExportAll = () => {
    const visibleEvents = events.filter((event) => visibleCalendarIds.includes(event.calendarId))
    if (visibleEvents.length === 0) {
      toast({
        title: "No events to export",
        description: "There are no visible events to export.",
        variant: "destructive",
      })
      return
    }
    const icsContent = generateICSContent(visibleEvents, "All Events")
    downloadICSFile(icsContent, "all_events.ics")
    toast({
      title: "Export successful",
      description: `Exported ${visibleEvents.length} events successfully.`,
    })
  }

  const handleExportByCalendar = (calendar: any) => {
    const calendarEvents = events.filter((e) => e.calendarId === calendar.id)
    if (calendarEvents.length === 0) {
      toast({
        title: "No events to export",
        description: `No events found in ${calendar.name} calendar.`,
        variant: "destructive",
      })
      return
    }
    exportCalendar(calendarEvents, calendar.name)
    toast({
      title: "Export successful",
      description: `Exported ${calendarEvents.length} events from ${calendar.name}.`,
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <div className="mr-6 flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">Event Manager</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* Search could go here */}</div>

          <nav className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {COMMON_BUTTONS.EXPORT}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleExportAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Export All Events
                </DropdownMenuItem>
                {calendars.length > 0 && <DropdownMenuSeparator />}
                {calendars.map((calendar) => (
                  <DropdownMenuItem key={calendar.id} onClick={() => handleExportByCalendar(calendar)}>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: calendar.color }} />
                      Export {calendar.name}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {logoutMutation.isPending ? COMMON_BUTTONS.LOADING : COMMON_BUTTONS.LOGOUT}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
