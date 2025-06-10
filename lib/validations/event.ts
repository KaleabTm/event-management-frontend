import { z } from "zod";

export const eventSchema = z
	.object({
		title: z
			.string()
			.min(1, "Event title is required")
			.max(100, "Title too long"),
		description: z.string().optional(),
		start_time: z.string().datetime("Invalid start_time date"),
		end_time: z.string().datetime("Invalid end_time date"),
		is_all_day: z.boolean(),
		color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
		calendarId: z.string().min(1, "Calendar is required"),
		recurrence: z.object({
			frequency: z.enum([
				"none",
				"daily",
				"weekly",
				"monthly",
				"yearly",
				"custom",
			]),
			interval: z.number().min(1).max(365),
			weekdays: z.array(z.number().min(0).max(6)),
			monthly_type: z.enum(["date", "weekday"]).nullable(),
			weekday_ordinal: z.number().min(1).max(5),
			end_date: z.string().optional().nullable(),
			repeat_count: z.number().min(1).max(999),
		}),
	})
	.refine((data) => new Date(data.end_time) >= new Date(data.start_time), {
		message: "End date must be after start_time date",
		path: ["end_time"],
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
