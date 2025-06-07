import axiosInstance from "@/actions/axiosInstance";
import type { Calendar } from "@/types/calendar";

// Define only the fields required for create/update
type CalendarInput = {
	name: string;
	description: string;
	color: string;
	is_visible: boolean;
};

// Fetch all calendars
export async function fetchCalendarsAction(): Promise<Calendar[]> {
	try {
		const response = await axiosInstance.get("calendars/");
		return response.data;
	} catch (error: any) {
		console.error("Fetch calendars error:", error);
		throw new Error(error.response?.data?.detail || "Failed to fetch calendars");
	}
}

// Create a new calendar
export async function createCalendarAction(
	calendarData: CalendarInput
): Promise<Calendar> {
	try {
		const response = await axiosInstance.post("calendars/create/", calendarData);
		return response.data;
	} catch (error: any) {
		console.error("Create calendar error:", error);
		throw new Error(error.response?.data?.detail || "Failed to create calendar");
	}
}

// Get calendar by ID
export async function getCalendarByIdAction(id: string): Promise<Calendar> {
	try {
		const response = await axiosInstance.get(`calendars/${id}/`);
		return response.data;
	} catch (error: any) {
		console.error("Get calendar error:", error);
		throw new Error(error.response?.data?.detail || "Failed to fetch calendar");
	}
}

// Update a calendar
export async function updateCalendarAction(
	id: string,
	calendarData: CalendarInput
): Promise<Calendar> {
	try {
		const response = await axiosInstance.put(
			`calendars/${id}/update/`,
			calendarData
		);
		return response.data;
	} catch (error: any) {
		console.error("Update calendar error:", error);
		throw new Error(error.response?.data?.detail || "Failed to update calendar");
	}
}

// Delete a calendar
export async function deleteCalendarAction(
	id: string
): Promise<{ id: string }> {
	try {
		await axiosInstance.delete(`calendars/${id}/delete/`);
		return { id };
	} catch (error: any) {
		console.error("Delete calendar error:", error);
		throw new Error(error.response?.data?.detail || "Failed to delete calendar");
	}
}
