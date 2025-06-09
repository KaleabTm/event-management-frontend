"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Calendar } from "@/types/calendar";
import {
	fetchCalendarsAction as fetchCalendars,
	createCalendarAction as createCalendar,
	getCalendarByIdAction as getCalendarById,
	updateCalendarAction as updateCalendar,
	deleteCalendarAction as deleteCalendar,
} from "@/actions/calendars/action";

// Query hooks
export function useCalendars() {
	return useQuery({
		queryKey: ["calendars"],
		queryFn: () => fetchCalendars(),
	});
}

export function useCalendar(id: string) {
	return useQuery({
		queryKey: ["calendars", id],
		queryFn: () => getCalendarById(id),
		enabled: !!id,
	});
}

export function useCreateCalendar() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCalendar,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["calendars"] });
		},
	});
}

export function useUpdateCalendar() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			calendarData,
		}: {
			id: string;
			calendarData: Partial<Calendar>;
		}): Promise<Calendar> => {
			// Ensure all required fields for CalendarInput are present
			const { name = "", ...rest } = calendarData;
			return updateCalendar(id, { name, ...rest } as any);
		},
		onSuccess: (data: Calendar) => {
			queryClient.invalidateQueries({ queryKey: ["calendars"] });
			queryClient.invalidateQueries({ queryKey: ["calendars", data.id] });
		},
	});
}

export function useDeleteCalendar() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCalendar,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["calendars"] });
			queryClient.removeQueries({ queryKey: ["calendars", data.id] });
			// Also invalidate events as they might be related to the deleted calendar
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
}
