import type { Calendar } from "@/types/calendar";
import type { User } from "@/types/user";

export interface Event {
	id: string;
	title: string;
	description?: string;
	start_time: string;
	end_time: string;
	is_all_day: boolean;
	color: string | null;
	calendar: Calendar;
	user: User;
	recurrence: {
		frequency: "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom";
		interval: number;
		weekdays: number[];
		monthly_type?: "date" | "weekday";
		weekday_ordinal: number;
		end_date?: string;
		repeat_count: number;
	};
	created_at: string;
	updated_at: string;
}

export interface EventFormData {
	title: string;
	description?: string;
	start_time: string;
	end_time: string;
	is_all_day: boolean;
	color: string;
	calendarId: string;
	recurrence: {
		frequency: "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom";
		interval: number;
		weekdays: number[];
		monthly_type?: "date" | "weekday";
		weekday_ordinal: number;
		end_date?: string;
		repeat_count: number;
	};
}

export type CreateEventInput = {
	calendar_id: string;
	title: string;
	description?: string;
	start_time: string;
	end_time: string;
	is_all_day: boolean;
	color?: string;
	frequency: "none" | "daily" | "weekly" | "monthly" | "yearly" | "custom";
	interval: number;
	weekdays: number[];
	monthly_type?: "date" | "weekday";
	weekday_ordinal: number;
	end_date?: string;
	repeat_count: number;
};
