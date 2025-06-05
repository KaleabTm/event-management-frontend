"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useCalendars, useDeleteCalendar } from "@/hooks/use-calendars"
import { useCalendarVisibility } from "@/hooks/use-calendar-visibility"
import { exportCalendar } from "@/lib/ics-export"
import CalendarModal from "./calendar-modal"
import { Plus, Download, Edit, Trash2, Eye, EyeOff } from "lucide-react"

export default function CalendarSidebar() {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  const [editingCalendar, setEditingCalendar] = useState<any>(null)

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

  const handleDeleteCalendar = async (calendarId: string) => {
    if (confirm("Are you sure you want to delete this calendar? All events in this calendar will also be deleted.")) {
      deleteCalendarMutation.mutate(calendarId)
    }
  }

  const handleExportCalendar = (calendar: any) => {
    const events = calendar.events // Assuming events are passed as part of the calendar object
    if (events.length === 0) {
      alert("This calendar has no events to export.")
      return
    }
    exportCalendar(events, calendar.name)
  }

  if (isLoading) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-lg">My Calendars</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
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
          <div key={calendar.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group">
            <div className="flex items-center space-x-3 flex-1">
              <Checkbox
                checked={visibleCalendarIds.includes(calendar.id)}
                onCheckedChange={() => toggleCalendarVisibility(calendar.id)}
              />
              <div className="flex items-center space-x-2 flex-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: calendar.color }} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{calendar.name}</div>
                  {calendar.description && <div className="text-xs text-gray-500 truncate">{calendar.description}</div>}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {calendar.events.length}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleCalendarVisibility(calendar.id)}
                className="h-6 w-6 p-0"
              >
                {visibleCalendarIds.includes(calendar.id) ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleExportCalendar(calendar)} className="h-6 w-6 p-0">
                <Download className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleEditCalendar(calendar)} className="h-6 w-6 p-0">
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteCalendar(calendar.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        {calendars.length === 0 && (
          <div className="text-center py-4 text-gray-500">
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
