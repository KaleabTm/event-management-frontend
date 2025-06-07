import { z } from "zod";

export const eventSchema = z
	.object({
		title: z
			.string()
			.min(1, "Event title is required")
			.max(100, "Title too long"),
		description: z.string().optional(),
		start: z.string().datetime("Invalid start date"),
		end: z.string().datetime("Invalid end date"),
		allDay: z.boolean(),
		color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
		calendarId: z.string().min(1, "Calendar is required"),
		recurrence: z.object({
			type: z.enum(["none", "daily", "weekly", "monthly", "yearly", "custom"]),
			interval: z.number().min(1).max(365),
			weekdays: z.array(z.number().min(0).max(6)),
			monthlyType: z.enum(["date", "weekday"]),
			weekdayOrdinal: z.number().min(1).max(5),
			endDate: z.string().optional(),
			endAfter: z.number().min(1).max(999),
		}),
	})
	.refine((data) => new Date(data.end) >= new Date(data.start), {
		message: "End date must be after start date",
		path: ["end"],
	});

export const calendarSchema = z.object({
	name: z.string().min(1, "Calendar name is required").max(50, "Name too long"),
	description: z.string().optional(),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
	is_visible: z.boolean(),
});

export const loginSchema = z.object({
	action: z.literal("login"),
	email: z.string().email(),
	password: z.string().min(6),
});

export const registerSchema = z.object({
	action: z.literal("register"),
	email: z.string().email(),
	password: z.string().min(6),
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	phone_number: z.string().min(10),
});

// Unified schema using discriminated union
export const authSchema = z.discriminatedUnion("action", [
	loginSchema,
	registerSchema,
]);

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AuthFormData = z.infer<typeof authSchema>;

export type EventFormData = z.infer<typeof eventSchema>;

export type CalendarFormData = z.infer<typeof calendarSchema>;
