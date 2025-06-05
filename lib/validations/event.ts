import { z } from "zod"

export const eventSchema = z
  .object({
    title: z.string().min(1, "Event title is required").max(100, "Title too long"),
    description: z.string().optional(),
    start: z.string().datetime("Invalid start date"),
    end: z.string().datetime("Invalid end date"),
    allDay: z.boolean().default(false),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
    recurrence: z
      .object({
        type: z.enum(["none", "daily", "weekly", "monthly", "yearly", "custom"]),
        interval: z.number().min(1).max(365).default(1),
        weekdays: z.array(z.number().min(0).max(6)).default([]),
        monthlyType: z.enum(["date", "weekday"]).default("date"),
        weekdayOrdinal: z.number().min(1).max(5).default(1),
        endDate: z.string().optional(),
        endAfter: z.number().min(1).max(999).default(10),
      })
      .default({
        type: "none",
        interval: 1,
        weekdays: [],
        monthlyType: "date",
        weekdayOrdinal: 1,
        endAfter: 10,
      }),
  })
  .refine(
    (data) => {
      const start = new Date(data.start)
      const end = new Date(data.end)
      return end >= start
    },
    {
      message: "End date must be after start date",
      path: ["end"],
    },
  )

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").optional(),
  action: z.enum(["login", "register"]),
})

export type EventFormData = z.infer<typeof eventSchema>
export type AuthFormData = z.infer<typeof authSchema>
