"use server";

import type { CreateEventInput, Event } from "@/types/event";
import axiosInstance from "@/actions/axiosInstance";

export async function fetchEventsAction(): Promise<Event[]> {
	try {
		const response = await axiosInstance.get("events/");
		return response.data;
	} catch (error: any) {
		console.error("Fetch events error:", error);
		throw new Error(error.response?.data?.message || "Failed to fetch events");
	}
}

export async function createEventAction(
	eventData: CreateEventInput
): Promise<Event> {
	try {
		const response = await axiosInstance.post("events/create/", eventData);
		return response.data;
	} catch (error: any) {
		console.error("Create event error:", error);
		throw new Error(error.response?.data?.message || "Failed to create event");
	}
}

export async function updateEventAction({
	id,
	eventData,
}: {
	id: string;
	eventData: Partial<CreateEventInput>;
}): Promise<Event> {
	try {
		const response = await axiosInstance.put(`events/${id}/update/`, eventData);
		return response.data;
	} catch (error: any) {
		console.error("Update event error:", error);
		throw new Error(error.response?.data?.message || "Failed to update event");
	}
}

export async function deleteEventAction(id: string): Promise<{ id: string }> {
	try {
		await axiosInstance.delete(`events/${id}/delete/`);
		return { id };
	} catch (error: any) {
		console.error("Delete event error:", error);
		throw new Error(error.response?.data?.message || "Failed to delete event");
	}
}

export async function getEventByIdAction(id: string): Promise<Event> {
	try {
		const response = await axiosInstance.get(`events/${id}/`);
		return response.data;
	} catch (error: any) {
		console.error("Get event error:", error);
		throw new Error(error.response?.data?.message || "Failed to fetch event");
	}
}
