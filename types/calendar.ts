import type { Event } from "@/types/event";

export interface Calendar {
	id: string;
	name: string;
	description?: string;
	color: string;
	is_visible: boolean;
	userId: string;
	created_at: string;
	updated_at: string;
	events: Event[];
}

export interface CalendarFormData {
	name: string;
	description?: string;
	color: string;
	is_visible: boolean;
}
