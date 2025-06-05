"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useEventStore } from "@/lib/store"
import CalendarView from "./calendar-view"
import ListView from "./list-view"
import EventModal from "./event-modal"
import { Plus, LogOut, Calendar, List } from "lucide-react"

export default function Dashboard() {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const { fetchEvents, error, setError } = useEventStore()

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleCreateEvent = () => {
    setEditingEvent(null)
    setIsEventModalOpen(true)
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setIsEventModalOpen(true)
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
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
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
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
      </main>

      {/* Event Modal */}
      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} event={editingEvent} />
    </div>
  )
}
