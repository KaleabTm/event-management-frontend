"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import CalendarForm from "@/components/forms/calendar-form"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createEvent, updateEvent } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { CALENDAR_COLORS } from "@/constants/colors"

const colors = CALENDAR_COLORS

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
  calendar?: any
}

export default function CalendarModal({ isOpen, onClose, calendar }: CalendarModalProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      })
      toast.success("Calendar created successfully")
      onClose()
      router.refresh()
    },
    onError: () => {
      toast.error("Something went wrong")
    },
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
      })
      toast.success("Calendar updated successfully")
      onClose()
      router.refresh()
    },
    onError: () => {
      toast.error("Something went wrong")
    },
  })

  function handleFormSubmit(values: any) {
    if (calendar?.id) {
      update({ ...values, id: calendar.id })
    } else {
      create(values)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{calendar?.id ? "Edit Calendar" : "Create New Calendar"}</DialogTitle>
        </DialogHeader>
        <CalendarForm calendar={calendar} onSuccess={handleFormSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}
