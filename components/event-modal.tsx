"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { eventSchema, type EventFormData } from "@/lib/validations/event"
import { useCreateEvent, useUpdateEvent } from "@/hooks/use-events"
import { useCalendars } from "@/hooks/use-calendars"
import { exportSingleEvent } from "@/lib/ics-export"
import { Download } from "lucide-react"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event?: any
}

const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

const weekdays = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
  const { data: calendars = [] } = useCalendars()
  const createEventMutation = useCreateEvent()
  const updateEventMutation = useUpdateEvent()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      start: new Date().toISOString().slice(0, 16),
      end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
      allDay: false,
      color: colors[0],
      calendarId: "",
      recurrence: {
        type: "none",
        interval: 1,
        weekdays: [],
        monthlyType: "date",
        weekdayOrdinal: 1,
        endAfter: 10,
      },
    },
  })

  const watchAllDay = watch("allDay")
  const watchRecurrenceType = watch("recurrence.type")

  useEffect(() => {
    if (event) {
      reset({
        title: event.title || "",
        description: event.description || "",
        start: event.start ? new Date(event.start).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        end: event.end
          ? new Date(event.end).toISOString().slice(0, 16)
          : new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
        allDay: event.allDay || false,
        color: event.color || colors[0],
        calendarId: event.calendarId || calendars[0]?.id || "",
        recurrence: event.recurrence || {
          type: "none",
          interval: 1,
          weekdays: [],
          monthlyType: "date",
          weekdayOrdinal: 1,
          endAfter: 10,
        },
      })
    } else {
      reset({
        title: "",
        description: "",
        start: new Date().toISOString().slice(0, 16),
        end: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
        allDay: false,
        color: colors[0],
        calendarId: calendars[0]?.id || "",
        recurrence: {
          type: "none",
          interval: 1,
          weekdays: [],
          monthlyType: "date",
          weekdayOrdinal: 1,
          endAfter: 10,
        },
      })
    }
  }, [event, reset, isOpen, calendars])

  const onSubmit = async (data: EventFormData) => {
    try {
      if (event?.id) {
        await updateEventMutation.mutateAsync({ id: event.id, eventData: data })
      } else {
        await createEventMutation.mutateAsync(data)
      }
      onClose()
    } catch (error) {
      console.error("Failed to save event:", error)
    }
  }

  const isPending = createEventMutation.isPending || updateEventMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event?.id ? "Edit Event" : "Create New Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input id="title" {...register("title")} className={errors.title ? "border-red-500" : ""} />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} rows={3} />
            </div>
            <div>
              <Label>Calendar *</Label>
              <Controller
                name="calendarId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={errors.calendarId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a calendar" />
                    </SelectTrigger>
                    <SelectContent>
                      {calendars.map((calendar) => (
                        <SelectItem key={calendar.id} value={calendar.id}>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: calendar.color }} />
                            <span>{calendar.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.calendarId && <p className="text-sm text-red-500 mt-1">{errors.calendarId.message}</p>}
            </div>
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center space-x-2">
            <Controller
              name="allDay"
              control={control}
              render={({ field }) => <Switch id="allDay" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="allDay">All Day Event</Label>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Start {watchAllDay ? "Date" : "Date & Time"} *</Label>
              <Input
                id="start"
                type={watchAllDay ? "date" : "datetime-local"}
                {...register("start")}
                className={errors.start ? "border-red-500" : ""}
              />
              {errors.start && <p className="text-sm text-red-500 mt-1">{errors.start.message}</p>}
            </div>

            <div>
              <Label htmlFor="end">End {watchAllDay ? "Date" : "Date & Time"} *</Label>
              <Input
                id="end"
                type={watchAllDay ? "date" : "datetime-local"}
                {...register("end")}
                className={errors.end ? "border-red-500" : ""}
              />
              {errors.end && <p className="text-sm text-red-500 mt-1">{errors.end.message}</p>}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <Label>Event Color</Label>
            <div className="flex space-x-2 mt-2">
              {colors.map((color) => (
                <Controller
                  key={color}
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        field.value === color ? "border-gray-800" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => field.onChange(color)}
                    />
                  )}
                />
              ))}
            </div>
          </div>

          {/* Recurrence Settings */}
          <div className="space-y-4">
            <div>
              <Label>Recurrence</Label>
              <Controller
                name="recurrence.type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Recurrence</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {watchRecurrenceType !== "none" && watchRecurrenceType !== "custom" && (
              <div>
                <Label htmlFor="interval">Repeat Every</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    max="365"
                    {...register("recurrence.interval", { valueAsNumber: true })}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">
                    {watchRecurrenceType === "daily" && "day(s)"}
                    {watchRecurrenceType === "weekly" && "week(s)"}
                    {watchRecurrenceType === "monthly" && "month(s)"}
                    {watchRecurrenceType === "yearly" && "year(s)"}
                  </span>
                </div>
              </div>
            )}

            {watchRecurrenceType === "custom" && (
              <div>
                <Label>Days of the Week</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {weekdays.map((day) => (
                    <Controller
                      key={day.value}
                      name="recurrence.weekdays"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`weekday-${day.value}`}
                            checked={field.value.includes(day.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, day.value])
                              } else {
                                field.onChange(field.value.filter((d: number) => d !== day.value))
                              }
                            }}
                          />
                          <Label htmlFor={`weekday-${day.value}`} className="text-sm">
                            {day.label}
                          </Label>
                        </div>
                      )}
                    />
                  ))}
                </div>
                {errors.recurrence?.weekdays && (
                  <p className="text-sm text-red-500 mt-1">{errors.recurrence.weekdays.message}</p>
                )}
              </div>
            )}

            {watchRecurrenceType === "monthly" && (
              <div>
                <Label>Monthly Recurrence Type</Label>
                <Controller
                  name="recurrence.monthlyType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Same date each month</SelectItem>
                        <SelectItem value="weekday">Same weekday each month</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-4">
            {event?.id && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const eventData = { ...event, ...watch() }
                  exportSingleEvent(eventData)
                }}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Event
              </Button>
            )}
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isPending}>
                {isSubmitting || isPending ? "Saving..." : event?.id ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
