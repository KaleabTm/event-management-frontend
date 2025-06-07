// store/calendarStore.ts
import { create } from "zustand";
import type { Calendar } from "@/types/calendar";
import {
	fetchCalendarsAction,
	createCalendarAction,
	updateCalendarAction,
	deleteCalendarAction,
} from "@/actions/calendars/action";

interface CalendarState {
	calendars: Calendar[];
	loading: boolean;
	error: string | null;
	isModalOpen: boolean;
	editingCalendar: Calendar | null;

	fetchCalendars: () => Promise<void>;
	addCalendar: (calendar: Calendar) => void;
	createCalendar: (input: any) => Promise<void>;
	updateCalendar: (id: string, input: any) => Promise<void>;
	deleteCalendar: (id: string) => Promise<void>;
	openModal: () => void;
	closeModal: () => void;
	setEditingCalendar: (calendar: Calendar | null) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
	calendars: [],
	loading: false,
	error: null,
	isModalOpen: false,
	editingCalendar: null,

	fetchCalendars: async () => {
		set({ loading: true, error: null });
		try {
			const data = await fetchCalendarsAction();
			set({ calendars: data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ loading: false });
		}
	},

	addCalendar: (calendar) => {
		set((state) => ({ calendars: [...state.calendars, calendar] }));
	},

	createCalendar: async (input) => {
		const newCalendar = await createCalendarAction(input);
		get().addCalendar(newCalendar);
	},

	updateCalendar: async (id, input) => {
		const updated = await updateCalendarAction(id, input);
		set((state) => ({
			calendars: state.calendars.map((c) => (c.id === id ? updated : c)),
		}));
	},

	deleteCalendar: async (id) => {
		await deleteCalendarAction(id);
		set((state) => ({
			calendars: state.calendars.filter((c) => c.id !== id),
		}));
	},

	openModal: () => set({ isModalOpen: true }),
	closeModal: () => set({ isModalOpen: false, editingCalendar: null }),
	setEditingCalendar: (calendar) => set({ editingCalendar: calendar }),
}));
