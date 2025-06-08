"use client";

import {
	createEventAction as createEvent,
	deleteEventAction as deleteEvent,
	fetchEventsAction as fetchEvents,
	getEventByIdAction as getEventById,
	updateEventAction as updateEvent,
} from "@/actions/events/action";
import type { CreateEventInput } from "@/types/event";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query hooks
export function useEvents() {
	return useQuery({
		queryKey: ["events"],
		queryFn: () => fetchEvents(),
	});
}

export function useEvent(id: string) {
	return useQuery({
		queryKey: ["events", id],
		queryFn: () => getEventById(id),
		enabled: !!id,
	});
}

export function useCreateEvent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
}

type UpdateEventInput = {
	id: string;
	eventData: Partial<CreateEventInput>;
};

export function useUpdateEvent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, eventData }: UpdateEventInput) =>
			updateEvent({ id, eventData }),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			queryClient.invalidateQueries({ queryKey: ["events", data.id] });
		},
	});
}

export function useDeleteEvent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEvent,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
			queryClient.removeQueries({ queryKey: ["events", data.id] });
		},
	});
}

// Utility hooks
export function useEventsByCalendar(calendarId: string) {
	const { data: events = [] } = useEvents();
	return events.filter((event) => event.calendar.id === calendarId);
}

export function useVisibleEvents(visibleCalendarIds: string[]) {
	const { data: events = [] } = useEvents();
	return events.filter((event) =>
		visibleCalendarIds.includes(event.calendar.id)
	);
}
