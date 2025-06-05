"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { calendarSchema, type CalendarFormData } from "@/lib/validations/event"
import { useCreateCalendar, useUpdateCalendar } from "@/hooks/use-calendars"
import { useCalendarVisibility } from "@/hooks/use-calendar-visibility"

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
  calendar?: any
}

const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

export default function CalendarModal({ isOpen, onClose, calendar }: CalendarModalProps) {
  const createCalendarMutation = useCreateCalendar()
  const updateCalendarMutation = useUpdateCalendar()
  const { setCalendarVisibility } = useCalendarVisibility()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CalendarFormData>({
    resolver: zodResolver(calendarSchema),
    defaultValues: {
      name: "",
      description: "",
      color: colors[0],
      isVisible: true,
    },
  })

  useEffect(() => {
    if (calendar) {
      reset({
        name: calendar.name || "",
        description: calendar.description || "",
        color: calendar.color || colors[0],
        isVisible: calendar.isVisible ?? true,
      })
    } else {
      reset({
        name: "",
        description: "",
        color: colors[0],
        isVisible: true,
      })
    }
  }, [calendar, reset, isOpen])

  const onSubmit = async (data: CalendarFormData) => {
    try {
      if (calendar?.id) {
        await updateCalendarMutation.mutateAsync({ id: calendar.id, calendarData: data })
        // Update visibility state
        setCalendarVisibility(calendar.id, data.isVisible)
      } else {
        const newCalendar = await createCalendarMutation.mutateAsync(data)
        // Set new calendar to visible
        if (data.isVisible && newCalendar.id) {
          setCalendarVisibility(newCalendar.id, true)
        }
      }
      onClose()
    } catch (error) {
      console.error("Failed to save calendar:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{calendar?.id ? "Edit Calendar" : "Create New Calendar"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Calendar Name *</Label>
            <Input
              id="name"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
              placeholder="e.g., Work, Personal, Family"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={2}
              placeholder="Optional description for this calendar"
            />
          </div>

          <div>
            <Label>Calendar Color</Label>
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || createCalendarMutation.isPending || updateCalendarMutation.isPending}
            >
              {isSubmitting || createCalendarMutation.isPending || updateCalendarMutation.isPending
                ? "Saving..."
                : calendar?.id
                  ? "Update Calendar"
                  : "Create Calendar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
