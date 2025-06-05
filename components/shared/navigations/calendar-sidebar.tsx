"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useCalendars, useDeleteCalendar } from "@/actions/query/calendars"
import { useCalendarVisibility } from "@/hooks/use-calendar-visibility"
import { exportCalendar } from "@/lib/ics-export"
import CalendarModal from "../../modals/calendar-modal"
import LoadingSpinner from "../ui/loading-spinner"
import { Plus, MoreHorizontal, Download, Edit, Trash2, Eye, EyeOff } from "lucide-react"

export default function CalendarSidebar() {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [editingCalendar, setEditingCalendar] = useState<any>(null)
  const { toast } = useToast()

  const { data: calendars = [], isLoading } = useCalendars()
  const { visibleCalendarIds, toggleCalendarVisibility, setInitialCalendars } = useCalendarVisibility()
  const deleteCalendarMutation = useDeleteCalendar()

  // Set initial visible calendars
  useEffect(() => {
    if (calendars.length > 0 && visibleCalendarIds.length === 0) {
      setInitialCalendars(calendars.map((cal) => cal.id))
    }
  }, [calendars, visibleCalendarIds.length, setInitialCalendars])

  const handleCreateCalendar = () => {
    setEditingCalendar(null)
    setIsCalendarModalOpen(true)
  }

  const handleEditCalendar = (calendar: any) => {
    setEditingCalendar(calendar)
    setIsCalendarModalOpen(true)
  }

  const handleDeleteCalendar = async (calendarId: string, calendarName: string) => {
    deleteCalendarMutation.mutate(calendarId, {
      onSuccess: () => {
        toast({
          title: "Calendar deleted",
          description: `${calendarName} has been deleted successfully.`,
        })
      },
      onError: () => {
        toast({
          title: "Delete failed",
          description: "There was an error deleting the calendar. Please try again.",
          variant: "destructive",
        })
      },
    })
  }

  const handleExportCalendar = (calendar: any) => {
    const events = calendar.events || []
    if (events.length === 0) {
      toast({
        title: "No events to export",
        description: `${calendar.name} has no events to export.`,
        variant: "destructive",
      })
      return
    }
    exportCalendar(events, calendar.name)
    toast({
      title: "Export successful",
      description: `${calendar.name} exported successfully.`,
    })
  }

  if (isLoading) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-lg">My Calendars</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner size="sm" text="Loading calendars..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">My Calendars</CardTitle>
          <Button size="sm" onClick={handleCreateCalendar}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {calendars.map((calendar) => (
          <div
            key={calendar.id}
            className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors group"
          >
            <div className="flex items-center space-x-3 flex-1">
              <Checkbox
                checked={visibleCalendarIds.includes(calendar.id)}
                onCheckedChange={() => toggleCalendarVisibility(calendar.id)}
              />
              <div className="flex items-center space-x-2 flex-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: calendar.color }} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{calendar.name}</div>
                  {calendar.description && (
                    <div className="text-xs text-muted-foreground truncate">{calendar.description}</div>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  0
                </Badge>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleCalendarVisibility(calendar.id)}>
                  {visibleCalendarIds.includes(calendar.id) ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide calendar
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show calendar
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportCalendar(calendar)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export calendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditCalendar(calendar)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit calendar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteCalendar(calendar.id, calendar.name)}
                  disabled={deleteCalendarMutation.isPending}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete calendar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {calendars.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No calendars yet</p>
            <p className="text-xs">Create your first calendar to get started</p>
          </div>
        )}
      </CardContent>

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        calendar={editingCalendar}
      />
    </Card>
  )
}
